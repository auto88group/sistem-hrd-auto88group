<template>
  <div class="space-y-5">
    <confirm-dialog />

    <v-snackbar
      v-model="showErrorSnackbar"
      color="bg-red-500"
      elevation="24"
      location="top"
      timeout="4000"
      rounded="lg"
    >
      <div class="d-flex align-center">
        <v-icon icon="mdi-alert-circle" class="me-3"></v-icon>
        <span class="font-weight-medium">{{ snackbarMessage }}</span>
      </div>
      <template v-slot:actions>
        <v-btn
          variant="text"
          icon="mdi-close"
          @click="showErrorSnackbar = false"
        ></v-btn>
      </template>
    </v-snackbar>

    <v-snackbar
      v-model="showSuccessSnackbar"
      color="bg-green-500"
      elevation="24"
      location="top"
      timeout="4000"
      rounded="lg"
    >
      <div class="d-flex align-center">
        <v-icon icon="mdi-check-circle" class="me-3"></v-icon>
        <span class="font-weight-medium">{{ successMessage }}</span>
      </div>
      <template v-slot:actions>
        <v-btn
          variant="text"
          icon="mdi-close"
          @click="showSuccessSnackbar = false"
        ></v-btn>
      </template>
    </v-snackbar>
    <table-leave-request
      @info="handleInfo"
      :show-error="showError"
      :show-success="showSuccess"
      :ask="ask"
    />
    <info-dialog-leave-request ref="infoDialogRef" />
  </div>
</template>

<script setup lang="ts">
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import InfoDialogLeaveRequest from "@/components/leave-request/InfoDialogLeaveRequest.vue";
import TableLeaveRequest from "@/components/leave-request/TableLeaveRequest.vue";
import { useConfirmDialog } from "@/composables/useConfirmDialog";
import { ref } from "vue";
const showErrorSnackbar = ref(false);
const snackbarMessage = ref("");
const showSuccessSnackbar = ref(false);
const successMessage = ref("");
const infoDialogRef = ref();

const { ask } = useConfirmDialog();

function handleInfo() {
  infoDialogRef.value.openInfoDialog();
}

function showError(message: string) {
  console.log(message);
  snackbarMessage.value = message;
  showErrorSnackbar.value = true;
}

function showSuccess(message: string) {
  successMessage.value = message;
  showSuccessSnackbar.value = true;
}
</script>
