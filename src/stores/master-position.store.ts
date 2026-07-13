import {
  masterPositionApi,
  type MasterPosition,
  type MasterLevel,
  type MasterPositionDatatablesParams,
  type MasterPositionParams,
} from "@/api/modules/master-position.api";
import { defineStore } from "pinia";
import { ref, reactive } from "vue";

export const useMasterPositionStore = defineStore("masterPosition", () => {
  const positions = ref<MasterPosition[]>([]);
  const levels = ref<MasterLevel[]>([]); // Menyimpan data dropdown level

  const isLoading = ref(false);
  const isLoadingLevels = ref(false);
  const isLoadingCreate = ref(false);
  const isLoadingUpdate = ref(false);
  const isLoadingDestroy = ref(false);
  const totalRecords = ref(0);

  const params = reactive<MasterPositionDatatablesParams>({
    draw: 1,
    start: 0,
    length: 10,
    search: undefined,
    sortBy: "id",
    sortDirection: "asc",
  });

  async function fetchPositions() {
    isLoading.value = true;
    try {
      const res = await masterPositionApi.getDatatables({ ...params });
      positions.value = res.data;
      totalRecords.value = res.recordsTotal;
      params.draw = res.draw + 1;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchLevels() {
    if (levels.value.length > 0) return; // Mencegah fetch berulang jika data sudah ada
    isLoadingLevels.value = true;
    try {
      const res = await masterPositionApi.getLevels();
      levels.value = res.data;
    } finally {
      isLoadingLevels.value = false;
    }
  }

  async function createPosition(payload: MasterPositionParams) {
    isLoadingCreate.value = true;
    try {
      const res = await masterPositionApi.createPosition(payload);
      // Refresh tabel setelah sukses create untuk mendapatkan DT_RowIndex & ID yang benar
      await fetchPositions();
      return res;
    } catch (err: any) {
      throw err;
    } finally {
      isLoadingCreate.value = false;
    }
  }

  async function updatePosition(id: number, payload: MasterPositionParams) {
    isLoadingUpdate.value = true;
    try {
      const res = await masterPositionApi.updatePosition(id, payload);
      const index = positions.value.findIndex((item) => item.id === id);
      if (index !== -1) {
        positions.value[index] = {
          ...positions.value[index],
          ...payload,
        };
      }
      return res;
    } catch (err: any) {
      throw err;
    } finally {
      isLoadingUpdate.value = false;
    }
  }

  async function destroyPosition(id: number) {
    isLoadingDestroy.value = true;
    try {
      const res = await masterPositionApi.destroyPosition(id);
      const index = positions.value.findIndex((item) => item.id === id);
      if (index !== -1) {
        positions.value.splice(index, 1);
        totalRecords.value -= 1;
      }
      return res;
    } catch (err: any) {
      throw err;
    } finally {
      isLoadingDestroy.value = false;
    }
  }

  return {
    positions,
    levels,
    isLoading,
    isLoadingLevels,
    isLoadingCreate,
    isLoadingUpdate,
    isLoadingDestroy,
    totalRecords,
    params,
    fetchPositions,
    fetchLevels,
    createPosition,
    updatePosition,
    destroyPosition,
  };
});
