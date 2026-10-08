import api from "../axios";

export const FILE_COMPLETENESS_ENTITY_TYPE = "hrd_file_completenesses";

export type ChangeAction = "create" | "update" | "delete";
export type ReviewStatus = "approved" | "rejected";

export interface ChangeFieldDetail {
  field_id: number | null;
  field_name: string;
  label: string;
  input_type: string | null;
  old_value: string | null;
  new_value: string | null;
  // Nama hasil terjemahan id (kategori dokumen, dst.). Sama dengan value kalau bukan id.
  old_label: string | null;
  new_label: string | null;
}

export interface ChangeRequestItem {
  item_id: number;
  request_id: number;
  entity_type: string;
  entity_id: number | null;
  action: ChangeAction;
  fields: ChangeFieldDetail[];
}

export interface ChangeRequest {
  id: number;
  user_id: number;
  user_name: string;
  user_full_name: string;
  status: "pending" | "approved" | "rejected";
  review_note?: string | null;
  created_at: string;
  updated_at?: string | null;
  item: ChangeRequestItem[];
}

export interface HistoryFileCompletenessParams {
  user_id: string | number;
  status?: ReviewStatus;
  skip?: number;
  per_page?: number;
}

export interface ChangeRequestListResponse {
  data: ChangeRequest[];
  total: number;
  skip: number;
  per_page: number;
  has_more: boolean;
}

export interface PendingFileCompletenessParams {
  user_id: string | number;
}

export interface ReviewParams {
  status: ReviewStatus;
  note?: string;
}

export interface ReviewResponse {
  success?: boolean;
  message?: string;
}

export const fileCompletenessDataChangeApi = {
  getPending(
    params: PendingFileCompletenessParams,
  ): Promise<ChangeRequestListResponse> {
    return api
      .get("/hrd/user-data-change", {
        params: {
          status: "pending",
          entity_type: FILE_COMPLETENESS_ENTITY_TYPE,
          user_id: params.user_id,
          all_periods: 1, // pending dari bulan lain tetap ikut
          per_page: 100,
        },
      })
      .then((res) => res.data);
  },

  getHistory(
    params: HistoryFileCompletenessParams,
  ): Promise<ChangeRequestListResponse> {
    return api
      .get("/hrd/user-data-change", {
        params: {
          entity_type: FILE_COMPLETENESS_ENTITY_TYPE,
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
  reviewRequest(id: number, params: ReviewParams): Promise<ReviewResponse> {
    const action = params.status === "approved" ? "approve" : "reject";
    return api
      .post(`/hrd/user-data-change/${id}/${action}`, {
        review_note: params.note,
      })
      .then((res) => res.data);
  },
};
