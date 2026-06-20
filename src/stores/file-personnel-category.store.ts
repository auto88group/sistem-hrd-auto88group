import {
  filePersonnelCategoryApi,
  type FilePersonnelCategory,
  type FilePersonnelCategoryCreateUpdateParams,
} from "@/api/modules/file-personnel-category.api";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useFilePersonnelCategoryStore = defineStore(
  "file-personnel-category",
  () => {
    const categories = ref<FilePersonnelCategory[]>([]);
    const isLoadingFetch = ref(false);
    const isLoadingCreate = ref(false);
    const isLoadingUpdate = ref(false);
    const isLoadingToggle = ref(false);
    const isLoadingDestroy = ref(false);
    const fetchError = ref<string | null>(null);
    const createError = ref<string | null>(null);
    const updateError = ref<string | null>(null);
    const toggleError = ref<string | null>(null);
    const deleteError = ref<string | null>(null);

    async function fetchCategories() {
      isLoadingFetch.value = true;
      fetchError.value = null;
      try {
        const res = await filePersonnelCategoryApi.getAll();
        categories.value = res.data;
      } catch (err: any) {
        fetchError.value =
          err?.response?.data?.message ?? "Gagal memuat kategori";
        throw err;
      } finally {
        isLoadingFetch.value = false;
      }
    }

    async function createCategory(
      params: FilePersonnelCategoryCreateUpdateParams,
    ) {
      isLoadingCreate.value = true;
      createError.value = null;
      try {
        const res = await filePersonnelCategoryApi.create(params);
        categories.value.push(res.data);
        return res;
      } catch (err: any) {
        createError.value =
          err?.response?.data?.message ?? "Gagal menambah kategori";
        throw err;
      } finally {
        isLoadingCreate.value = false;
      }
    }

    async function updateCategory(
      id: number,
      params: FilePersonnelCategoryCreateUpdateParams,
    ) {
      isLoadingUpdate.value = true;
      updateError.value = null;
      try {
        const res = await filePersonnelCategoryApi.update(id, params);
        const idx = categories.value.findIndex((c) => c.id === id);
        if (idx !== -1) categories.value[idx] = res.data;
        return res;
      } catch (err: any) {
        updateError.value =
          err?.response?.data?.message ?? "Gagal mengupdate kategori";
        throw err;
      } finally {
        isLoadingUpdate.value = false;
      }
    }

    async function toggleMandatory(id: number) {
      isLoadingToggle.value = true;
      toggleError.value = null;
      try {
        const res = await filePersonnelCategoryApi.toggleMandatory(id);
        const idx = categories.value.findIndex((c) => c.id === id);
        if (idx !== -1) categories.value[idx] = res.data;
        return res;
      } catch (err: any) {
        toggleError.value =
          err?.response?.data?.message ?? "Gagal mengubah status mandatory";
        throw err;
      } finally {
        isLoadingToggle.value = false;
      }
    }

    async function destroyCategory(id: number) {
      isLoadingDestroy.value = true;
      deleteError.value = null;
      try {
        const res = await filePersonnelCategoryApi.destroy(id);
        categories.value = categories.value.filter((c) => c.id !== id);
        return res;
      } catch (err: any) {
        deleteError.value =
          err?.response?.data?.message ?? "Gagal menghapus kategori";
        throw err;
      } finally {
        isLoadingDestroy.value = false;
      }
    }

    return {
      categories,
      isLoadingFetch,
      isLoadingCreate,
      isLoadingUpdate,
      isLoadingToggle,
      isLoadingDestroy,
      fetchError,
      createError,
      updateError,
      toggleError,
      deleteError,
      fetchCategories,
      createCategory,
      updateCategory,
      toggleMandatory,
      destroyCategory,
    };
  },
);
