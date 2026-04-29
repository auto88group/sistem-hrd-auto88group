import api from "../axios";

export interface EmployeeAttendanceParams {
  draw?: number;
  start?: number;
  length?: number;
  periodForm?: string[];
  period?: string;
  user_id?: number | null;
  branch_id?: number | null;
  type_present?: number | null;
  type_late?: number | null;
  type_go_home_early?: number | null;
  type_didnt_check_out?: number | null;
  type_negligent?: number | null;
  type_sick?: number | null;
  type_permit?: number | null;
  type_leave?: number | null;
  type_holiday?: number | null;
}

export interface EmployeeAttendanceEditParams {
  id: number | null;
  user_id: number | null;
  user_name: string | null;
  user_full_name: string | null;
  user_email: string | null;
  branch_id: number | null;
  period_date: string | null;
  hrd_master_shift_id: string | null;
  working_hour: string | null;
  time_in: string | null;
  time_out: string | null;
}

export interface EmployeeAttendanceResponse {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: EmployeeAttendance[];
}

export interface EmployeeAttendance {
  id: number;
  user_id: number;
  working_hour: string;
  time_in: string;
  image_in: string;
  device_in: string;
  latitude_in: number;
  longitude_in: number;
  in_coordinate_id: number;
  in_coordinate_name: string;
  note_in: string | null;
  time_out: string | null;
  image_out: string | null;
  device_out: string | null;
  latitude_out: number | null;
  longitude_out: number | null;
  out_coordinate_id: number | null;
  out_coordinate_name: string | null;
  note_out: string | null;
  overtime_status: string | null;
  overtime_note: string | null;
  overtime_approved_by: string | null;
  overtime_approved_at: string | null;
  overtime_status_2: string | null;
  overtime_note_2: string | null;
  overtime_approved_by_2: string | null;
  overtime_approved_at_2: string | null;
  overtime_status_hrd: string | null;
  overtime_note_hrd: string | null;
  overtime_approved_by_hrd: string | null;
  overtime_approved_at_hrd: string | null;
  created_at: string;
  updated_at: string;
  user_name: string;
  user_full_name: string;
  user_email: string;
  user_employee_id: string;
  branch_id: number;
  branch_name: string;
  branch_alias: string;
  branch_code: string;
  period_date: string;
  lr_type_code: string | null;
  lr_type_name: string | null;
  lr_is_full_day: number | null;
  is_holiday: number | null;
  shift_id: number | null;
  shift_name: string | null;
  shift_code: string | null;
}

export const employeeAttendanceRequestApi = {
  getDatatables(
    params: EmployeeAttendanceParams,
  ): Promise<EmployeeAttendanceResponse> {
    return api
      .get("/hrd/employee-attendance", { params })
      .then((res) => res.data);
  },
};
