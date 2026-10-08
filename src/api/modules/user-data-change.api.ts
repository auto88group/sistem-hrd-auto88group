import api from "../axios";

export const USER_ENTITY_TYPE = "users";

export type UserChangeAction = "create" | "update" | "delete";
export type UserReviewStatus = "approved" | "rejected";

export interface UserChangeFieldDetail {
  field_id: number | null;
  field_name: string;
  label: string;
  input_type: string | null;
  old_value: string | null;
  new_value: string | null;
  // Nama hasil terjemahan id (status nikah, kecamatan, dst.). Sama dengan value kalau bukan id.
  old_label: string | null;
  new_label: string | null;
}

export interface UserChangeRequestItem {
  item_id: number;
  request_id: number;
  entity_type: string;
  entity_id: number | null;
  action: UserChangeAction;
  fields: UserChangeFieldDetail[];
}

export interface UserChangeRequest {
  id: number;
  user_id: number;
  user_name: string;
  user_full_name: string;
  image?: string | null;
  branch_id?: number | null;
  branch_name?: string | null;
  branch_alias?: string | null;
  status: "pending" | "approved" | "rejected";
  review_note?: string | null;
  created_at: string;
  updated_at?: string | null;
  item: UserChangeRequestItem[];
}

export interface UserChangeListResponse {
  data: UserChangeRequest[];
  total: number;
  skip: number;
  per_page: number;
  has_more: boolean;
}

export interface PendingUserParams {
  user_id: string | number;
}

export interface HistoryUserParams {
  user_id: string | number;
  status?: UserReviewStatus;
  skip?: number;
  per_page?: number;
}

export interface UserReviewParams {
  status: UserReviewStatus;
  note?: string;
}

export interface UserReviewResponse {
  success?: boolean;
  message?: string;
}

export const userDataChangeApi = {
  getPending(params: PendingUserParams): Promise<UserChangeListResponse> {
    return api
      .get("/hrd/user-data-change", {
        params: {
          status: "pending",
          entity_type: USER_ENTITY_TYPE,
          user_id: params.user_id,
          all_periods: 1, // pending dari bulan lain tetap ikut
          per_page: 100,
        },
      })
      .then((res) => res.data);
  },

  getHistory(params: HistoryUserParams): Promise<UserChangeListResponse> {
    return api
      .get("/hrd/user-data-change", {
        params: {
          entity_type: USER_ENTITY_TYPE,
          user_id: params.user_id,
          all_periods: 1,
          skip: params.skip ?? 0,
          per_page: params.per_page ?? 10,
          // status spesifik, atau semua kecuali pending
          ...(params.status
            ? { status: params.status }
            : { exclude_status: "pending" }),
        },
      })
      .then((res) => res.data);
  },

  // Approve: review_note opsional. Reject: review_note wajib.
  reviewRequest(
    id: number,
    params: UserReviewParams,
  ): Promise<UserReviewResponse> {
    const action = params.status === "approved" ? "approve" : "reject";
    return api
      .post(`/hrd/user-data-change/${id}/${action}`, {
        review_note: params.note,
      })
      .then((res) => res.data);
  },
};
