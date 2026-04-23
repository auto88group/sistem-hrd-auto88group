<template>
  <v-card class="p-3 rounded-lg shadow-md space-y-5 w-full">
    <div class="space-y-3 md:space-y-0 md:flex items-center justify-between">
      <div>
        <p class="text-lg font-bold m-0 text-indigo-500">Laporan Absensi</p>
        <v-breadcrumbs
          :items="items"
          class="m-0 p-0 text-gray-500 dark:text-gray-300 text-sm"
        ></v-breadcrumbs>
      </div>
    </div>
    <filter-attendance-report />
  </v-card>
</template>
<script setup lang="ts">
import FilterAttendanceReport from "./FilterAttendanceReport.vue";

const items = [
  { title: "Kelola Absensi", disabled: false, href: "/manage-attendance" },
  {
    title: "Laoran Absensi",
    disabled: true,
    href: "/manage-attendance/attendance-report",
  },
];
</script>
<style scoped>
:deep(.v-breadcrumbs-item--disabled) {
  color: #615fff !important;
  opacity: 1;
}
:deep(.v-breadcrumbs-item) {
  padding: 0;
}
</style>
