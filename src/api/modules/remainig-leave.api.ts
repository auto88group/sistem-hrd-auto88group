import api from "../axios";
export interface RemainingLeaveDatatablesParams {
  draw?: number;
  start?: number;
  length?: number;
  user_id?: number;
  branch_id?: number;
  sortBy?: string;
  sortDirection?: string;
}

export interface RemainingLeaveDetailParams {
  draw?: number;
  start?: number;
  length?: number;
  year?: string;
  change?: string;
  type?: string;
}

export interface RemainingLeaveAdjustmentPayload {
  user_id: number;
  change: "+" | "-";
  amount: number;
  notes: string;
}

export interface RemainingLeaveAdjustmentResponse {
  success: boolean;
  message: string;
  data: {
    user_id: number;
    change_amount: string;
    balance_before: number;
    balance_after: number;
  };
}

export interface RemainingLeaveSettingPayload {
  change: "add" | "subtract" | "reset";
  amount: number;
  notes: string;
  for: "all" | "branch" | "user";
  for_id?: number;
}

export interface RemainingLeaveSettingError {
  user_id: number;
  name: string;
  message: string;
}

export interface RemainingLeaveSettingResponse {
  success: boolean;
  message: string;
  errors?: RemainingLeaveSettingError[];
}

export interface RemainingLeaveDatatablesResponse {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: RemainingLeave[];
}

export interface RemainingLeaveDetailResponse {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: History[];
}

export interface History {
  id: number;
  user_id: number;
  change_amount: string;
  balance_before: number;
  balance_after: number;
  type: string;
  reference_id?: number;
  notes: string;
  created_by?: number;
  created_at: string;
  updated_at: string;
  created_name: string;
  created_full_name: string;
}

export interface RemainingLeave {
  id: number;
  name: string;
  full_name: string;
  email: string;
  position: string;
  remaining_leave: number;
  branch_name: string;
  branch_alias: string;
  branch_code: string;
  join_date: string | null; // ← tambah
  valid_until: string | null; // ← tambah
  DT_RowIndex: number; // ← fix: was literal `1`, seharusnya `number`
}

export const remainingLeaveApi = {
  getDatatables(
    params: RemainingLeaveDatatablesParams,
  ): Promise<RemainingLeaveDatatablesResponse> {
    return api.get("/hrd/remaining-leave", { params }).then((res) => res.data);
  },

  getDetail(
    id: number,
    params: URLSearchParams | RemainingLeaveDetailParams,
  ): Promise<RemainingLeaveDetailResponse> {
    return api
      .get(`/hrd/remaining-leave/${id}/detail`, { params })
      .then((res) => res.data);
  },

  storeAdjustment(
    payload: RemainingLeaveAdjustmentPayload,
  ): Promise<RemainingLeaveAdjustmentResponse> {
    return api
      .post("/hrd/remaining-leave/adjustment", payload)
      .then((res) => res.data);
  },

  storeSetting(
    payload: RemainingLeaveSettingPayload,
  ): Promise<RemainingLeaveSettingResponse> {
    return api
      .post("/hrd/remaining-leave/setting", payload)
      .then((res) => res.data);
  },
};
