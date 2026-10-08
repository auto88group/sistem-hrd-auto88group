import api from "../axios";

export interface UserDataApprovalParams {
  branch_id?: number;
  skip?: number;
  per_page?: number;
}
export interface UserDataApprovalChangeItem {
  item_id: number;
  request_id: number;
  entity_type: string;
  entity_id: number | null;
  action: "create" | "update" | "delete";
  fields?: UserDataApprovalField[];
}

export interface UserDataApprovalField {
  field_id: number | null;
  field_name: string;
  label: string;
  input_type: string | null;
  old_value: string | null;
  new_value: string | null;
  // Nama hasil terjemahan id. Sama dengan value kalau bukan id.
  old_label: string | null;
  new_label: string | null;
}

export interface UserDataApprovalReviewParams {
  status: "approved" | "rejected";
  note?: string;
}

export interface UserDataApprovalReviewResponse {
  success?: boolean;
  message?: string;
}

export interface UserDataApprovalRequest {
  id: number;
  user_id: number;
  user_name: string;
  user_full_name: string;
  user_email?: string | null; // tidak ada di response, disiapkan kalau backend menambahkan
  user_employee_id?: string | null; // idem
  image?: string | null;
  branch_id?: number | null;
  branch_name?: string | null;
  branch_alias?: string | null;
  status: "pending" | "approved" | "rejected";
  review_note?: string | null;
  created_at: string;
  updated_at?: string | null;
  item: UserDataApprovalChangeItem[];
}

export interface UserDataApprovalResponse {
  data: UserDataApprovalRequest[];
  total: number;
  skip: number;
  per_page: number;
  has_more: boolean;
}

export interface UserDataApprovalListParams {
  branch_id?: number;
  user_id?: string | number;
  status?: "pending" | "approved" | "rejected";
  skip?: number;
  per_page?: number;
}

export const userDataApprovalApi = {
  // Daftar lengkap (untuk tabel), status bisa dipilih
  getList(
    params: UserDataApprovalListParams = {},
  ): Promise<UserDataApprovalResponse> {
    return api
      .get("/hrd/user-data-change", {
        params: {
          all_periods: 1,
          status: params.status ?? "pending",
          skip: params.skip ?? 0,
          per_page: params.per_page ?? 10,
          ...(params.branch_id ? { branch_id: params.branch_id } : {}),
          ...(params.user_id ? { user_id: params.user_id } : {}),
        },
      })
      .then((res) => res.data);
  },

  getPending(
    params: UserDataApprovalParams = {},
  ): Promise<UserDataApprovalResponse> {
    return api
      .get("/hrd/user-data-change", {
        params: {
          status: "pending",
          all_periods: 1, // pending dari bulan lain tetap ikut
          skip: params.skip ?? 0,
          per_page: params.per_page ?? 10,
          // filter cabang, dikirim hanya kalau dipilih
          ...(params.branch_id ? { branch_id: params.branch_id } : {}),
        },
      })
      .then((res) => res.data);
  },

  // Approve: note opsional. Reject: note wajib.
  reviewRequest(
    id: number,
    params: UserDataApprovalReviewParams,
  ): Promise<UserDataApprovalReviewResponse> {
    const action = params.status === "approved" ? "approve" : "reject";
    return api
      .post(`/hrd/user-data-change/${id}/${action}`, {
        review_note: params.note,
      })
      .then((res) => res.data);
  },
};
