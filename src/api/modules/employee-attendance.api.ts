import api from "../axios";

export interface EmployeeAttendanceLeave {
  lr_type_code: string;
  lr_type: string;
  lr_type_name: string;
  lr_is_full_day: number;
}

// REPORT
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
  type_belum_absen?: number | null;
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
  default_working_hour: string;
  working_hour: string;
  time_in: string;
  image_in: string;
  device_in: string;
  latitude_in: number;
  longitude_in: number;
  in_coordinate_id: number;
  in_coordinate_name: string;
  note_in: string | null;
  request_diff_loc_in: number | null;
  confirm_diff_loc_in_id: number | null;
  time_out: string | null;
  image_out: string | null;
  device_out: string | null;
  latitude_out: number | null;
  longitude_out: number | null;
  out_coordinate_id: number | null;
  out_coordinate_name: string | null;
  note_out: string | null;
  request_diff_loc_out: number | null;
  confirm_diff_loc_out_id: number | null;
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
  is_holiday: number | null;
  shift_id: number | null;
  shift_name: string | null;
  shift_code: string | null;
  modify_by: number | null;
  modify_by_name: string | null;
  modify_by_full_name: string | null;

  // ── BARU: leaves sebagai array ──
  leaves: EmployeeAttendanceLeave[]; // array, bisa kosong []
  leave_types: string[]; // ['sakit', 'izin', ...] lowercase
}

// RECAP
export interface EmployeeAttendanceRecapParams {
  draw?: number;
  start?: number;
  length?: number;
  periodForm?: string[];
  period?: string;
  user_id?: number | null;
  branch_id?: number | null;
}
export interface EmployeeAttendanceRecapResponse {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  dates: RecapDate[];
  data: EmployeeAttendanceRecapItem[];
}

export interface EmployeeAttendanceRecapItem {
  user_id: number;
  user_name: string;
  user_full_name: string;
  user_email: string;
  user_employee_id: number;
  branch_id: number;
  branch_name: string;
  branch_alias: string;
  branch_code: string;
  h: number;
  t: number;
  t_duration: string;
  pc: number;
  pc_duration: string;
  tap: number;
  i: number;
  i_telat: number; // izin telat (lr_type_id = 1)
  i_pc: number; // izin pulang cepat (lr_type_id = 11)
  s: number;
  c: number;
  a: number;
  holiday: number;
  total_working_hour: string;
  daily: Record<string, EmployeeAttendanceDailyStatus>;
}

export interface EmployeeAttendanceDailyStatus {
  is_holiday: number;
  is_hadir: number;
  is_shift: number;
  is_late: number;
  is_pc: number;
  is_tap: number;
  is_izin: number;
  is_izin_telat: number; // izin telat (lr_type_id = 1)
  is_izin_pc: number; // izin pulang cepat (lr_type_id = 11)
  is_sakit: number;
  is_cuti: number;
  is_alpha: number;
  lr_types: EmployeeAttendanceLeave[];
  shift_id: number | null;
  shift_name: string | null;
  shift_code: string | null;

  late_duration_sec?: number;
  late_duration?: string;
  pc_duration_sec?: number;
  pc_duration?: string;
}

export interface EmployeeAttendanceLeave {
  lr_type_id: number;
  lr_type_code: string;
  lr_type: string;
  lr_type_name: string;
  lr_is_full_day: number;
}

export interface RecapDate {
  date: string;
  is_holiday: number;
  holiday_name: string | null;
}

// EDIT
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
  note_in: string | null;
  time_out: string | null;
  note_out: string | null;
}

// DEFAULT
export interface DefaultResponse {
  success: boolean;
  message: string;
}

// DETAIL
export interface EmployeeAttendanceDetailParams {
  id: string | null;
  in_out: string | null;
}
export interface EmployeeAttendanceDetailResponse {
  success: boolean;
  message: string;
  data: EmployeeAttendanceDetail;
}
export interface EmployeeAttendanceDetail {
  id: number;
  user_id: number;
  name: string;
  full_name: string;
  working_hour: string;
  time_in: string;
  time_out: string | null;
  image_in: string;
  image_out: string | null;
  device_in: string | null;
  device_out: string | null;
  latitude_in: number;
  latitude_out: number | null;
  longitude_in: number;
  longitude_out: number | null;
  in_coordinate_name: string;
  out_coordinate_name: string | null;
  note_in: string | null;
  note_out: string | null;
  created_at: string | null;
}

export interface ApprovalDiffLocParams {
  attendance_id: number;
  type: "in" | "out";
}
export interface DeletePhotoParams {
  user_id: number | null;
  start_date: string | null; // "YYYY-MM-DD"
  end_date: string | null; // "YYYY-MM-DD"
  type: "in" | "out" | "both";
}

export interface DeletePhotoData {
  start_date: string; // ganti dari period
  end_date: string; // tambah
  type: string;
  total_found: number;
  total_updated: number;
}
export interface DeletePhotoResponse {
  success: boolean;
  message: string;
  data: DeletePhotoData;
}

export const employeeAttendanceRequestApi = {
  getDatatables(
    params: EmployeeAttendanceParams,
  ): Promise<EmployeeAttendanceResponse> {
    return api
      .get("/hrd/employee-attendance", { params })
      .then((res) => res.data);
  },

  getRecapDatatables(
    params: EmployeeAttendanceRecapParams,
  ): Promise<EmployeeAttendanceRecapResponse> {
    return api
      .get("/hrd/employee-attendance/recap", { params })
      .then((res) => res.data);
  },

  update: (id: number, payload: Partial<EmployeeAttendanceEditParams>) =>
    api.post<{ status: boolean; message: string; data: EmployeeAttendance }>(
      `/hrd/employee-attendance/${id}`,
      payload,
    ),

  destroy(id: number): Promise<DefaultResponse> {
    return api.delete(`/hrd/employee-attendance/${id}`).then((res) => res.data);
  },

  modify(payload: EmployeeAttendanceEditParams) {
    return api.post(`/hrd/employee-attendance/modify`, payload);
  },

  detail(
    params: EmployeeAttendanceDetailParams,
  ): Promise<EmployeeAttendanceDetailResponse> {
    return api
      .get(`/hrd/employee-attendance/detail/${params.id}`)
      .then((res) => res.data);
  },

  approvalDiffLoc(params: ApprovalDiffLocParams): Promise<DefaultResponse> {
    return api
      .get("/hrd/employee-attendance/approval-diff-loc", { params })
      .then((res) => res.data);
  },

  deletePhoto(payload: DeletePhotoParams): Promise<DeletePhotoResponse> {
    return api
      .post("/hrd/employee-attendance/delete-photo", payload)
      .then((res) => res.data);
  },

  export(params: {
    period?: string;
    branch_id?: number | null;
  }): Promise<Blob> {
    return api
      .get("/hrd/employee-attendance/export", {
        params,
        responseType: "blob",
      })
      .then((res) => res.data);
  },

  recapExport(params: {
    period?: string;
    branch_id?: number | null;
  }): Promise<Blob> {
    return api
      .get("/hrd/employee-attendance/recap/export", {
        params,
        responseType: "blob",
      })
      .then((res) => res.data);
  },
};
