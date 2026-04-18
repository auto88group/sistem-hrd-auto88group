import {
  leaveRequestApi,
  type LeaveRequest,
  type LeaveRequestApprovalPayload,
  type LeaveRequestDatatablesParams,
} from "@/api/modules/leave-request.api";
import { defineStore } from "pinia";
import { ref, reactive } from "vue";

export const useLeaveRequestStore = defineStore("leaveRequest", () => {
  const leaveRequest = ref<LeaveRequest[]>([]);
  const leaveRequestSelected = ref<LeaveRequest | null>(null);
  const isLoading = ref(false);
  const isLoadingSelected = ref(false);
  const isLoadingDestroy = ref(false);
  const isLoadingApproval = ref(false);
  const totalRecords = ref(0);

  const dialog = ref(false);
  const infoDialog = ref(false);
  const serverErrors = reactive<Record<string, string>>({});

  const params = reactive<LeaveRequestDatatablesParams>({
    draw: 1,
    start: 0,
    length: 10,
    period: undefined,
    status: undefined,
    user_id: undefined,
    branch_id: undefined,
    hrd_leave_type_id: undefined,
  });

  const payloadApproval = reactive<LeaveRequestApprovalPayload>({
    id: null,
    note: null,
    status: null,
    level: null,
  });

  async function fetchLeaveRequest() {
    isLoading.value = true;
    try {
      const res = await leaveRequestApi.getDatatables({ ...params });
      leaveRequest.value = res.data;
      totalRecords.value = res.recordsTotal;
      params.draw = res.draw + 1;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchLeaveRequestSelected(userId: number) {
    isLoadingSelected.value = true;
    leaveRequestSelected.value = null;
    try {
      const res = await leaveRequestApi.getSelected(userId);
      console.log(res);
      if (res.success && res.data) {
        leaveRequestSelected.value = res.data;
      } else {
        leaveRequestSelected.value = null;
      }

      return res;
    } catch (error: any) {
      leaveRequestSelected.value = null;
      throw error;
    } finally {
      isLoadingSelected.value = false;
    }
  }

  async function approvalLeaveRequest() {
    isLoadingApproval.value = true;
    try {
      const res = await leaveRequestApi.approval(payloadApproval);
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

  return {
    leaveRequest,
    leaveRequestSelected,
    isLoading,
    isLoadingApproval,
    isLoadingDestroy,
    isLoadingSelected,
    totalRecords,
    payloadApproval,
    params,
    dialog,
    infoDialog,
    serverErrors,
    fetchLeaveRequest,
    approvalLeaveRequest,
    fetchLeaveRequestSelected,
    clearApprovalPayload,
  };
});
