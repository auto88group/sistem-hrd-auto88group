import {
  districtApi,
  type District,
  type DistrictParams,
} from "@/api/modules/district.api";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useDistrictStore = defineStore("district", () => {
  const district = ref<District[]>([]);
  const isLoading = ref(false);

  const districtParams = reactive<DistrictParams>({
    search: "",
    regency_id: "",
  });

  async function fetchDistrict() {
    isLoading.value = true;
    try {
      const res = await districtApi.getData({ ...districtParams });
      district.value = res.data;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    district,
    isLoading,
    districtParams,
    fetchDistrict,
  };
});
