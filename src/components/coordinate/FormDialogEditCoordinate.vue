<template>
  <v-dialog v-model="coordinateStore.dialog.edit" max-width="450" persistent>
    <v-card v-if="coordinateStore.selectedCoordinate" rounded="lg">
      <v-card-title class="flex items-center gap-2 px-6 pt-5 pb-3">
        <v-icon icon="mdi-map-marker-outline" color="primary" size="small" />
        <span class="text-base font-bold">Edit Koordinat</span>
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="coordinateStore.closeEditDialog()"
        />
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-4">
        <v-row>
          <!-- Nama (readonly) -->
          <v-col cols="12">
            <v-text-field
              :model-value="coordinateStore.selectedCoordinate.name"
              label="Nama Lokasi"
              variant="outlined"
              density="compact"
              readonly
              hide-details
            />
          </v-col>

          <!-- Akurasi -->
          <v-col cols="12">
            <v-text-field
              v-model.number="coordinateStore.selectedCoordinate.accuracy"
              variant="outlined"
              density="compact"
              type="number"
              min="0"
              hide-details="auto"
              suffix="Meter"
              :error-messages="coordinateStore.serverErrors.accuracy"
            >
              <template #label>
                Akurasi<span class="text-red-500">*</span>
              </template>
            </v-text-field>
          </v-col>

          <!-- Kuota Lembur -->
          <v-col cols="12">
            <v-text-field
              v-model.number="coordinateStore.selectedCoordinate.overtime_quota"
              variant="outlined"
              density="compact"
              type="number"
              min="0"
              hide-details="auto"
              hint="Isi 0 untuk tidak terbatas"
              persistent-hint
              :error-messages="coordinateStore.serverErrors.overtime_quota"
            >
              <template #label>
                Kuota Lembur / Hari<span class="text-red-500">*</span>
              </template>
            </v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <v-card-actions class="px-6 py-4 gap-2 justify-end">
        <v-btn variant="outlined" @click="coordinateStore.closeEditDialog()">
          Batal
        </v-btn>
        <v-btn
          color="bg-blue-300 dark:bg-blue-500"
          variant="flat"
          prepend-icon="mdi-content-save"
          :loading="coordinateStore.isLoadingEdit"
          @click="handleSave"
        >
          Simpan
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useCoordinateStore } from "@/stores/coordinates.store";
import { useAppStore } from "@/stores/app";

const coordinateStore = useCoordinateStore();
const appStore = useAppStore();

async function handleSave() {
  try {
    const res = await coordinateStore.updateCoordinate();
    if (res?.success) {
      appStore.showSuccessSnackbar = true;
      appStore.successMessage = res.message;
      coordinateStore.fetchCoordinates();
      coordinateStore.closeEditDialog();
    }
  } catch (error: any) {
    if (error?.status === 422) {
      appStore.showErrorSnackbar = true;
      appStore.errorMessage = error?.message ?? "Terjadi kesalahan, coba lagi.";
      const errors = error.errors as Record<string, string[]>;
      if (errors) {
        Object.entries(errors).forEach(([field, messages]) => {
          coordinateStore.serverErrors[field] = messages[0];
        });
      }
    } else {
      appStore.showErrorSnackbar = true;
      appStore.errorMessage = error?.message ?? "Terjadi kesalahan, coba lagi.";
    }
  }
}
</script>
