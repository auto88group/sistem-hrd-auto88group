import {
  shiftScheduleApi,
  type ShiftScheduleImportPayload,
  type ShiftSchedule,
  type ShiftScheduleDatatablesParams,
  type ShiftScheduleStorePayload,
  type ShiftScheduleTemplateParams,
  type ShiftScheduleUpdatePayload,
} from "@/api/modules/shift-schedule.api";
import { defineStore } from "pinia";
import { ref, reactive } from "vue";

export const useShiftScheduleStore = defineStore("shift-schedule", () => {
  const shiftSchedule = ref<ShiftSchedule[]>([]);
  const isLoading = ref(false);
  const isLoadingCreate = ref(false);
  const isLoadingUpdate = ref(false);
  const isLoadingDestroy = ref(false);
  const isLoadingImport = ref(false);
  const totalRecords = ref(0);

  const isImportDialogOpen = ref(false);
  const isLoadingDownloadTemplate = ref(false);

  const params = reactive<ShiftScheduleDatatablesParams>({
    draw: 1,
    start: 0,
    length: 10,
    user_id: undefined,
    branch_id: undefined,
    period: undefined,
  });

  async function fetchShiftSchedule() {
    isLoading.value = true;
    try {
      const res = await shiftScheduleApi.getDatatables({ ...params });
      shiftSchedule.value = res.data;
      totalRecords.value = res.recordsTotal;
      params.draw = res.draw + 1;
    } finally {
      isLoading.value = false;
    }
  }

  async function store(payload: ShiftScheduleStorePayload) {
    isLoadingCreate.value = true;
    try {
      return await shiftScheduleApi.store(payload);
    } finally {
      isLoadingCreate.value = false;
    }
  }

  async function update(id: number, payload: ShiftScheduleUpdatePayload) {
    isLoadingUpdate.value = true;
    try {
      return await shiftScheduleApi.update(id, payload);
    } finally {
      isLoadingUpdate.value = false;
    }
  }

  async function destroy(id: number) {
    isLoadingDestroy.value = true;
    try {
      return await shiftScheduleApi.destroy(id);
    } finally {
      isLoadingDestroy.value = false;
    }
  }

  async function downloadTemplate(payload: ShiftScheduleTemplateParams) {
    isLoadingDownloadTemplate.value = true;
    try {
      const res = await shiftScheduleApi.getTemplate(payload);

      // Data berhasil didapat, untuk sekarang kita console.log dulu
      // Proses generate Excel-nya akan kita bahas di tahap selanjutnya
      console.log("Data Template Berhasil Diambil:", res);

      return res;
    } catch (error) {
      console.error("Gagal mengambil data template:", error);
      throw error;
    } finally {
      isLoadingDownloadTemplate.value = false;
    }
  }
  async function importExcel(payload: ShiftScheduleImportPayload) {
    isLoadingImport.value = true;
    try {
      return await shiftScheduleApi.importExcel(payload);
    } finally {
      isLoadingImport.value = false;
    }
  }

  return {
    shiftSchedule,
    isLoading,
    isLoadingCreate,
    isLoadingUpdate,
    isLoadingDestroy,
    totalRecords,
    params,

    isImportDialogOpen,
    isLoadingDownloadTemplate,
    isLoadingImport,
    importExcel,
    downloadTemplate,

    fetchShiftSchedule,
    store,
    update,
    destroy,
  };
});
