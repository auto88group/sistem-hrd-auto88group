import {
  bloodTypeApi,
  type BloodType,
  type BloodTypeDataParams,
} from "@/api/modules/blood-type.api";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useBloodTypeStore = defineStore("blood-type", () => {
  const bloodTypeData = ref<BloodType[]>([]);
  const isLoadingData = ref(false);

  const bloodTypeDataParams = reactive<BloodTypeDataParams>({
    search: "",
  });

  async function fetchBloodTypeData() {
    if (bloodTypeData.value && bloodTypeData.value.length > 0) {
      return;
    }
    isLoadingData.value = true;
    try {
      const res = await bloodTypeApi.getData({
        ...bloodTypeDataParams,
      });

      bloodTypeData.value = res.data;
    } finally {
      isLoadingData.value = false;
    }
  }

  return {
    bloodTypeData,
    isLoadingData,
    bloodTypeDataParams,
    fetchBloodTypeData,
  };
});
