import {
  villageApi,
  type Village,
  type VillageParams,
} from "@/api/modules/village.api";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useVillageStore = defineStore("village", () => {
  const village = ref<Village[]>([]);
  const isLoading = ref(false);

  const villageParams = reactive<VillageParams>({
    search: "",
    district_id: "",
  });

  async function fetchVillage() {
    isLoading.value = true;
    try {
      const res = await villageApi.getData({ ...villageParams });
      village.value = res.data;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    village,
    isLoading,
    villageParams,
    fetchVillage,
  };
});
