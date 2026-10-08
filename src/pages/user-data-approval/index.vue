<template>
  <v-card flat class="p-1 md:p-3 space-y-3">
    <!-- ───── Toolbar ───── -->
    <div class="flex flex-wrap items-center justify-between gap-2">
      <h2 class="text-base font-bold text-slate-800 dark:text-slate-200">
        Approval Data Karyawan
        <v-chip class="ms-2 bg-blue-50 dark:bg-blue-900 font-bold" size="small">
          {{ listStore.total }}
        </v-chip>
      </h2>

      <div class="flex flex-wrap items-center gap-2">
        <v-autocomplete
          v-model="params.branch_id"
          :items="listBranch"
          :loading="isLoadingBranch"
          prepend-inner-icon="mdi-map-marker-outline"
          item-title="name"
          item-value="id"
          placeholder="Lokasi cabang"
          variant="outlined"
          density="compact"
          color="primary"
          hide-details
          clearable
          no-filter
          class="min-w-[220px]"
          @update:search="onSearchBranch"
        >
          <template v-slot:item="{ props, item }">
            <v-list-item
              v-bind="props"
              :title="item.name"
              :subtitle="item.alias"
            ></v-list-item>
          </template>
        </v-autocomplete>

        <v-btn
          color="bg-gray-300 dark:bg-gray-600 text-indigo-900 dark:text-indigo-100 text-sm"
          prepend-icon="mdi-refresh"
          variant="flat"
          :loading="listStore.isLoading"
          @click="load"
        >
          Muat Ulang
        </v-btn>
      </div>
    </div>

    <v-chip-group
      v-model="params.status"
      mandatory
      selected-class="text-indigo-600"
    >
      <v-chip value="pending" size="small" variant="outlined">Pending</v-chip>
      <v-chip value="approved" size="small" variant="outlined">
        Disetujui
      </v-chip>
      <v-chip value="rejected" size="small" variant="outlined">Ditolak</v-chip>
    </v-chip-group>

    <v-alert
      v-if="listStore.error"
      type="error"
      variant="tonal"
      density="compact"
    >
      {{ listStore.error }}
    </v-alert>

    <!-- ───── Data Table ───── -->
    <v-data-table-server
      v-model:page="params.page"
      v-model:items-per-page="params.itemsPerPage"
      :headers="headers as any"
      :items="listStore.rows"
      :items-length="listStore.total"
      :loading="listStore.isLoading"
      class="elevation-1 custom-header-table"
    >
      <template #[`item.no`]="{ index }">
        {{ (params.page - 1) * params.itemsPerPage + index + 1 }}
      </template>

      <template #[`item.employee`]="{ item }">
        <div class="py-1">
          <div class="font-bold text-sm text-slate-800 dark:text-white">
            {{
              formatName({
                name: item.user_name,
                full_name: item.user_full_name,
              })
            }}
          </div>
          <div class="text-xs text-slate-500">
            {{
              item.user_employee_id ??
              item.user_email ??
              item.branch_alias ??
              "-"
            }}
          </div>
        </div>
      </template>

      <template #[`item.branch_alias`]="{ item }">
        {{ item.branch_alias ?? "-" }}
      </template>

      <template #[`item.label`]="{ item }">
        <div class="flex flex-wrap gap-1.5 py-1">
          <span
            v-for="(lbl, i) in item.label"
            :key="i"
            class="px-3 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[11px] font-bold rounded-full border border-red-100 dark:border-red-800"
          >
            {{ lbl }}
          </span>
        </div>
      </template>

      <template #[`item.status`]="{ item }">
        <v-chip
          :color="statusMeta[item.status]?.color ?? 'grey'"
          size="small"
          variant="flat"
          label
        >
          {{ statusMeta[item.status]?.label ?? item.status }}
        </v-chip>
      </template>

      <template #[`item.created_at`]="{ item }">
        {{ toFullDateWithDay(item.created_at) }}
      </template>

      <template #[`item.actions`]="{ item }">
        <div class="flex justify-end">
          <v-btn
            variant="tonal"
            size="small"
            rounded="pill"
            class="text-none"
            color="indigo"
            @click="goToDetail(item)"
          >
            Detail
          </v-btn>
        </div>
      </template>

      <template #no-data>
        <div class="py-8 text-slate-400 text-sm">Tidak ada data pengajuan</div>
      </template>
    </v-data-table-server>
  </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useDateFormatter } from "@/composables/UseDateFormatter";
import { useFormatName } from "@/composables/useFormatName";
import { useBranchStore } from "@/stores/branch.store";
import { useUserDataApprovalListStore } from "@/stores/user-data-approval-list.store";

const router = useRouter();
const branchStore = useBranchStore();
const listStore = useUserDataApprovalListStore();
const { formatName } = useFormatName();
const { toFullDateWithDay } = useDateFormatter();

const { branchData, isLoadingData: isLoadingBranch } = storeToRefs(branchStore);
const { params } = storeToRefs(listStore);

const headers = [
  { title: "No", key: "no", sortable: false, width: "60px" },
  { title: "Karyawan", key: "employee", sortable: false },
  { title: "Cabang", key: "branch_alias", sortable: false },
  { title: "Jenis Perubahan", key: "label", sortable: false },
  { title: "Status", key: "status", sortable: false },
  { title: "Diajukan Pada", key: "created_at", sortable: false },
  { title: "Aksi", key: "actions", sortable: false, align: "end" },
];

const statusMeta: Record<string, { label: string; color: string }> = {
  pending: { label: "PENDING", color: "orange" },
  approved: { label: "DISETUJUI", color: "green-500" },
  rejected: { label: "DITOLAK", color: "red-500" },
};

// ── Filter cabang (sama seperti di card) ────────────────────────────────
const searchBranch = ref("");
const listBranch = computed(() => {
  const keyword = searchBranch.value.toLowerCase();

  return branchData.value
    .filter((branch) => {
      if (!keyword) return true;
      return (
        branch.name.toLowerCase().includes(keyword) ||
        branch.alias.toLowerCase().includes(keyword)
      );
    })
    .map((branch) => ({
      id: branch.id,
      name: branch.name,
      alias: branch.alias,
    }));
});

function onSearchBranch(val: any) {
  searchBranch.value = val ?? "";
}

// ── Load ────────────────────────────────────────────────────────────────
function load() {
  return listStore.fetchList();
}

// Ganti halaman / jumlah per halaman -> muat ulang
watch(
  () => [params.value.page, params.value.itemsPerPage],
  () => load(),
);

// Ganti filter -> kembali ke halaman 1 (yang otomatis memuat ulang),
// atau muat langsung kalau sudah di halaman 1
watch(
  () => [params.value.branch_id, params.value.status],
  () => {
    if (params.value.page !== 1) params.value.page = 1;
    else load();
  },
);
// Halaman detail pengajuan: src/pages/user-data-approval/detail.vue
function goToDetail(item: { id: number; user_id: number; status: string }) {
  router.push({
    path: "/dashboard/personnel/user-data-approvals/detail",
    query: {
      id: item.id,
      user_id: item.user_id,
      status: item.status,
    },
  });
}

onMounted(() => {
  branchStore.fetchBranchData();
  load();
});
</script>
