<template>
  <v-dialog v-model="isDialogImport" max-width="500" persistent>
    <v-card
      elevation="1"
      prepend-icon="mdi-download"
      title="Import Data Karyawan"
    >
      <v-card-text>
        <p
          class="text-sm border-l-4 border-indigo-500 ps-3 bg-indigo-50 dark:bg-indigo-500/20 p-3 text-gray-600 dark:text-gray-400 mb-2"
        >
          Silakan unggah file Excel sesuai dengan format yang telah ditentukan.
          Pastikan data NIK dan Nama sudah terisi dengan benar.
        </p>

        <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          density="compact"
          class="mb-4 text-sm"
          closable
          @click:close="errorMessage = null"
        >
          {{ errorMessage }}
        </v-alert>

        <v-btn
          @click="downloadTemplate"
          :loading="isLoadingGetData"
          block
          variant="tonal"
          color="text-green-500"
          prepend-icon="mdi-file-excel"
          class="text-none mb-6"
        >
          Download Template Excel
        </v-btn>

        <v-file-input
          v-model="selectedFile"
          id="file"
          variant="outlined"
          density="compact"
          hide-details="auto"
          accept=".xlsx, .xls, .csv"
          prepend-icon=""
          prepend-inner-icon="mdi-paperclip"
          :error="!!errorMessage || uploadErrors.length > 0"
        >
          <template v-slot:label
            >File Excel<span class="text-red-500">*</span></template
          >
        </v-file-input>

        <div class="mt-4" v-if="errorMessage || uploadErrors.length > 0">
          <v-alert
            v-if="errorMessage"
            type="error"
            variant="tonal"
            density="compact"
            class="text-sm font-semibold mb-2"
          >
            {{ errorMessage }}
          </v-alert>

          <div
            v-if="uploadErrors.length > 0"
            class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3"
          >
            <p class="text-xs text-red-600 dark:text-red-400 font-bold mb-2">
              Detail Kesalahan Validasi:
            </p>
            <ul
              class="list-decimal pl-5 text-xs text-red-600 dark:text-red-400 space-y-1 max-h-40 overflow-y-auto custom-scrollbar"
            >
              <li v-for="(err, index) in uploadErrors" :key="index">
                {{ err }}
              </li>
            </ul>
          </div>
        </div>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          text="Batal"
          color="bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-200 font-bold"
          variant="plain"
          @click="closeDialog"
          :disabled="isUploading"
        ></v-btn>

        <v-btn
          @click="handleImport"
          :loading="isUploading"
          color="bg-indigo-200 dark:bg-indigo-800 text-indigo-500 dark:text-indigo-200 font-bold"
          text="Import"
          variant="flat"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useImportUserStore } from "@/stores/import-user.store";
import { storeToRefs } from "pinia";

const importUserStore = useImportUserStore();

// Destructure state yang dibutuhkan
const {
  isDialogImport,
  isLoadingGetData,
  selectedFile,
  isUploading,
  errorMessage,
  uploadErrors,
} = storeToRefs(importUserStore);

// Destructure action yang dibutuhkan
const { fetchDataForTemplateUser, downloadTemplate, uploadData, resetData } =
  importUserStore;

// Fungsi untuk menutup dialog & mereset state
const closeDialog = () => {
  isDialogImport.value = false;
  resetData();
};

// Eksekutor fungsi Upload
const handleImport = async () => {
  const isSuccess = await uploadData();

  if (isSuccess) {
    // Jika upload berhasil, Anda bisa menambahkan alert/toast sukses di sini
    // atau emit event ke parent component agar me-refresh tabel data user.
    console.log("Import Berhasil!");
  }
};
</script>
