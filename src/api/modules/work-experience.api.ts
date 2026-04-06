import api from "../axios";

export interface WorkExperienceDatatablesParams {
  draw?: number;
  start?: number;
  length?: number;
  search_slug?: string;
}
export interface WorkExperienceDatatablesResponse {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: WorkExperience[];
}
export interface WorkExperience {
  DT_RowIndex: number;
  user_id: number;
  slug: string;
  company: string;
  company_type: string;
  position: string;
  address: string;
  master_area_province_id: number;
  province_name: string;
  master_area_regency_id: number;
  regency_name: string;
  start_date: string;
  end_date: string;
  quit_reason: string;
  attachment: string;
}

export const workExperienceApi = {
  getDatatables(
    params: WorkExperienceDatatablesParams,
  ): Promise<WorkExperienceDatatablesResponse> {
    return api.get("/hrd/work-experience", { params }).then((res) => res.data);
  },
};
