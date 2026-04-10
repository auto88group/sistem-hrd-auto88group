<template>
  <v-card class="p-3 rounded-lg shadow-md space-y-5 w-full">
    <div class="space-y-3 md:space-y-0 md:flex items-center justify-between">
      <div>
        <p class="text-lg font-bold m-0 text-indigo-500">Jadwal Shift</p>
        <v-breadcrumbs
          :items="items"
          class="m-0 p-0 text-gray-500 dark:text-gray-300 text-sm"
        ></v-breadcrumbs>
      </div>

      <div
        class="space-y-1 space-x-1 md:space-y-1 md:space-x-1 md:flex gap-2 justify-start"
      >
        <v-btn
          prepend-icon="mdi-upload"
          variant="flat"
          class="bg-green-500 dark:bg-green-500 text-sm text-white"
        >
          Import Data Shift</v-btn
        >
        <v-btn
          @click="handleAdd()"
          prepend-icon="mdi-plus"
          variant="flat"
          class="bg-sky-500 dark:bg-sky-500 text-sm text-white"
          >Tambah Data</v-btn
        >
      </div>
    </div>
    <filter-shift-schedule />
  </v-card>
</template>

<script setup lang="ts">
import FilterShiftSchedule from "./FilterShiftSchedule.vue";

const emit = defineEmits(["add"]);

const items = [
  { title: "Master", disabled: false, href: "/master" },
  { title: "Jadwal Shift", disabled: true, href: "/master/shift-schedule" },
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
