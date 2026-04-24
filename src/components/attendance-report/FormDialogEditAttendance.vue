<template>
  <v-dialog
    v-model="employeeAttendanceStore.formDialog"
    max-width="700"
    scrollable
  >
    <v-card rounded="lg">
      <v-card-title class="flex items-center gap-2 px-6 pt-5 pb-3">
        <v-icon icon="mdi-tune-variant" color="primary" size="small"></v-icon>
        <span class="text-base font-bold">Edit Absensi</span>
        <v-spacer></v-spacer>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="closeDialog"
        ></v-btn>
      </v-card-title>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useEmployeeAttendanceRequestStore } from "@/stores/employee-attendance.store";
import { computed } from "vue";

const employeeAttendanceStore = useEmployeeAttendanceRequestStore();
const form = computed(() => employeeAttendanceStore.payloadEdit);

function closeDialog() {
  employeeAttendanceStore.formDialog = false;
  employeeAttendanceStore.clearpayloadEdit();
  Object.keys(employeeAttendanceStore.serverErrors).forEach(
    (key) => delete employeeAttendanceStore.serverErrors[key],
  );
}
</script>
