<template>
  <v-dialog v-model="appStore.dialog" max-width="700" scrollable>
    <v-card rounded="lg">
      <v-card-title class="flex items-center gap-2 px-6 pt-5 pb-3">
        <v-icon icon="mdi-tune-variant" color="primary" size="small"></v-icon>
        <span class="text-base font-bold">
          {{ "Sesuaikan Data " }}
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
        <v-form ref="formRef">
          <v-row class="gy-4">
            <v-col cols="12">
              <v-text-field
                id="note"
                v-model="form.note"
                variant="outlined"
                density="compact"
                hide-details="auto"
                :rules="[rules.required]"
                :error-messages="serverErrors.note"
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
          :loading="remainingLeaveStore.isLoadingAdjustmant"
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
import { reactive, ref } from "vue";

const appStore = useAppStore();
const formRef = ref();
const serverErrors = reactive<Record<string, string>>({});

function closeDialog() {
  appStore.dialog = false;
  formRef.value?.reset();
  Object.keys(serverErrors).forEach((key) => delete serverErrors[key]);
}
</script>
