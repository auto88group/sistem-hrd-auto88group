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
  const isLoadingCreate = ref(false);
  const isLoadingUpdate = ref(false);
  const isLoadingDestroy = ref(false);
  const totalRecords = ref(0);
  const updateError = ref<string | null>(null);
  const createError = ref<string | null>(null);
  const deleteError = ref<string | null>(null);

  const params = reactive<WorkExperienceDatatablesParams>({
    draw: 1,
    start: 0,
    length: 50,
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

  async function updateWorkExperience(id: number, params: FormData) {
    isLoadingUpdate.value = true;
    updateError.value = null;
    try {
      const res = await workExperienceApi.updateWorkExperience(id, params);
      const index = workExperience.value.findIndex((u) => u.id === id);
      if (index !== -1) workExperience.value[index] = res.data;
      return res;
    } catch (err: any) {
      updateError.value =
        err?.response?.data?.message ?? "Gagal mengupdate pengalaman kerja";
      throw err;
    } finally {
      isLoadingUpdate.value = false;
    }
  }

  async function createWorkExperience(params: FormData) {
    isLoadingCreate.value = true;
    createError.value = null;
    try {
      const res = await workExperienceApi.createWorkExperience(params);
      workExperience.value.push(res.data);
      return res;
    } catch (err: any) {
      createError.value =
        err?.response?.data?.message ?? "Gagal menambah pengalaman kerja";
      throw err;
    } finally {
      isLoadingCreate.value = false;
    }
  }

  async function destroyWorkExperience(id: number) {
    isLoadingDestroy.value = true;
    deleteError.value = null;
    try {
      const res = await workExperienceApi.destroyWorkExperience(id);
      workExperience.value = workExperience.value.filter((f) => f.id !== id);
      return res;
    } catch (err: any) {
      deleteError.value =
        err?.response?.data?.message ?? "Gagal menghapus pengalaman kerja";
      throw err;
    } finally {
      isLoadingDestroy.value = false;
    }
  }

  return {
    workExperience,
    params,
    isLoading,
    isLoadingCreate,
    isLoadingUpdate,
    isLoadingDestroy,
    totalRecords,
    fetchWorkExperience,
    updateWorkExperience,
    createWorkExperience,
    destroyWorkExperience,
  };
});
