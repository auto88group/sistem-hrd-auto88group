<template>
  <v-data-table-server
    :headers="headers as any"
    :items="leaveRequest"
    :items-length="leaveRequestStore.totalRecords"
    :items-per-page="leaveRequestStore.params.length"
    :loading="leaveRequestStore.isLoading"
    class="elevation-1 custom-header-table"
    @update:options="onTableOptionsChange"
  >
    <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
      <tr>
        <th rowspan="2">No</th>
        <th rowspan="2">Nama</th>
        <th rowspan="2">Jenis</th>
        <th rowspan="2">Tanggal Pengajuan</th>
        <th rowspan="2">Periode</th>
        <th rowspan="2">Keterangan</th>
        <th colspan="3" class="text-center">APPROVAL</th>
        <th rowspan="2" class="text-end">Aksi</th>
      </tr>
      <tr>
        <th class="text-center">Approval 1</th>
        <th class="text-center">Approval 2</th>
        <th class="text-center">Approval HRD</th>
      </tr>
    </template>

    <template #[`item.no`]="{ index }">
      {{ (leaveRequestStore.params.start ?? 0) + index + 1 }}
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
    <template #[`item.start_date`]="{ item }">
      <span v-if="item.start_date === item.end_date">
        {{ toFullDate(item.start_date) }}
      </span>
      <span v-else>
        {{ toFullDate(item.start_date) }} - {{ toFullDate(item.end_date) }}
      </span>
    </template>

    <template #[`item.status`]="{ item }">
      <div v-if="item.status == 'pending'">
        <!-- Kalau user adalah approver -->
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

        <!-- Kalau bukan approver -->
        <v-chip v-else-if="item.status === 'pending'">
          Menunggu Persetujuan:
          <span class="font-bold ms-1">
            {{
              formatName({
                name: item.primary_approver_name,
                full_name: item.primary_approver_full_name,
              })
            }}
          </span>
        </v-chip>
      </div>
      <v-chip
        v-else-if="item.status == 'approved'"
        color="text-green-600"
        variant="tonal"
      >
        Disetujui:
        <span class="font-bold ms-1">
          {{
            formatName({
              name: item.approver_name,
              full_name: item.approver_full_name,
            })
          }}
        </span>
      </v-chip>
      <v-chip
        v-else-if="item.status == 'rejected'"
        color="text-red-600"
        variant="tonal"
      >
        Ditolak:
        <span class="font-bold ms-1">
          {{
            formatName({
              name: item.approver_name,
              full_name: item.approver_full_name,
            })
          }}
        </span>
      </v-chip>
    </template>

    <template #[`item.status_2`]="{ item }">
      <v-chip v-if="item.status_2 == 'pending'">
        Menunggu Persetujuan:
        <span class="font-bold ms-1">
          {{
            formatName({
              name: item.secondary_approver_name,
              full_name: item.secondary_approver_full_name,
            })
          }}
        </span>
      </v-chip>
      <v-chip
        v-else-if="item.status_2 == 'approved'"
        color="text-green-600"
        variant="tonal"
      >
        Disetujui:
        <span class="font-bold ms-1">
          {{
            formatName({
              name: item.approver_2_name,
              full_name: item.approver_2_full_name,
            })
          }}
        </span>
      </v-chip>
      <v-chip
        v-else-if="item.status_2 == 'rejected'"
        color="text-red-600"
        variant="tonal"
      >
        Ditolak:
        <span class="font-bold ms-1">
          {{
            formatName({
              name: item.approver_2_name,
              full_name: item.approver_2_full_name,
            })
          }}
        </span>
      </v-chip>
    </template>

    <template #[`item.status_hrd`]="{ item }">
      <v-chip v-if="item.status_hrd == 'pending'">
        Menunggu Persetujuan:
        <span class="font-bold ms-1"> HRD </span>
      </v-chip>
      <v-chip
        v-else-if="item.status_hrd == 'approved'"
        color="text-green-600"
        variant="tonal"
      >
        Disetujui:
        <span class="font-bold ms-1">
          {{
            formatName({
              name: item.approver_hrd_name,
              full_name: item.approver_hrd_full_name,
            })
          }}
        </span>
      </v-chip>
      <v-chip
        v-else-if="item.status_hrd == 'rejected'"
        color="text-red-600"
        variant="tonal"
      >
        Ditolak:
        <span class="font-bold ms-1">
          {{
            formatName({
              name: item.approver_hrd_name,
              full_name: item.approver_hrd_full_name,
            })
          }}
        </span>
      </v-chip>
    </template>

    <template #[`item.created_at`]="{ item }">
      {{ toFullDateWithDay(item.created_at) }}
    </template>

    <template #[`item.actions`]="{ item }">
      <div class="flex justify-end items-center gap-1">
        <v-btn
          icon
          color="text-blue-500"
          variant="tonal"
          size="x-small"
          @click="handleInfo(item)"
        >
          <v-icon>mdi-information-outline</v-icon>
        </v-btn>
        <v-btn
          icon="mdi-file-edit-outline"
          variant="text"
          density="comfortable"
          class="!text-amber-600 hover:!bg-amber-50 transition-all duration-300"
          @click="handleEdit(item)"
        />

        <v-btn
          icon="mdi-delete-outline"
          variant="text"
          density="comfortable"
          @click="handleDelete(item.id)"
          :loading="leaveRequestStore.isLoadingDestroy"
          class="!text-red-500 hover:!bg-red-50 transition-all duration-300"
        />
      </div>
    </template>
  </v-data-table-server>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useLeaveRequestStore } from "@/stores/leave-request.store";
import { useFormatName } from "@/composables/useFormatName";
import { useDateFormatter } from "@/composables/UseDateFormatter";
import { useAuthStore } from "@/stores/auth.store";

const { formatName } = useFormatName();
const authStore = useAuthStore();
const leaveRequestStore = useLeaveRequestStore();
const leaveRequest = computed(() => leaveRequestStore.leaveRequest);

const { toFullDateWithDay, toFullDate } = useDateFormatter();

const props = defineProps<{
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  ask: (options: any) => Promise<boolean>;
}>();

const emit = defineEmits(["edit", "info"]);

function handleInfo(item: any) {
  leaveRequestStore.leaveRequestSelected = item;
  emit("info");
}
const headers = [
  { title: "No", key: "no", sortable: false, width: "60px" },
  { title: "Nama", key: "user_name", sortable: false },
  { title: "Jenis", key: "leave_type_name", sortable: false },
  { title: "Tanggal Pengajuan", key: "created_at", sortable: false },
  { title: "Periode", key: "start_date", sortable: false },
  { title: "Keterangan", key: "reason", sortable: false },
  { title: "Approval 1", key: "status", sortable: false, align: "center" },
  { title: "Approval 2", key: "status_2", sortable: false, align: "center" },
  {
    title: "Approval HRD",
    key: "status_hrd",
    sortable: false,
    align: "center",
  },
  { title: "Aksi", key: "actions", sortable: false, align: "end" },
];

function onTableOptionsChange(options: { page: number; itemsPerPage: number }) {
  leaveRequestStore.params.length = options.itemsPerPage;
  leaveRequestStore.params.start = (options.page - 1) * options.itemsPerPage;
  leaveRequestStore.fetchLeaveRequest();
}

function approve(item: any) {
  console.log("Approve", item);
  // API call approve
}
function reject(item: any) {
  console.log("Reject", item);
  // API call reject
}

function handleEdit(item: any) {
  emit("edit", item);
}

async function handleDelete(id: number) {
  const confirmed = await props.ask({
    title: "Hapus Pengajuan Izin",
    message: "Data ini akan dihapus. Lanjutkan?",
    confirmText: "Ya, Hapus",
    color: "red-darken-1",
  });
  if (confirmed) deleteWorkExperience(id);
}

async function deleteWorkExperience(id: number) {
  try {
    // await leaveRequestStore.destroyLeaveType(id);
    props.showSuccess("Data jenis izin berhasil dihapus.");
  } catch (err: any) {
    props.showError(err?.message ?? "Gagal menghapus data jenis izin.");
  }
}

onMounted(() => leaveRequestStore.fetchLeaveRequest());
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
