<template>
  <div class="space-y-5">
    <header-attendance-report />
    <table-attendance-today-report />
  </div>
</template>

<script setup lang="ts">
import HeaderAttendanceReport from "@/components/attendance-report/HeaderAttendanceReport.vue";
import TableAttendanceTodayReport from "@/components/attendance-report/TableAttendanceTodayReport.vue";
</script>
