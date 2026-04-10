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
export const shiftScheduleApi = {
  getDatatables(
    params: ShiftScheduleDatatablesParams,
  ): Promise<ShiftScheduleDatatablesResponse> {
    return api.get("/hrd/shift-schedule", { params }).then((res) => res.data);
  },
};
