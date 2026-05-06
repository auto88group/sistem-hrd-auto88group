import api from "../axios";

export interface UserContractEndDatatablesParams {
  draw?: number;
  start?: number;
  length?: number;
  user_id?: number;
  branch_id?: number;
}
export interface UserContractEndHightlightParams {
  branch_id?: number;
}

export interface UserContractEndDatatablesResponse {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: UserContractEnd[];
}

export interface UserContractEndHighlightResponse {
  data: UserContractEndHighlight[];
}

export interface UserContractEnd {
  id: number;
  name: string;
  full_name: string | null;
  branch_id: number | null;
  position: string | null;
  employee_id: string | null;
  status_id: number | null;
  effective_start_date: string | null;
  effective_end_date: string | null;
  deleted: number | null;
  branch_name: string | null;
  branch_alias: string | null;
  DT_RowIndex: number | null;
  is_contract_end: number | null;
}

export interface UserContractEndHighlight {
  id: number;
  name: string;
  full_name: string | null;
  employee_id: string | null;
  branch_id: number | null;
  position: string | null;
  status_id: number | null;
  effective_start_date: string | null;
  effective_end_date: string | null;
  branch_name: string | null;
  is_contract_end: number | null;
}

export const userContractEndApi = {
  getDatatables(
    params: UserContractEndDatatablesParams,
  ): Promise<UserContractEndDatatablesResponse> {
    return api
      .get("/hrd/users/contract-end", { params })
      .then((res) => res.data);
  },

  getHighlight(
    params: UserContractEndHightlightParams,
  ): Promise<UserContractEndHighlightResponse> {
    return api
      .get("hrd/users/contract-end/highlight", { params })
      .then((res) => res.data);
  },
};
