import api from "../axios";

export interface FamilySelectedParams {
  user_id?: string;
}
export interface FamilyCreateUpdateParams {
  // required
  user_id: number;
  hrd_master_employee_relation_id: number;
  hrd_master_marital_status_id: number;
  name: string;
  birth_place: string;
  birth_date: string;
  gender: string;
  hrd_master_religion_id: number;
  hrd_master_job_id: number;
  hrd_master_education_id: number;
  life_status: string;

  // optional
  nik: string;
  bpjs_health_number: string;
  phone_number: string;
  marriage_date: string;
}
export interface FamilySelectedResponse {
  success: boolean;
  data: Family[];
}
export interface FamilyCreateUpdateResponse {
  success: boolean;
  message: string;
  data: Family;
}
export interface FamilyDestroyResponse {
  success: boolean;
  message: string;
}

export interface Family {
  id: number;
  user_id: number;
  hrd_master_employee_relation_id: number;
  hrd_master_marital_status_id: number;
  name: string;
  nik: string;
  birth_place: string;
  birth_date: string;
  bpjs_health_number: string;
  gender: string;
  hrd_master_religion_id: number;
  phone_number: string;
  hrd_master_job_id: number;
  marriage_date: string;
  hrd_master_education_id: number;
  life_status: string;
  created_at: string;
  updated_at: string;
  employee_relation_name: string;
  marital_status_name: string;
  religion_name: string;
  job_name: string;
  education_name: string;
}

export const familyApi = {
  getSelected(params: FamilySelectedParams): Promise<FamilySelectedResponse> {
    return api.get(`/hrd/family/${params.user_id}`).then((res) => res.data);
  },
  updateFamily(
    id: number,
    params: FamilyCreateUpdateParams,
  ): Promise<FamilyCreateUpdateResponse> {
    return api.post(`/hrd/family/${id}`, params).then((res) => res.data);
  },
  createFamily(
    params: FamilyCreateUpdateParams,
  ): Promise<FamilyCreateUpdateResponse> {
    return api.post(`/hrd/family`, params).then((res) => res.data);
  },
  destroyFamily(id: number): Promise<FamilyDestroyResponse> {
    return api.delete(`/hrd/family/${id}`).then((res) => res.data);
  },
};
