<template>
  <v-data-table-server
    v-model:items-per-page="store.params.length"
    :headers="headers"
    :items="store.shiftSchedule"
    :items-length="store.totalRecords"
    :loading="store.isLoading"
    item-value="user_id"
    fixed-header
    @update:options="onUpdateOptions"
  >
    <template v-for="header in headers" #[`header.${header.key}`]="{ column }">
      <v-tooltip v-if="getHolidayNote(header.key)" location="top">
        <template #activator="{ props }">
          <span v-bind="props" class="cursor-help">
            {{ column.title }}
          </span>
        </template>
        <span>🗓️ {{ getHolidayNote(header.key) }}</span>
      </v-tooltip>

      <!-- Kalau bukan holiday, tampil biasa tanpa tooltip -->
      <span v-else>{{ column.title }}</span>
    </template>
    <!-- Kolom Nama -->
    <template #item.user_name="{ item }">
      <span class="font-bold text-blue-500 dark:text-blue-300">{{
        formatName({ name: item.user_name, full_name: item.user_full_name })
      }}</span>
    </template>

    <!-- Kolom Team -->
    <template #item.branch_team="{ item }">
      <v-chip size="small" variant="tonal">
        {{ item.branch_team }}
      </v-chip>
    </template>

    <!-- Kolom Cabang -->
    <template #item.branch_name="{ item }">
      <span class="text-nowrap">{{ item.branch_name }}</span>
    </template>

    <!-- Kolom Tanggal Dinamis -->

    <template
      v-for="dateKey in dateColumns"
      :key="dateKey"
      #[`item.${dateKey}`]="{ item }"
    >
      <div class="text-center">
        <v-menu location="top">
          <template #activator="{ props }">
            <v-chip
              v-bind="props"
              v-if="item[dateKey]"
              size="small"
              color="text-green-700 dark:text-green-300"
              variant="tonal"
            >
              {{ item[dateKey]?.split(",")[1]?.trim() }}
            </v-chip>

            <span v-else class="text-disabled text-body-2">-</span>
          </template>

          <!-- POPUP CONTENT -->
          <v-card min-width="200" class="p-2">
            <div class="text-caption">
              <div><b>Nama:</b> {{ item[dateKey]?.split(",")[2]?.trim() }}</div>
              <div>
                <b>In:</b>
                {{
                  item[dateKey]?.split(",")[3]?.trim().substring(0, 5) || "-"
                }}
              </div>
              <div>
                <b>Out:</b>
                {{
                  item[dateKey]?.split(",")[4]?.trim().substring(0, 5) || "-"
                }}
              </div>
            </div>

            <v-divider class="my-2" />

            <div class="flex justify-end gap-2">
              <v-btn
                size="small"
                color="text-amber-600"
                variant="tonal"
                @click="handleEdit(item, dateKey)"
              >
                Edit
              </v-btn>

              <v-btn
                size="small"
                color="text-red-600"
                variant="tonal"
                :loading="store.isLoadingDestroy"
                @click="onDelete(item, dateKey)"
              >
                Hapus
              </v-btn>
            </div>
          </v-card>
        </v-menu>
      </div>
    </template>
  </v-data-table-server>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useShiftScheduleStore } from "@/stores/shift-schedule.store";
import { useFormatName } from "@/composables/useFormatName";

import { useDateFormatter } from "@/composables/UseDateFormatter";
import { useDisplay } from "vuetify";
import { useHolidayStore } from "@/stores/holiday.store";

const { toDayShortMonth } = useDateFormatter();
const { mdAndUp } = useDisplay();

const store = useShiftScheduleStore();
const holidayStore = useHolidayStore();
const { formatName } = useFormatName();

const emit = defineEmits(["edit"]);

const props = defineProps<{
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}>();

function isHoliday(dateStr: string): boolean {
  return holidayStore.holidayByMonth.some((item) => item.tanggal === dateStr);
}

function getHolidayNote(dateStr: string): string | null {
  const holiday = holidayStore.holidayByMonth.find(
    (item) => item.tanggal === dateStr,
  );
  return holiday ? holiday.note : null; // sesuaikan field nama dengan struktur data kamu
}
// Ambil kolom tanggal dari data pertama (key format YYYY-MM-DD)
const dateColumns = computed<string[]>(() => {
  if (!store.shiftSchedule.length) return [];
  const firstRow = store.shiftSchedule[0];
  return Object.keys(firstRow).filter((key) => /^\d{4}-\d{2}-\d{2}$/.test(key));
});

// Build headers secara dinamis
const headers = computed(() => {
  const staticHeaders = [
    {
      title: "No",
      key: "DT_RowIndex",
      sortable: false,
      width: "60",
      fixed: true,
    },
    {
      title: "Nama",
      key: "user_name",
      sortable: false,
      width: "140",
      fixed: true,
    },
    {
      title: "Cabang",
      key: "branch_name",
      sortable: false,
      width: "180",
      fixed: mdAndUp.value,
    },
    {
      title: "Departemen / Team",
      key: "branch_team",
      sortable: false,
      minWidth: "160",
    },
  ];

  const dateHeaders = dateColumns.value.map((dateKey) => ({
    title: formatDateHeader(dateKey),
    key: dateKey,
    sortable: false,
    align: "center" as const,
    width: "100",
    nowrap: true,
    headerProps: isHoliday(dateKey) ? { class: "!text-black !bg-red-200" } : {},
    cellProps: isHoliday(dateKey) ? { class: "!text-black !bg-red-200" } : {},
  }));

  return [...staticHeaders, ...dateHeaders];
});

// Format header tanggal: "2026-04-01" → "01\nApr"
function formatDateHeader(dateStr: string): string {
  return toDayShortMonth(dateStr);
}

// Handle pagination dari v-data-table-server
function onUpdateOptions(options: { page: number; itemsPerPage: number }) {
  store.params.start = (options.page - 1) * options.itemsPerPage;
  store.params.length = options.itemsPerPage;
  store.fetchShiftSchedule();
}

function handleEdit(item: any, dateKey: string) {
  const raw = item[dateKey];

  if (!raw) return;

  const parts = raw.split(",").map((v: string) => v.trim());

  if (parts.length < 6) return;

  const result = {
    id: Number(parts[0]) || 0,
    hrd_master_shift_id: Number(parts[5]) || 0,
  };

  emit("edit", result);
}

function onDelete(item: any, dateKey: string) {
  let id = item[dateKey]?.split(",")[0]?.trim();
  store.destroy(id);
  props.showSuccess("Data berhasil dihapus.");
  store.fetchShiftSchedule();
}

onMounted(() => {
  store.fetchShiftSchedule();
  holidayStore.fetchHolidayByMonth();
});
</script>

<style scoped>
:deep(.v-data-table__wrapper) {
  overflow-x: auto;
}

/* Shadow di kolom fixed terakhir */
:deep(th.v-data-table__th--fixed-last),
:deep(td.v-data-table__td--fixed-last) {
  box-shadow: 4px 0 6px -2px rgba(0, 0, 0, 0.15);
}

:deep(.v-data-table__thead .v-data-table__td) {
  background-color: #e3f2fd;
  color: #1976d2;
}

:deep(.v-theme--dark > thead.v-data-table__thead th.v-data-table__td) {
  background-color: #1a237e;
  color: #bbdefb;
}

/* :deep(.v-data-table-header__content) {
  width: fit-content;
  white-space: nowrap;
} */
</style>
