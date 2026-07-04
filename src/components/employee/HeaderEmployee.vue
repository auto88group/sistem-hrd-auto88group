<template>
  <v-card
    class="p-3 rounded-lg shadow-md space-y-3 md:space-y-0 md:flex w-full items-center justify-between"
  >
    <div>
      <p class="text-lg font-bold m-0 text-indigo-500">Karyawan</p>
      <v-breadcrumbs
        :items="items"
        class="m-0 p-0 text-gray-500 dark:text-gray-300 text-sm"
      ></v-breadcrumbs>
    </div>
    <div
      v-if="isVisible('index')"
      class="space-y-1 space-x-1 md:space-y-1 md:space-x-1 md:flex gap-2 justify-start"
    >
      <v-btn
        prepend-icon="mdi-family-tree"
        variant="flat"
        :loading="isExporting"
        @click="handleExport"
        class="bg-amber-300 dark:bg-amber-500 text-sm"
        >Export Data Karyawan</v-btn
      >

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
          <span class="font-weight-medium">{{ errorMessage }}</span>
        </div>
        <template v-slot:actions>
          <v-btn
            variant="text"
            icon="mdi-close"
            @click="showErrorSnackbar = false"
          ></v-btn>
        </template>
      </v-snackbar>

      <v-btn
        @click="isDialogImport = true"
        prepend-icon="mdi-file-import"
        variant="flat"
        class="bg-teal-500 dark:bg-teal-500 text-sm text-white"
        >Import Data Karyawan</v-btn
      >
      <v-btn
        to="/master/employee/create"
        prepend-icon="mdi-plus"
        variant="flat"
        class="bg-sky-500 dark:bg-sky-500 text-sm text-white"
        >Tambah Data</v-btn
      >

      <v-btn
        prepend-icon="mdi-reload"
        variant="flat"
        class="bg-red-500 dark:bg-red-500 text-sm text-white"
        :loading="userStore.isLoadingWarningReset"
        @click="handleResetWarning"
      >
        Reset Info Peringatan
      </v-btn>
    </div>
    <div v-if="isVisible('back')">
      <v-btn
        @click="handleBack"
        prepend-icon="mdi-keyboard-backspace"
        variant="flat"
        class="bg-gray-500 dark:bg-gray-500 text-sm text-white"
        >Kembali</v-btn
      >
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { useImportUserStore } from "@/stores/import-user.store";
import { useUserStore } from "@/stores/user.store";
import { useConfirmDialog } from "@/composables/useConfirmDialog"; // Import Composable Dialog Konfirmasi
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores/app";

const router = useRouter();
const userStore = useUserStore();
const appStore = useAppStore(); // Inisialisasi AppStore
const importUserStore = useImportUserStore();
const { ask } = useConfirmDialog(); // Deklarasi fungsi ask dari dialog konfirmasi

const { isDialogImport, isExporting, errorMessage } =
  storeToRefs(importUserStore);

const items = [
  { title: "Master", disabled: false, href: "/master" },
  { title: "Karyawan", disabled: true, href: "/master/karyawan" },
];

const props = defineProps({
  hideFields: {
    type: Array,
    default: () => [],
  },
});

const isVisible = (fieldName: string) => !props.hideFields.includes(fieldName);

const handleBack = () => {
  userStore.usersSelected = null;
  router.push("/master/employee");
};

const handleExport = async () => {
  await importUserStore.exportData();
};

// Fungsi Handler untuk Reset Warning dengan Konfirmasi & Snackbar
const handleResetWarning = async () => {
  // 1. Tampilkan dialog konfirmasi kustom Anda
  const confirmed = await ask({
    title: "Konfirmasi Reset Peringatan",
    message:
      "Apakah Anda yakin ingin mereset data peringatan karyawan? </br>Semua data status peringatan yang <b>sudah melewati tanggal selesai (kedaluwarsa)</b> akan dikosongkan secara massal.",
    confirmText: "Ya, Reset",
    cancelText: "Batal",
    color: "red-darken-1", // Menyesuaikan preferensi warna merah
  });

  // Jika user menekan tombol Batal, hentikan eksekusi
  if (!confirmed) return;

  try {
    // 2. Jalankan proses reset API ke Laravel via Pinia Store
    const res = await userStore.autoResetUserWarning();

    if (res.success) {
      // 3. Tampilkan pesan sukses di v-snackbar global milik appStore
      appStore.successMessage = `${res.message} (Total: ${res.data.total_reset} karyawan berhasil di-reset).`;
      appStore.showSuccessSnackbar = true;

      // 4. Refresh datatable list karyawan agar perubahan langsung terlihat di layar
      userStore.fetchUsers();
    }
  } catch (err: any) {
    // Jika gagal, tampilkan pesan error store ke snackbar lokal/error di header
    errorMessage.value =
      userStore.resetWarningError || "Gagal memproses reset peringatan user.";
  }
};

const showErrorSnackbar = computed({
  get: () => !!errorMessage.value,
  set: (val) => {
    if (!val) {
      errorMessage.value = null;
    }
  },
});
</script>

<style scoped>
:deep(.v-breadcrumbs-item--disabled) {
  color: #615fff !important;
  opacity: 1;
}
:deep(.v-breadcrumbs-item) {
  padding: 0;
}
</style>
