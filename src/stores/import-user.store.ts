import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  importUserApi,
  type Branch,
  type Coordinate,
  type Position,
  type MasterEducation,
  type BloodType,
  type Religion,
  type MaritalStatus,
} from "@/api/modules/import-user.api";
import { generateTemplateUser } from "@/composables/generate-template-user";

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
  };

  return {
    isDialogImport,
    // state
    branch,
    coordinate,
    position,
    masterEducation,
    bloodType,
    religion,
    maritalStatus,
    isLoadingGetData,
    errorMessage,

    // getters
    isFetched,

    // actions
    fetchDataForTemplateUser,
    downloadTemplate,
    resetData,
  };
});
