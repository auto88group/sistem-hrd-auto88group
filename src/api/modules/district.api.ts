import api from "../axios";
export interface DistrictParams {
  search?: string;
  regency_id?: string;
}
export interface DistrictResponse {
  success: boolean;
  data: District[];
}

export interface District {
  id: string;
  name: string;
}

export const districtApi = {
  getData(params: DistrictParams): Promise<DistrictResponse> {
    return api
      .get("/hrd/master-area/districts", { params })
      .then((res) => res.data);
  },
};
