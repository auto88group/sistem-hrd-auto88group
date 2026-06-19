import {
  coordinateApi,
  type Coordinate,
  type CoordinateParams,
  type CoordinateUpdatePayload,
} from "@/api/modules/coordinate.api";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export interface CoordinateSelected {
  id: string;
  name: string;
  accuracy: number | null;
  overtime_quota: number | null;
}

export const useCoordinateStore = defineStore("coordinate", () => {
  const coordinates = ref<Coordinate[]>([]);
  const isLoading = ref(false);
  const isLoadingEdit = ref(false);
  const totalRecords = ref(0);
  const recordsFiltered = ref(0);

  const coordinateParams = reactive<CoordinateParams>({
    draw: 1,
    start: 0,
    length: 10,
    search: "",
    sortBy: "id",
    sortDirection: "asc",
  });

  const dialog = reactive({
    edit: false,
  });

  const selectedCoordinate = ref<CoordinateSelected | null>(null);

  const serverErrors = reactive<Record<string, string>>({});

  function openEditDialog(item: Coordinate) {
    selectedCoordinate.value = {
      id: item.id,
      name: item.name,
      accuracy: item.accuracy,
      overtime_quota: item.overtime_quota,
    };
    Object.keys(serverErrors).forEach((key) => delete serverErrors[key]);
    dialog.edit = true;
  }

  function closeEditDialog() {
    selectedCoordinate.value = null;
    Object.keys(serverErrors).forEach((key) => delete serverErrors[key]);
    dialog.edit = false;
  }

  async function fetchCoordinates() {
    isLoading.value = true;
    try {
      const res = await coordinateApi.getData({ ...coordinateParams });
      coordinates.value = res.data;
      totalRecords.value = res.recordsTotal;
      recordsFiltered.value = res.recordsFiltered;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateCoordinate(): Promise<{
    success: boolean;
    message: string;
  } | null> {
    if (!selectedCoordinate.value) return null;
    isLoadingEdit.value = true;
    try {
      const payload: CoordinateUpdatePayload = {
        accuracy: selectedCoordinate.value.accuracy,
        overtime_quota: selectedCoordinate.value.overtime_quota,
      };
      const res = await coordinateApi.update(
        selectedCoordinate.value.id,
        payload,
      );
      return res;
    } finally {
      isLoadingEdit.value = false;
    }
  }

  return {
    coordinates,
    isLoading,
    isLoadingEdit,
    totalRecords,
    recordsFiltered,
    coordinateParams,
    dialog,
    selectedCoordinate,
    serverErrors,
    openEditDialog,
    closeEditDialog,
    fetchCoordinates,
    updateCoordinate,
  };
});
