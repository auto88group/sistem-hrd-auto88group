import {
  leaveRequestApi,
  type LeaveRequest,
  type LeaveRequestApprovalPayload,
  type LeaveRequestCreateUpdatePayload,
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
  const isLoadingCreateEdit = ref(false);
  const isLoadingDeductLeave = ref(false);
  const totalRecords = ref(0);

  const dialog = ref(false);
  const createEditDialog = ref(false);
  const infoDialog = ref(false);
  const serverErrors = reactive<Record<string, string>>({});

  const paramId = ref<number | null>(null);

  const params = reactive<LeaveRequestDatatablesParams>({
    draw: 1,
    start: 0,
    length: 10,
    period: undefined,
    status: null,
    user_id: null,
    branch_id: null,
    hrd_leave_type_id: null,
  });

  const payloadApproval = reactive<LeaveRequestApprovalPayload>({
    id: null,
    note: null,
    status: null,
    level: null,
  });

  const payloadCreateUpdate = reactive<LeaveRequestCreateUpdatePayload>({
    id: null,
    user_id: null,
    user_name: null,
    user_full_name: null,
    user_email: null,
    hrd_leave_type_id: null,
    start_date: null,
    end_date: null,
    total_days: null,
    reason: null,
    attachment: null,
    attachment_preview: null,
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

  async function updateLeaveRequest() {
    isLoadingCreateEdit.value = true;
    try {
      if (payloadCreateUpdate.hrd_leave_type_id != 1) {
        countDays();
      }

      const formData = toFormData(payloadCreateUpdate);
      const res = await leaveRequestApi.updateLeaveRequest(
        payloadCreateUpdate.id ?? 0,
        formData,
      );
      return res;
    } catch (err: any) {
      throw err;
    } finally {
      isLoadingCreateEdit.value = false;
    }
  }

  async function createLeaveRequest() {
    isLoadingCreateEdit.value = true;
    try {
      if (payloadCreateUpdate.hrd_leave_type_id != 1) {
        countDays();
      }

      const formData = toFormData(payloadCreateUpdate);
      const res = await leaveRequestApi.createLeaveRequest(formData);
      return res;
    } catch (err: any) {
      throw err;
    } finally {
      isLoadingCreateEdit.value = false;
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

  async function deductLeaveRequest() {
    isLoadingDeductLeave.value = true;
    try {
      const res = await leaveRequestApi.deductLeave(paramId.value);
      return res;
    } finally {
      isLoadingDeductLeave.value = false;
    }
  }

  async function restoreLeaveRequest() {
    isLoadingDeductLeave.value = true;
    try {
      const res = await leaveRequestApi.restoreLeave(paramId.value);
      return res;
    } finally {
      isLoadingDeductLeave.value = false;
    }
  }

  async function destroyLeaveRequest() {
    isLoadingDestroy.value = true;
    try {
      const res = await leaveRequestApi.destroyLeave(paramId.value);
      return res;
    } finally {
      isLoadingDestroy.value = false;
    }
  }

  function clearApprovalPayload() {
    payloadApproval.id = null;
    payloadApproval.note = null;
    payloadApproval.status = null;
    payloadApproval.level = null;
  }

  function clearCreateUpdatePayload() {
    Object.assign(payloadCreateUpdate, {
      id: null,
      user_id: null,
      hrd_leave_type_id: null,
      start_date: null,
      end_date: null,
      total_days: null,
      reason: null,
      attachment: null,
      attachment_preview: null,
    });
  }

  function toFormData(payload: LeaveRequestCreateUpdatePayload) {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as any);
      }
    });

    return formData;
  }

  function countDays() {
    if (!payloadCreateUpdate.start_date || !payloadCreateUpdate.end_date) {
      return 0; // atau throw error / return null
    }

    const start = new Date(payloadCreateUpdate.start_date + "T00:00:00");
    const end = new Date(payloadCreateUpdate.end_date + "T00:00:00");

    const diffTime = end.getTime() - start.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    payloadCreateUpdate.total_days = diffDays + 1;
  }

  return {
    leaveRequest,
    leaveRequestSelected,
    isLoading,
    isLoadingApproval,
    isLoadingDestroy,
    isLoadingSelected,
    isLoadingDeductLeave,
    isLoadingCreateEdit,
    totalRecords,
    payloadApproval,
    params,
    paramId,
    dialog,
    createEditDialog,
    infoDialog,
    serverErrors,
    payloadCreateUpdate,
    fetchLeaveRequest,
    approvalLeaveRequest,
    fetchLeaveRequestSelected,
    clearApprovalPayload,
    deductLeaveRequest,
    clearCreateUpdatePayload,
    updateLeaveRequest,
    restoreLeaveRequest,
    destroyLeaveRequest,
    createLeaveRequest,
  };
});
