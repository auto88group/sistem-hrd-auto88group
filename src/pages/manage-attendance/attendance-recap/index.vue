<template>
  <div class="space-y-5">
    <table-attendance-recap />
  </div>
</template>

<script setup lang="ts">
import TableAttendanceRecap from "@/components/attendance-recap/TableAttendanceRecap.vue";
import { useAppStore } from "@/stores/app";

const appStore = useAppStore();
</script>
