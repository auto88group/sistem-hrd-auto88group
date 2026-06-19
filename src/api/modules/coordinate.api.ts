import api from "../axios";

export interface CoordinateParams {
  draw?: number;
  start?: number;
  length?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: string;
}

export interface CoordinateResponse {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: Coordinate[];
}

export interface Coordinate {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
  overtime_quota: number;
  accuracy: number;
  attendance: number;
  created_at: string;
  DT_RowIndex: number;
}
export interface CoordinateUpdatePayload {
  accuracy: number | null;
  overtime_quota: number | null;
}

export const coordinateApi = {
  getData(params: CoordinateParams): Promise<CoordinateResponse> {
    return api.get("/hrd/coordinate", { params }).then((res) => res.data);
  },

  update(
    id: string,
    payload: CoordinateUpdatePayload,
  ): Promise<{ success: boolean; message: string }> {
    return api.put(`/hrd/coordinate/${id}`, payload).then((res) => res.data);
  },
};
