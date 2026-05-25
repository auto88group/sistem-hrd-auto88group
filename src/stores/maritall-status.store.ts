import {
  maritalStatusApi,
  type MaritalStatus,
  type MaritalStatusDataParams,
} from "@/api/modules/marital-status.api";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useMaritalStatusStore = defineStore("marital-status", () => {
  const maritalStatusData = ref<MaritalStatus[]>([]);
  const isLoadingData = ref(false);

  const maritalStatusDataParams = reactive<MaritalStatusDataParams>({
    search: "",
  });

  async function fetchMaritalStatusData() {
    if (maritalStatusData.value && maritalStatusData.value.length > 0) {
      return;
    }
    isLoadingData.value = true;
    try {
      const res = await maritalStatusApi.getData({
        ...maritalStatusDataParams,
      });

      maritalStatusData.value = res.data;
    } finally {
      isLoadingData.value = false;
    }
  }

  return {
    maritalStatusData,
    isLoadingData,
    maritalStatusDataParams,
    fetchMaritalStatusData,
  };
});
