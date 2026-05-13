<template>
  <v-dialog v-model="isDialogImport" max-width="450" persistent>
    <v-card
      elevation="1"
      prepend-icon="mdi-download"
      title="Import Data Karyawan"
    >
      <!-- Bagian Isi/Konten Dialog -->
      <v-card-text>
        <p
          class="text-sm border-l-4 border-indigo-500 ps-3 bg-indigo-50 dark:bg-indigo-500/20 p-3 text-gray-600 dark:text-gray-400 mb-2"
        >
          Silakan unggah file Excel sesuai dengan format yang telah ditentukan.
          Pastikan data NIK dan Nama sudah terisi dengan benar.
        </p>

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

        <!-- Slot untuk Input File bisa diletakkan di sini nanti -->
        <v-file-input
          id="file"
          variant="outlined"
          density="compact"
          hide-details="auto"
          accept=".pdf,.jpg,.jpeg,.png"
          prepend-icon=""
          prepend-inner-icon="mdi-paperclip"
        >
          <template v-slot:label
            >File Excel<span class="text-red-500">*</span></template
          >
        </v-file-input>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          text="Batal"
          color="bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-200 font-bold"
          variant="plain"
          @click="isDialogImport = false"
        ></v-btn>

        <!-- Button type diset ke 'submit' -->
        <v-btn
          type="submit"
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
const { isDialogImport, isLoadingGetData } = storeToRefs(importUserStore);
const { fetchDataForTemplateUser, downloadTemplate } = importUserStore;
</script>
