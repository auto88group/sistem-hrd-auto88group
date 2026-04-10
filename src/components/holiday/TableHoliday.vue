<template>
  <div class="space-y-3">
    <div class="flex justify-end gap-3">
      <!-- Select Bulan -->
      <v-select
        v-model="selectedMonth"
        :items="months"
        item-title="title"
        item-value="value"
        placeholder="Pilih bulan"
        variant="outlined"
        density="compact"
        bg-color="bg-white dark:bg-slate-900"
        clearable
        hide-details
        class="max-w-xs"
        @update:model-value="triggerSearch"
      />
      <v-text-field
        v-model="searchQuery"
        placeholder="Cari hari..."
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="compact"
        bg-color="bg-white dark:bg-slate-900"
        clearable
        hide-details
        class="max-w-xs"
        @update:model-value="triggerSearch"
        @click:clear="onClear"
      />
    </div>
    <v-data-table-server
      :headers="headers as any"
      :items="holiday"
      :items-length="holidayStore.totalRecords"
      :items-per-page="holidayStore.params.length"
      :loading="holidayStore.isLoading"
      class="elevation-1 custom-header-table"
      @update:options="onTableOptionsChange"
    >
      <template #[`item.no`]="{ index }">
        {{ (holidayStore.params.start ?? 0) + index + 1 }}
      </template>
      <template #[`item.tanggal`]="{ item }">
        {{ toFullDate(item.tanggal) }}
      </template>

      <template #[`item.actions`]="{ item }">
        <div class="flex justify-end items-center gap-1">
          <v-btn
            icon="mdi-delete-outline"
            variant="text"
            density="comfortable"
            @click="handleDelete(item.id)"
            :loading="holidayStore.isLoadingDestroy"
            class="!text-red-500 hover:!bg-red-50 transition-all duration-300"
          />
        </div>
      </template>
    </v-data-table-server>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import { useHolidayStore } from "@/stores/holiday.store";
import { useDateFormatter } from "@/composables/UseDateFormatter";

const { toFullDate } = useDateFormatter();
const holidayStore = useHolidayStore();

const selectedMonth = ref<number | null>(null);

const months = [
  { title: "Januari", value: 1 },
  { title: "Februari", value: 2 },
  { title: "Maret", value: 3 },
  { title: "April", value: 4 },
  { title: "Mei", value: 5 },
  { title: "Juni", value: 6 },
  { title: "Juli", value: 7 },
  { title: "Agustus", value: 8 },
  { title: "September", value: 9 },
  { title: "Oktober", value: 10 },
  { title: "November", value: 11 },
  { title: "Desember", value: 12 },
];

const holiday = computed(() => holidayStore.holiday);

const props = defineProps<{
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  ask: (options: any) => Promise<boolean>;
}>();

const searchQuery = ref("");
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

function triggerSearch() {
  if (searchTimeout) clearTimeout(searchTimeout);

  searchTimeout = setTimeout(() => {
    holidayStore.params.search = searchQuery.value ?? "";
    holidayStore.params.month = selectedMonth.value ?? undefined;
    holidayStore.params.start = 0;
    holidayStore.fetchHoliday();
  }, 400);
}

function onSearch(value: string | null) {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    holidayStore.params.search = value ?? "";
    holidayStore.params.start = 0;
    holidayStore.fetchHoliday();
  }, 400);
}

function onClear() {
  searchQuery.value = "";
  selectedMonth.value = null;

  holidayStore.params.search = "";
  holidayStore.params.month = undefined;
  holidayStore.params.start = 0;

  holidayStore.fetchHoliday();
}

const headers = [
  { title: "No", key: "no", sortable: false, width: "60px" },
  { title: "Tanggal", key: "tanggal", sortable: false },
  { title: "Catatan", key: "note", sortable: false },
  { title: "Aksi", key: "actions", sortable: false, align: "end" },
];

function onTableOptionsChange(options: { page: number; itemsPerPage: number }) {
  holidayStore.params.length = options.itemsPerPage;
  holidayStore.params.start = (options.page - 1) * options.itemsPerPage;
  holidayStore.fetchHoliday();
}

onMounted(() => {
  holidayStore.fetchHoliday();
  console.log(holiday.value);
});

async function handleDelete(id: number) {
  const confirmed = await props.ask({
    title: "Hapus Hari Libur",
    message: "Data ini akan dihapus. Lanjutkan?",
    confirmText: "Ya, Hapus",
    color: "red-darken-1",
  });
  if (confirmed) deleteHoliday(id);
}

async function deleteHoliday(id: number) {
  try {
    await holidayStore.destroyHoliday(id);
    props.showSuccess("Data hari libur berhasil dihapus.");
  } catch (err: any) {
    props.showError(err?.message ?? "Gagal menghapus data hari libur.");
  }
}
</script>
<style scoped>
/* Gunakan deep selector agar tembus ke dalam komponen Vuetify */
:deep(.custom-header-table thead) {
  background-color: #e3f2fd; /* Blue lighten-5 (sangat lembut) */
}

/* Penyesuaian untuk Dark Theme */
:deep(.v-theme--dark .custom-header-table thead) {
  background-color: #1a237e; /* Biru gelap yang lembut untuk mata */
}

:deep(.custom-header-table thead th) {
  font-weight: bold !important;
  /* Jika ingin warna teks biru tua di light mode */
  color: #1976d2 !important;
}

:deep(.v-theme--dark .custom-header-table thead th) {
  color: #bbdefb !important;
}
</style>
