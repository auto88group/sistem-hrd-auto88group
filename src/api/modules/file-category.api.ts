import api from "../axios";

export interface FileCategory {
  id: number;
  name: string;
  is_mandatory: boolean;
  created_at: string;
  updated_at: string;
}

export interface FileCategoryListResponse {
  success: boolean;
  data: FileCategory[];
}

export interface FileCategoryCreateUpdateParams {
  name: string;
  is_mandatory: boolean;
}

export interface FileCategoryCreateUpdateResponse {
  success: boolean;
  message: string;
  data: FileCategory;
}

export interface FileCategoryDestroyResponse {
  success: boolean;
  message: string;
}

export const fileCategoryApi = {
  getAll(): Promise<FileCategoryListResponse> {
    return api.get("/hrd/file-completeness-category").then((res) => res.data);
  },

  create(
    params: FileCategoryCreateUpdateParams,
  ): Promise<FileCategoryCreateUpdateResponse> {
    return api
      .post("/hrd/file-completeness-category", params)
      .then((res) => res.data);
  },

  update(
    id: number,
    params: FileCategoryCreateUpdateParams,
  ): Promise<FileCategoryCreateUpdateResponse> {
    return api
      .put(`/hrd/file-completeness-category/${id}`, params)
      .then((res) => res.data);
  },

  toggleMandatory(id: number): Promise<FileCategoryCreateUpdateResponse> {
    return api
      .patch(`/hrd/file-completeness-category/${id}/toggle-mandatory`)
      .then((res) => res.data);
  },

  destroy(id: number): Promise<FileCategoryDestroyResponse> {
    return api
      .delete(`/hrd/file-completeness-category/${id}`)
      .then((res) => res.data);
  },
};
