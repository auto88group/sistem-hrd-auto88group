<template>
  <div class="space-y-5">
    <confirm-dialog />

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
          @click="appStore.showErrorSnackbar = false"
        ></v-btn>
      </template>
    </v-snackbar>
    <header-leave-request />
    <table-leave-request />
    <form-dialog-approval />
    <form-dialog-create-edit-leave-request />
    <info-dialog-leave-request />
  </div>
</template>

<script setup lang="ts">
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import FormDialogApproval from "@/components/leave-request/FormDialogApproval.vue";
import FormDialogCreateEditLeaveRequest from "@/components/leave-request/FormDialogCreateEditLeaveRequest.vue";
import HeaderLeaveRequest from "@/components/leave-request/HeaderLeaveRequest.vue";
import InfoDialogLeaveRequest from "@/components/leave-request/InfoDialogLeaveRequest.vue";
import TableLeaveRequest from "@/components/leave-request/TableLeaveRequest.vue";
import { useAppStore } from "@/stores/app";

const appStore = useAppStore();
</script>
