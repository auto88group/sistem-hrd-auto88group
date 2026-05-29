import api from "../axios";
export interface LeaveTypeDatatablesParams {
  draw?: number;
  start?: number;
  length?: number;
  search?: string;
}

export interface LeaveTypeDataParams {
  search?: string;
}

export interface LeaveTypeDataResponse {
  success: boolean;
  data: LeaveType[];
}

export interface LeaveTypeParams {
  code: string;
  name: string;
  type: string;
  is_full_day: number;
  max_day?: string;
  max_hour?: string;
  back_date?: string;
  file_upload: number;
  deduct_leave: number;
}

export interface leaveTypeCreateUpdateResponse {
  success: boolean;
  message: string;
  data: LeaveType;
}

export interface LeaveTypeDatatablesResponse {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: LeaveType[];
}

export interface LeaveTypeDefaultResponse {
  success: boolean;
  message: string;
}

export interface LeaveType {
  DT_RowIndex: number;
  id: number;
  code: string;
  name: string;
  type: string;
  is_full_day: number;
  max_day: number;
  max_hour: number;
  change_time: string;
  back_date: number;
  file_upload: number;
  deduct_leave: number;
  deduct_no_file: number;
  can_delete: number;
}

export const leaveTypeApi = {
  getDatatables(
    params: LeaveTypeDatatablesParams,
  ): Promise<LeaveTypeDatatablesResponse> {
    return api.get("/hrd/leave-type", { params }).then((res) => res.data);
  },

  getData(params: LeaveTypeDataParams): Promise<LeaveTypeDataResponse> {
    return api.get("/hrd/leave-type/data", { params }).then((res) => res.data);
  },

  createLeaveType(
    params: LeaveTypeParams,
  ): Promise<leaveTypeCreateUpdateResponse> {
    return api
      .post(`/hrd/leave-type/?_method=POST`, params)
      .then((res) => res.data);
  },

  updateLeaveType(
    id: number,
    params: LeaveTypeParams,
  ): Promise<leaveTypeCreateUpdateResponse> {
    return api
      .post(`/hrd/leave-type/${id}?_method=POST`, params)
      .then((res) => res.data);
  },

  destroyLeaveType(id: number): Promise<LeaveTypeDefaultResponse> {
    return api.delete(`/hrd/leave-type/${id}`).then((res) => res.data);
  },
};
