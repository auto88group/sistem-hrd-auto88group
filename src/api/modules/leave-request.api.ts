import api from "../axios";
export interface LeaveRequestDatatablesParams {
  draw?: number;
  start?: number;
  length?: number;
  periodForm?: string[];
  period?: string;
  status: string | null;
  user_id: number | null;
  branch_id: number | null;
  hrd_leave_type_id: number | null;
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

export interface LeaveRequestCreateUpdatePayload {
  id: number | null;
  user_id: number | null;
  user_name: string | null;
  user_full_name: string | null;
  user_email: string | null;
  hrd_leave_type_id: number | null;
  start_date: string | null;
  end_date: string | null;
  total_days: number | null;
  reason: string | null;
  attachment: File[] | null;
  attachment_preview: string | null;
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
  has_deduct_no_file: number | null;
  reason: string;
  created_at: string;

  // datatables
  DT_RowIndex: number;

  // user
  user_name: string;
  user_full_name: string | null;
  user_email: string | null;
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
  deduct_leave: number;

  // approval result (actual approver)
  approver_name: string | null;
  approver_full_name: string | null;

  approver_2_name: string | null;
  approver_2_full_name: string | null;

  approver_hrd_name: string | null;
  approver_hrd_full_name: string | null;

  missing_attendance: number;
}

export const leaveRequestApi = {
  getDatatables(
    params: LeaveRequestDatatablesParams,
  ): Promise<LeaveRequestDatatablesResponse> {
    return api.get("/hrd/leave-request", { params }).then((res) => res.data);
  },

  createLeaveRequest(params: FormData): Promise<LeaveRequestSelectedResponse> {
    return api
      .post(`/hrd/leave-request`, params, {
        headers: { "Content-Type": "multipart/form-data" },
        transformRequest: [(data) => data],
      })
      .then((res) => res.data);
  },

  updateLeaveRequest(
    id: number,
    params: FormData,
  ): Promise<LeaveRequestSelectedResponse> {
    return api
      .post(`/hrd/leave-request/${id}?_method=POST`, params, {
        headers: { "Content-Type": "multipart/form-data" },
        transformRequest: [(data) => data],
      })
      .then((res) => res.data);
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

  deductLeave(id: number | null): Promise<LeaveRequestApprovalResponse> {
    return api
      .post(`/hrd/leave-request/deduct-leave/${id}`)
      .then((res) => res.data);
  },

  restoreLeave(id: number | null): Promise<LeaveRequestApprovalResponse> {
    return api
      .post(`/hrd/leave-request/restore-leave/${id}`)
      .then((res) => res.data);
  },

  destroyLeave(id: number | null): Promise<LeaveRequestApprovalResponse> {
    return api.delete(`/hrd/leave-request/${id}`).then((res) => res.data);
  },
};
