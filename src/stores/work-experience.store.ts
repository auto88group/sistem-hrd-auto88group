import {
  workExperienceApi,
  type WorkExperience,
  type WorkExperienceDatatablesParams,
} from "@/api/modules/work-experience.api";
import { defineStore } from "pinia";
import { ref, reactive } from "vue";

export const useWorkExperienceStore = defineStore("work-experience", () => {
  const workExperience = ref<WorkExperience[]>([]);
  const isLoading = ref(false);
  const totalRecords = ref(0);

  const params = reactive<WorkExperienceDatatablesParams>({
    draw: 1,
    start: 0,
    length: 10,
    search_slug: "",
  });

  async function fetchWorkExperience() {
    isLoading.value = true;
    try {
      const res = await workExperienceApi.getDatatables({ ...params });
      workExperience.value = res.data;
      totalRecords.value = res.recordsTotal;
      params.draw = res.draw + 1;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    workExperience,
    params,
    isLoading,
    totalRecords,
    fetchWorkExperience,
  };
});
