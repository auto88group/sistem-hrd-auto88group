import {
  jobCareerApi,
  type JobCareer,
  type JobCareerSelectedParams,
} from "@/api/modules/job-career.api";
import { defineStore } from "pinia";
import { ref, reactive } from "vue";

export const useJobCareerStore = defineStore("job-career", () => {
  const JobCareerSelected = ref<JobCareer[]>([]);
  const isLoadingSelected = ref(false);
  const isLoadingUpdate = ref(false);
  const isLoadingCreate = ref(false);
  const isLoadingDestroy = ref(false);
  const updateError = ref<string | null>(null);
  const createError = ref<string | null>(null);
  const deleteError = ref<string | null>(null);

  const JobCareerSelectedParams = reactive<JobCareerSelectedParams>({
    user_id: "",
  });

  async function fetchJobCareerSelected() {
    isLoadingSelected.value = true;
    try {
      const res = await jobCareerApi.getSelected({
        ...JobCareerSelectedParams,
      });
      JobCareerSelected.value = res.data;
    } finally {
      isLoadingSelected.value = false;
    }
  }

  async function updateJobCareer(id: number, params: FormData) {
    isLoadingUpdate.value = true;
    updateError.value = null;
    try {
      const res = await jobCareerApi.updateJobCareer(id, params);
      // update data di list jika ada
      const index = JobCareerSelected.value.findIndex((u) => u.id === id);
      if (index !== -1) JobCareerSelected.value[index] = res.data;

      return res;
    } catch (err: any) {
      updateError.value =
        err?.response?.data?.message ?? "Gagal mengupdate data";
      throw err;
    } finally {
      isLoadingUpdate.value = false;
    }
  }

  async function createJobCareer(params: FormData) {
    isLoadingCreate.value = true;
    createError.value = null;
    try {
      const res = await jobCareerApi.createJobCareer(params);
      JobCareerSelected.value.push(res.data);
      return res;
    } catch (err: any) {
      createError.value = err?.response?.data?.message ?? "Gagal menambah data";
      throw err;
    } finally {
      isLoadingCreate.value = false;
    }
  }

  async function destroyJobCareer(id: number) {
    isLoadingDestroy.value = true;
    deleteError.value = null;
    try {
      const res = await jobCareerApi.destroyJobCareer(id);
      JobCareerSelected.value = JobCareerSelected.value.filter(
        (f) => f.id !== id,
      );
      return res;
    } catch (err: any) {
      deleteError.value =
        err?.response?.data?.message ?? "Gagal menghapus data";
      throw err;
    } finally {
      isLoadingDestroy.value = false;
    }
  }

  return {
    JobCareerSelected,
    isLoadingSelected,
    isLoadingUpdate,
    isLoadingCreate,
    isLoadingDestroy,
    JobCareerSelectedParams,
    createError,
    updateError,
    deleteError,
    fetchJobCareerSelected,
    updateJobCareer,
    createJobCareer,
    destroyJobCareer,
  };
});
