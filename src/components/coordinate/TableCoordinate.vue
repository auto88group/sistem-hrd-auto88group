<template>
  <div>
    <v-card style="position: relative">
      <!-- <v-overlay
        :model-value="coordinateStore.isLoading"
        contained
        class="flex items-center justify-center backdrop-blur-sm"
      >
        <v-progress-circular indeterminate class="text-blue-500" size="50" />
      </v-overlay> -->

      <v-data-table-server
        :headers="headers"
        :items="coordinateStore.coordinates"
        :items-length="coordinateStore.recordsFiltered"
        :loading="coordinateStore.isLoading"
        :items-per-page="coordinateStore.coordinateParams.length"
        @update:options="onUpdateOptions"
      >
        <!-- No -->
        <template #item.DT_RowIndex="{ item }">
          {{ item.DT_RowIndex }}
        </template>

        <template #item.location="{ item }">
          <div class="text-sm">
            <div>Lat: {{ item.latitude }}</div>
            <div>Long: {{ item.longitude }}</div>
            <v-btn
              size="x-small"
              variant="tonal"
              color="text-green-700"
              prepend-icon="mdi-map-marker"
              :href="`https://www.google.com/maps?q=${item.latitude},${item.longitude}`"
              target="_blank"
              class="my-1"
            >
              Lihat Lokasi
            </v-btn>
          </div>
        </template>

        <!-- Overtime quota -->
        <template #item.overtime_quota="{ item }">
          <v-chip
            :color="
              item.overtime_quota === 0 ? 'grey' : 'text-blue-500 font-bold'
            "
            size="large"
            label
          >
            {{ item.overtime_quota }}
          </v-chip>
        </template>

        <!-- Accuracy -->
        <template #item.accuracy="{ item }">
          {{ item.accuracy }} Meter
        </template>

        <!-- tambah template actions -->
        <template #item.actions="{ item }">
          <v-btn
            size="x-small"
            variant="tonal"
            color="text-amber-600"
            icon="mdi-pencil"
            @click="coordinateStore.openEditDialog(item)"
          />
        </template>
      </v-data-table-server>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useCoordinateStore } from "@/stores/coordinates.store";

const coordinateStore = useCoordinateStore();

const headers = [
  { title: "No", key: "DT_RowIndex", sortable: false },
  { title: "Nama Lokasi", key: "name", sortable: true },
  { title: "Lokasi", key: "location", sortable: false },
  { title: "Akurasi", key: "accuracy", sortable: true },
  { title: "Kuota Lembur/Hari", key: "overtime_quota", sortable: true },
  { title: "Aksi", key: "actions", sortable: false },
];

function onUpdateOptions(options: any) {
  coordinateStore.coordinateParams.draw =
    (coordinateStore.coordinateParams.draw ?? 1) + 1;
  coordinateStore.coordinateParams.start =
    (options.page - 1) * options.itemsPerPage;
  coordinateStore.coordinateParams.length = options.itemsPerPage;

  if (options.sortBy.length > 0) {
    coordinateStore.coordinateParams.sortBy = options.sortBy[0].key;
    coordinateStore.coordinateParams.sortDirection = options.sortBy[0].order;
  } else {
    coordinateStore.coordinateParams.sortBy = "id";
    coordinateStore.coordinateParams.sortDirection = "asc";
  }

  coordinateStore.fetchCoordinates();
}

onMounted(() => {
  coordinateStore.fetchCoordinates();
});
</script>
