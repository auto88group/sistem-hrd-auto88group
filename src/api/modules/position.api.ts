import api from "../axios";
export interface PositionDataParams {
  search?: string;
  branch_id?: number;
}
export interface PositionDataResponse {
  success: boolean;
  data: Position[];
}

export interface Position {
  id: number;
  name: string;
  level_name: string;
}

export const positionApi = {
  getData(params: PositionDataParams): Promise<PositionDataResponse> {
    return api.get("/hrd/positions/data", { params }).then((res) => res.data);
  },
};
