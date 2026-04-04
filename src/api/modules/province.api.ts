import api from "../axios";
export interface ProvinceParams {
  search?: string;
}
export interface ProvinceResponse {
  success: boolean;
  data: Province[];
}

export interface Province {
  id: string;
  name: string;
}

export const provinceApi = {
  getData(params: ProvinceParams): Promise<ProvinceResponse> {
    return api
      .get("/hrd/master-area/provinces", { params })
      .then((res) => res.data);
  },
};
