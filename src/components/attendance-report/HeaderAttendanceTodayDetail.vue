<template>
  <v-card class="p-3 rounded-lg space-y-3 shadow-md w-full dar:bg-slate-500">
    <!-- State Loading -->
    <template v-if="isLoading">
      <div class="p-2">
        <v-skeleton-loader type="text" width="40%"></v-skeleton-loader>
        <v-divider></v-divider>
        <v-row no-gutters>
          <v-col cols="6" v-for="i in 6" :key="i">
            <v-skeleton-loader type="text"></v-skeleton-loader>
          </v-col>
        </v-row>
      </div> </template
    ><template v-else>
      <p class="text-lg font-bold m-0 text-indigo-500 dark:text-indigo-300">
        {{ store.getInOutLabelAttendanceDetail() }}
      </p>
      <v-divider variant="solid" thickness="3"></v-divider>
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

const { toFullDateWithDay } = useDateFormatter();
const store = useEmployeeAttendanceRequestStore();
const { employeeAttendanceDetail: data, isLoadingDetail: isLoading } =
  storeToRefs(store);
const { formatName } = useFormatName();
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
