<template>
  <v-data-table-server
    :headers="headers as any"
    :items="overtimeRequest"
    :items-length="overtimeRequestStore.totalRecords"
    :items-per-page="overtimeRequestStore.params.length"
    :loading="overtimeRequestStore.isLoading"
    class="elevation-1 custom-header-table"
    @update:options="onTableOptionsChange"
  >
    <template #headers>
      <tr>
        <th rowspan="2" class="border-right">No</th>
        <th rowspan="2" class="border-right">Nama</th>
        <th rowspan="2" class="border-right">Tanggal Pengajuan</th>
        <th colspan="3" class="border-right text-center">Jam Lembur</th>
        <th rowspan="2" class="border-right">Catatan</th>
        <th colspan="3" class="border-right text-center">Approval</th>
      </tr>
      <tr>
        <!-- Jam Lembur sub-headers -->
        <th class="text-start">Mulai</th>
        <th class="text-start">Selesai</th>
        <th class="text-start border-right">Lama Lembur</th>
        <!-- Approval sub-headers -->
        <th class="text-start">Approval 1</th>
        <th class="text-start">Approval 2</th>
        <th class="text-start border-right">Approval HRD</th>
      </tr>
    </template>

    <template #[`item.no`]="{ index }">
      {{ (overtimeRequestStore.params.start ?? 0) + index + 1 }}
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

    <template #[`item.created_at`]="{ item }">
      {{ toFullDateWithDay(item.created_at) }}
    </template>

    <template #[`item.time_out`]="{ item }">
      <v-btn
        @click="handleDetail(item)"
        variant="tonal"
        color="text-red-500 font-bold"
        >{{ item.time_out }}</v-btn
      >
    </template>

    <template #[`item.working_hour`]="{ item }">
      {{ item.working_hour.split(" - ")[1] }}
    </template>

    <template #[`item.duration`]="{ item }">
      <span class="font-bold">
        {{ getDuration(item.working_hour, item.time_out) }}
      </span>
    </template>

    <!-- PRIMARY -->
    <template #[`item.overtime_status`]="{ item }">
      <!-- PENDING -->
      <div v-if="item.overtime_status == 'pending'">
        <div v-if="item.primary_approver_id == authStore.id">
          <v-btn
            elevation="0"
            variant="tonal"
            color="text-green-700"
            size="small"
            class="me-2"
            @click="approve(item)"
          >
            Approve
          </v-btn>
          <v-btn
            color="text-red-700"
            elevation="0"
            variant="tonal"
            size="small"
            @click="reject(item)"
          >
            Reject
          </v-btn>
        </div>

        <v-chip v-else-if="item.overtime_status === 'pending'">
          Menunggu Persetujuan:
          <span class="font-bold ms-1">
            {{
              formatName({
                name: item.primary_apv_name,
                full_name: item.primary_apv_full_name,
              })
            }}
          </span>
        </v-chip>
      </div>

      <!-- APPROVAL -->
      <div
        class="space-y-3 my-3 flex flex-col"
        v-else-if="item.overtime_status == 'approved'"
      >
        <v-tooltip location="top">
          <template v-slot:activator="{ props }">
            <v-chip
              v-bind="props"
              color="text-green-600 flex justify-center"
              variant="tonal"
            >
              <div>
                Disetujui:
                <span class="font-bold ms-1">
                  {{
                    formatName({
                      name: item.apv1_name,
                      full_name: item.apv1_full_name,
                    })
                  }}
                </span>
              </div>
            </v-chip>
          </template>

          <div class="flex flex-col text-caption">
            <span
              ><strong>Disetujui Pada:</strong>
              {{ toFullDateWithDay(item.overtime_approved_at) }}</span
            >
            <span
              ><strong>Catatan:</strong> {{ item.overtime_note || "-" }}</span
            >
          </div>
        </v-tooltip>

        <v-btn
          v-if="item.primary_approver_id == authStore.id"
          color="text-red-700"
          elevation="0"
          variant="tonal"
          size="small"
          @click="reject(item)"
        >
          Ubah Ke Reject
        </v-btn>
      </div>

      <!-- REJECT -->
      <div
        class="space-y-3 my-3 flex flex-col"
        v-else-if="item.overtime_status == 'rejected'"
      >
        <v-tooltip location="top">
          <template v-slot:activator="{ props }">
            <v-chip
              v-bind="props"
              color="text-red-600 flex justify-center"
              variant="tonal"
            >
              <div>
                Ditolak:
                <span class="font-bold ms-1">
                  {{
                    formatName({
                      name: item.apv1_name,
                      full_name: item.apv1_full_name,
                    })
                  }}
                </span>
              </div>
            </v-chip>
          </template>

          <div class="flex flex-col text-caption">
            <span
              ><strong>Ditolak Pada:</strong>
              {{ toFullDateWithDay(item.overtime_approved_at) }}</span
            >
            <span
              ><strong>Catatan:</strong> {{ item.overtime_note || "-" }}</span
            >
          </div>
        </v-tooltip>

        <v-btn
          v-if="item.primary_approver_id == authStore.id"
          elevation="0"
          variant="tonal"
          color="text-green-700"
          size="small"
          class="me-2"
          @click="approve(item)"
        >
          Ubah Ke Approve
        </v-btn>
      </div>
    </template>

    <!-- SECONDARY -->
    <template #[`item.overtime_status_2`]="{ item }">
      <!-- PENDING -->
      <div v-if="item.overtime_status_2 == 'pending'">
        <div v-if="item.secondary_approver_id == authStore.id">
          <v-btn
            elevation="0"
            variant="tonal"
            color="text-green-700"
            size="small"
            class="me-2"
            @click="approve(item, 'secondary')"
          >
            Approve
          </v-btn>
          <v-btn
            color="text-red-700"
            elevation="0"
            variant="tonal"
            size="small"
            @click="reject(item, 'secondary')"
          >
            Reject
          </v-btn>
        </div>
        <v-chip v-else-if="item.overtime_status_2 == 'pending'">
          Menunggu Persetujuan:
          <span class="font-bold ms-1">
            {{
              formatName({
                name: item.secondary_apv_name,
                full_name: item.secondary_apv_full_name,
              })
            }}
          </span>
        </v-chip>
      </div>

      <!-- APPROVED -->
      <div
        class="space-y-3 my-3 flex flex-col"
        v-else-if="item.overtime_status_2 == 'approved'"
      >
        <v-tooltip location="top">
          <template v-slot:activator="{ props }">
            <v-chip v-bind="props" color="text-green-600" variant="tonal">
              Disetujui:
              <span class="font-bold ms-1">
                {{
                  formatName({
                    name: item.apv2_name,
                    full_name: item.apv2_full_name,
                  })
                }}
              </span>
            </v-chip>
          </template>

          <div class="flex flex-col text-caption">
            <span
              ><strong>Disetujui Pada:</strong>
              {{ toFullDateWithDay(item.overtime_approved_at_2) }}</span
            >
            <span
              ><strong>Catatan:</strong> {{ item.overtime_note_2 || "-" }}</span
            >
          </div>
        </v-tooltip>

        <v-btn
          v-if="item.secondary_approver_id == authStore.id"
          color="text-red-700"
          elevation="0"
          variant="tonal"
          size="small"
          @click="reject(item, 'secondary')"
        >
          Ubah Ke Reject
        </v-btn>
      </div>

      <!-- REJECTED -->
      <div
        class="space-y-3 my-3 flex flex-col"
        v-else-if="item.overtime_status_2 == 'rejected'"
      >
        <v-tooltip location="top">
          <template v-slot:activator="{ props }">
            <v-chip v-bind="props" color="text-red-600" variant="tonal">
              Ditolak:
              <span class="font-bold ms-1">
                {{
                  formatName({
                    name: item.apv2_name,
                    full_name: item.apv2_full_name,
                  })
                }}
              </span>
            </v-chip>
          </template>

          <div class="flex flex-col text-caption">
            <span
              ><strong>Ditolak Pada:</strong>
              {{ toFullDateWithDay(item.overtime_approved_at_2) }}</span
            >
            <span
              ><strong>Catatan:</strong> {{ item.overtime_note_2 || "-" }}</span
            >
          </div>
        </v-tooltip>

        <v-btn
          v-if="item.secondary_approver_id == authStore.id"
          elevation="0"
          variant="tonal"
          color="text-green-700"
          size="small"
          class="me-2"
          @click="approve(item, 'secondary')"
        >
          Ubah Ke Approve
        </v-btn>
      </div>
    </template>

    <!-- HRD -->
    <template #[`item.overtime_status_hrd`]="{ item }">
      <!-- PENDING -->
      <div v-if="item.overtime_status_hrd == 'pending'">
        <div v-if="authStore.level == 'hrd'">
          <v-btn
            elevation="0"
            variant="tonal"
            color="text-green-700"
            size="small"
            class="me-2"
            @click="approve(item, 'hrd')"
          >
            Approve
          </v-btn>
          <v-btn
            color="text-red-700"
            elevation="0"
            variant="tonal"
            size="small"
            @click="reject(item, 'hrd')"
          >
            Reject
          </v-btn>
        </div>
        <v-chip v-else-if="item.overtime_status_hrd == 'pending'">
          Menunggu Persetujuan:
          <span class="font-bold ms-1"> HRD </span>
        </v-chip>
      </div>

      <!-- APPROVED -->
      <div
        class="space-y-3 my-3 flex flex-col"
        v-else-if="item.overtime_status_hrd == 'approved'"
      >
        <v-tooltip location="top">
          <template v-slot:activator="{ props }">
            <v-chip
              v-bind="props"
              color="text-green-600 flex justify-center"
              variant="tonal"
            >
              Disetujui:
              <span class="font-bold ms-1">
                {{
                  formatName({
                    name: item.apv_hrd_name,
                    full_name: item.apv_hrd_full_name,
                  })
                }}
              </span>
            </v-chip>
          </template>

          <div class="flex flex-col text-caption">
            <span
              ><strong>Disetujui Pada:</strong>
              {{ toFullDateWithDay(item.overtime_approved_at_hrd) }}</span
            >
            <span
              ><strong>Catatan:</strong>
              {{ item.overtime_note_hrd || "-" }}</span
            >
          </div>
        </v-tooltip>

        <v-btn
          v-if="authStore.level == 'hrd'"
          color="text-red-700"
          elevation="0"
          variant="tonal"
          size="small"
          @click="reject(item, 'hrd')"
        >
          Ubah Ke Reject
        </v-btn>
      </div>

      <!-- REJECTED -->
      <div
        class="space-y-3 my-3 flex flex-col"
        v-else-if="item.overtime_status_hrd == 'rejected'"
      >
        <v-tooltip location="top">
          <template v-slot:activator="{ props }">
            <v-chip
              v-bind="props"
              color="text-red-600 flex justify-center"
              variant="tonal"
              class="justify-center"
            >
              Ditolak:
              <span class="font-bold ms-1">
                {{
                  formatName({
                    name: item.apv_hrd_name,
                    full_name: item.apv_hrd_full_name,
                  })
                }}
              </span>
            </v-chip>
          </template>

          <div class="flex flex-col text-caption">
            <span
              ><strong>Ditolak Pada:</strong>
              {{ toFullDateWithDay(item.overtime_approved_at_hrd) }}</span
            >
            <span
              ><strong>Catatan:</strong>
              {{ item.overtime_note_hrd || "-" }}</span
            >
          </div>
        </v-tooltip>

        <v-btn
          v-if="authStore.level == 'hrd'"
          elevation="0"
          variant="tonal"
          color="text-green-700"
          size="small"
          class="me-2"
          @click="approve(item, 'hrd')"
        >
          Ubah Ke Approve
        </v-btn>
      </div>
    </template>
  </v-data-table-server>
</template>

<script setup lang="ts">
import type { OvertimeRequest } from "@/api/modules/overtime-request.api";
import { useDateFormatter } from "@/composables/UseDateFormatter";
import { useFormatName } from "@/composables/useFormatName";
import { useAuthStore } from "@/stores/auth.store";
import { useOvertimeRequestStore } from "@/stores/overtime-request.store";
import { computed, onMounted } from "vue";

const { formatName } = useFormatName();
const { toFullDateWithDay } = useDateFormatter();

const authStore = useAuthStore();
const overtimeRequestStore = useOvertimeRequestStore();
const overtimeRequest = computed(() => overtimeRequestStore.overtimeRequest);

const headers = [
  { title: "No", key: "no", sortable: false, align: "center" },
  { title: "Nama", key: "user_name", sortable: false },
  { title: "Tanggal Pengajuan", key: "created_at", sortable: false },
  { title: "Mulai", key: "working_hour", sortable: false },
  { title: "Selesai", key: "time_out", sortable: false },
  { title: "Lama Lembur", key: "duration", sortable: false },
  { title: "Catatan", key: "note_out", sortable: false },
  { title: "Approval 1", key: "overtime_status", sortable: false },
  { title: "Approval 2", key: "overtime_status_2", sortable: false },
  { title: "Approval HRD", key: "overtime_status_hrd", sortable: false },
];

function onTableOptionsChange(options: { page: number; itemsPerPage: number }) {
  overtimeRequestStore.params.length = options.itemsPerPage;
  overtimeRequestStore.params.start = (options.page - 1) * options.itemsPerPage;
  overtimeRequestStore.fetchOvertimeRequest();
}

function getDuration(workingHour: any, timeOut: any) {
  if (!workingHour || !timeOut) return "-";

  const endWork = workingHour.split(" - ")[1]; // "18:00:00"

  const toSeconds = (time: any) => {
    const [h, m, s] = time.split(":").map(Number);
    return h * 3600 + m * 60 + s;
  };

  const diff = toSeconds(timeOut) - toSeconds(endWork);

  if (diff <= 0) return "-"; // belum overtime

  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;

  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function approve(
  item: any,
  level: "primary" | "secondary" | "hrd" | null = "primary",
) {
  overtimeRequestStore.dialog = true;
  overtimeRequestStore.payloadApproval.id = item.id;
  overtimeRequestStore.payloadApproval.status = "approved";
  overtimeRequestStore.payloadApproval.level = level;
}
function reject(
  item: any,
  level: "primary" | "secondary" | "hrd" | null = "primary",
) {
  overtimeRequestStore.dialog = true;
  overtimeRequestStore.payloadApproval.id = item.id;
  overtimeRequestStore.payloadApproval.status = "rejected";
  overtimeRequestStore.payloadApproval.level = level;
}

function handleDetail(item: OvertimeRequest) {
  overtimeRequestStore.overtimeRequestSelected = item;

  console.log(overtimeRequestStore.overtimeRequestSelected);
  overtimeRequestStore.detailOvertimeDialog = true;
}

onMounted(() => overtimeRequestStore.fetchOvertimeRequest());
</script>
<style scoped>
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
