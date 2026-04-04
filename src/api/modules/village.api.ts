import api from "../axios";
export interface VillageParams {
  search?: string;
  district_id?: string;
}
export interface VillageResponse {
  success: boolean;
  data: Village[];
}

export interface Village {
  id: string;
  name: string;
}

export const villageApi = {
  getData(params: VillageParams): Promise<VillageResponse> {
    return api
      .get("/hrd/master-area/villages", { params })
      .then((res) => res.data);
  },
};
