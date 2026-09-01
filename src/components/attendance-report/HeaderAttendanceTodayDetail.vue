<template>
  <v-card class="p-3 rounded-lg space-y-3 shadow-md w-full dar:bg-slate-500">
    <!-- Baris atas: judul + tombol kembali -->
    <div class="flex items-center justify-between">
      <p
        v-if="!isLoading"
        class="text-lg font-bold m-0 text-indigo-500 dark:text-indigo-300"
      >
        {{ store.getInOutLabelAttendanceDetail() }}
      </p>
      <v-skeleton-loader
        v-else
        type="text"
        width="40%"
        class="flex-1"
      ></v-skeleton-loader>

      <v-btn
        variant="tonal"
        color="primary"
        prepend-icon="mdi-arrow-left"
        density="comfortable"
        @click="goBack"
      >
        Kembali
      </v-btn>
    </div>

    <v-divider variant="solid" thickness="3"></v-divider>

    <!-- State Loading -->
    <template v-if="isLoading">
      <div class="p-2">
        <v-row no-gutters>
          <v-col cols="6" v-for="i in 6" :key="i">
            <v-skeleton-loader type="text"></v-skeleton-loader>
          </v-col>
        </v-row>
      </div>
    </template>
    <template v-else>
      <v-table>
        <tbody>
          <tr>
            <td>Nama</td>
            <td>
              :
              <span class="font-bold">{{
                formatName({ name: data?.name, full_name: data?.full_name })
              }}</span>
            </td>
            <td>Tanggal</td>
            <td>
              :
              <span class="font-bold">{{
                toFullDateWithDay(data?.created_at)
              }}</span>
            </td>
          </tr>
          <tr>
            <td>Jam Kerja</td>
            <td>
              :
              <span class="font-bold">{{ data?.working_hour ?? "-" }}</span>
            </td>
            <td>
              {{
                store.getInOutLabelAttendanceDetail({
                  in: "Jam Masuk",
                  out: "Jam Pulang",
                  default: "Tidak Diketahui",
                })
              }}
            </td>
            <td>
              :
              <span class="font-bold">
                {{
                  store.getInOutLabelAttendanceDetail({
                    in: data?.time_in,
                    out: data?.time_out ?? "",
                    default: "-",
                  })
                }}
              </span>
            </td>
          </tr>
          <tr>
            <td>
              {{
                store.getInOutLabelAttendanceDetail({
                  in: "Keterangan Masuk",
                  out: "Keterangan Pulang",
                  default: "Tidak Diketahui",
                })
              }}
            </td>
            <td>
              :
              <span class="font-bold">
                {{
                  store.getInOutLabelAttendanceDetail({
                    in: data?.note_in ?? "",
                    out: data?.note_out ?? "",
                    default: "-",
                  })
                }}
              </span>
            </td>
            <td>Lokasi</td>
            <td>
              :
              <span class="font-bold">
                {{
                  store.getInOutLabelAttendanceDetail({
                    in: data?.in_coordinate_name ?? "",
                    out: data?.out_coordinate_name ?? "",
                    default: "-",
                  })
                }}
              </span>
            </td>
          </tr>
        </tbody>
      </v-table>
    </template>
  </v-card>
</template>

<script setup lang="ts">
import { useDateFormatter } from "@/composables/UseDateFormatter";
import { useFormatName } from "@/composables/useFormatName";
import { useEmployeeAttendanceRequestStore } from "@/stores/employee-attendance.store";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const { toFullDateWithDay } = useDateFormatter();
const store = useEmployeeAttendanceRequestStore();
const { employeeAttendanceDetail: data, isLoadingDetail: isLoading } =
  storeToRefs(store);
const { formatName } = useFormatName();
const router = useRouter();

function goBack() {
  const returnPath = sessionStorage.getItem("attendance-today-report-return");
  if (returnPath) {
    router.push(returnPath);
  } else {
    // fallback kalau user buka halaman detail langsung (refresh/share link)
    router.push({ name: "Laporan Absensi Hari Ini" });
  }
}
</script>

<style scoped>
:deep(.v-breadcrumbs-item--disabled) {
  color: #615fff !important;
  opacity: 1;
}
:deep(.v-breadcrumbs-item) {
  padding: 0;
}
</style>
