import {
  employeeAttendanceRequestApi,
  type EmployeeAttendance,
  type EmployeeAttendanceEditParams,
  type EmployeeAttendanceParams,
} from "@/api/modules/employee-attendance.api";
import { defineStore } from "pinia";
import { ref, reactive } from "vue";

export const useEmployeeAttendanceRequestStore = defineStore(
  "employee-attendance",
  () => {
    const employeeAttendance = ref<EmployeeAttendance[]>([]);
    const isLoading = ref(false);
    const isLoadingEdit = ref(false);
    const serverErrors = reactive<Record<string, string>>({});

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

    const payloadEdit = reactive<EmployeeAttendanceEditParams>({
      id: null,
      user_id: null,
      user_name: null,
      user_full_name: null,
      user_email: null,
      branch_id: null,
      period_date: null,
      hrd_master_shift_id: null,
      working_hour: null,
      time_in: null,
      note_in: null,
      time_out: null,
      note_out: null,
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

    async function updateAttendance() {
      if (!payloadEdit.id) throw new Error("ID tidak ditemukan.");

      isLoadingEdit.value = true;

      try {
        const { data } = await employeeAttendanceRequestApi.update(
          payloadEdit.id,
          payloadEdit,
        );
        return data;
      } finally {
        isLoadingEdit.value = false;
      }
    }

    async function modifyAttendance() {
      isLoadingEdit.value = true;

      try {
        const { data } = await employeeAttendanceRequestApi.modify(payloadEdit);
        return data;
      } finally {
        isLoadingEdit.value = false;
      }
    }

    function resetServerErrors() {
      Object.keys(serverErrors).forEach((key) => delete serverErrors[key]);
    }

    function clearpayloadEdit() {
      payloadEdit.id = null;
      payloadEdit.user_id = null;
      payloadEdit.user_name = null;
      payloadEdit.user_full_name = null;
      payloadEdit.user_email = null;
      payloadEdit.branch_id = null;
      payloadEdit.period_date = null;
      payloadEdit.hrd_master_shift_id = null;
      payloadEdit.working_hour = null;
      payloadEdit.time_in = null;
      payloadEdit.time_out = null;
      payloadEdit.note_in = null;
      payloadEdit.note_out = null;
    }

    return {
      employeeAttendance,
      isLoading,
      isLoadingEdit,
      totalRecords,
      params,
      formDialog,
      payloadEdit,
      serverErrors,
      modifyAttendance,
      fetchEmployeeAttendance,
      clearpayloadEdit,
      updateAttendance,
      resetServerErrors,
    };
  },
);
