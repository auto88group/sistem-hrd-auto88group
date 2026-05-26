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
    <template #item.no="{ index }">
      {{ (employeeAttendanceStore.params.start ?? 0) + index + 1 }}
    </template>

    <template #item.user_name="{ item }">
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

    <template #item.branch_name="{ item }">
      <div class="flex flex-col whitespace-nowrap">
        <span class="font-bold">
          {{ item.branch_alias }} ({{ item.branch_code }})
        </span>
        <span class="text-sm text-gray-500 dark:text-gray-300">
          {{ item.branch_name }}
        </span>
      </div>
    </template>

    <template #item.working_hour="{ item }">
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

    <!-- Foto Masuk -->
    <template #item.image_in="{ item }">
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
                <v-progress-circular indeterminate color="grey-lighten-5" />
              </v-row>
            </template>
          </v-img>
        </a>
      </div>
      <span v-else>━</span>
    </template>

    <!-- Informasi Masuk -->
    <template #item.info_in="{ item }">
      <div class="flex flex-col gap-1 py-1 text-sm">
        <!-- Tanggal -->
        <div class="flex items-center gap-1 text-slate-500 text-xs">
          <v-icon size="14">mdi-calendar-outline</v-icon>
          {{ toFullDateWithDay(item.period_date) }}
        </div>

        <!-- Jam Masuk -->
        <div v-if="item?.time_in" class="flex flex-col gap-0.5">
          <div class="flex items-center gap-1 font-bold">
            <v-icon size="14" color="green">mdi-clock-in</v-icon>
            {{ item.time_in }} WIB
          </div>

          <!-- Lokasi -->
          <a
            v-if="item?.latitude_in"
            target="_blank"
            :href="`https://www.google.com/maps/search/?api=1&query=${item?.latitude_in},${item?.longitude_in}`"
            class="text-green-600 font-bold hover:text-green-800 flex items-center gap-1 no-underline text-xs"
          >
            <v-icon size="12" color="green">mdi-map-marker</v-icon>
            {{ item.in_coordinate_name }}
          </a>

          <!-- Terlambat -->
          <span
            v-if="
              item.lr_type_code != 'T' &&
              getLateDuration(item.time_in, item.working_hour) &&
              !(
                item.request_diff_loc_in === 1 &&
                item.confirm_diff_loc_in_id == null
              )
            "
            class="text-red-500 font-bold text-xs"
          >
            T: {{ getLateDuration(item.time_in, item.working_hour) }}
          </span>

          <!-- Approval Beda Lokasi Masuk -->
          <v-btn
            v-if="
              item.request_diff_loc_in === 1 &&
              item.confirm_diff_loc_in_id == null
            "
            size="small"
            color="bg-blue-500 text-white"
            variant="flat"
            prepend-icon="mdi-check-decagram"
            :loading="employeeAttendanceStore.isLoadingApproval"
            class="text-none w-fit mt-1"
            rounded="lg"
            @click="handleApprovalDiffLoc(item.id, 'in')"
          >
            Approval Beda Lokasi
          </v-btn>
        </div>
        <span v-else class="text-slate-400">━</span>

        <!-- Catatan Masuk -->
        <div
          v-if="item?.note_in"
          class="flex items-start gap-1 text-xs text-slate-500"
        >
          <v-icon size="13">mdi-note-text-outline</v-icon>
          <span>{{ item.note_in }}</span>
        </div>

        <v-btn
          v-if="item.id"
          :to="`/dashboard/attendance-today-report/${item.id}/detail/in`"
          size="small"
          variant="tonal"
          color="text-green-600"
          class="text-none font-weight-bold w-fit"
          rounded="lg"
        >
          <v-icon start size="14">mdi-eye-outline</v-icon>
          Detail
        </v-btn>
      </div>
    </template>

    <!-- Foto Pulang -->
    <template #item.image_out="{ item }">
      <div v-if="item.image_out" class="p-3">
        <a
          :href="`${baseUrl}/image/employee-attendance/${item.user_id}/${item.image_out}`"
          target="_blank"
          class="text-decoration-none"
        >
          <v-img
            :src="`${baseUrl}/image/employee-attendance/${item.user_id}/${item.image_out}`"
            alt="gambar absen pulang"
            class="cursor-pointer"
            height="100"
            width="100"
            cover
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey-lighten-5" />
              </v-row>
            </template>
          </v-img>
        </a>
      </div>
      <span v-else>━</span>
    </template>

    <!-- Informasi Pulang -->
    <template #item.info_out="{ item }">
      <div class="flex flex-col gap-1 py-1 text-sm">
        <!-- Spacer tanggal agar sejajar dengan kolom masuk -->
        <div class="flex items-center gap-1 text-slate-500 text-xs">
          <v-icon size="14">mdi-calendar-outline</v-icon>
          {{ toFullDateWithDay(item.period_date) }}
        </div>

        <!-- Jam Pulang -->
        <div v-if="item?.time_out" class="flex flex-col gap-0.5">
          <div class="flex items-center gap-1 font-bold">
            <v-icon size="14" color="blue">mdi-clock-out</v-icon>
            {{ item.time_out }} WIB
          </div>

          <!-- Lokasi -->
          <a
            v-if="item?.latitude_out"
            :href="`https://www.google.com/maps/search/?api=1&query=${item?.latitude_out},${item?.longitude_out}`"
            target="_blank"
            class="text-green-600 font-bold hover:text-green-800 flex items-center gap-1 no-underline text-xs"
          >
            <v-icon size="12" color="green">mdi-map-marker</v-icon>
            {{ item.out_coordinate_name }}
          </a>

          <!-- Pulang Cepat -->
          <span
            v-if="
              getEarlyGoHomeDuration(item.time_out, item.working_hour) &&
              !(
                item.request_diff_loc_out === 1 &&
                item.confirm_diff_loc_out_id == null
              )
            "
            class="text-red-500 font-bold text-xs"
          >
            PC: {{ getEarlyGoHomeDuration(item.time_out, item.working_hour) }}
          </span>

          <!-- Approval Beda Lokasi Pulang -->
          <v-btn
            v-if="
              item.request_diff_loc_out === 1 &&
              item.confirm_diff_loc_out_id == null
            "
            size="small"
            color="bg-blue-500 text-white"
            variant="flat"
            prepend-icon="mdi-check-decagram"
            :loading="employeeAttendanceStore.isLoadingApproval"
            class="text-none w-fit mt-1"
            rounded="lg"
            @click="handleApprovalDiffLoc(item.id, 'out')"
          >
            Approval Beda Lokasi
          </v-btn>
        </div>
        <span v-else class="text-slate-400">
          <!-- Tidak Absen Pulang -->
          <span
            v-if="
              item.created_at &&
              isDidntCheckOut(
                item.created_at,
                item.time_out,
                item.request_diff_loc_out,
                item.confirm_diff_loc_out_id,
              )
            "
            class="text-amber-500 font-bold text-xs"
          >
            TAP - Tidak Absen Pulang
          </span>

          <span v-else>━</span>
        </span>

        <!-- Catatan Pulang -->
        <div
          v-if="item?.note_out"
          class="flex items-start gap-1 text-xs text-slate-500"
        >
          <v-icon size="13">mdi-note-text-outline</v-icon>
          <span>{{ item.note_out }}</span>
        </div>

        <v-btn
          v-if="item.id"
          :to="`/dashboard/attendance-today-report/${item.id}/detail/out`"
          size="small"
          variant="tonal"
          color="text-green-600"
          class="text-none font-weight-bold w-fit"
          rounded="lg"
        >
          <v-icon start size="14">mdi-eye-outline</v-icon>
          Detail
        </v-btn>
      </div>
    </template>
  </v-data-table-server>
</template>

<script setup lang="ts">
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
const appStore = useAppStore();

const headers = [
  { title: "No", key: "no", sortable: false, align: "center", rowspan: 2 },
  { title: "Nama", key: "user_name", sortable: false, rowspan: 2 },
  { title: "Cabang", key: "branch_name", sortable: false, rowspan: 2 },
  { title: "Jam Kerja", key: "working_hour", sortable: false, rowspan: 2 },
  {
    title: "Absensi Masuk",
    align: "center",
    children: [
      { title: "Foto", key: "image_in", sortable: false, align: "center" },
      { title: "Informasi", key: "info_in", sortable: false },
    ],
  },
  {
    title: "Absensi Pulang",
    align: "center",
    children: [
      { title: "Foto", key: "image_out", sortable: false, align: "center" },
      { title: "Informasi", key: "info_out", sortable: false },
    ],
  },
];

function isDidntCheckOut(
  createdAt: string,
  timeOut: string | null,
  requestDiffLocOut?: number | null,
  confirmDiffLocOutId?: number | null,
): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const itemDate = new Date(createdAt);
  itemDate.setHours(0, 0, 0, 0);
  const isBeforeToday = itemDate < today;

  if (isBeforeToday && !timeOut) return true;
  if (
    isBeforeToday &&
    timeOut &&
    requestDiffLocOut === 1 &&
    confirmDiffLocOutId == null
  )
    return true;

  return false;
}

async function handleApprovalDiffLoc(attendanceId: number, type: "in" | "out") {
  try {
    const res = await employeeAttendanceStore.approvalDiffLoc({
      attendance_id: attendanceId,
      type,
    });
    if (res.success) {
      await employeeAttendanceStore.fetchEmployeeAttendance();
    }
    appStore.showSuccessSnackbar = true;
    appStore.successMessage = res.message ?? "Approval berhasil.";
  } catch (err: any) {
    appStore.showErrorSnackbar = true;
    appStore.errorMessage = err?.message ?? "Terjadi kesalahan.";
  }
}

const getRowProps = ({ item }: { item: any }) => {
  if (item.is_holiday == 1) return { class: "holiday-row" };
  return {};
};

const formatTime = (workingHour: string, index: number) => {
  if (!workingHour) return "-";
  const parts = workingHour.split(" - ");
  const time = parts[index]?.trim();
  if (!time) return "-";
  return time.substring(0, 5);
};

function onTableOptionsChange(options: { page: number; itemsPerPage: number }) {
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  employeeAttendanceStore.params.period = formattedDate;
  employeeAttendanceStore.params.length = options.itemsPerPage;
  employeeAttendanceStore.params.start =
    (options.page - 1) * options.itemsPerPage;
  employeeAttendanceStore.fetchEmployeeAttendance();
}

function getLateDuration(timeIn: string, workingHour: string): string {
  const startWorkTime = workingHour.split(" - ")[0].trim();
  const [inHour = 0, inMin = 0, inSec = 0] = timeIn.split(":").map(Number);
  const [workHour = 0, workMin = 0, workSec = 0] = startWorkTime
    .split(":")
    .map(Number);

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
  const [outHour = 0, outMin = 0, outSec = 0] = timeOut.split(":").map(Number);
  const [workHour = 0, workMin = 0, workSec = 0] = endWorkTime
    .split(":")
    .map(Number);

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
</script>

<style scoped>
:deep(.holiday-row td) {
  background-color: #fee2e2 !important;
  color: black !important;
}
:deep(.holiday-row span) {
  color: black !important;
}
:deep(.holiday-row:hover td) {
  background-color: #fecaca !important;
  color: black !important;
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
