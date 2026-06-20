import {
  fileCompletenessApi,
  type FileCompleteness,
  type FileCompletenessSelectedParams,
} from "@/api/modules/file-completeness.api";
import { defineStore } from "pinia";
import { ref, reactive } from "vue";

export const useFileCompletenessStore = defineStore("file-completeness", () => {
  const fileCompletenessSelected = ref<FileCompleteness[]>([]);
  const isLoadingSelected = ref(false);
  const isLoadingUpdate = ref(false);
  const isLoadingCreate = ref(false);
  const isLoadingDestroy = ref(false);
  const updateError = ref<string | null>(null);
  const createError = ref<string | null>(null);
  const deleteError = ref<string | null>(null);

  const fileCompletenessSelectedParams =
    reactive<FileCompletenessSelectedParams>({
      user_id: "",
    });

  async function fetchFileCompletenessSelected() {
    isLoadingSelected.value = true;
    try {
      const res = await fileCompletenessApi.getSelected({
        ...fileCompletenessSelectedParams,
      });
      fileCompletenessSelected.value = res.data;
    } finally {
      isLoadingSelected.value = false;
    }
  }

  async function updateFileCompleteness(id: number, params: FormData) {
    isLoadingUpdate.value = true;
    updateError.value = null;
    try {
      const res = await fileCompletenessApi.updateFileCompleteness(id, params);
      // update data di list jika ada
      const index = fileCompletenessSelected.value.findIndex(
        (u) => u.id === id,
      );
      if (index !== -1) {
        // pertahankan category_name & is_mandatory dari data lama
        // lalu timpa dengan data baru dari response
        fileCompletenessSelected.value[index] = {
          ...fileCompletenessSelected.value[index],
          ...res.data,
        };
      }

      return res;
    } catch (err: any) {
      updateError.value =
        err?.response?.data?.message ?? "Gagal mengupdate file";
      throw err;
    } finally {
      isLoadingUpdate.value = false;
    }
  }

  async function createFileCompleteness(params: FormData) {
    isLoadingCreate.value = true;
    createError.value = null;
    try {
      const res = await fileCompletenessApi.createFileCompleteness(params);
      fileCompletenessSelected.value.push(res.data);
      return res;
    } catch (err: any) {
      createError.value = err?.response?.data?.message ?? "Gagal menambah file";
      throw err;
    } finally {
      isLoadingCreate.value = false;
    }
  }

  async function destroyFileCompleteness(id: number) {
    isLoadingDestroy.value = true;
    deleteError.value = null;
    try {
      const res = await fileCompletenessApi.destroyFileCompleteness(id);
      fileCompletenessSelected.value = fileCompletenessSelected.value.filter(
        (f) => f.id !== id,
      );
      return res;
    } catch (err: any) {
      deleteError.value =
        err?.response?.data?.message ?? "Gagal menghapus file";
      throw err;
    } finally {
      isLoadingDestroy.value = false;
    }
  }

  return {
    fileCompletenessSelected,
    isLoadingSelected,
    isLoadingUpdate,
    isLoadingCreate,
    isLoadingDestroy,
    fileCompletenessSelectedParams,
    createError,
    updateError,
    deleteError,
    fetchFileCompletenessSelected,
    updateFileCompleteness,
    createFileCompleteness,
    destroyFileCompleteness,
  };
});
