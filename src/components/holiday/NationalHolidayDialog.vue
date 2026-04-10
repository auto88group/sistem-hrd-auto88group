<template>
  <v-dialog v-model="dialog" max-width="500" scrollable persistent>
    <v-card rounded="lg">
      <v-card-title class="flex items-center gap-2 px-6 pt-5 pb-0">
        <v-icon icon="mdi-flag" />
        <span class="text-base font-bold">Pilih Libur Nasional</span>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" @click="dialog = false" />
      </v-card-title>

      <v-card-subtitle class="px-6 pb-3">
        <div class="flex items-center gap-1 text-warning font-medium">
          <v-icon icon="mdi-alert-circle-outline" size="small" />
          <span>Periksa lagi tanggal yang dipilih karena belum tentu valid</span>
        </div>
      </v-card-subtitle>

      <v-divider />

      <!-- Loading -->
      <v-card-text
        v-if="holidayStore.isLoadingPublicHolidays"
        class="flex justify-center py-8"
      >
        <v-progress-circular indeterminate color="primary" />
      </v-card-text>

      <!-- List -->
      <v-card-text v-else class="p-0">
        <!-- Select All -->
        <div class="px-4 py-2 border-b">
          <v-checkbox
            v-model="selectAll"
            label="Pilih Semua"
            density="compact"
            hide-details
            color="primary"
            @change="toggleSelectAll"
          />
        </div>

        <v-list lines="one" class="py-0">
          <v-list-item
            v-for="item in holidayStore.publicHolidays"
            :key="item.date"
            class="border-b"
          >
            <template #prepend>
              <v-checkbox
                v-model="selectedPublicHolidays"
                :value="item"
                density="compact"
                hide-details
                color="primary"
                @change="updateSelectAll"
              />
            </template>
            <v-list-item-title class="text-sm font-medium">
              {{ item.name }}
            </v-list-item-title>
            <v-list-item-subtitle class="text-xs">
              {{ formatDate(item.date) }}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-divider />

      <v-card-actions class="justify-between px-4">
        <span class="text-sm text-gray-500">
          {{ selectedPublicHolidays.length }} item dipilih
        </span>
        <div class="flex gap-2">
          <v-btn variant="outlined" @click="dialog = false">Batal</v-btn>
          <v-btn
            color="primary"
            :disabled="selectedPublicHolidays.length === 0"
            @click="handleAdd"
          >
            Tambahkan
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useHolidayStore } from "@/stores/holiday.store";
import type { PublicHoliday } from "@/api/modules/holiday.api";

export interface SelectedHolidayItem {
  tanggal: string;
  note: string;
}

const emit = defineEmits<{
  added: [items: SelectedHolidayItem[]];
}>();

const holidayStore = useHolidayStore();

const dialog = ref(false);
const selectedPublicHolidays = ref<PublicHoliday[]>([]);
const selectAll = ref(false);

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function toggleSelectAll() {
  if (selectAll.value) {
    selectedPublicHolidays.value = [...holidayStore.publicHolidays];
  } else {
    selectedPublicHolidays.value = [];
  }
}

function updateSelectAll() {
  selectAll.value =
    selectedPublicHolidays.value.length === holidayStore.publicHolidays.length;
}

async function open() {
  selectedPublicHolidays.value = [];
  selectAll.value = false;
  dialog.value = true;

  if (holidayStore.publicHolidays.length === 0) {
    await holidayStore.fetchPublicHolidays();
  }
}

function handleAdd() {
  const items: SelectedHolidayItem[] = selectedPublicHolidays.value.map((item) => ({
    tanggal: item.date,
    note: item.name,
  }));

  emit("added", items);
  dialog.value = false;
}

defineExpose({ open });
</script>
