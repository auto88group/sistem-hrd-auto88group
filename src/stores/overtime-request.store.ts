import {
  overtimeRequestApi,
  type OvertimeRequest,
  type OvertimeRequestApprovalPayload,
  type OvertimeRequestParams,
} from "@/api/modules/overtime-request.api";
import { defineStore } from "pinia";
import { ref, reactive } from "vue";

export const useOvertimeRequestStore = defineStore("overtime-request", () => {
  const overtimeRequest = ref<OvertimeRequest[]>([]);
  const overtimeRequestSelected = ref<OvertimeRequest | null>(null);
  const isLoading = ref(false);
  const isLoadingExport = ref(false);
  const isLoadingApproval = ref(false);
  const totalRecords = ref(0);

  const dialog = ref(false);
  const detailOvertimeDialog = ref(false);
  const serverErrors = reactive<Record<string, string>>({});

  const payloadApproval = reactive<OvertimeRequestApprovalPayload>({
    id: null,
    note: null,
    status: null,
    level: null,
  });

  const params = reactive<OvertimeRequestParams>({
    draw: 1,
    start: 0,
    length: 10,
    period: undefined,
    status: null,
    user_id: null,
    branch_id: null,
  });

  async function fetchOvertimeRequest() {
    isLoading.value = true;
    try {
      const res = await overtimeRequestApi.getDatatables({ ...params });
      overtimeRequest.value = res.data;
      totalRecords.value = res.recordsTotal;
      params.draw = res.draw + 1;
    } finally {
      isLoading.value = false;
    }
  }

  async function approvalOvertimeRequest() {
    isLoadingApproval.value = true;
    try {
      const res = await overtimeRequestApi.approval(payloadApproval);
      return res;
    } finally {
      isLoadingApproval.value = false;
    }
  }

  function clearApprovalPayload() {
    payloadApproval.id = null;
    payloadApproval.note = null;
    payloadApproval.status = null;
    payloadApproval.level = null;
  }

  async function exportToExcel() {
    isLoadingExport.value = true;
    try {
      const blob = await overtimeRequestApi.export({
        year: params.period,
        branch_id: params.branch_id,
      });

      // Membuat link download temporary di browser
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;

      // Penamaan file dinamis di sisi client
      link.setAttribute(
        "download",
        `Pengajuan_Lembur_${new Date().toISOString().split("T")[0]}.xlsx`,
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
    isLoading,
    isLoadingApproval,
    params,
    totalRecords,
    overtimeRequest,
    payloadApproval,
    dialog,
    detailOvertimeDialog,
    overtimeRequestSelected,
    serverErrors,
    isLoadingExport,

    exportToExcel,
    fetchOvertimeRequest,
    approvalOvertimeRequest,
    clearApprovalPayload,
  };
});
