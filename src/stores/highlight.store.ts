import {
  highlightApi,
  type EmployeeTotalItem,
  type EmployeeTotalParams,
  type GenderItem,
  type GenderParams,
  type JoinTerminationItem,
  type JoinTerminationParams,
  type LeaveRequest,
  type LeaveRequestParams,
  type ReligionItem,
  type ReligionParams,
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
  };
});
