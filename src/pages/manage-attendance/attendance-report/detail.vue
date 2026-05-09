<template>
  <div class="space-y-5">
    <header-detail-time-in />
    <attendance-today-detail />
  </div>
</template>

<script setup lang="ts">
import AttendanceTodayDetail from "@/components/attendance-report/AttendanceTodayDetail.vue";
import HeaderDetailTimeIn from "@/components/attendance-report/HeaderAttendanceTodayDetail.vue";
import { useEmployeeAttendanceRequestStore } from "@/stores/employee-attendance.store";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const employeeAttendanceStore = useEmployeeAttendanceRequestStore();
const { detailParams: params } = storeToRefs(employeeAttendanceStore);

onMounted(async () => {
  console.log(route.params);
  params.value.id = route.params.id as string;
  params.value.in_out = route.params.in_out as string;
  employeeAttendanceStore.fetchEmployeeAttendanceDetail();
});
</script>
