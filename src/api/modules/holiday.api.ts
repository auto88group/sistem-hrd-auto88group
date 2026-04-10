import api from "../axios";
import externalApi from "../axios-external";
export interface HolidayDatatablesParams {
  draw?: number;
  start?: number;
  length?: number;
  search?: string;
  month?: number;
}

export interface PublicHoliday {
  date: string;
  name: string;
}

export interface HolidayParams {
  tanggal: string;
  note: string;
}
export type HolidayBulkParams = HolidayParams[];

export interface HolidayCreateUpdateResponse {
  success: boolean;
  message: string;
  data: Holiday;
}

export interface HolidayDatatablesResponse {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: Holiday[];
}

export interface HolidayDefaultResponse {
  success: boolean;
  message: string;
}

export interface HolidayByMonthResponse {
  success: boolean;
  month: number;
  data: Holiday[];
}

export interface Holiday {
  DT_RowIndex: number;
  id: number;
  tanggal: string;
  note: string;
}

export const holidayApi = {
  getDatatables(
    params: HolidayDatatablesParams,
  ): Promise<HolidayDatatablesResponse> {
    return api.get("/hrd/holidays", { params }).then((res) => res.data);
  },

  getHolidayByMonth(params?: number): Promise<HolidayByMonthResponse> {
    return api
      .get(`/hrd/holidays/month?month=${params}`)
      .then((res) => res.data);
  },

  createHoliday(
    params: HolidayBulkParams,
  ): Promise<HolidayCreateUpdateResponse> {
    const payload = {
      data: params.map((item) => ({
        date: item.tanggal, // sesuai backend
        note: item.note,
      })),
    };
    return api
      .post(`/hrd/holidays/?_method=POST`, payload)
      .then((res) => res.data);
  },

  destroyHoliday(id: number): Promise<HolidayDefaultResponse> {
    return api.delete(`/hrd/holidays/${id}`).then((res) => res.data);
  },

  getPublicHolidays(year?: number): Promise<PublicHoliday[]> {
    const baseUrl = import.meta.env.VITE_HOLIDAY_JSON as string;
    const url = year ? `${baseUrl}/${year}` : baseUrl;
    return externalApi.get(url).then((res) => res.data);
  },
};
