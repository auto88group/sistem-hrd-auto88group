import api from "../axios";

export interface MasterPositionDatatablesParams {
  draw?: number;
  start?: number;
  length?: number;
  search?: string;
  sortBy?: string;
  sortDirection?: string;
}

export interface MasterPositionParams {
  name: string;
  master_level_id: number;
  level_name: string;
}

export interface MasterPosition {
  DT_RowIndex: number;
  id: number;
  name: string;
  master_level_id: number;
  level_name: string;
  display_name: string;
}

export interface MasterLevel {
  id: number;
  level_name: string;
  display_name: string;
  description: string;
}

export interface MasterPositionDatatablesResponse {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: MasterPosition[];
}

export interface MasterPositionResponse {
  success: boolean;
  message: string;
  data?: MasterPosition;
}

export interface MasterLevelResponse {
  success: boolean;
  message: string;
  data: MasterLevel[];
}

export const masterPositionApi = {
  getDatatables(
    params: MasterPositionDatatablesParams,
  ): Promise<MasterPositionDatatablesResponse> {
    return api.get("/hrd/master-position", { params }).then((res) => res.data);
  },

  getLevels(): Promise<MasterLevelResponse> {
    return api
      .get("/hrd/master-position/levels/options")
      .then((res) => res.data);
  },

  createPosition(
    params: MasterPositionParams,
  ): Promise<MasterPositionResponse> {
    return api.post(`/hrd/master-position`, params).then((res) => res.data);
  },

  updatePosition(
    id: number,
    params: MasterPositionParams,
  ): Promise<MasterPositionResponse> {
    // Menggunakan PUT sesuai dengan route backend yang kita buat sebelumnya
    return api
      .put(`/hrd/master-position/${id}`, params)
      .then((res) => res.data);
  },

  destroyPosition(id: number): Promise<MasterPositionResponse> {
    return api.delete(`/hrd/master-position/${id}`).then((res) => res.data);
  },
};
