<template>
  <div class="space-y-3">
    <v-data-table-server
      v-model:items-per-page="store.params.length"
      :headers="headers as any"
      :items="store.remainingLeave"
      :items-length="store.totalRecords"
      :loading="store.isLoading"
      item-value="user_id"
      class="elevation-1 custom-header-table"
      @update:options="onTableOptionsChange"
    >
      <template #[`item.no`]="{ item }">
        {{ item.DT_RowIndex }}
      </template>

      <template #[`item.name`]="{ item }">
        <span class="font-bold text-blue-500 dark:text-blue-300">{{
          formatName(item)
        }}</span>
      </template>

      <template #[`item.branch_name`]="{ item }">
        <div class="flex flex-col whitespace-nowrap">
          <span class="font-bold">
            {{ item.branch_alias }} ({{ item.branch_code }})
          </span>
          <span class="text-sm text-gray-500 dark:text-gray-300">{{
            item.branch_name
          }}</span>
        </div>
      </template>
      <template #[`item.join_date`]="{ item }">
        {{ item.join_date ? toFullDate(item.join_date) : "-" }}
      </template>

      <template #[`item.remaining_leave`]="{ item }">
        <!-- Jika join_date tidak null dan belum 1 tahun, tampilkan "-" -->
        <span
          v-if="isBelowOneYear(item.join_date)"
          class="text-gray-400 font-bold"
        >
          -
        </span>
        <span v-else class="font-bold">
          {{ item.remaining_leave }}
        </span>
      </template>

      <template #[`item.valid_until`]="{ item }">
        <span v-if="item.valid_until" class="text-sm whitespace-nowrap">
          {{ formatDate(item.valid_until) }}
          <v-chip
            :color="chipColor(item.valid_until)"
            size="small"
            class="ml-1"
          >
            {{ timeUntil(item.valid_until) }}
          </v-chip>
        </span>
        <span v-else class="text-gray-400">-</span>
      </template>

      <template #[`item.actions`]="{ item }">
        <!-- Sembunyikan aksi jika belum 1 tahun -->
        <v-btn
          v-if="!isBelowOneYear(item.join_date)"
          icon
          color="text-blue-500"
          variant="tonal"
          size="x-small"
          :to="'/master/remaining-leave/' + item.id + '/detail/'"
          router
        >
          <v-icon>mdi-information-outline</v-icon>
        </v-btn>
      </template>
    </v-data-table-server>
  </div>
</template>

<script setup lang="ts">
import { useDateFormatter } from "@/composables/UseDateFormatter";
import { useFormatName } from "@/composables/useFormatName";
import { useRemainingLeaveStore } from "@/stores/remaining-leave.store";
import { onMounted } from "vue";

const { toFullDate } = useDateFormatter();
const store = useRemainingLeaveStore();
const { formatName } = useFormatName();

const headers = [
  { title: "No", key: "no", sortable: false, width: "60px" },
  { title: "Nama", key: "name", sortable: true },
  { title: "Cabang", key: "branch_name", sortable: true },
  { title: "Jabatan", key: "position", sortable: true },
  { title: "Tgl Masuk", key: "join_date", sortable: true },
  { title: "Saldo Cuti", key: "remaining_leave", sortable: true },
  { title: "Valid Hingga", key: "valid_until", sortable: true },
  { title: "Aksi", key: "actions", sortable: false, align: "end" },
];

function timeUntil(dateStr: string): string {
  const target = new Date(dateStr);
  const today = new Date();
  target.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const totalDays = Math.ceil(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (totalDays < 0) return `Lewat ${Math.abs(totalDays)} Hari`;
  if (totalDays === 0) return "Hari Ini";

  const months = Math.floor(totalDays / 30);
  const days = totalDays % 30;

  if (months > 0 && days > 0) return `Sisa ${months} Bulan ${days} Hari`;
  if (months > 0) return `Sisa ${months} Bulan`;
  return `Sisa ${days} Hari`;
}

function chipColor(dateStr: string): string {
  const target = new Date(dateStr);
  const today = new Date();
  target.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const totalDays = Math.ceil(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (totalDays <= 7) return "text-red-500 font-bold";
  if (totalDays <= 30) return "text-amber-800  font-bold";
  return "text-green-800 font-bold";
}

/**
 * Cek apakah join_date belum genap 1 tahun dari sekarang.
 * Jika join_date null → dianggap sudah 1 tahun (tampilkan normal).
 */
function isBelowOneYear(joinDate: string | null): boolean {
  if (!joinDate) return true;
  const join = new Date(joinDate);
  const oneYearLater = new Date(join);
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
  return new Date() < oneYearLater;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function onTableOptionsChange(options: any) {
  store.params.draw = (store.params.draw ?? 1) + 1;
  store.params.length = options.itemsPerPage;
  store.params.start = (options.page - 1) * options.itemsPerPage;

  if (options.sortBy.length > 0) {
    store.params.sortBy = options.sortBy[0].key;
    store.params.sortDirection = options.sortBy[0].order;
  } else {
    store.params.sortBy = "id";
    store.params.sortDirection = "asc";
  }

  store.fetchRemainingLeave();
}

onMounted(() => store.fetchRemainingLeave());
</script>

<style scoped>
:deep(.custom-header-table thead) {
  background-color: #e3f2fd;
}
:deep(.v-theme--dark .custom-header-table thead) {
  background-color: #1a237e;
}
:deep(.custom-header-table thead th) {
  font-weight: bold !important;
  color: #1976d2 !important;
}
:deep(.v-theme--dark .custom-header-table thead th) {
  color: #bbdefb !important;
}
</style>
