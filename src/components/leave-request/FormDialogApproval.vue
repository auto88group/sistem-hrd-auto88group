<template>
  <v-dialog v-model="leaveRequestStore.dialog" max-width="700" scrollable>
    <v-card rounded="lg">
      <v-card-title class="flex items-center gap-2 px-6 pt-5 pb-3">
        <v-icon icon="mdi-tune-variant" color="primary" size="small"></v-icon>
        <span class="text-base font-bold">
          {{
            form.status == "approved"
              ? "Approve Pengajuan"
              : form.status == "rejected"
                ? "Reject Pengajuan"
                : ""
          }}
        </span>
        <v-spacer></v-spacer>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="closeDialog"
        ></v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="p-4">
        <v-form>
          <v-row class="gy-4">
            <v-col cols="12">
              <v-text-field
                id="note"
                v-model="form.note"
                variant="outlined"
                density="compact"
                hide-details="auto"
                :rules="[rules.required]"
                :error-messages="leaveRequestStore.serverErrors.note"
              >
                <template v-slot:label>
                  Catatan<span class="text-red-500">*</span>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="px-6 py-4 gap-2 justify-end">
        <v-btn variant="outlined" @click="closeDialog">Batal</v-btn>
        <v-btn
          color="bg-blue-300 dark:bg-blue-500"
          variant="flat"
          prepend-icon="mdi-content-save"
          :loading="leaveRequestStore.isLoadingApproval"
          @click="submitForm"
        >
          Konfirmasi
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { useAppStore } from "@/stores/app";
import { useLeaveRequestStore } from "@/stores/leave-request.store";
import { computed, ref } from "vue";

const appStore = useAppStore();
const leaveRequestStore = useLeaveRequestStore();

const form = computed(() => leaveRequestStore.payloadApproval);

const rules = {
  required: (v: any) =>
    (v !== null && v !== undefined && v !== "") || "Wajib diisi",
};

async function submitForm() {
  try {
    const res = await leaveRequestStore.approvalLeaveRequest();
    if (res.success) {
      appStore.showSuccessSnackbar = true;
      appStore.successMessage = res.message;
      leaveRequestStore.fetchLeaveRequest();
      leaveRequestStore.dialog = false;
      leaveRequestStore.isLoadingApproval = false;
      leaveRequestStore.clearApprovalPayload();
    }
  } catch (error: any) {
    handleServerErrors(error);
  }
}

function handleServerErrors(err: any) {
  if (err?.status === 422) {
    appStore.showErrorSnackbar = true;
    appStore.errorMessage = err?.message ?? "Terjadi kesalahan, coba lagi.";
    leaveRequestStore.isLoadingApproval = false;
    const errors = err.errors as Record<string, string[]>;
    if (errors) {
      Object.entries(errors).forEach(([field, messages]) => {
        leaveRequestStore.serverErrors[field] = messages[0];
      });
    }
  } else {
    appStore.showErrorSnackbar = true;
    appStore.errorMessage = err?.message ?? "Terjadi kesalahan, coba lagi.";
    leaveRequestStore.isLoadingApproval = false;
  }
}

function closeDialog() {
  leaveRequestStore.dialog = false;
  leaveRequestStore.clearApprovalPayload();
  Object.keys(leaveRequestStore.serverErrors).forEach(
    (key) => delete leaveRequestStore.serverErrors[key],
  );
}
</script>
