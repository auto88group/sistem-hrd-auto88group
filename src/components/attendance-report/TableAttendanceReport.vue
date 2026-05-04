<template>
  <v-data-table-server
    :headers="headers as any"
    :items="employee"
    :items-length="employeeAttendanceStore.totalRecords"
    :items-per-page="employeeAttendanceStore.params.length"
    :loading="employeeAttendanceStore.isLoading"
    class="elevation-1 custom-header-table"
    :row-props="getRowProps"
    @update:options="onTableOptionsChange"
  >
    <template #[`item.no`]="{ index }">
      {{ (employeeAttendanceStore.params.start ?? 0) + index + 1 }}
    </template>

    <template #[`item.user_name`]="{ item }">
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
      <div class="flex flex-col whitespace-nowrap">
        <span class="font-bold">
          {{ item.branch_alias }} ({{ item.branch_code }})
        </span>
        <span class="text-sm text-gray-500 dark:text-gray-300">{{
          item.branch_name
        }}</span>
      </div>
    </template>

    <template #[`item.working_hour`]="{ item }">
      <div v-if="item.working_hour" class="flex flex-col gap-2">
        <p class="m-0">
          Jam Masuk:
          <span class="font-bold"
            >{{ formatTime(item.working_hour, 0) }} WIB</span
          >
        </p>
        <p class="m-0">
          Jam Pulang:
          <span class="font-bold"
            >{{ formatTime(item.working_hour, 1) }} WIB</span
          >
        </p>
      </div>
    </template>

    <template #[`item.code`]="{ item }">
      <!-- HADIR -->
      <div v-if="item.time_in">
        <!-- KALAU HADIR -->
        <span v-if="item.time_in">
          <v-tooltip location="top">
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
        </span>

        <!-- KALAU HARI SHIFT -->
        <span v-if="item.shift_id">
          ,
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <span
                v-bind="props"
                class="font-bold text-purple-500 cursor-pointer"
              >
                {{ item.shift_code }}
              </span>
            </template>

            {{ item.shift_name }}
          </v-tooltip>
        </span>

        <!-- KALAU ADA PENGAJUAN IZIN SETENGAH HARI / TELAT -->
        <span v-if="item.lr_is_full_day == 0">
          ,
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <span
                v-bind="props"
                class="font-bold text-green-500 cursor-pointer"
              >
                {{ item.lr_type_code }}
              </span>
            </template>

            {{ item.lr_type_name }} (Approved)
          </v-tooltip>
        </span>

        <!-- KALAU TELAT -->
        <span
          v-if="
            item.lr_type_code != 'T' &&
            item.time_in &&
            getLateDuration(item.time_in, item.working_hour)
          "
          >,
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

        <!-- KALAU PULANG LEBIH AWAL -->
        <span
          v-if="
            item.time_out &&
            getEarlyGoHomeDuration(item.time_out, item.working_hour)
          "
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

        <!-- KALAU TIDAK ABSEN PULANG -->
        <span
          v-if="
            item.created_at && isDidntCheckOut(item.created_at, item.time_out)
          "
          >,
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <span
                v-bind="props"
                class="font-bold text-amber-500 cursor-pointer"
              >
                TAP
              </span>
            </template>
            Tidak Absen Pulang
          </v-tooltip></span
        >
      </div>

      <!-- KODE  PENGAJUAN IZIN FULL DAY -->
      <div v-else-if="item.lr_is_full_day == 1">
        <v-tooltip location="top">
          <template v-slot:activator="{ props }">
            <span
              v-bind="props"
              class="font-bold text-green-500 cursor-pointer"
            >
              {{ item.lr_type_code }}
            </span>
          </template>

          {{ item.lr_type_name }} (Approved)
        </v-tooltip>
      </div>

      <!-- ALPA HARI BIASA -->
      <div v-else-if="!item.is_holiday">
        <v-tooltip location="top">
          <template v-slot:activator="{ props }">
            <span v-bind="props" class="font-bold text-red-500 cursor-pointer">
              A
            </span>
          </template>
          Alpa
        </v-tooltip>
      </div>

      <!-- ALPA HARI SHIFT DI HARI LIBUR -->
      <div v-else-if="item.is_holiday && item.shift_id">
        <v-tooltip location="top">
          <template v-slot:activator="{ props }">
            <span v-bind="props" class="font-bold text-red-500 cursor-pointer">
              A
            </span>
          </template>
          Alpa Di Jadwal Shift
        </v-tooltip>
      </div>
    </template>

    <template #[`item.period_date`]="{ item }">
      {{ toFullDateWithDay(item.period_date) }}
    </template>

    <template #[`item.time_in`]="{ item }">
      <div
        v-if="item.time_in"
        class="flex flex-col justify-center items-center w-fit"
      >
        <span class="font-bold"> {{ item.time_in }} WIB </span>

        <a
          :href="`https://www.google.com/maps/search/?api=1&query=${item.latitude_in},${item.longitude_in}`"
          target="_blank"
          class="text-green-600 font-bold hover:text-green-800 flex items-center gap-1 no-underline text-sm"
        >
          <v-icon small color="green"> mdi-map-marker </v-icon>
          <span>Lokasi</span>
        </a>

        <span
          v-if="
            item.lr_type_code != 'T' &&
            getLateDuration(item.time_in, item.working_hour)
          "
          class="text-red-500 font-bold"
        >
          T: {{ getLateDuration(item.time_in, item.working_hour) }}
        </span>
      </div>
      <span v-else>━</span>
    </template>

    <template #[`item.image_in`]="{ item }">
      <div v-if="item.image_in" class="p-3">
        <a
          :href="`${baseUrl}/image/employee-attendance/${item.user_id}/${item.image_in}`"
          target="_blank"
          class="text-decoration-none"
        >
          <v-img
            :src="`${baseUrl}/image/employee-attendance/${item.user_id}/${item.image_in}`"
            alt="gambar absen masuk"
            class="cursor-pointer"
            height="100"
            width="100"
            cover
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="grey-lighten-5"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </a>
      </div>
      <span v-else>━</span>
    </template>

    <template #[`item.time_out`]="{ item }">
      <div
        v-if="item.time_out"
        class="flex flex-col justify-center items-center w-fit"
      >
        <span class="font-bold"> {{ item.time_out }} WIB </span>
        <a
          v-if="item.latitude_out"
          :href="`https://www.google.com/maps/search/?api=1&query=${item.latitude_out},${item.longitude_out}`"
          target="_blank"
          class="text-green-600 font-bold hover:text-green-800 flex items-center gap-1 no-underline text-sm"
        >
          <v-icon small color="green"> mdi-map-marker </v-icon>
          <span>Lokasi</span>
        </a>

        <span
          v-if="getEarlyGoHomeDuration(item.time_out, item.working_hour)"
          class="text-red-500 font-bold"
        >
          PC: {{ getEarlyGoHomeDuration(item.time_out, item.working_hour) }}
        </span>
      </div>

      <span v-else>━</span>
    </template>

    <template #[`item.image_out`]="{ item }">
      <div v-if="item.image_out" class="p-3">
        <a
          v-if="item.image_out"
          :href="`${baseUrl}/image/employee-attendance/${item.user_id}/${item.image_out}`"
          target="_blank"
          class="text-decoration-none"
        >
          <v-img
            :src="`${baseUrl}/image/employee-attendance/${item.user_id}/${item.image_out}`"
            alt="gambar absen masuk"
            class="cursor-pointer"
            height="100"
            width="100"
            cover
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="grey-lighten-5"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </a>
      </div>
      <span v-else>━</span>
    </template>

    <template #[`item.modify_by`]="{ item }">
      {{
        formatName({
          name: item.modify_by_name,
          full_name: item.modify_by_full_name,
        })
      }}
    </template>

    <template #[`item.actions`]="{ item }">
      <div class="flex justify-end items-center gap-3">
        <v-btn
          @click="handleEdit(item)"
          icon="mdi-file-edit-outline"
          variant="text"
          density="comfortable"
          class="!text-amber-600 hover:!bg-amber-50 transition-all duration-300"
        />
        <v-btn
          v-if="item.id"
          @click="handleDelete(item.id)"
          icon="mdi-delete-outline"
          variant="text"
          density="comfortable"
          class="!text-red-600 hover:!bg-red-50 transition-all duration-300"
        />
      </div>
    </template>
  </v-data-table-server>
</template>

<script setup lang="ts">
import type { EmployeeAttendance } from "@/api/modules/employee-attendance.api";
import { useConfirmDialog } from "@/composables/useConfirmDialog";
import { useDateFormatter } from "@/composables/UseDateFormatter";
import { useFormatName } from "@/composables/useFormatName";
import { useAppStore } from "@/stores/app";
import { useEmployeeAttendanceRequestStore } from "@/stores/employee-attendance.store";
import { computed } from "vue";

const baseUrl = import.meta.env.VITE_API_URL;
const employeeAttendanceStore = useEmployeeAttendanceRequestStore();
const employee = computed(() => employeeAttendanceStore.employeeAttendance);
const { toFullDateWithDay } = useDateFormatter();
const { formatName } = useFormatName();
const { ask } = useConfirmDialog();
const appStore = useAppStore();

const headers = [
  { title: "No", key: "no", sortable: false, align: "center" },
  { title: "Tanggal", key: "period_date", sortable: false },
  { title: "Nama", key: "user_name", sortable: false },
  { title: "Cabang", key: "branch_name", sortable: false },
  { title: "Kode", key: "code", sortable: false },
  { title: "Jam Kerja", key: "working_hour", sortable: false },
  { title: "Absen Masuk", key: "time_in", sortable: false },
  { title: "Foto Masuk", key: "image_in", sortable: false },
  { title: "Catatan Masuk", key: "note_in", sortable: false },
  { title: "Absen Pulang", key: "time_out", sortable: false },
  { title: "Foto Pulang", key: "image_out", sortable: false },
  { title: "Catatan Keluar", key: "note_out", sortable: false },
  { title: "Modify By", key: "modify_by", sortable: false },
  { title: "Aksi", key: "actions", sortable: false, align: "end" },
];

const getRowProps = ({ item }: { item: any }) => {
  if (item.is_holiday == 1) {
    return { class: "holiday-row" };
  }
  return {};
};

const formatTime = (workingHour: string, index: number) => {
  if (!workingHour) return "-";
  const parts = workingHour.split(" - ");
  const time = parts[index]?.trim();
  if (!time) return "-";
  return time.substring(0, 5);
};

async function handleDelete(id: number) {
  console.log(id);
  const confirmed = await ask({
    title: "Hapus Data Absensi",
    message: "Data ini akan dihapus. Lanjutkan?",
    confirmText: "Ya, Hapus",
    color: "red-darken-1",
  });
  if (confirmed) deleteAttendance(id);
}

async function deleteAttendance(id: number) {
  let res = null;
  try {
    res = await employeeAttendanceStore.destroyAttendance(id);
    appStore.showSuccessSnackbar = true;
    appStore.successMessage = res.message ?? "Data berhasil disimpan.";
    employeeAttendanceStore.fetchEmployeeAttendance();
  } catch (err: any) {
    appStore.showErrorSnackbar = true;
    appStore.errorMessage = err?.message ?? "Terjadi kesalahan, coba lagi.";
  }
}

function handleEdit(item: EmployeeAttendance) {
  employeeAttendanceStore.formDialog = true;
  employeeAttendanceStore.payloadEdit.id = item.id;
  employeeAttendanceStore.payloadEdit.user_id = item.user_id;
  employeeAttendanceStore.payloadEdit.user_name = item.user_name;
  employeeAttendanceStore.payloadEdit.user_full_name = item.user_full_name;
  employeeAttendanceStore.payloadEdit.branch_id = item.branch_id;
  employeeAttendanceStore.payloadEdit.period_date = item.period_date;
  employeeAttendanceStore.payloadEdit.working_hour = item.working_hour;
  employeeAttendanceStore.payloadEdit.time_in = item.time_in;
  employeeAttendanceStore.payloadEdit.time_out = item.time_out;
}

function onTableOptionsChange(options: { page: number; itemsPerPage: number }) {
  employeeAttendanceStore.params.length = options.itemsPerPage;
  employeeAttendanceStore.params.start =
    (options.page - 1) * options.itemsPerPage;
  employeeAttendanceStore.fetchEmployeeAttendance();
}

function getLateDuration(timeIn: string, workingHour: string): string {
  const startWorkTime = workingHour.split(" - ")[0].trim();

  const [inHour, inMin, inSec] = timeIn.split(":").map(Number);
  const [workHour, workMin, workSec] = startWorkTime.split(":").map(Number);

  const timeInSeconds = inHour * 3600 + inMin * 60 + inSec;
  const workStartSeconds = workHour * 3600 + workMin * 60 + workSec;

  if (timeInSeconds <= workStartSeconds) return "";

  const diff = timeInSeconds - workStartSeconds;
  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours} jam`);
  if (minutes > 0) parts.push(`${minutes} menit`);
  if (seconds > 0) parts.push(`${seconds} detik`);

  return parts.join(" ");
}

function getEarlyGoHomeDuration(timeOut: string, workingHour: string): string {
  const endWorkTime = workingHour.split(" - ")[1].trim();

  const [outHour, outMin, outSec] = timeOut.split(":").map(Number);
  const [workHour, workMin, workSec] = endWorkTime.split(":").map(Number);

  const timeOutSeconds = outHour * 3600 + outMin * 60 + outSec;
  const workEndSeconds = workHour * 3600 + workMin * 60 + workSec;

  if (timeOutSeconds >= workEndSeconds) return "";

  const diff = workEndSeconds - timeOutSeconds;
  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours} jam`);
  if (minutes > 0) parts.push(`${minutes} menit`);
  if (seconds > 0) parts.push(`${seconds} detik`);

  return parts.join(" ");
}

function isDidntCheckOut(createdAt: string, timeOut: string | null): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const itemDate = new Date(createdAt);
  itemDate.setHours(0, 0, 0, 0);

  const isBeforeToday = itemDate < today;
  console.log(`dfa: ${timeOut}`);

  return isBeforeToday && !timeOut;
}
</script>

<style scoped>
:deep(.holiday-row td) {
  background-color: #fee2e2 !important; /* soft red - Tailwind red-100 */
  color: black !important;
}

:deep(.holiday-row span) {
  color: black !important;
}

/* Opsional: hover state agar tetap terlihat */
:deep(.holiday-row:hover td) {
  background-color: #fecaca !important; /* Tailwind red-200 */
  color: black !important;
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
