import {
  employeeAttendanceRequestApi,
  type ApprovalDiffLocParams,
  type DeletePhotoParams,
  type EmployeeAttendance,
  type EmployeeAttendanceDetail,
  type EmployeeAttendanceDetailParams,
  type EmployeeAttendanceEditParams,
  type EmployeeAttendanceParams,
  type EmployeeAttendanceRecapItem,
  type EmployeeAttendanceRecapParams,
  type RecapDate,
  type DeletePhotoResponse,
} from "@/api/modules/employee-attendance.api";
import { defineStore } from "pinia";
import { ref, reactive } from "vue";

export const useEmployeeAttendanceRequestStore = defineStore(
  "employee-attendance",
  () => {
    const employeeAttendance = ref<EmployeeAttendance[]>([]);
    const employeeAttendanceRecap = ref<EmployeeAttendanceRecapItem[]>([]);
    const employeeAttendanceDetail = ref<EmployeeAttendanceDetail>();
    const isLoading = ref(false);
    const isLoadingExport = ref(false);
    const isLoadingEdit = ref(false);
    const isLoadingDetail = ref(false);
    const isLoadingDestroy = ref(false);
    const isLoadingApproval = ref(false);
    const serverErrors = reactive<Record<string, string>>({});
    const recapDates = ref<RecapDate[]>([]);

    const totalRecords = ref(0);

    const params = reactive<EmployeeAttendanceParams>({
      draw: 1,
      start: 0,
      length: 10,
      period: undefined,
      user_id: null,
      branch_id: null,

      type_present: 0,
      type_late: 0,
      type_go_home_early: 0,
      type_didnt_check_out: 0,
      type_negligent: 0,
      type_sick: 0,
      type_permit: 0,
      type_leave: 0,
      type_holiday: 0,
      type_belum_absen: 0,
    });

    const recapParams = reactive<EmployeeAttendanceRecapParams>({
      draw: 1,
      start: 0,
      length: 10,
      period: undefined,
      branch_id: null,
      user_id: null,
    });

    const payloadEdit = reactive<EmployeeAttendanceEditParams>({
      id: null,
      user_id: null,
      user_name: null,
      user_full_name: null,
      user_email: null,
      branch_id: null,
      period_date: null,
      hrd_master_shift_id: null,
      working_hour: null,
      time_in: null,
      note_in: null,
      time_out: null,
      note_out: null,
    });

    const detailParams = reactive<EmployeeAttendanceDetailParams>({
      id: null,
      in_out: null,
    });

    const isLoadingDeletePhoto = ref(false);
    const payloadDeletePhoto = reactive<DeletePhotoParams>({
      user_id: null,
      start_date: null,
      end_date: null,
      type: "both",
    });

    const formDialogDeletePhoto = ref(false);

    // action baru
    async function deletePhoto(): Promise<DeletePhotoResponse> {
      isLoadingDeletePhoto.value = true;
      try {
        return await employeeAttendanceRequestApi.deletePhoto({
          ...payloadDeletePhoto,
        });
      } finally {
        isLoadingDeletePhoto.value = false;
      }
    }

    function clearPayloadDeletePhoto() {
      payloadDeletePhoto.user_id = null;
      payloadDeletePhoto.start_date = null;
      payloadDeletePhoto.end_date = null;
      payloadDeletePhoto.type = "both";
    }

    const formDialog = ref(false);

    async function fetchEmployeeAttendance() {
      isLoading.value = true;
      try {
        const res = await employeeAttendanceRequestApi.getDatatables({
          ...params,
        });
        employeeAttendance.value = res.data;
        totalRecords.value = res.recordsTotal;
        params.draw = res.draw + 1;
      } finally {
        isLoading.value = false;
      }
    }

    async function fetchEmployeeAttendanceRecap() {
      isLoading.value = true;
      try {
        const res = await employeeAttendanceRequestApi.getRecapDatatables({
          ...recapParams,
        });
        employeeAttendanceRecap.value = res.data;
        totalRecords.value = res.recordsTotal;
        params.draw = res.draw + 1;
        recapDates.value = res.dates;
      } finally {
        isLoading.value = false;
      }
    }

    async function fetchEmployeeAttendanceDetail() {
      isLoadingDetail.value = true;
      try {
        const res = await employeeAttendanceRequestApi.detail({
          ...detailParams,
        });
        employeeAttendanceDetail.value = res.data;
      } finally {
        isLoadingDetail.value = false;
      }
    }

    async function updateAttendance() {
      if (!payloadEdit.id) throw new Error("ID tidak ditemukan.");

      isLoadingEdit.value = true;

      try {
        const { data } = await employeeAttendanceRequestApi.update(
          payloadEdit.id,
          payloadEdit,
        );
        return data;
      } finally {
        isLoadingEdit.value = false;
      }
    }

    async function modifyAttendance() {
      isLoadingEdit.value = true;

      try {
        const { data } = await employeeAttendanceRequestApi.modify(payloadEdit);
        return data;
      } finally {
        isLoadingEdit.value = false;
      }
    }

    async function destroyAttendance(id: number) {
      isLoadingDestroy.value = true;
      try {
        const res = await employeeAttendanceRequestApi.destroy(id);
        return res;
      } catch (err: any) {
        throw err;
      } finally {
        isLoadingDestroy.value = false;
      }
    }

    function resetServerErrors() {
      Object.keys(serverErrors).forEach((key) => delete serverErrors[key]);
    }

    function clearpayloadEdit() {
      payloadEdit.id = null;
      payloadEdit.user_id = null;
      payloadEdit.user_name = null;
      payloadEdit.user_full_name = null;
      payloadEdit.user_email = null;
      payloadEdit.branch_id = null;
      payloadEdit.period_date = null;
      payloadEdit.hrd_master_shift_id = null;
      payloadEdit.working_hour = null;
      payloadEdit.time_in = null;
      payloadEdit.time_out = null;
      payloadEdit.note_in = null;
      payloadEdit.note_out = null;
    }

    const getInOutLabelAttendanceDetail = (labels?: {
      in?: string;
      out?: string;
      default?: string;
    }) => {
      const config = {
        in: labels?.in ?? "Informasi Masuk",
        out: labels?.out ?? "Informasi Pulang",
        default: labels?.default ?? "-",
      };
      if (!detailParams.in_out) return config.default;
      return (
        config[detailParams.in_out as keyof typeof config] ?? config.default
      );
    };

    async function approvalDiffLoc(params: ApprovalDiffLocParams) {
      isLoadingApproval.value = true;
      try {
        const res = await employeeAttendanceRequestApi.approvalDiffLoc(params);
        return res;
      } finally {
        isLoadingApproval.value = false;
      }
    }

    async function exportToExcel() {
      isLoadingExport.value = true;
      try {
        const blob = await employeeAttendanceRequestApi.export({
          period: params.period,
          branch_id: params.branch_id,
        });

        // Membuat link download temporary di browser
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;

        // Penamaan file dinamis di sisi client
        link.setAttribute(
          "download",
          `Laporan_Absensi_${new Date().toISOString().split("T")[0]}.xlsx`,
        );
        document.body.appendChild(link);
        link.click();

        // Cleanup element link setelah download terpicu
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Gagal mengunduh file laporan excel:", error);
        throw error;
      } finally {
        isLoadingExport.value = false;
      }
    }

    async function recapExportToExcel() {
      isLoadingExport.value = true;
      try {
        const blob = await employeeAttendanceRequestApi.recapExport({
          period: recapParams.period,
          branch_id: recapParams.branch_id,
        });

        // Membuat link download temporary di browser
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;

        // Penamaan file dinamis di sisi client
        link.setAttribute(
          "download",
          `Rekap_Absensi_${new Date().toISOString().split("T")[0]}.xlsx`,
        );
        document.body.appendChild(link);
        link.click();

        // Cleanup element link setelah download terpicu
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Gagal mengunduh file laporan excel:", error);
        throw error;
      } finally {
        isLoadingExport.value = false;
      }
    }

    return {
      employeeAttendance,
      employeeAttendanceRecap,
      employeeAttendanceDetail,
      isLoading,
      isLoadingEdit,
      isLoadingDestroy,
      isLoadingDetail,
      isLoadingDeletePhoto,
      totalRecords,
      params,
      recapParams,
      detailParams,
      formDialog,
      formDialogDeletePhoto,
      payloadDeletePhoto,
      payloadEdit,
      serverErrors,
      recapDates,
      isLoadingApproval,
      isLoadingExport,
      exportToExcel,
      recapExportToExcel,
      approvalDiffLoc,
      destroyAttendance,
      modifyAttendance,
      fetchEmployeeAttendance,
      clearpayloadEdit,
      updateAttendance,
      resetServerErrors,
      fetchEmployeeAttendanceRecap,
      fetchEmployeeAttendanceDetail,
      getInOutLabelAttendanceDetail,
      deletePhoto,
      clearPayloadDeletePhoto,
    };
  },
);
