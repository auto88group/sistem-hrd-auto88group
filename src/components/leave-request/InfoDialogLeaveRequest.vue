<template>
  <v-dialog v-model="dialog" max-width="700" scrollable persistent>
    <v-card rounded="lg">
      <v-card-title class="flex items-center gap-2 px-6 pt-5 pb-3">
        <v-icon icon="mdi-tune-variant" color="primary" size="small"></v-icon>
        <span class="text-base font-bold"> Detail Data </span>
        <v-spacer></v-spacer>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="closeDialog"
        ></v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="p-4 space-y-3">
        <v-row>
          <!-- NAMA -->
          <v-col cols="6">
            <div class="flex flex-col">
              <span class="dark:text-white text-slate-700 text-sm"
                >Nama Karyawan</span
              >
              <span class="dark:text-white text-slate-700 font-bold">{{
                formatName({
                  name: leaveRequest?.user_name,
                  full_name: leaveRequest?.user_full_name,
                })
              }}</span>
            </div>
          </v-col>

          <!-- CABANG -->
          <v-col cols="6">
            <div class="flex flex-col">
              <span class="dark:text-white text-slate-700 text-sm">Cabang</span>
              <span class="dark:text-white text-slate-700 font-bold">{{
                leaveRequest?.branch_alias + " - " + leaveRequest?.branch_name
              }}</span>
            </div>
          </v-col>

          <!-- JENIS PENGAJUAN -->
          <v-col cols="6">
            <div class="flex flex-col">
              <span class="dark:text-white text-slate-700 text-sm"
                >Jenis Pengajuan</span
              >
              <span class="dark:text-white text-slate-700 font-bold">{{
                leaveRequest?.leave_type_name
              }}</span>
            </div>
          </v-col>

          <!-- TOTAL HARI PENGAJUAN -->
          <v-col cols="6">
            <div class="flex flex-col">
              <span class="dark:text-white text-slate-700 text-sm"
                >Total Hari</span
              >
              <span class="dark:text-white text-slate-700 font-bold">{{
                leaveRequest?.total_days + " Hari"
              }}</span>
            </div>
          </v-col>

          <!-- TANGGAL PENGAJUAN -->
          <v-col cols="6">
            <div class="flex flex-col">
              <span class="dark:text-white text-slate-700 text-sm"
                >Tanggal Pengajuan</span
              >
              <span class="dark:text-white text-slate-700 font-bold">{{
                toFullDateWithDay(leaveRequest?.created_at)
              }}</span>
            </div>
          </v-col>

          <!-- PERIODE PENGAJUAN -->
          <v-col cols="6">
            <div class="flex flex-col">
              <span class="dark:text-white text-slate-700 text-sm"
                >Periode Pengajuan</span
              >
              <span class="dark:text-white text-slate-700 font-bold"
                >{{ toFullDate(leaveRequest?.start_date) }}
                <span class="font-light"> s/d </span>
                {{ toFullDate(leaveRequest?.end_date) }}
              </span>
            </div>
          </v-col>

          <!-- KETERANGAN -->
          <v-col cols="6">
            <div class="flex flex-col">
              <span class="dark:text-white text-slate-700 text-sm"
                >Keterangan</span
              >
              <span class="dark:text-white text-slate-700 font-bold">{{
                leaveRequest?.reason
              }}</span>
            </div>
          </v-col>
        </v-row>
        <v-divider variant="double" thickness="4">APPROVAL</v-divider>
        <v-table>
          <thead>
            <tr>
              <th class="text-left font-bold">USER APPROVER</th>
              <th class="text-left font-bold">STATUS</th>
              <th class="text-left font-bold">CATATAN</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="leaveRequest?.status == 'pending'">
              <td class="">
                {{
                  formatName({
                    name: leaveRequest?.primary_approver_name,
                    full_name: leaveRequest?.primary_approver_full_name,
                  })
                }}
              </td>
              <td class="">
                <v-chip> Menunggu Persetujuan</v-chip>
              </td>
              <td>
                {{ leaveRequest.note }}
              </td>
            </tr>
            <tr v-if="leaveRequest?.status == 'approved'">
              <td class="">
                {{
                  formatName({
                    name: leaveRequest?.approver_name,
                    full_name: leaveRequest?.approver_full_name,
                  })
                }}
              </td>
              <td class="">
                <v-chip variant="tonal" color="text-green-600">
                  Disetujui</v-chip
                >
              </td>
              <td>
                {{ leaveRequest.note }}
              </td>
            </tr>
            <tr v-if="leaveRequest?.status == 'rejected'">
              <td class="">
                {{
                  formatName({
                    name: leaveRequest?.approver_name,
                    full_name: leaveRequest?.approver_full_name,
                  })
                }}
              </td>
              <td class="">
                <v-chip variant="tonal" color="text-red-600"> Ditolak</v-chip>
              </td>
              <td>
                {{ leaveRequest.note }}
              </td>
            </tr>

            <tr v-if="leaveRequest?.status_2 == 'pending'">
              <td class="">
                {{
                  formatName({
                    name: leaveRequest?.secondary_approver_name,
                    full_name: leaveRequest?.secondary_approver_full_name,
                  })
                }}
              </td>
              <td class="">
                <v-chip> Menunggu Persetujuan</v-chip>
              </td>
              <td>
                {{ leaveRequest.note_2 }}
              </td>
            </tr>
            <tr v-if="leaveRequest?.status_2 == 'approved'">
              <td class="">
                {{
                  formatName({
                    name: leaveRequest?.approver_2_name,
                    full_name: leaveRequest?.approver_2_full_name,
                  })
                }}
              </td>
              <td class="">
                <v-chip variant="tonal" color="text-green-600">
                  Disetujui</v-chip
                >
              </td>
              <td>
                {{ leaveRequest.note_2 }}
              </td>
            </tr>
            <tr v-if="leaveRequest?.status_2 == 'rejected'">
              <td class="">
                {{
                  formatName({
                    name: leaveRequest?.approver_2_name,
                    full_name: leaveRequest?.approver_2_full_name,
                  })
                }}
              </td>
              <td class="">
                <v-chip variant="tonal" color="text-red-600"> Ditolak</v-chip>
              </td>
              <td>
                {{ leaveRequest.note_2 }}
              </td>
            </tr>

            <tr v-if="leaveRequest?.status_hrd == 'pending'">
              <td class="">HRD</td>
              <td class="">
                <v-chip> Menunggu Persetujuan</v-chip>
              </td>
              <td>
                {{ leaveRequest.note_hrd }}
              </td>
            </tr>
            <tr v-if="leaveRequest?.status_hrd == 'approved'">
              <td class="">
                {{
                  formatName({
                    name: leaveRequest?.approver_hrd_name,
                    full_name: leaveRequest?.approver_hrd_full_name,
                  })
                }}
              </td>
              <td class="">
                <v-chip variant="tonal" color="text-green-600">
                  Disetujui</v-chip
                >
              </td>
              <td>
                {{ leaveRequest.note_hrd }}
              </td>
            </tr>
            <tr v-if="leaveRequest?.status_hrd == 'rejected'">
              <td class="">
                {{
                  formatName({
                    name: leaveRequest?.approver_hrd_name,
                    full_name: leaveRequest?.approver_hrd_full_name,
                  })
                }}
              </td>
              <td class="">
                <v-chip variant="tonal" color="text-red-600"> Ditolak</v-chip>
              </td>
              <td>
                {{ leaveRequest.note_hrd }}
              </td>
            </tr>
          </tbody>
        </v-table>

        <div v-if="leaveRequest?.attachment">
          <p class="m-0 font-bold">FIle</p>
          <div class="bg-gray-300 p-3">
            <v-img
              :src="`${baseUrl}/image/leave-request/${leaveRequest?.user_id}/${leaveRequest?.attachment}`"
              alt="Attachment Request Cuti"
              class="mx-auto rounded-xl shadow-xl"
              max-width="500"
              aspect-ratio="16/9"
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
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { useDateFormatter } from "@/composables/UseDateFormatter";
import { useFormatName } from "@/composables/useFormatName";
import { useLeaveRequestStore } from "@/stores/leave-request.store";
import { computed, ref } from "vue";

const baseUrl = import.meta.env.VITE_API_URL;
const leaveRequestStore = useLeaveRequestStore();
const leaveRequest = computed(() => leaveRequestStore.leaveRequestSelected);
const { formatName } = useFormatName();
const { toFullDateWithDay, toFullDate } = useDateFormatter();
const dialog = ref(false);

function openInfoDialog() {
  dialog.value = true;
}

function closeDialog() {
  dialog.value = false;
}
defineExpose({
  openInfoDialog,
});
</script>
