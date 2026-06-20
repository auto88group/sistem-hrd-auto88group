import {
  filePersonnelApi,
  type FilePersonnel,
  type FilePersonnelSelectedParams,
} from "@/api/modules/file-personnel.api";
import { defineStore } from "pinia";
import { ref, reactive } from "vue";

export const useFilePersonnelStore = defineStore("file-personnel", () => {
  const filePersonnelSelected = ref<FilePersonnel[]>([]);
  const isLoadingSelected = ref(false);
  const isLoadingCreate = ref(false);
  const isLoadingUpdate = ref(false);
  const isLoadingDestroy = ref(false);
  const createError = ref<string | null>(null);
  const updateError = ref<string | null>(null);
  const deleteError = ref<string | null>(null);

  const filePersonnelSelectedParams = reactive<FilePersonnelSelectedParams>({
    user_id: "",
  });

  async function fetchFilePersonnelSelected() {
    isLoadingSelected.value = true;
    try {
      const res = await filePersonnelApi.getSelected({
        ...filePersonnelSelectedParams,
      });
      filePersonnelSelected.value = res.data;
    } finally {
      isLoadingSelected.value = false;
    }
  }

  async function createFilePersonnel(params: FormData) {
    isLoadingCreate.value = true;
    createError.value = null;
    try {
      const res = await filePersonnelApi.createFilePersonnel(params);
      filePersonnelSelected.value.push(res.data);
      return res;
    } catch (err: any) {
      createError.value =
        err?.response?.data?.message ?? "Gagal menambah file personnel";
      throw err;
    } finally {
      isLoadingCreate.value = false;
    }
  }

  async function updateFilePersonnel(id: number, params: FormData) {
    isLoadingUpdate.value = true;
    updateError.value = null;
    try {
      const res = await filePersonnelApi.updateFilePersonnel(id, params);
      const idx = filePersonnelSelected.value.findIndex((f) => f.id === id);
      if (idx !== -1) filePersonnelSelected.value[idx] = res.data;
      return res;
    } catch (err: any) {
      updateError.value =
        err?.response?.data?.message ?? "Gagal mengupdate file personnel";
      throw err;
    } finally {
      isLoadingUpdate.value = false;
    }
  }

  async function destroyFilePersonnel(id: number) {
    isLoadingDestroy.value = true;
    deleteError.value = null;
    try {
      const res = await filePersonnelApi.destroyFilePersonnel(id);
      filePersonnelSelected.value = filePersonnelSelected.value.filter(
        (f) => f.id !== id,
      );
      return res;
    } catch (err: any) {
      deleteError.value =
        err?.response?.data?.message ?? "Gagal menghapus file personnel";
      throw err;
    } finally {
      isLoadingDestroy.value = false;
    }
  }

  return {
    filePersonnelSelected,
    isLoadingSelected,
    isLoadingCreate,
    isLoadingUpdate,
    isLoadingDestroy,
    filePersonnelSelectedParams,
    createError,
    updateError,
    deleteError,
    fetchFilePersonnelSelected,
    createFilePersonnel,
    updateFilePersonnel,
    destroyFilePersonnel,
  };
});
