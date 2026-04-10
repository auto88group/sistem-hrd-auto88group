import {
  holidayApi,
  type Holiday,
  type HolidayBulkParams,
  type HolidayDatatablesParams,
  type PublicHoliday,
} from "@/api/modules/holiday.api";
import { defineStore } from "pinia";
import { ref, reactive } from "vue";

export const useHolidayStore = defineStore("holiday", () => {
  const holiday = ref<Holiday[]>([]);
  const publicHolidays = ref<PublicHoliday[]>([]);
  const holidayByMonth = ref<Holiday[]>([]);
  const isLoading = ref(false);
  const isLoadingByMonth = ref(false);
  const isLoadingCreate = ref(false);
  const isLoadingDestroy = ref(false);
  const isLoadingPublicHolidays = ref(false);
  const totalRecords = ref(0);

  const params = reactive<HolidayDatatablesParams>({
    draw: 1,
    start: 0,
    length: 10,
    search: undefined,
    month: undefined,
  });

  async function fetchHoliday() {
    isLoading.value = true;
    try {
      const res = await holidayApi.getDatatables({ ...params });
      holiday.value = res.data;
      totalRecords.value = res.recordsTotal;
      params.draw = res.draw + 1;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchHolidayByMonth(params?: number) {
    isLoadingByMonth.value = true;
    try {
      const res = await holidayApi.getHolidayByMonth(params);
      holidayByMonth.value = res.data;
    } finally {
      isLoadingByMonth.value = false;
    }
  }

  async function fetchPublicHolidays(year?: number) {
    isLoadingPublicHolidays.value = true;
    try {
      publicHolidays.value = await holidayApi.getPublicHolidays(year);
    } finally {
      isLoadingPublicHolidays.value = false;
    }
  }

  async function createHoliday(params: HolidayBulkParams) {
    isLoadingCreate.value = true;
    try {
      const res = await holidayApi.createHoliday(params);
      await fetchHoliday(); // refresh dari server
      return res;
    } catch (err: any) {
      throw err;
    } finally {
      isLoadingCreate.value = false;
    }
  }

  async function destroyHoliday(id: number) {
    isLoadingDestroy.value = true;
    try {
      const res = await holidayApi.destroyHoliday(id);
      const index = holiday.value.findIndex((item) => item.id === id);
      if (index !== -1) {
        holiday.value.splice(index, 1);
      }
      return res;
    } catch (err: any) {
      throw err;
    } finally {
      isLoadingDestroy.value = false;
    }
  }

  return {
    holiday,
    holidayByMonth,
    publicHolidays,
    isLoading,
    isLoadingCreate,
    isLoadingByMonth,
    isLoadingDestroy,
    isLoadingPublicHolidays,
    totalRecords,
    params,
    fetchHoliday,
    fetchHolidayByMonth,
    fetchPublicHolidays,
    createHoliday,
    destroyHoliday,
  };
});
