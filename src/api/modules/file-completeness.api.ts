import api from "../axios";

export interface FileCompletenessSelectedParams {
  user_id?: string;
}

export interface FileCompletenessCreateUpdateParams {
  // required
  user_id: number;
  hrd_file_category_id: number;
  name: string;
  // optional
  file?: File;
  file_preview?: string | null;
}

export interface FileCompletenessSelectedResponse {
  success: boolean;
  data: FileCompleteness[];
}

export interface FileCompletenessCreateUpdateResponse {
  success: boolean;
  message: string;
  data: FileCompleteness;
}

// ─── INTERFACE BARU UNTUK RESPONSE MULTI ADD ───
export interface FileCompletenessBulkCreateResponse {
  success: boolean;
  message: string;
  data: FileCompleteness[];
}

export interface FileCompletenessDestroyResponse {
  success: boolean;
  message: string;
}

export interface FileCompleteness {
  id: number;
  user_id: number;
  hrd_file_category_id: number;
  category_name: string;
  is_mandatory: boolean;
  name: string;
  file?: string | null;
}

export const fileCompletenessApi = {
  getSelected(
    params: FileCompletenessSelectedParams,
  ): Promise<FileCompletenessSelectedResponse> {
    return api
      .get(`/hrd/file-completeness/${params.user_id}`)
      .then((res) => res.data);
  },

  updateFileCompleteness(
    id: number,
    params: FormData,
  ): Promise<FileCompletenessCreateUpdateResponse> {
    return api
      .post(`/hrd/file-completeness/${id}?_method=POST`, params, {
        headers: { "Content-Type": "multipart/form-data" },
        transformRequest: [(data) => data],
      })
      .then((res) => res.data);
  },

  createFileCompleteness(
    params: FormData,
  ): Promise<FileCompletenessCreateUpdateResponse> {
    return api
      .post(`/hrd/file-completeness?_method=POST`, params, {
        headers: { "Content-Type": "multipart/form-data" },
        transformRequest: [(data) => data],
      })
      .then((res) => res.data);
  },

  // ─── METHOD BARU: ADD SEKALIGUS (SINGLE REQUEST) ───
  bulkCreateFileCompleteness(
    params: FormData,
  ): Promise<FileCompletenessBulkCreateResponse> {
    return api
      .post("/hrd/file-completeness/bulk", params, {
        headers: { "Content-Type": "multipart/form-data" },
        transformRequest: [(data) => data],
      })
      .then((res) => res.data);
  },

  destroyFileCompleteness(
    id: number,
  ): Promise<FileCompletenessDestroyResponse> {
    return api.delete(`/hrd/file-completeness/${id}`).then((res) => res.data);
  },

  // ─── METHOD BARU: HAPUS SEKALIGUS (SINGLE REQUEST) ───
  bulkDestroyFileCompleteness(
    ids: number[],
  ): Promise<FileCompletenessDestroyResponse> {
    return api
      .post("/hrd/file-completeness/bulk-delete", { ids })
      .then((res) => res.data);
  },
};
