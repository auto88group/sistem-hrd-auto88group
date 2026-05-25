import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  importUserApi,
  uploadImportUserApi,
  exportUserApi,
  type Branch,
  type Coordinate,
  type Position,
  type MasterEducation,
  type BloodType,
  type Religion,
  type MaritalStatus,
} from "@/api/modules/import-user.api";
import { generateTemplateUser } from "@/composables/generate-template-user";
import type { AxiosError } from "axios";

export const useImportUserStore = defineStore("import-user", () => {
  // ==================== STATE ====================

  const branch = ref<Branch[]>([]);
  const coordinate = ref<Coordinate[]>([]);
  const position = ref<Position[]>([]);
  const masterEducation = ref<MasterEducation[]>([]);
  const bloodType = ref<BloodType[]>([]);
  const religion = ref<Religion[]>([]);
  const maritalStatus = ref<MaritalStatus[]>([]);

  const isLoadingGetData = ref<boolean>(false);
  const errorMessage = ref<string | null>(null);
  const isDialogImport = ref(false);

  // State baru untuk Upload
  const selectedFile = ref<File | null>(null);
  const isUploading = ref<boolean>(false);
  const uploadErrors = ref<string[]>([]); // Menyimpan detail error per baris Excel

  const isExporting = ref<boolean>(false);

  // ==================== GETTERS ====================

  const isFetched = computed<boolean>(() => branch.value.length > 0);

  // ==================== ACTIONS ====================

  const fetchDataForTemplateUser = async (): Promise<void> => {
    try {
      errorMessage.value = null;
      const response = await importUserApi();

      if (response.success) {
        branch.value = response.data.branch;
        coordinate.value = response.data.coordinate;
        position.value = response.data.position;
        masterEducation.value = response.data.master_education;
        bloodType.value = response.data.blood_type;
        religion.value = response.data.religion;
        maritalStatus.value = response.data.marital_status;
      } else {
        errorMessage.value = response.message;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        errorMessage.value = error.message;
      } else {
        errorMessage.value = "Gagal mengambil data template user";
      }
    }
  };

  const downloadTemplate = async (): Promise<void> => {
    isLoadingGetData.value = true;
    await fetchDataForTemplateUser();

    await generateTemplateUser({
      branch: branch.value,
      coordinate: coordinate.value,
      position: position.value,
      masterEducation: masterEducation.value,
      bloodType: bloodType.value,
      religion: religion.value,
      maritalStatus: maritalStatus.value,
    });
    isLoadingGetData.value = false;
  };

  // Action baru untuk mengeksekusi upload file
  const uploadData = async (): Promise<boolean> => {
    if (!selectedFile.value) {
      errorMessage.value = "Silakan unggah file Excel terlebih dahulu.";
      return false;
    }

    try {
      isUploading.value = true;
      errorMessage.value = null;
      uploadErrors.value = [];

      const fileToUpload = Array.isArray(selectedFile.value)
        ? selectedFile.value[0]
        : selectedFile.value;

      const response = await uploadImportUserApi(fileToUpload);

      // Jika berhasil (HTTP 200)
      if (response.success) {
        isDialogImport.value = false;
        resetData();
        return true;
      }

      return false;
    } catch (error: any) {
      // (Opsional) Uncomment baris di bawah ini jika ingin melihat bentuk asli error di console browser
      // console.log("Detail Error Catch:", error);

      // Skenario 1: Error standar dari Axios (belum diotak-atik interceptor)
      if (error.response && error.response.data) {
        errorMessage.value =
          error.response.data.message || "Gagal mengunggah file.";
        if (error.response.data.errors) {
          uploadErrors.value = error.response.data.errors;
        }
      }
      // Skenario 2: Error sudah diekstrak oleh Axios Interceptor Anda
      else if (error.errors || error.success === false) {
        errorMessage.value =
          error.message || "Terdapat kesalahan pada data Excel.";
        if (error.errors) {
          uploadErrors.value = error.errors;
        }
      }
      // Skenario 3: Memang koneksi terputus, timeout, atau Server Down (500)
      else {
        errorMessage.value =
          "Koneksi ke server terputus atau sistem bermasalah.";
      }

      return false;
    } finally {
      isUploading.value = false;
    }
  };

  const resetData = (): void => {
    branch.value = [];
    coordinate.value = [];
    position.value = [];
    masterEducation.value = [];
    bloodType.value = [];
    religion.value = [];
    maritalStatus.value = [];
    isLoadingGetData.value = false;
    errorMessage.value = null;

    selectedFile.value = null;
    isUploading.value = false;
    uploadErrors.value = [];
  };

  const exportData = async (): Promise<void> => {
    try {
      isExporting.value = true;
      errorMessage.value = null; // Reset error (gunakan state errorMessage yang sudah ada)

      // Panggil API
      const blob = await exportUserApi();

      // Buat URL sementara untuk file blob tersebut
      const url = window.URL.createObjectURL(new Blob([blob]));

      // Buat elemen anchor (<a>) tersembunyi
      const link = document.createElement("a");
      link.href = url;

      // Set nama file (Opsional, browser biasanya bisa membaca dari header backend,
      // tapi men-set atribut download memastikan file terunduh dengan benar)
      link.setAttribute(
        "download",
        `Data_Karyawan_${new Date().toISOString().slice(0, 10)}.xlsx`,
      );

      // Sisipkan ke DOM, klik, lalu hapus kembali
      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      // PENANGANAN ERROR KHUSUS BLOB:
      // Karena kita men-set Axios ke 'blob', jika backend membalas dengan JSON (misal error 500),
      // JSON tersebut akan dibungkus sebagai Blob. Kita harus membacanya dengan FileReader.
      if (
        error.response &&
        error.response.data instanceof Blob &&
        error.response.data.type === "application/json"
      ) {
        const reader = new FileReader();
        reader.onload = () => {
          const errorData = JSON.parse(reader.result as string);
          errorMessage.value = errorData.message || "Gagal mengexport data.";
        };
        reader.readAsText(error.response.data);
      } else {
        errorMessage.value =
          "Koneksi ke server terputus saat mencoba mengunduh file.";
      }
    } finally {
      isExporting.value = false;
    }
  };

  return {
    isDialogImport,
    branch,
    coordinate,
    position,
    masterEducation,
    bloodType,
    religion,
    maritalStatus,
    isLoadingGetData,
    errorMessage,
    selectedFile,
    isUploading,
    uploadErrors,
    isExporting,
    isFetched,

    exportData,
    fetchDataForTemplateUser,
    downloadTemplate,
    uploadData,
    resetData,
  };
});
