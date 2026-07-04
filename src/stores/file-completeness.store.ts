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
      const index = fileCompletenessSelected.value.findIndex(
        (u) => u.id === id,
      );
      if (index !== -1) {
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

  // ─── ACTION BARU: TAMBAH MULTI DATA SEKALIGUS ───
  async function bulkCreateFileCompleteness(params: FormData) {
    isLoadingCreate.value = true;
    createError.value = null;
    try {
      const res = await fileCompletenessApi.bulkCreateFileCompleteness(params);
      if (Array.isArray(res.data)) {
        fileCompletenessSelected.value.push(...res.data);
      }
      return res;
    } catch (err: any) {
      createError.value =
        err?.response?.data?.message ?? "Gagal menambah berkas sekaligus";
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

  // ─── ACTION BARU: HAPUS MULTI DATA SEKALIGUS ───
  async function bulkDestroyFileCompleteness(ids: number[]) {
    isLoadingDestroy.value = true;
    deleteError.value = null;
    try {
      const res = await fileCompletenessApi.bulkDestroyFileCompleteness(ids);
      fileCompletenessSelected.value = fileCompletenessSelected.value.filter(
        (f) => !ids.includes(f.id),
      );
      return res;
    } catch (err: any) {
      deleteError.value =
        err?.response?.data?.message ?? "Gagal menghapus berkas massal";
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
    bulkCreateFileCompleteness,
    destroyFileCompleteness,
    bulkDestroyFileCompleteness,
  };
});
