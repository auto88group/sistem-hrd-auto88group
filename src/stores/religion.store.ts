import {
  religionApi,
  type Religion,
  type ReligionDataParams,
} from "@/api/modules/religion.api";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useReligionStore = defineStore("religion", () => {
  const religionData = ref<Religion[]>([]);
  const isLoadingData = ref(false);

  const religionDataParams = reactive<ReligionDataParams>({
    search: "",
  });

  async function fetchReligionData() {
    if (religionData.value && religionData.value.length > 0) {
      return;
    }
    isLoadingData.value = true;
    try {
      const res = await religionApi.getData({
        ...religionDataParams,
      });

      religionData.value = res.data;
    } finally {
      isLoadingData.value = false;
    }
  }

  return {
    religionData,
    isLoadingData,
    religionDataParams,
    fetchReligionData,
  };
});
