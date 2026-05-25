import {
  provinceApi,
  type Province,
  type ProvinceParams,
} from "@/api/modules/province.api";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useProvinceStore = defineStore("province", () => {
  const province = ref<Province[]>([]);
  const isLoading = ref(false);

  const provinceParams = reactive<ProvinceParams>({
    search: "",
  });

  async function fetchProvince() {
    if (province.value && province.value.length > 0) {
      return;
    }

    isLoading.value = true;
    try {
      const res = await provinceApi.getData({ ...provinceParams });
      province.value = res.data;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    province,
    isLoading,
    provinceParams,
    fetchProvince,
  };
});
