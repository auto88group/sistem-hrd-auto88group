import api from "../axios";

export interface FilePersonnelSelectedParams {
  user_id?: string;
}

export interface FilePersonnelCreateUpdateParams {
  user_id: number;
  hrd_file_personnel_category_id: number;
  name: string;
  file?: File;
  file_preview?: string | null;
}

export interface FilePersonnel {
  id: number;
  user_id: number;
  hrd_file_personnel_category_id: number;
  category_name: string;
  is_mandatory: boolean;
  name: string;
  file?: string | null;
}

export interface FilePersonnelSelectedResponse {
  success: boolean;
  data: FilePersonnel[];
}

export interface FilePersonnelCreateUpdateResponse {
  success: boolean;
  message: string;
  data: FilePersonnel;
}

// Tambahkan response untuk bulk create jika data berupa array
export interface FilePersonnelBulkCreateResponse {
  success: boolean;
  message: string;
  data: FilePersonnel[];
}

export interface FilePersonnelDestroyResponse {
  success: boolean;
  message: string;
}

export const filePersonnelApi = {
  getSelected(
    params: FilePersonnelSelectedParams,
  ): Promise<FilePersonnelSelectedResponse> {
    return api
      .get(`/hrd/file-personnel/${params.user_id}`)
      .then((res) => res.data);
  },

  createFilePersonnel(
    params: FormData,
  ): Promise<FilePersonnelCreateUpdateResponse> {
    return api
      .post("/hrd/file-personnel", params, {
        headers: { "Content-Type": "multipart/form-data" },
        transformRequest: [(data) => data],
      })
      .then((res) => res.data);
  },

  // ─── ENDPOINT BARU: TAMBAH SEKALIGUS (BULK CREATE) ───
  bulkCreateFilePersonnel(
    params: FormData,
  ): Promise<FilePersonnelBulkCreateResponse> {
    return api
      .post("/hrd/file-personnel/bulk", params, {
        headers: { "Content-Type": "multipart/form-data" },
        transformRequest: [(data) => data],
      })
      .then((res) => res.data);
  },

  updateFilePersonnel(
    id: number,
    params: FormData,
  ): Promise<FilePersonnelCreateUpdateResponse> {
    return api
      .post(`/hrd/file-personnel/${id}?_method=POST`, params, {
        headers: { "Content-Type": "multipart/form-data" },
        transformRequest: [(data) => data],
      })
      .then((res) => res.data);
  },

  destroyFilePersonnel(id: number): Promise<FilePersonnelDestroyResponse> {
    return api.delete(`/hrd/file-personnel/${id}`).then((res) => res.data);
  },

  // ─── ENDPOINT BARU: HAPUS SEKALIGUS (BULK DELETE) ───
  bulkDestroyFilePersonnel(
    ids: number[],
  ): Promise<FilePersonnelDestroyResponse> {
    return api
      .post("/hrd/file-personnel/bulk-delete", { ids })
      .then((res) => res.data);
  },
};
