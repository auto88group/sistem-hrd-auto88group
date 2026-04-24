<template>
  <div class="space-y-5">
    <v-snackbar
      v-model="appStore.showErrorSnackbar"
      color="bg-red-500"
      elevation="24"
      location="top"
      timeout="4000"
      rounded="lg"
    >
      <div class="d-flex align-center">
        <v-icon icon="mdi-alert-circle" class="me-3"></v-icon>
        <span class="font-weight-medium">{{ appStore.errorMessage }}</span>
      </div>
      <template v-slot:actions>
        <v-btn
          variant="text"
          icon="mdi-close"
          @click="appStore.showErrorSnackbar = false"
        ></v-btn>
      </template>
    </v-snackbar>

    <v-snackbar
      v-model="appStore.showSuccessSnackbar"
      color="bg-green-500"
      elevation="24"
      location="top"
      timeout="4000"
      rounded="lg"
    >
      <div class="d-flex align-center">
        <v-icon icon="mdi-check-circle" class="me-3"></v-icon>
        <span class="font-weight-medium">{{ appStore.successMessage }}</span>
      </div>
      <template v-slot:actions>
        <v-btn
          variant="text"
          icon="mdi-close"
          @click="appStore.showSuccessSnackbar = false"
        ></v-btn>
      </template>
    </v-snackbar>

    <header-attendance-report />
    <table-attendance-report />
    <form-dialog-edit-attendance />
  </div>
</template>

<script setup lang="ts">
import FormDialogEditAttendance from "@/components/attendance-report/FormDialogEditAttendance.vue";
import HeaderAttendanceReport from "@/components/attendance-report/HeaderAttendanceReport.vue";
import TableAttendanceReport from "@/components/attendance-report/TableAttendanceReport.vue";
import { useAppStore } from "@/stores/app";

const appStore = useAppStore();
</script>
