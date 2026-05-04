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
        <th rowspan="1" colspan="10" class="text-center">Rekap</th>
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
        <th>S</th>
        <th>C</th>
        <th>A</th>
        <th>Libur</th>
        <th class="text-nowrap">Total Jam Kerja</th>
        <th
          v-for="d in recapDates"
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

    <template #[`item.total_working_hour`]="{ item }">
      <span class="text-nowrap">
        {{ toReadableTime(item.total_working_hour) }}
      </span>
    </template>

    <!-- Kolom tanggal dinamis -->
    <template
      v-for="d in recapDates"
      :key="date"
      #[`item.daily.${d.date}`]="{ item }"
    >
      <template v-if="item.daily?.[d.date]">
        <!-- KALAU HARI LIBUR -->
        <span v-if="item.daily[d.date].is_holiday">
          <!-- KALAU ALPA DI SHIFT PIKET -->
          <v-tooltip
            v-if="
              item.daily[d.date].is_shift == 1 &&
              item.daily[d.date].is_hadir == 0
            "
            location="top"
          >
            <template v-slot:activator="{ props }">
              <span
                v-bind="props"
                class="font-bold text-red-500 cursor-pointer"
              >
                A
              </span>
            </template>
            Alpa Di Shift Piket
          </v-tooltip>

          <!-- KALAU LIBUR -->
          <v-tooltip v-else>
            <template v-slot:activator="{ props }">
              <span
                v-bind="props"
                class="font-bold text-gray-500 cursor-pointer"
              >
                L
              </span>
            </template>
            Libur
          </v-tooltip>

          <!-- KALAU HADIR DI SHIFT PIKET -->
          <v-tooltip v-if="item.daily[d.date].is_hadir" location="top">
            <template v-slot:activator="{ props }">
              <span
                v-bind="props"
                class="font-bold text-green-500 cursor-pointer"
              >
                H
              </span>
            </template>
            Hadir
          </v-tooltip>

          <v-tooltip
            v-if="
              item.daily[d.date].is_shift == 1 &&
              item.daily[d.date].is_hadir == 1
            "
            location="top"
          >
            <template v-slot:activator="{ props }"
              >,
              <span
                v-bind="props"
                class="font-bold text-purple-500 cursor-pointer"
              >
                {{ item.daily[d.date].shift_code }}
              </span>
            </template>
            {{ item.daily[d.date].shift_name }}
          </v-tooltip>

          <!-- KALAU TELAT DI APPROVE (IZIN)-->
          <span v-if="item.daily[d.date].lr_is_full_day == 0">
            ,
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <span
                  v-bind="props"
                  class="font-bold text-green-500 cursor-pointer"
                >
                  {{ item.daily[d.date].lr_type_code }}
                </span>
              </template>

              {{ item.daily[d.date].lr_type_code }} (Approved)
            </v-tooltip>
          </span>

          <!-- KALAU TELAT BIASA -->
          <span v-else-if="item.daily[d.date].is_late">
            ,
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <span
                  v-bind="props"
                  class="font-bold text-amber-500 cursor-pointer"
                >
                  T
                </span>
              </template>

              Telat
            </v-tooltip>
          </span>

          <!-- KALAU PULANG CEPAT -->
          <span v-if="item.daily[d.date].is_pc"
            >,
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <span
                  v-bind="props"
                  class="font-bold text-amber-500 cursor-pointer"
                >
                  PC
                </span>
              </template>
              Pulang Cepat
            </v-tooltip>
          </span>
        </span>

        <!-- KALAU HADIR -->
        <span v-else-if="item.daily[d.date].is_hadir">
          <!-- KALAU HADIR -->
          <v-tooltip v-if="item.daily[d.date].is_hadir" location="top">
            <template v-slot:activator="{ props }">
              <span
                v-bind="props"
                class="font-bold text-green-500 cursor-pointer"
              >
                H
              </span>
            </template>
            Hadir
          </v-tooltip>

          <!-- KALAU HADIR DI HARI SHIFT -->
          <span v-if="item.daily[d.date].is_shift">
            ,
            <v-tooltip location="top">
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
          </span>

          <!-- KALAU TELAT DI APPROVE (IZIN)-->
          <span v-if="item.daily[d.date].lr_is_full_day == 0">
            ,
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <span
                  v-bind="props"
                  class="font-bold text-green-500 cursor-pointer"
                >
                  {{ item.daily[d.date].lr_type_code }}
                </span>
              </template>

              {{ item.daily[d.date].lr_type_code }} (Approved)
            </v-tooltip>
          </span>

          <!-- KALAU TELAT BIASA -->
          <span v-else-if="item.daily[d.date].is_late">
            ,
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <span
                  v-bind="props"
                  class="font-bold text-amber-500 cursor-pointer"
                >
                  T
                </span>
              </template>

              Telat
            </v-tooltip>
          </span>

          <!-- KALAU PULANG CEPAT -->
          <span v-if="item.daily[d.date].is_pc"
            >,
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <span
                  v-bind="props"
                  class="font-bold text-amber-500 cursor-pointer"
                >
                  PC
                </span>
              </template>
              Pulang Cepat
            </v-tooltip>
          </span>
        </span>

        <!-- <v-chip color="green" size="x-small" label>
          {{ item.daily[d.date].is_late ? "T" : "✓" }}
        </v-chip> -->
        <v-chip
          v-else-if="item.daily[d.date].is_izin"
          color="blue"
          size="x-small"
          label
          >I</v-chip
        >
        <v-chip
          v-else-if="item.daily[d.date].is_sakit"
          color="orange"
          size="x-small"
          label
          >S</v-chip
        >
        <v-chip
          v-else-if="item.daily[d.date].is_cuti"
          color="purple"
          size="x-small"
          label
          >C</v-chip
        >
        <v-chip
          v-else-if="item.daily[d.date].is_alpha"
          color="text-red-600"
          size="x-small"
          label
          >A</v-chip
        >
        <span v-else>-</span>
      </template>
      <span v-else>-</span>
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
import { useDisplay } from "vuetify";

const { formatName } = useFormatName();
const { toReadableTime } = useTimeFormatter();

const { toFullDateWithDay, toFullDate } = useDateFormatter();
const employeeAttendanceStore = useEmployeeAttendanceRequestStore();
const { mdAndUp } = useDisplay();
const {
  employeeAttendanceRecap,
  totalRecords,
  recapParams,
  isLoading,
  recapDates,
} = storeToRefs(employeeAttendanceStore);

// ── Static headers ───────────────────────────────────────────────────────────
const staticHeaders = [
  {
    title: "No",
    key: "no",
    width: "60",
    sortable: false,
  },
  {
    title: "Nama",
    key: "user_full_name",
    nowrap: true,
    sortable: false,
  },
  {
    title: "Branch",
    key: "branch_alias",
    nowrap: true,
    sortable: false,
  },
  {
    title: "Departemen / Team",
    key: "branch_name",
    sortable: false,
    width: "160",
  },
  { title: "H", key: "h", sortable: false, align: "center", width: "50" },
  {
    title: "T",
    key: "t",
    sortable: false,
    align: "center",
    width: "140",
  },
  { title: "PC", key: "pc", sortable: false, align: "center", width: "140" },
  { title: "TAP", key: "tap", sortable: false, align: "center", width: "60" },
  { title: "I", key: "i", sortable: false, align: "center", width: "50" },
  { title: "S", key: "s", sortable: false, align: "center", width: "50" },
  { title: "C", key: "c", sortable: false, align: "center", width: "50" },
  { title: "A", key: "a", sortable: false, align: "center", width: "50" },
  {
    title: "Libur",
    key: "holiday",
    sortable: false,
    align: "center",
    width: "50",
  },
  {
    title: "Total Jam Kerja",
    key: "total_working_hour",
    sortable: false,
    align: "center",
    minWidth: "120",
  },
];

// ── Dynamic date headers ─────────────────────────────────────────────────────
const dynamicDateHeaders = computed(() =>
  (recapDates.value ?? []).map((d) => ({
    title: toFullDateWithDay(d.date), // "01\nMei"
    key: `daily.${d.date}`,
    sortable: false,
    align: "center" as const,
    cellProps: d.is_holiday ? { class: "!text-black  !bg-red-100" } : {},
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
  border: 1px solid #cbe3f1; /* grey */
}

/* Optional: header lebih tegas */
.custom-header-table th {
  font-weight: 600;
}

/* Gunakan deep selector agar tembus ke dalam komponen Vuetify */
:deep(.v-data-table__thead) {
  background-color: #e3f2fd;
}

/* Penyesuaian untuk Dark Theme */
:deep(.v-theme--dark thead.v-data-table__thead) {
  background-color: #1a237e; /* Biru gelap yang lembut untuk mata */
}

:deep(thead.v-data-table__thead th) {
  font-weight: bold !important;
  /* Jika ingin warna teks biru tua di light mode */
  color: #1976d2 !important;
}

:deep(.v-theme--dark thead.v-data-table__thead th) {
  color: #bbdefb !important;
}
</style>
