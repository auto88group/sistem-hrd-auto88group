<template>
  <v-card
    class="p-3 rounded-lg shadow-md space-y-3 md:space-y-0 md:flex w-full items-center justify-between"
  >
    <div>
      <p class="text-lg font-bold m-0 text-indigo-500">Hari Libur</p>
      <v-breadcrumbs
        :items="items"
        class="m-0 p-0 text-gray-500 dark:text-gray-300 text-sm"
      ></v-breadcrumbs>
    </div>
    <div
      class="space-y-1 space-x-1 md:space-y-1 md:space-x-1 md:flex gap-2 justify-start"
    >
      <v-btn
        @click="handleAdd()"
        prepend-icon="mdi-plus"
        variant="flat"
        class="bg-sky-500 dark:bg-sky-500 text-sm text-white"
        >Tambah Data</v-btn
      >
    </div>
  </v-card>
</template>

<script setup lang="ts">
const emit = defineEmits(["add"]);
const items = [
  { title: "Pengaturan", disabled: false, href: "/setting" },
  { title: "Hari Libur", disabled: true, href: "/setting/holiday" },
];
function handleAdd() {
  emit("add");
}
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
