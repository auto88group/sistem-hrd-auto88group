<template>
  <div class="space-y-4 md:space-y-0 md:grid grid-cols-2 md:gap-6">
    <today-attendance-card />
    <permit-application-card />
    <div class="col-span-2">
      <late-ratio-statistics-card />
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderAttendanceReport from "@/components/attendance-report/HeaderAttendanceReport.vue";
import LateRatioStatisticsCard from "@/components/dashboard/LateRatioStatisticsCard.vue";
import PermitApplicationCard from "@/components/dashboard/PermitApplicationCard.vue";
import TodayAttendanceCard from "@/components/dashboard/TodayAttendanceCard.vue";
</script>
