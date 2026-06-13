<template>
  <v-data-table-server
    :headers="headers as any"
    :items="employeeAttendanceRecap"
    :items-length="totalRecords"
    :items-per-page="recapParams.length"
    :loading="isLoading"
    class="elevation-1 custom-header-table"
    :row-props="getRowProps"
    @update:options="onTableOptionsChange"
  >
    <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
      <tr>
        <th rowspan="2">No</th>
        <th rowspan="2">Nama</th>
        <th rowspan="1" colspan="2" class="text-center">Cabang</th>
        <th rowspan="1" colspan="12" class="text-center">Rekap</th>
        <th rowspan="1" class="text-center" :colspan="recapDates.length">
          Tanggal
        </th>
      </tr>
      <tr>
        <th>Cabang</th>
        <th>Departemen/Team</th>
        <th>H</th>
        <th>T</th>
        <th>PC</th>
        <th>TAP</th>
        <th>I</th>
        <th title="Izin Telat">I.T</th>
        <th title="Izin Pulang Cepat">I.PC</th>
        <th>S</th>
        <th>C</th>
        <th>A</th>
        <th>Libur</th>
        <th class="text-nowrap">Total Jam Kerja</th>
        <th
          v-for="d in recapDates"
          :key="d.date"
          class="text-nowrap"
          :class="d.is_holiday ? 'bg-red-200' : ''"
        >
          <v-tooltip v-if="d.is_holiday" location="top">
            <template #activator="{ props }">
              <span v-bind="props" class="cursor-help">
                {{ toFullDateWithDay(d.date) }}
              </span>
            </template>
            <span>🗓️ {{ d.holiday_name }}</span>
          </v-tooltip>
          <span v-else>{{ toFullDateWithDay(d.date) }}</span>
        </th>
      </tr>
    </template>

    <template #[`item.no`]="{ index }">
      {{ (recapParams.start ?? 0) + index + 1 }}
    </template>

    <template #[`item.user_full_name`]="{ item }">
      <ul class="list-none p-0">
        <li class="font-bold">
          {{
            formatName({
              name: item.user_name,
              full_name: item.user_full_name,
            })
          }}
        </li>
        <li class="text-gray-600">
          {{ item.user_employee_id }}
        </li>
      </ul>
    </template>

    <template #[`item.branch_name`]="{ item }">
      <v-chip size="small" variant="tonal">{{ item.branch_name }}</v-chip>
    </template>

    <template #[`item.t`]="{ item }">
      <span class="text-nowrap">
        {{ item.t + " Kali (" + toReadableTime(item.t_duration) + ")" }}
      </span>
    </template>

    <template #[`item.pc`]="{ item }">
      <span class="text-nowrap">
        {{ item.pc + " Kali (" + toReadableTime(item.pc_duration) + ")" }}
      </span>
    </template>

    <template #[`item.i_telat`]="{ item }">
      <v-tooltip v-if="item.i_telat > 0" location="top">
        <template #activator="{ props }">
          <span v-bind="props" class="font-bold text-blue-500 cursor-pointer">
            {{ item.i_telat }}
          </span>
        </template>
        Izin Telat
      </v-tooltip>
      <span v-else>{{ item.i_telat }}</span>
    </template>

    <template #[`item.i_pc`]="{ item }">
      <v-tooltip v-if="item.i_pc > 0" location="top">
        <template #activator="{ props }">
          <span v-bind="props" class="font-bold text-blue-500 cursor-pointer">
            {{ item.i_pc }}
          </span>
        </template>
        Izin Pulang Cepat
      </v-tooltip>
      <span v-else>{{ item.i_pc }}</span>
    </template>

    <template #[`item.total_working_hour`]="{ item }">
      <span class="text-nowrap">
        {{ toReadableTime(item.total_working_hour) }}
      </span>
    </template>

    <!-- Kolom tanggal dinamis -->
    <template
      v-for="d in recapDates"
      :key="d.date"
      #[`item.daily.${d.date}`]="{ item }"
    >
      <div
        v-if="item.daily?.[d.date]"
        class="flex flex-wrap items-center justify-center gap-1"
      >
        <!-- Libur -->
        <v-tooltip
          v-if="
            item.daily[d.date].is_holiday &&
            !item.daily[d.date].is_hadir &&
            !item.daily[d.date].is_alpha
          "
          location="top"
        >
          <template v-slot:activator="{ props }">
            <span v-bind="props" class="font-bold text-gray-500 cursor-pointer"
              >L</span
            >
          </template>
          Libur
        </v-tooltip>

        <!-- Alpa -->
        <v-tooltip v-if="item.daily[d.date].is_alpha" location="top">
          <template v-slot:activator="{ props }">
            <span v-bind="props" class="font-bold text-red-500 cursor-pointer"
              >A</span
            >
          </template>
          {{ item.daily[d.date].is_shift ? "Alpa Di Shift Piket" : "Alpa" }}
        </v-tooltip>

        <!-- Leave full day -->
        <template
          v-for="lr in item.daily[d.date].lr_types.filter(
            (l) => l.lr_is_full_day == 1,
          )"
          :key="lr.lr_type_code"
        >
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <span
                v-bind="props"
                class="font-bold text-blue-500 cursor-pointer"
              >
                {{ lr.lr_type_code }}
              </span>
            </template>
            {{ lr.lr_type_name }} (Full Day)
          </v-tooltip>
        </template>

        <!-- Hadir -->
        <v-tooltip v-if="item.daily[d.date].is_hadir" location="top">
          <template v-slot:activator="{ props }">
            <span v-bind="props" class="font-bold text-green-500 cursor-pointer"
              >H</span
            >
          </template>
          Hadir
        </v-tooltip>

        <!-- Shift -->
        <v-tooltip
          v-if="item.daily[d.date].is_shift && item.daily[d.date].is_hadir"
          location="top"
        >
          <template v-slot:activator="{ props }">
            <span
              v-bind="props"
              class="font-bold text-purple-500 cursor-pointer"
            >
              {{ item.daily[d.date].shift_code }}
            </span>
          </template>
          {{ item.daily[d.date].shift_name }}
        </v-tooltip>

        <!-- Leave tidak full day -->
        <template
          v-for="lr in item.daily[d.date].lr_types.filter(
            (l) => l.lr_is_full_day == 0,
          )"
          :key="lr.lr_type_code"
        >
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <span
                v-bind="props"
                :class="[
                  'font-bold cursor-pointer',
                  lr.lr_type_id == 1 || lr.lr_type_id == 11
                    ? 'text-blue-500'
                    : 'text-green-500',
                ]"
              >
                {{ lr.lr_type_code }}
              </span>
            </template>
            {{ lr.lr_type_name }}
            <span v-if="lr.lr_type_id == 1"> (Izin Telat)</span>
            <span v-else-if="lr.lr_type_id == 11"> (Izin Pulang Cepat)</span>
            <span v-else> (Approved)</span>
          </v-tooltip>
        </template>

        <!-- Telat -->
        <v-tooltip v-if="item.daily[d.date].is_late" location="top">
          <template v-slot:activator="{ props }">
            <span v-bind="props" class="font-bold text-amber-500 cursor-pointer"
              >T</span
            >
          </template>
          Telat
          {{
            item.daily[d.date].late_duration
              ? ": " + item.daily[d.date].late_duration
              : ""
          }}
        </v-tooltip>

        <!-- Pulang Cepat -->
        <v-tooltip v-if="item.daily[d.date].is_pc" location="top">
          <template v-slot:activator="{ props }">
            <span v-bind="props" class="font-bold text-amber-500 cursor-pointer"
              >PC</span
            >
          </template>
          Pulang Cepat
          {{
            item.daily[d.date].pc_duration
              ? ": " + item.daily[d.date].pc_duration
              : ""
          }}
        </v-tooltip>

        <!-- Tidak Absen Pulang -->
        <v-tooltip v-if="item.daily[d.date].is_tap" location="top">
          <template v-slot:activator="{ props }">
            <span v-bind="props" class="font-bold text-amber-500 cursor-pointer"
              >TAP</span
            >
          </template>
          Tidak Absen Pulang
        </v-tooltip>

        <!-- Izin Telat (non-full day) -->
        <!-- <v-tooltip
          v-if="item.daily[d.date].is_izin_telat && !item.daily[d.date].is_late"
          location="top"
        >
          <template v-slot:activator="{ props }">
            <span v-bind="props" class="font-bold text-blue-500 cursor-pointer"
              >IT</span
            >
          </template>
          Izin Telat
        </v-tooltip> -->

        <!-- Izin Pulang Cepat (non-full day) -->
        <!-- <v-tooltip
          v-if="item.daily[d.date].is_izin_pc && !item.daily[d.date].is_pc"
          location="top"
        >
          <template v-slot:activator="{ props }">
            <span v-bind="props" class="font-bold text-blue-500 cursor-pointer"
              >IPC</span
            >
          </template>
          Izin Pulang Cepat
        </v-tooltip> -->
      </div>
      <span v-else class="text-gray-400">-</span>
    </template>
  </v-data-table-server>
</template>

<script setup lang="ts">
import { useDateFormatter } from "@/composables/UseDateFormatter";
import { useFormatName } from "@/composables/useFormatName";
import { useTimeFormatter } from "@/composables/useTimeFormatter";
import { useEmployeeAttendanceRequestStore } from "@/stores/employee-attendance.store";
import { storeToRefs } from "pinia";
import { computed } from "vue";

const { formatName } = useFormatName();
const { toReadableTime } = useTimeFormatter();
const { toFullDateWithDay } = useDateFormatter();

const employeeAttendanceStore = useEmployeeAttendanceRequestStore();
const {
  employeeAttendanceRecap,
  totalRecords,
  recapParams,
  isLoading,
  recapDates,
} = storeToRefs(employeeAttendanceStore);

// ── Static headers ───────────────────────────────────────────────────────────
const staticHeaders = [
  { title: "No", key: "no", width: "60", sortable: false },
  { title: "Nama", key: "user_full_name", nowrap: true, sortable: false },
  { title: "Branch", key: "branch_alias", nowrap: true, sortable: false },
  {
    title: "Departemen/Team",
    key: "branch_name",
    sortable: false,
    width: "160",
  },
  {
    title: "H",
    key: "h",
    sortable: false,
    align: "center" as const,
    width: "50",
  },
  {
    title: "T",
    key: "t",
    sortable: false,
    align: "center" as const,
    width: "140",
  },
  {
    title: "PC",
    key: "pc",
    sortable: false,
    align: "center" as const,
    width: "140",
  },
  {
    title: "TAP",
    key: "tap",
    sortable: false,
    align: "center" as const,
    width: "60",
  },
  {
    title: "I",
    key: "i",
    sortable: false,
    align: "center" as const,
    width: "50",
  },
  {
    title: "I.T",
    key: "i_telat",
    sortable: false,
    align: "center" as const,
    width: "50",
  },
  {
    title: "I.PC",
    key: "i_pc",
    sortable: false,
    align: "center" as const,
    width: "50",
  },
  {
    title: "S",
    key: "s",
    sortable: false,
    align: "center" as const,
    width: "50",
  },
  {
    title: "C",
    key: "c",
    sortable: false,
    align: "center" as const,
    width: "50",
  },
  {
    title: "A",
    key: "a",
    sortable: false,
    align: "center" as const,
    width: "50",
  },
  {
    title: "Libur",
    key: "holiday",
    sortable: false,
    align: "center" as const,
    width: "50",
  },
  {
    title: "Total Jam Kerja",
    key: "total_working_hour",
    sortable: false,
    align: "center" as const,
    minWidth: "120",
  },
];

// ── Dynamic date headers ─────────────────────────────────────────────────────
const dynamicDateHeaders = computed(() =>
  (recapDates.value ?? []).map((d) => ({
    title: toFullDateWithDay(d.date),
    key: `daily.${d.date}`,
    sortable: false,
    align: "center" as const,
    cellProps: d.is_holiday ? { class: "!text-black !bg-red-100" } : {},
  })),
);

// ── Gabungan headers ─────────────────────────────────────────────────────────
const headers = computed(() => [...staticHeaders, ...dynamicDateHeaders.value]);

const getRowProps = ({ item }: { item: any }) => {
  if (item.is_holiday == 1) {
    return { class: "holiday-row" };
  }
  return {};
};

function onTableOptionsChange(options: { page: number; itemsPerPage: number }) {
  recapParams.value.length = options.itemsPerPage;
  recapParams.value.start = (options.page - 1) * options.itemsPerPage;
  employeeAttendanceStore.fetchEmployeeAttendanceRecap();
}
</script>

<style scoped>
.custom-header-table th,
.custom-header-table td {
  border: 1px solid #cbe3f1;
}
.custom-header-table th {
  font-weight: 600;
}
:deep(.v-data-table__thead) {
  background-color: #e3f2fd;
}
:deep(.v-theme--dark thead.v-data-table__thead) {
  background-color: #1a237e;
}
:deep(thead.v-data-table__thead th) {
  font-weight: bold !important;
  color: #1976d2 !important;
}
:deep(.v-theme--dark thead.v-data-table__thead th) {
  color: #bbdefb !important;
}
</style>
