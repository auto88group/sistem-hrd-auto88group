import api from "../axios";

export interface FilePersonnelCategory {
  id: number;
  name: string;
  is_mandatory: boolean;
  created_at: string;
  updated_at: string;
}

export interface FilePersonnelCategoryListResponse {
  success: boolean;
  data: FilePersonnelCategory[];
}

export interface FilePersonnelCategoryCreateUpdateParams {
  name: string;
  is_mandatory: boolean;
}

export interface FilePersonnelCategoryCreateUpdateResponse {
  success: boolean;
  message: string;
  data: FilePersonnelCategory;
}

export interface FilePersonnelCategoryDestroyResponse {
  success: boolean;
  message: string;
}

export const filePersonnelCategoryApi = {
  getAll(): Promise<FilePersonnelCategoryListResponse> {
    return api.get("/hrd/file-personnel-categories").then((res) => res.data);
  },

  create(
    params: FilePersonnelCategoryCreateUpdateParams,
  ): Promise<FilePersonnelCategoryCreateUpdateResponse> {
    return api
      .post("/hrd/file-personnel-categories", params)
      .then((res) => res.data);
  },

  update(
    id: number,
    params: FilePersonnelCategoryCreateUpdateParams,
  ): Promise<FilePersonnelCategoryCreateUpdateResponse> {
    return api
      .put(`/hrd/file-personnel-categories/${id}`, params)
      .then((res) => res.data);
  },

  toggleMandatory(
    id: number,
  ): Promise<FilePersonnelCategoryCreateUpdateResponse> {
    return api
      .patch(`/hrd/file-personnel-categories/${id}/toggle-mandatory`)
      .then((res) => res.data);
  },

  destroy(id: number): Promise<FilePersonnelCategoryDestroyResponse> {
    return api
      .delete(`/hrd/file-personnel-categories/${id}`)
      .then((res) => res.data);
  },
};
