import {
  remainingLeaveApi,
  type History,
  type RemainingLeave,
  type RemainingLeaveAdjustmentPayload,
  type RemainingLeaveDatatablesParams,
  type RemainingLeaveDetailParams,
  type RemainingLeaveSettingError,
  type RemainingLeaveSettingPayload,
} from "@/api/modules/remainig-leave.api";
import { defineStore } from "pinia";
import { ref, reactive } from "vue";

export const useRemainingLeaveStore = defineStore("remaining-leave", () => {
  const remainingLeave = ref<RemainingLeave[]>([]);
  const historySelected = ref<History[]>([]);
  const isLoading = ref(false);
  const isLoadingDetail = ref(false);
  const isLoadingAdjustmant = ref(false);
  const isLoadingSetting = ref(false);
  const totalRecords = ref(0);
  const detailTotalRecords = ref(0);
  const settingPartialErrors = ref<RemainingLeaveSettingError[]>([]);

  const params = reactive<RemainingLeaveDatatablesParams>({
    draw: 1,
    start: 0,
    length: 10,
    user_id: undefined,
    branch_id: undefined,
    sortBy: "id", // ← tambah
    sortDirection: "asc", // ← tambah
  });

  const detailParams = reactive<RemainingLeaveDetailParams>({
    draw: 1,
    start: 0,
    length: 10,
    year: undefined,
    change: undefined,
    type: undefined,
  });

  async function fetchRemainingLeave() {
    isLoading.value = true;
    try {
      const res = await remainingLeaveApi.getDatatables({ ...params });
      remainingLeave.value = res.data;
      totalRecords.value = res.recordsTotal;
      params.draw = res.draw + 1;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchRemainingLeaveDetail(id: number) {
    isLoadingDetail.value = true;
    try {
      const res = await remainingLeaveApi.getDetail(id, detailParams);
      historySelected.value = res.data;
      detailTotalRecords.value = res.recordsTotal;
      detailParams.draw = res.draw + 1;
    } finally {
      isLoadingDetail.value = false;
    }
  }

  async function storeAdjustment(payload: RemainingLeaveAdjustmentPayload) {
    isLoadingAdjustmant.value = true;
    try {
      const res = await remainingLeaveApi.storeAdjustment(payload);
      return res;
    } finally {
      isLoadingAdjustmant.value = false;
    }
  }

  async function storeSetting(payload: RemainingLeaveSettingPayload) {
    isLoadingSetting.value = true;
    settingPartialErrors.value = [];
    try {
      const res = await remainingLeaveApi.storeSetting(payload);
      return res;
    } finally {
      isLoadingSetting.value = false;
    }
  }

  return {
    remainingLeave,
    historySelected,
    isLoading,
    isLoadingAdjustmant,
    isLoadingDetail,
    totalRecords,
    detailTotalRecords,
    params,
    detailParams,
    isLoadingSetting,
    settingPartialErrors,
    storeSetting,
    fetchRemainingLeave,
    fetchRemainingLeaveDetail,
    storeAdjustment,
  };
});
