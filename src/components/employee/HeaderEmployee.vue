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
    <div class="grid grid-cols-1 md:grid-cols-3 gap-2 justify-start">
      <v-btn
        prepend-icon="mdi-family-tree"
        variant="flat"
        class="bg-amber-300 dark:bg-amber-500 text-sm"
        >Bagan Organisasi</v-btn
      >
      <v-btn
        prepend-icon="mdi-file-import"
        variant="flat"
        class="bg-teal-500 dark:bg-teal-500 text-sm"
        >Import Data Karyawan</v-btn
      >
      <v-btn
        prepend-icon="mdi-plus"
        variant="flat"
        class="bg-sky-500 dark:bg-sky-500 text-sm"
        >Tambah Data</v-btn
      >
    </div>
  </v-card>
</template>

<script setup lang="ts">
const items = [
  { title: "Master", disabled: false, href: "/master" },
  { title: "Karyawan", disabled: true, href: "/master/karyawan" },
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
