import api from "../axios";

// LEAVE REQUEST
export interface LeaveRequestParams {
  branch_id?: number;
  hrd_leave_type_id?: number;
}
export interface LeaveRequestResponse {
  success: boolean;
  message: string;
  data: LeaveRequest[];
}
export interface LeaveRequest {
  id: number;
  user_id: number;
  hrd_leave_type_id: number;

  start_date: string;
  end_date: string;
  total_days: string | null;

  status: string;
  note: string | null;

  approved_by: string | null;
  approved_at: string | null;

  status_2: string | null;
  note_2: string | null;
  approved_by_2: string | null;
  approved_at_2: string | null;

  status_hrd: string;
  note_hrd: string | null;
  approved_by_hrd: string | null;
  approved_at_hrd: string | null;

  attachment: string | null;
  reason: string;

  created_at: string;

  user_name: string;
  user_full_name: string;

  primary_approver_name: string | null;
  primary_approver_full_name: string | null;

  secondary_approver_name: string | null;
  secondary_approver_full_name: string | null;

  leave_type_name: string;
  leave_type: string;
}

// GENDER
export interface GenderParams {
  alias?: string;
}
export type GenderType = "M" | "F" | "UNSET" | "TOTAL";
interface GenderBaseItem {
  id: GenderType;
  details: string[];
}
interface GenderPercentItem extends GenderBaseItem {
  id: Exclude<GenderType, "TOTAL">;
  value: number;
  type: "percent";
}
interface GenderTotalItem extends GenderBaseItem {
  id: Extract<GenderType, "TOTAL">;
  value: number;
  type: "total";
}
export type GenderItem = GenderPercentItem | GenderTotalItem;
export type GenderResponse = GenderItem[];

// RELIGION
export interface ReligionParams {
  alias?: string;
}
interface ReligionTotalItem {
  value: number;
  type: "total";
  details: string[];
}
interface ReligionPercentItem {
  id: string;
  value: number;
  type: "percent";
  details: string[];
}
export type ReligionItem = ReligionPercentItem | ReligionTotalItem;
export type ReligionResponse = ReligionItem[];

// EMPLOYEE TOTAL
export interface EmployeeTotalParams {
  alias?: string;
}
export interface EmployeeTotalItem {
  year: number;
  volume: number;
}
export type EmployeeTotalResponse = EmployeeTotalItem[];

// JOIN TERMINATION
export interface JoinTerminationParams {
  alias?: string;
  year?: number;
}
export interface JoinTerminationItem {
  month: string;
  join: number;
  termination: number;
}
export type JoinTerminationResponse = JoinTerminationItem[];

// USR DATA APPROVAL
export interface UserDataApprovalParams {
  alias?: string;
}
export interface UserDataApprovalItem {
  id: number;
  user_name: string;
  user_full_name: string;
  user_email: string;
  user_employee_id: string;
  is_active: number;
  label: string[];
  created_at: string;
}
export type UserDataApprovalResponse = UserDataApprovalItem[];

// EMPLOYEE STATUS
export interface EmployeeStatusParams {
  alias?: string;
}
export interface EmployeeStatusItem {
  status: string;
  total: number;
  color: string;
}
export type EmployeeStatusResponse = EmployeeStatusItem[];

// EMPLOYEE EDUCATION
export interface EmployeeEducationParams {
  alias?: string;
}
export type EmployeeEducationResponse = Record<string, number>;

// ATTENDANCE TODAY
export interface AttendanceTodayParams {
  alias?: string;
}
export interface AttendanceTodayItem {
  label: string;
  total: number;
  percent: number;
}
export type AttendanceTodayResponse = AttendanceTodayItem[];

// LATE PERCENTAGE
export interface LatePercentageParams {
  alias?: string;
  periodForm?: string[];
  period?: string;
}
export interface LatePercentageItem {
  branch_group_name: string;
  branch_group_code: string;
  late_percentage: number;
  total_present: number;
  note: string;
}
export type LatePercentageResponse = LatePercentageItem[];

// STATISTIC FILE COMPLETENESS
export interface StatisticFileCompletenessParams {
  alias?: string;
}

export interface CategoryBreakdownItem {
  category_id: number;
  category_name: string;
  uploaded_count: number;
  missing_count: number;
}

export interface StatisticFileCompletenessData {
  total_employees: number;
  complete_employees_count: number;
  incomplete_employees_count: number;
  category_breakdown: CategoryBreakdownItem[];
}

export interface StatisticFileCompletenessResponse {
  success: boolean;
  data: StatisticFileCompletenessData;
}

export const highlightApi = {
  getLeaveRequest(params: LeaveRequestParams): Promise<LeaveRequestResponse> {
    return api
      .get(`/hrd/highlight/leave-request`, { params })
      .then((res) => res.data);
  },

  getGender(params?: GenderParams): Promise<GenderResponse> {
    return api.get(`/hrd/highlight/gender`, { params }).then((res) => res.data);
  },

  getReligion(params?: ReligionParams): Promise<ReligionResponse> {
    return api
      .get(`/hrd/highlight/religion`, { params })
      .then((res) => res.data);
  },

  getEmployeeTotal(
    params?: EmployeeTotalParams,
  ): Promise<EmployeeTotalResponse> {
    return api
      .get(`/hrd/highlight/employee-total`, { params })
      .then((res) => res.data);
  },

  getJoinTermination(
    params?: JoinTerminationParams,
  ): Promise<JoinTerminationResponse> {
    return api
      .get(`/hrd/highlight/join-termination`, { params })
      .then((res) => res.data);
  },

  getUserDataApproval(
    params?: UserDataApprovalParams,
  ): Promise<UserDataApprovalResponse> {
    return api
      .get(`/hrd/highlight/user-data-approval`, { params })
      .then((res) => res.data);
  },

  getEmployeeStatus(
    params?: EmployeeStatusParams,
  ): Promise<EmployeeStatusResponse> {
    return api
      .get(`/hrd/highlight/employee-status`, { params })
      .then((res) => res.data);
  },

  getEmployeeEducation(
    params?: EmployeeEducationParams,
  ): Promise<EmployeeEducationResponse> {
    return api
      .get(`/hrd/highlight/employee-education`, { params })
      .then((res) => res.data);
  },

  getAttendanceToday(
    params?: AttendanceTodayParams,
  ): Promise<AttendanceTodayResponse> {
    return api
      .get(`/hrd/highlight/attendance-today`, { params })
      .then((res) => res.data);
  },

  getLatePercentage(
    params?: LatePercentageParams,
  ): Promise<LatePercentageResponse> {
    return api
      .get(`/hrd/highlight/late-percentage`, { params })
      .then((res) => res.data);
  },

  getStatisticFileCompleteness(
    params?: StatisticFileCompletenessParams,
  ): Promise<StatisticFileCompletenessResponse> {
    return api
      .get(`/hrd/highlight/statistic-file-completeness`, { params })
      .then((res) => res.data);
  },
};
