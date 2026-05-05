<template>
  <div class="space-y-5">
    <header-attendance-recap />
    <table-attendance-recap />
  </div>
</template>

<script setup lang="ts">
import HeaderAttendanceRecap from "@/components/attendance-recap/HeaderAttendanceRecap.vue";
import TableAttendanceRecap from "@/components/attendance-recap/TableAttendanceRecap.vue";
import { useAppStore } from "@/stores/app";

const appStore = useAppStore();
</script>
