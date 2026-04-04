import api from "../axios";
export interface LastSequenceSalesParams {
  level?: string;
}
export interface LastSequenceSalesResponse {
  success: boolean;
  data: number;
}

export const salesOfficialApi = {
  getLastSequenceSales(
    params: LastSequenceSalesParams,
  ): Promise<LastSequenceSalesResponse> {
    return api
      .get("/telemarketing-next-sequence", { params })
      .then((res) => res.data);
  },
};
