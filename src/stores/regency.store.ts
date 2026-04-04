import {
  regencyApi,
  type Regency,
  type RegencyParams,
} from "@/api/modules/regency.api";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useRegencyStore = defineStore("regency", () => {
  const regency = ref<Regency[]>([]);
  const isLoading = ref(false);

  const regencyParams = reactive<RegencyParams>({
    search: "",
    province_id: "",
  });

  async function fetchRegency() {
    isLoading.value = true;
    try {
      const res = await regencyApi.getData({ ...regencyParams });
      regency.value = res.data;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    regency,
    isLoading,
    regencyParams,
    fetchRegency,
  };
});
