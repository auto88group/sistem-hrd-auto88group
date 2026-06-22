import api from "../axios";
export interface ShiftScheduleDatatablesParams {
  draw?: number;
  start?: number;
  length?: number;
  period?: string;
  branch_id?: number;
  user_id?: number;
}
export interface ShiftScheduleDatatablesResponse {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: ShiftSchedule[];
}

export interface ShiftSchedule {
  DT_RowIndex: number;
  id?: number;
  user_id: number;
  user_name: string;
  user_full_name: string;
  branch_id: number;
  branch_name: string;
  branch_team: string;
  [key: string]: any;
}

export interface ShiftScheduleStorePayload {
  branch_id: number;
  user_ids: number[];
  hrd_master_shift_id: number;
  period: string[] | Date[];
}

// ✅ Payload untuk update
export interface ShiftScheduleUpdatePayload {
  hrd_master_shift_id?: number;
}

// ✅ Response umum
export interface ShiftScheduleMutationResponse {
  success: boolean;
  message: string;
}

export interface ShiftScheduleTemplateParams {
  period_date: string;
  branch_id?: number | null;
}

export interface ShiftScheduleTemplateResponse {
  start_date: string;
  end_date: string;
  dates: {
    date: string;
    holiday: string | null;
  }[];
  users: {
    employee_id: string;
    name: string;
    position: string;
    branch: string;
  }[];
}

export const shiftScheduleApi = {
  getDatatables(
    params: ShiftScheduleDatatablesParams,
  ): Promise<ShiftScheduleDatatablesResponse> {
    return api.get("/hrd/shift-schedule", { params }).then((res) => res.data);
  },

  store(
    payload: ShiftScheduleStorePayload,
  ): Promise<ShiftScheduleMutationResponse> {
    return api.post("/hrd/shift-schedule", payload).then((res) => res.data);
  },

  update(
    id: number,
    payload: ShiftScheduleUpdatePayload,
  ): Promise<ShiftScheduleMutationResponse> {
    return api
      .post(`/hrd/shift-schedule/${id}`, payload)
      .then((res) => res.data);
  },

  destroy(id: number): Promise<ShiftScheduleMutationResponse> {
    return api.delete(`/hrd/shift-schedule/${id}`).then((res) => res.data);
  },

  getTemplate(
    params: ShiftScheduleTemplateParams,
  ): Promise<ShiftScheduleTemplateResponse> {
    // Sesuaikan URL prefix-nya jika berbeda. Di sini saya asumsikan mengikuti pola sebelumnya
    return api
      .get("/hrd/shift-schedule/data-template", { params })
      .then((res) => res.data);
  },
};
