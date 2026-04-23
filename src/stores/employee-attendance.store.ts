import {
  employeeAttendanceRequestApi,
  type EmployeeAttendance,
  type EmployeeAttendanceParams,
} from "@/api/modules/employee-attendance.api";
import { defineStore } from "pinia";
import { ref, reactive } from "vue";

export const useEmployeeAttendanceRequestStore = defineStore(
  "employee-attendance",
  () => {
    const employeeAttendance = ref<EmployeeAttendance[]>([]);
    const isLoading = ref(false);
    const totalRecords = ref(0);

    const params = reactive<EmployeeAttendanceParams>({
      draw: 1,
      start: 0,
      length: 10,
      period: undefined,
      user_id: null,
      branch_id: null,

      type_present: 1,
      type_late: 1,
      type_go_home_early: 1,
      type_didnt_check_out: 1,
      type_negligent: 1,
      type_sick: 1,
      type_permit: 1,
      type_leave: 1,
      type_holiday: 1,
    });

    const formDialog = ref(false);

    async function fetchEmployeeAttendance() {
      isLoading.value = true;
      try {
        const res = await employeeAttendanceRequestApi.getDatatables({
          ...params,
        });
        employeeAttendance.value = res.data;
        totalRecords.value = res.recordsTotal;
        params.draw = res.draw + 1;
      } finally {
        isLoading.value = false;
      }
    }

    return {
      employeeAttendance,
      isLoading,
      totalRecords,
      params,
      formDialog,
      fetchEmployeeAttendance,
    };
  },
);
