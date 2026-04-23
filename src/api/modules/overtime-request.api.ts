import api from "../axios";

export interface OvertimeApprover {
  name: string | null;
  full_name: string | null;
  email: string | null;
}

export interface OvertimeRequestApprovalPayload {
  id: number | null;
  note: string | null;
  status: "approved" | "rejected" | null;
  level: "primary" | "secondary" | "hrd" | null;
}

export interface OvertimeRequestApprovalResponse {
  success: boolean;
  message: string;
}

export interface OvertimeRequest {
  id: number;
  user_id: number;
  working_hour: string;
  time_in: string;
  image_in: string | null;
  device_in: string | null;
  latitude_in: number | null;
  longitude_in: number | null;
  in_coordinate_id: number | null;
  in_coordinate_name: string | null;
  note_in: string | null;
  time_out: string | null;
  image_out: string | null;
  device_out: string | null;
  latitude_out: number | null;
  longitude_out: number | null;
  out_coordinate_id: number | null;
  out_coordinate_name: string | null;
  note_out: string | null;

  // Overtime level 1
  overtime_status: string | null;
  overtime_note: string | null;
  overtime_approved_by: number | null;
  overtime_approved_at: string | null;

  // Overtime level 2
  overtime_status_2: string | null;
  overtime_note_2: string | null;
  overtime_approved_by_2: number | null;
  overtime_approved_at_2: string | null;

  // Overtime HRD
  overtime_status_hrd: string | null;
  overtime_note_hrd: string | null;
  overtime_approved_by_hrd: number | null;
  overtime_approved_at_hrd: string | null;

  created_at: string;
  updated_at: string;

  // User utama
  user_name: string;
  user_full_name: string;
  user_email: string;
  user_employee_id: string;
  primary_approver_id: number | null;
  secondary_approver_id: number | null;

  // Primary Approver (dari user)
  primary_apv_name: string | null;
  primary_apv_full_name: string | null;
  primary_apv_email: string | null;

  // Secondary Approver (dari user)
  secondary_apv_name: string | null;
  secondary_apv_full_name: string | null;
  secondary_apv_email: string | null;

  // Approver 1
  apv1_name: string | null;
  apv1_full_name: string | null;
  apv1_email: string | null;

  // Approver 2
  apv2_name: string | null;
  apv2_full_name: string | null;
  apv2_email: string | null;

  // Approver HRD
  apv_hrd_name: string | null;
  apv_hrd_full_name: string | null;
  apv_hrd_email: string | null;
}

export interface OvertimeRequestParams {
  draw?: number;
  start?: number;
  length?: number;
  periodForm?: string[];
  period?: string;
  status?: string | null;
  user_id?: number | null;
  branch_id?: number | null;
}

export interface OvertimeRequestResponse {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: OvertimeRequest[];
}

export const overtimeRequestApi = {
  getDatatables(
    params: OvertimeRequestParams,
  ): Promise<OvertimeRequestResponse> {
    return api.get("/hrd/overtime-request", { params }).then((res) => res.data);
  },

  approval(
    payload: OvertimeRequestApprovalPayload,
  ): Promise<OvertimeRequestApprovalResponse> {
    return api
      .post(`/hrd/overtime-request/approval/${payload.id}`, payload)
      .then((res) => res.data);
  },
};
