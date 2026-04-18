<template>
  <div class="space-y-3 p-3 bg-white dark:bg-gray-900 rounded-lg shadow-md">
    <filter-remaining-lave-detail :employeeId="employeeId" />
    <v-data-table-server
      v-model:items-per-page="remainingLeaveStore.detailParams.length"
      :headers="headers as any"
      :items="remainingLeaveStore.historySelected"
      :items-length="remainingLeaveStore.detailTotalRecords"
      :loading="remainingLeaveStore.isLoadingDetail"
      item-value="leave_balance_history_id"
      class="elevation-0 custom-header-table"
      @update:options="onTableOptionsChange"
    >
      <template #[`item.no`]="{ index }">
        {{ (remainingLeaveStore.detailParams.start ?? 0) + index + 1 }}
      </template>

      <template #[`item.created_at`]="{ item }">
        <span class="font-bold text-blue-500 dark:text-blue-300">{{
          toFullDate(item.created_at)
        }}</span>
      </template>

      <template #[`item.type`]="{ item }">
        <v-chip :color="typeColor(item.type)" variant="tonal" class="font-bold">
          {{ typeLabel(item.type) }}
        </v-chip>
      </template>

      <template #[`item.reference_id`]="{ item }">
        <v-btn
          v-if="item.reference_id"
          prepend-icon="mdi-link"
          variant="flat"
          @click="openReferenceLeave(item.reference_id)"
          class="bg-amber-500 dark:bg-amber-800 text-sm text-white"
        >
          Lihat Referensi</v-btn
        >
        <span v-else>-</span>
      </template>

      <template #[`item.change_amount`]="{ item }">
        <v-chip
          :color="amountColor(item.change_amount)"
          variant="tonal"
          class="font-bold"
        >
          {{ item.change_amount }}
        </v-chip>
      </template>

      <template #[`item.notes`]="{ item }">
        {{ item.notes }}
      </template>

      <template #[`item.created_name`]="{ item }">
        {{
          item.created_name
            ? formatName({
                name: item.created_name,
                full_name: item.created_full_name,
              })
            : "Sistem"
        }}
      </template>

      <template #[`item.balance_after`]="{ item }">
        <div class="flex flex-col gap-1.5 py-2 min-w-[160px]">
          <div
            class="flex items-center justify-between px-2.5 py-1 bg-emerald-50 rounded-lg border border-emerald-100"
          >
            <span
              class="text-[10px] font-medium uppercase tracking-wider text-emerald-500"
              >Sesudah</span
            >
            <span class="text-xs font-bold text-emerald-700">
              {{ item.balance_after }}
            </span>
          </div>
          <div
            class="flex items-center justify-between px-2.5 py-1 bg-slate-50 rounded-lg border border-slate-100"
          >
            <span
              class="text-[10px] font-medium uppercase tracking-wider text-slate-400"
              >Sebelum</span
            >
            <span class="text-xs font-semibold text-slate-600">
              {{ item.balance_before }}
            </span>
          </div>
        </div>
      </template>
    </v-data-table-server>
  </div>
</template>
<script setup lang="ts">
import { useDateFormatter } from "@/composables/UseDateFormatter";
import { useFormatName } from "@/composables/useFormatName";
import { useLeaveBalanceType } from "@/composables/UseLeaveBalanceType";
import { useRemainingLeaveStore } from "@/stores/remaining-leave.store";
import { onMounted } from "vue";
import FilterRemainingLaveDetail from "./FilterRemainingLaveDetail.vue";
import { useLeaveRequestStore } from "@/stores/leave-request.store";
import { useAppStore } from "@/stores/app";

const { formatName } = useFormatName();
const { toFullDate } = useDateFormatter();
const { typeLabel, typeColor, amountColor } = useLeaveBalanceType();
const props = defineProps({
  employeeId: {
    type: Number,
    required: true,
  },
});

const appStore = useAppStore();
const remainingLeaveStore = useRemainingLeaveStore();
const leaveRequestStore = useLeaveRequestStore();
const headers = [
  { title: "No", key: "no", sortable: false, width: "60px" },
  { title: "Tanggal", key: "created_at", sortable: false },
  { title: "Jenis", key: "type", sortable: false },
  { title: "Catatan", key: "notes", sortable: false },
  { title: "Perubahan (+/-)", key: "change_amount", sortable: false },
  { title: "Referensi", key: "reference_id", sortable: false },
  { title: "Dibuat Oleh", key: "created_name", sortable: false },
  { title: "Keterangan", key: "balance_after", sortable: false },
];

function onTableOptionsChange(options: { page: number; itemsPerPage: number }) {
  remainingLeaveStore.detailParams.length = options.itemsPerPage;
  remainingLeaveStore.detailParams.start =
    (options.page - 1) * options.itemsPerPage;
  remainingLeaveStore.fetchRemainingLeaveDetail(props.employeeId);
}

async function openReferenceLeave(id: any) {
  try {
    leaveRequestStore.infoDialog = true;
    await leaveRequestStore.fetchLeaveRequestSelected(id);
  } catch (error) {
    appStore.showErrorSnackbar = true;
    appStore.errorMessage = "Gagal mengambil data: " + error;
  }
}
onMounted(() => {
  remainingLeaveStore.fetchRemainingLeaveDetail(props.employeeId);
});
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
