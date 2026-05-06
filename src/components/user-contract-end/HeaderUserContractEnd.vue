<template>
  <v-card
    class="p-3 rounded-lg shadow-md space-y-3 md:space-y-0 md:flex w-full items-center justify-between"
  >
    <div>
      <p class="text-lg font-bold m-0 text-indigo-500">
        Daftar Karyawan Habis Kontrak
      </p>
      <v-breadcrumbs
        :items="items"
        class="m-0 p-0 text-gray-500 dark:text-gray-300 text-sm"
      ></v-breadcrumbs>
    </div>
    <div
      class="space-y-1 space-x-1 md:space-y-1 md:space-x-1 md:flex gap-2 justify-start"
    >
      <v-btn
        to="/dashboard/personnel"
        prepend-icon="mdi-keyboard-backspace"
        variant="flat"
        class="bg-gray-500 dark:bg-gray-500 text-sm text-white"
        >Kembali</v-btn
      >
      <v-btn
        prepend-icon="mdi-download"
        variant="flat"
        class="bg-teal-500 dark:bg-teal-500 text-sm text-white"
        >Cetak Data</v-btn
      >
    </div>
  </v-card>
</template>

<script setup lang="ts">
const items = [
  { title: "Kepegawaian", disabled: false, href: "/dashboard/personnel" },
  {
    title: "Daftar Karyawan Habis Kontrak",
    disabled: true,
    href: "/dashboard/personnel",
  },
];
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
