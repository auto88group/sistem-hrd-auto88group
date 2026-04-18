import api from "../axios";
export interface LeaveRequestDatatablesParams {
  draw?: number;
  start?: number;
  length?: number;
  period?: string;
  status?: string;
  user_id?: number;
  branch_id?: number;
  hrd_leave_type_id?: number;
}

export interface LeaveRequestDatatablesResponse {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: LeaveRequest[];
}

export interface LeaveRequestSelectedResponse {
  success: boolean;
  message: string;
  data: LeaveRequest | null;
}

export interface LeaveRequestApprovalPayload {
  id: number | null;
  note: string | null;
  status: "approved" | "rejected" | null;
  level: "primary" | "secondary" | "hrd" | null;
}

export interface LeaveRequestApprovalResponse {
  success: boolean;
  message: string;
}

export interface LeaveRequest {
  id: number;
  user_id: number;
  hrd_leave_type_id: number;

  start_date: string;
  end_date: string;
  total_days: number | null;

  status: string;
  note: string | null;

  approved_by: number | null;
  approved_at: string | null;

  status_2: string | null;
  note_2: string | null;
  approved_by_2: number | null;
  approved_at_2: string | null;

  status_hrd: string | null;
  note_hrd: string | null;
  approved_by_hrd: number | null;
  approved_at_hrd: string | null;

  attachment: string | null;
  reason: string;
  created_at: string;

  // datatables
  DT_RowIndex: number;

  // user
  user_name: string;
  user_full_name: string | null;
  user_employee_id: string | null;
  primary_approver_id: number | null;
  secondary_approver_id: number | null;

  // branch
  branch_name: string;
  branch_alias: string;

  // approvers (default dari user relation)
  primary_approver_name: string | null;
  primary_approver_full_name: string | null;
  primary_approver_employee_id?: string | null;

  secondary_approver_name: string | null;
  secondary_approver_full_name: string | null;
  secondary_approver_employee_id?: string | null;

  // leave type
  leave_type_name: string;
  leave_type: string;
  deduct_no_file: number;

  // approval result (actual approver)
  approver_name: string | null;
  approver_full_name: string | null;

  approver_2_name: string | null;
  approver_2_full_name: string | null;

  approver_hrd_name: string | null;
  approver_hrd_full_name: string | null;
}

export const leaveRequestApi = {
  getDatatables(
    params: LeaveRequestDatatablesParams,
  ): Promise<LeaveRequestDatatablesResponse> {
    return api.get("/hrd/leave-request", { params }).then((res) => res.data);
  },

  getSelected(userId: number): Promise<LeaveRequestSelectedResponse> {
    return api
      .get(`/hrd/leave-request/selected/${userId}`)
      .then((res) => res.data);
  },

  approval(
    payload: LeaveRequestApprovalPayload,
  ): Promise<LeaveRequestApprovalResponse> {
    return api
      .post(`/hrd/leave-request/approval/${payload.id}`, payload)
      .then((res) => res.data);
  },
};
