import api from "../axios";
export interface RegencyParams {
  search?: string;
  province_id?: string;
}
export interface RegencyResponse {
  success: boolean;
  data: Regency[];
}

export interface Regency {
  id: string;
  name: string;
}

export const regencyApi = {
  getData(params: RegencyParams): Promise<RegencyResponse> {
    return api
      .get("/hrd/master-area/regencies", { params })
      .then((res) => res.data);
  },
};
