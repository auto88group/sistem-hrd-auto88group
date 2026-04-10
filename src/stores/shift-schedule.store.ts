import {
  shiftScheduleApi,
  type ShiftSchedule,
  type ShiftScheduleDatatablesParams,
} from "@/api/modules/shift-schedule.api";
import { defineStore } from "pinia";
import { ref, reactive } from "vue";

export const useShiftScheduleStore = defineStore("shift-schedule", () => {
  const shiftSchedule = ref<ShiftSchedule[]>([]);
  const isLoading = ref(false);
  const totalRecords = ref(0);

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

  return {
    shiftSchedule,
    isLoading,
    totalRecords,
    params,
    fetchShiftSchedule,
  };
});
