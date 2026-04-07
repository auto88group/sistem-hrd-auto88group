import api from "../axios";

export interface JobCareerSelectedParams {
  user_id?: string;
}
export interface JobCareerCreateUpdateParams {
  // required
  user_id: number;
  reference_number: string;
  position: string;
  master_position_id: number;
  branch_id: number;
  start_date: string;
  end_date: string;
  status_id: number;
  note: string;
  is_active: number;

  // optional
  attachment?: File;
}
export interface JobCareerSelectedResponse {
  success: boolean;
  data: JobCareer[];
}
export interface JobCareerCreateUpdateResponse {
  success: boolean;
  message: string;
  data: JobCareer;
}
export interface JobCareerDestroyResponse {
  success: boolean;
  message: string;
}

export interface JobCareer {
  id: number;
  user_id: number;
  reference_number: string;
  position: string;
  master_position_id: number;
  branch_id: number;
  branch_name: string;
  start_date: string;
  end_date: string;
  status_id: number;
  note: string;
  is_active: number;
  attachment?: File;
}

export const jobCareerApi = {
  getSelected(
    params: JobCareerSelectedParams,
  ): Promise<JobCareerSelectedResponse> {
    return api.get(`/hrd/career-job/${params.user_id}`).then((res) => res.data);
  },
  updateJobCareer(
    id: number,
    params: FormData,
  ): Promise<JobCareerCreateUpdateResponse> {
    return api
      .post(`/hrd/career-job/${id}?_method=POST`, params, {
        headers: { "Content-Type": "multipart/form-data" },
        transformRequest: [(data) => data],
      })
      .then((res) => res.data);
  },
  createJobCareer(params: FormData): Promise<JobCareerCreateUpdateResponse> {
    return api
      .post(`/hrd/career-job?_method=POST`, params, {
        headers: { "Content-Type": "multipart/form-data" },
        transformRequest: [(data) => data],
      })
      .then((res) => res.data);
  },
  destroyJobCareer(id: number): Promise<JobCareerDestroyResponse> {
    return api.delete(`/hrd/career-job/${id}`).then((res) => res.data);
  },
};
