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

    <!-- ───── Snackbar Error ───── -->
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

    <!-- ───── Snackbar Success ───── -->
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

    <header-remaining-leave-detail @add="handleAdd" />
    <sub-header-remaining-leave-detail />
    <table-detail-remaining-leave :employeeId="employeeId" />
    <info-dialog-leave-request />
    <form-adjut-dialog
      ref="formDialogRef"
      :user-id="employeeId"
      :show-error="showError"
      :show-success="showSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import InfoDialogLeaveRequest from "@/components/leave-request/InfoDialogLeaveRequest.vue";
import FormAdjutDialog from "@/components/remaining-leave/FormAdjutDialog.vue";
import HeaderRemainingLeaveDetail from "@/components/remaining-leave/HeaderRemainingLeaveDetail.vue";
import SubHeaderRemainingLeaveDetail from "@/components/remaining-leave/SubHeaderRemainingLeaveDetail.vue";
import TableDetailRemainingLeave from "@/components/remaining-leave/TableDetailRemainingLeave.vue";
import { useAppStore } from "@/stores/app";

import { useUserStore } from "@/stores/user.store";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const appStore = useAppStore();
const userStore = useUserStore();
const route = useRoute();
const employeeId = Number(route.params.id);

const formDialogRef = ref();

const showErrorSnackbar = ref(false);
const snackbarMessage = ref("");
const showSuccessSnackbar = ref(false);
const successMessage = ref("");

function showError(message: string) {
  snackbarMessage.value = message;
  showErrorSnackbar.value = true;
}

function showSuccess(message: string) {
  successMessage.value = message;
  showSuccessSnackbar.value = true;
}

function handleAdd() {
  formDialogRef.value.openAddDialog();
}

onMounted(async () => {
  userStore.userSelectedParams.id = employeeId.toString();
  userStore.fetchUsersSelected();
});
</script>
