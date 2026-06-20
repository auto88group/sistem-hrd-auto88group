import {
  highlightApi,
  type AttendanceTodayParams,
  type AttendanceTodayResponse,
  type EmployeeEducationParams,
  type EmployeeEducationResponse,
  type EmployeeStatusItem,
  type EmployeeStatusParams,
  type EmployeeTotalItem,
  type EmployeeTotalParams,
  type GenderItem,
  type GenderParams,
  type JoinTerminationItem,
  type JoinTerminationParams,
  type LatePercentageItem,
  type LatePercentageParams,
  type LatePercentageResponse,
  type LeaveRequest,
  type LeaveRequestParams,
  type ReligionItem,
  type ReligionParams,
  type UserDataApprovalItem,
  type UserDataApprovalParams,
  type StatisticFileCompletenessParams,
  type StatisticFileCompletenessData,
  type StatisticFileCompletenessResponse,
} from "@/api/modules/highlight.api";
import { defineStore } from "pinia";
import { ref, reactive } from "vue";

export const useHighlightStore = defineStore("highlight", () => {
  // LEAVE REQUEST
  const leaveRequest = ref<LeaveRequest[]>([]);
  const isLoadingLeaveRequest = ref(false);
  const leaveRequestParams = reactive<LeaveRequestParams>({
    branch_id: undefined,
    hrd_leave_type_id: undefined,
  });
  async function fetchLeaveRequest() {
    isLoadingLeaveRequest.value = true;
    try {
      console.log(leaveRequestParams);
      const res = await highlightApi.getLeaveRequest({ ...leaveRequestParams });
      leaveRequest.value = res.data;

      console.log(res.data);
    } finally {
      isLoadingLeaveRequest.value = false;
    }
  }

  // GENDER
  const gender = ref<GenderItem[]>([]);
  const isLoadingGender = ref(false);
  const genderParams = reactive<GenderParams>({
    alias: undefined,
  });
  async function fetchGender() {
    isLoadingGender.value = true;
    try {
      const res = await highlightApi.getGender({ ...genderParams });
      gender.value = res;
    } finally {
      isLoadingGender.value = false;
    }
  }

  // RELIGION
  const religion = ref<ReligionItem[]>([]);
  const isLoadingReligion = ref(false);
  const religionParams = reactive<ReligionParams>({ alias: undefined });
  async function fetchReligion() {
    isLoadingReligion.value = true;
    try {
      const res = await highlightApi.getReligion({ ...religionParams });
      religion.value = res;
    } finally {
      isLoadingReligion.value = false;
    }
  }

  // EMPLOYEE TOTAL
  const employeeTotal = ref<EmployeeTotalItem[]>([]);
  const isLoadingEmployeeTotal = ref(false);
  const employeeTotalParams = reactive<EmployeeTotalParams>({
    alias: undefined,
  });
  async function fetchEmployeeTotal() {
    isLoadingEmployeeTotal.value = true;
    try {
      const res = await highlightApi.getEmployeeTotal({
        ...employeeTotalParams,
      });
      employeeTotal.value = res;
    } finally {
      isLoadingEmployeeTotal.value = false;
    }
  }

  // JOIN TERMINATION
  const joinTermination = ref<JoinTerminationItem[]>([]);
  const isLoadingJoinTermination = ref(false);
  const joinTerminationParams = reactive<JoinTerminationParams>({
    year: undefined,
    alias: undefined,
  });
  async function fetchJoinTermination() {
    isLoadingJoinTermination.value = true;
    try {
      const res = await highlightApi.getJoinTermination({
        ...joinTerminationParams,
      });
      joinTermination.value = res;
    } finally {
      isLoadingJoinTermination.value = false;
    }
  }

  // USER DATA APPROVAL
  const userDataApproval = ref<UserDataApprovalItem[]>([]);
  const isLoadingUserDataApproval = ref(false);
  const userDataApprovalParams = reactive<UserDataApprovalParams>({
    alias: undefined,
  });
  async function fetchUserDataApproval() {
    isLoadingUserDataApproval.value = true;
    try {
      const res = await highlightApi.getUserDataApproval({
        ...userDataApprovalParams,
      });
      userDataApproval.value = res;
    } finally {
      isLoadingUserDataApproval.value = false;
    }
  }

  // EMPLOYEE STATUS
  const employeeStatus = ref<EmployeeStatusItem[]>([]);
  const isLoadingEmployeeStatus = ref(false);
  const employeStatusParams = reactive<EmployeeStatusParams>({
    alias: undefined,
  });
  async function fetchEmployeeStatus() {
    isLoadingEmployeeStatus.value = true;
    try {
      const res = await highlightApi.getEmployeeStatus({
        ...employeStatusParams,
      });
      employeeStatus.value = res;
    } finally {
      isLoadingEmployeeStatus.value = false;
    }
  }

  // EMPLOYEE EDUCATION
  const employeeEducation = ref<EmployeeEducationResponse>({});
  const isLoadingEmployeeEducation = ref(false);
  const employeeEducationParams = reactive<EmployeeEducationParams>({
    alias: undefined,
  });
  async function fetchEmployeeEducation() {
    isLoadingEmployeeEducation.value = true;
    try {
      const res = await highlightApi.getEmployeeEducation({
        ...employeeEducationParams,
      });
      employeeEducation.value = res;
    } finally {
      isLoadingEmployeeEducation.value = false;
    }
  }

  // ATTENDANCE TODAY
  const attendanceToday = ref<AttendanceTodayResponse>([]);
  const isLoadingAttendanceToday = ref(false);
  const attendanceTodayParams = reactive<AttendanceTodayParams>({
    alias: undefined,
  });
  async function fetchAttendanceToday() {
    isLoadingAttendanceToday.value = true;
    try {
      const res = await highlightApi.getAttendanceToday({
        ...attendanceTodayParams,
      });
      attendanceToday.value = res;
    } finally {
      isLoadingAttendanceToday.value = false;
    }
  }

  // LATE PERCENTAGE
  const latePercentage = ref<LatePercentageResponse>([]);
  const isLoadingLatePercentage = ref(false);
  const latePercentageParams = reactive<LatePercentageParams>({
    alias: undefined,
    period: undefined,
    periodForm: undefined,
  });
  async function fetchLatePercentage() {
    isLoadingLatePercentage.value = true;
    try {
      const res = await highlightApi.getLatePercentage({
        ...latePercentageParams,
      });
      latePercentage.value = res;
    } finally {
      isLoadingLatePercentage.value = false;
    }
  }

  // STATISTIC FILE COMPLETENESS
  const statisticFileCompleteness = ref<StatisticFileCompletenessData | null>(
    null,
  );
  const isLoadingStatisticFileCompleteness = ref(false);
  const statisticFileCompletenessParams =
    reactive<StatisticFileCompletenessParams>({
      alias: undefined,
    });

  async function fetchStatisticFileCompleteness() {
    isLoadingStatisticFileCompleteness.value = true;
    try {
      const res = await highlightApi.getStatisticFileCompleteness({
        ...statisticFileCompletenessParams,
      });
      statisticFileCompleteness.value = res.data;
    } finally {
      isLoadingStatisticFileCompleteness.value = false;
    }
  }

  return {
    // LEAVE REQUEST
    leaveRequest,
    isLoadingLeaveRequest,
    leaveRequestParams,
    fetchLeaveRequest,

    // GENDER
    gender,
    isLoadingGender,
    genderParams,
    fetchGender,

    // RELIGION
    religion,
    isLoadingReligion,
    religionParams,
    fetchReligion,

    // EMPLOYEE TOTAL
    employeeTotal,
    isLoadingEmployeeTotal,
    employeeTotalParams,
    fetchEmployeeTotal,

    // JOIN TERMINATION
    joinTermination,
    isLoadingJoinTermination,
    joinTerminationParams,
    fetchJoinTermination,

    // USER DATA APPROVAL
    userDataApproval,
    isLoadingUserDataApproval,
    userDataApprovalParams,
    fetchUserDataApproval,

    // EMPLOYEE STATUS
    employeeStatus,
    isLoadingEmployeeStatus,
    employeStatusParams,
    fetchEmployeeStatus,

    // EMPLOYEE EDUCATION
    employeeEducation,
    isLoadingEmployeeEducation,
    employeeEducationParams,
    fetchEmployeeEducation,

    // ATTENDANCE TODAY
    attendanceToday,
    isLoadingAttendanceToday,
    attendanceTodayParams,
    fetchAttendanceToday,

    // LATE PERCENTAGE
    latePercentage,
    isLoadingLatePercentage,
    latePercentageParams,
    fetchLatePercentage,

    // STATISTIC FILE COMPLETENESS
    statisticFileCompleteness,
    isLoadingStatisticFileCompleteness,
    statisticFileCompletenessParams,
    fetchStatisticFileCompleteness,
  };
});
