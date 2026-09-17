import api from "../axios";

export interface HrdEducationSelectedParams {
  user_id?: string;
}
export interface HrdEducationCreateUpdateParams {
  // required
  user_id: number;
  hrd_master_education_id: number;
  major: string;
  school_name: string;
  from: string;
  title: string;
  year_in: string;
  graduation_year: string;

  // optional
  certificate?: File;
  transcripts?: File;
}
export interface HrdEducationSelectedResponse {
  success: boolean;
  data: HrdEducation[];
}
export interface HrdEducationCreateUpdateResponse {
  success: boolean;
  message: string;
  data: HrdEducation;
}
export interface HrdEducationDestroyResponse {
  success: boolean;
  message: string;
}

export interface HrdEducation {
  id: number;
  user_id: number;
  hrd_master_education_id: number;
  education_name: string;
  major: string;
  school_name: string;
  from: string;
  title: string;
  year_in: string;
  graduation_year: string;
  certificate?: File;
  transcripts?: File;
}

export const hrdEducationApi = {
  getSelected(
    params: HrdEducationSelectedParams,
  ): Promise<HrdEducationSelectedResponse> {
    return api.get(`/hrd/education/${params.user_id}`).then((res) => res.data);
  },
  updateHrdEducation(
    id: number,
    params: FormData,
  ): Promise<HrdEducationCreateUpdateResponse> {
    return api
      .post(`/hrd/education/${id}`, params, {
        headers: { "Content-Type": "multipart/form-data" },
        transformRequest: [(data) => data],
      })
      .then((res) => res.data);
  },
  createHrdEducation(
    params: FormData,
  ): Promise<HrdEducationCreateUpdateResponse> {
    return api
      .post(`/hrd/education`, params, {
        headers: { "Content-Type": "multipart/form-data" },
        transformRequest: [(data) => data],
      })
      .then((res) => res.data);
  },
  destroyHrdEducation(id: number): Promise<HrdEducationDestroyResponse> {
    return api.delete(`/hrd/education/${id}`).then((res) => res.data);
  },
};
