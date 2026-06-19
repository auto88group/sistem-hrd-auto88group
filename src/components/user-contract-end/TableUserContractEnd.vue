<template>
  <v-data-table-server
    :headers="headers as any"
    :items="userContractEnd"
    :items-length="totalRecords"
    :items-per-page="params.length"
    :loading="isLoading"
    class="elevation-1 custom-header-table"
    @update:options="onTableOptionsChange"
  >
    <template #[`item.no`]="{ index }">
      {{ (params.start ?? 0) + index + 1 }}
    </template>

    <template #[`item.name`]="{ item }">
      <ul class="list-none p-0">
        <li class="font-bold">
          {{
            formatName({
              name: item.name,
              full_name: item.full_name,
            })
          }}
        </li>
        <li class="text-gray-600">
          {{ item.employee_id }}
        </li>
      </ul>
    </template>

    <template #[`item.branch_name`]="{ item }">
      <div class="flex flex-col whitespace-nowrap">
        <span class="font-bold"> {{ item.branch_alias }}</span>
        <span class="text-sm text-gray-500 dark:text-gray-300">{{
          item.branch_name
        }}</span>
      </div>
    </template>
    <template #[`item.status_id`]="{ item }">
      <v-chip
        variant="tonal"
        :color="item.status_id === 1 ? 'text-amber-500' : 'text-blue-500'"
        class="font-semibold"
      >
        {{ item.status_id === 1 ? "Kontrak" : "Training" }}
      </v-chip>
    </template>

    <template #[`item.effective_start_date`]="{ item }">
      <span class="text-green-600 font-bold">{{
        toFullDateWithDay(item.effective_start_date)
      }}</span>
    </template>

    <template #[`item.effective_end_date`]="{ item }">
      <span
        :class="[
          'font-bold',
          isDatePassed(item.effective_end_date)
            ? 'text-red-600'
            : 'text-amber-600',
        ]"
      >
        {{ toFullDateWithDay(item.effective_end_date) }}
      </span>
    </template>

    <template #[`item.note`]="{ item }">
      <v-chip
        variant="tonal"
        :color="
          getDateDiffInfo(item.effective_end_date).isPassed
            ? 'text-red-500'
            : 'text-amber-700'
        "
        class="font-semibold"
      >
        {{ getDateDiffInfo(item.effective_end_date).text }}
      </v-chip>
    </template>

    <template #[`item.actions`]="{ item }">
      <div class="flex justify-end items-center gap-3">
        <v-btn
          :to="`/master/employee/detail/${item.id}`"
          target="_blank"
          icon="mdi-information-outline"
          variant="text"
          density="comfortable"
          class="!text-blue-600 hover:!bg-blue-50 transition-all duration-300"
        />
      </div>
    </template>
  </v-data-table-server>
</template>
<script setup lang="ts">
import { useDateFormatter } from "@/composables/UseDateFormatter";
import { useFormatName } from "@/composables/useFormatName";
import { useUserContractEndStore } from "@/stores/user-contract-end.store";
import { storeToRefs } from "pinia";

const userContractEndStore = useUserContractEndStore();
const { userContractEnd, totalRecords, params, isLoading } =
  storeToRefs(userContractEndStore);

const { toFullDateWithDay, getDateDiffInfo } = useDateFormatter();
const { formatName } = useFormatName();

const headers = [
  { title: "No", key: "no", sortable: false, align: "center" },
  { title: "Nama", key: "name", sortable: true },
  { title: "Cabang", key: "branch_name", sortable: true },
  { title: "Jabatan", key: "position", sortable: true },
  { title: "Status", key: "status_id", sortable: true },
  { title: "Tanggal Mulai", key: "effective_start_date", sortable: true },
  { title: "Tanggal Berakhir", key: "effective_end_date", sortable: true },
  { title: "Keterangan", key: "note", sortable: false },
  { title: "Aksi", key: "actions", sortable: false, align: "end" },
];

function isDatePassed(dateStr: string | null): boolean {
  if (!dateStr) return false;

  const inputDate = new Date(dateStr);
  const today = new Date();

  // set ke awal hari biar fair (00:00:00)
  today.setHours(0, 0, 0, 0);

  return inputDate < today;
}

function onTableOptionsChange(options: any) {
  params.value.draw = (params.value.draw ?? 1) + 1;
  params.value.length = options.itemsPerPage;
  params.value.start = (options.page - 1) * options.itemsPerPage;

  if (options.sortBy.length > 0) {
    params.value.sortBy = options.sortBy[0].key;
    params.value.sortDirection = options.sortBy[0].order;
  } else {
    params.value.sortBy = "effective_end_date";
    params.value.sortDirection = "asc";
  }

  userContractEndStore.fetchUsers();
}
</script>
