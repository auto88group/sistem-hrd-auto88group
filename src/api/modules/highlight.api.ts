import api from "../axios";

export interface LeaveRequestParams {
  branch_id?: number;
  hrd_leave_type_id?: number;
}
export interface LeaveRequestResponse {
  success: boolean;
  message: string;
  data: LeaveRequest[];
}
export interface LeaveRequest {
  id: number;
  user_id: number;
  hrd_leave_type_id: number;

  start_date: string;
  end_date: string;
  total_days: string | null;

  status: string;
  note: string | null;

  approved_by: string | null;
  approved_at: string | null;

  status_2: string | null;
  note_2: string | null;
  approved_by_2: string | null;
  approved_at_2: string | null;

  status_hrd: string;
  note_hrd: string | null;
  approved_by_hrd: string | null;
  approved_at_hrd: string | null;

  attachment: string | null;
  reason: string;

  created_at: string;

  user_name: string;
  user_full_name: string;

  primary_approver_name: string | null;
  primary_approver_full_name: string | null;

  secondary_approver_name: string | null;
  secondary_approver_full_name: string | null;

  leave_type_name: string;
  leave_type: string;
}

export const highlightApi = {
  getLeaveRequest(params: LeaveRequestParams): Promise<LeaveRequestResponse> {
    return api
      .get(`/hrd/highlight/leave-request`, { params })
      .then((res) => res.data);
  },
};
