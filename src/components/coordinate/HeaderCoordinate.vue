<template>
  <v-card class="p-3 rounded-lg shadow-md space-y-5 w-full">
    <div
      class="space-y-3 md:space-y-0 md:flex items-center justify-between mb-0"
    >
      <div>
        <p class="text-lg font-bold m-0 text-indigo-500">Koordinat Absen</p>
        <v-breadcrumbs
          :items="items"
          class="m-0 p-0 text-gray-500 dark:text-gray-300 text-sm"
        ></v-breadcrumbs>
      </div>

      <v-text-field
        v-model="coordinateStore.coordinateParams.search"
        placeholder="Cari nama / koordinat..."
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="compact"
        hide-details
        clearable
        style="max-width: 300px"
        @input="onSearch"
        @click:clear="onClear"
      />
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { useCoordinateStore } from "@/stores/coordinates.store";

const coordinateStore = useCoordinateStore();

const items = [
  { title: "Setting", disabled: false, href: "/setting" },
  { title: "Koordinat Absen", disabled: true, href: "/setting/coordinate" },
];

let searchTimeout: ReturnType<typeof setTimeout> | null = null;

function onSearch() {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    coordinateStore.coordinateParams.start = 0;
    coordinateStore.coordinateParams.draw = 1;
    coordinateStore.fetchCoordinates();
  }, 400);
}

function onClear() {
  coordinateStore.coordinateParams.search = "";
  coordinateStore.coordinateParams.start = 0;
  coordinateStore.coordinateParams.draw = 1;
  coordinateStore.fetchCoordinates();
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
