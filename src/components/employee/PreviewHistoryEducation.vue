<template>
  <v-card flat class="p-1 md:p-3 space-y-3">
    <!-- Toolbar -->
    <div class="flex flex-wrap items-center justify-between gap-2">
      <v-chip-group
        v-model="statusFilter"
        mandatory
        selected-class="text-indigo-600"
      >
        <v-chip value="all" size="small" variant="outlined">Semua</v-chip>
        <v-chip value="approved" size="small" variant="outlined">
          Disetujui
        </v-chip>
        <v-chip value="rejected" size="small" variant="outlined">
          Ditolak
        </v-chip>
      </v-chip-group>

      <v-btn
        color="bg-gray-300 dark:bg-gray-600 text-indigo-900 dark:text-indigo-100 text-sm"
        prepend-icon="mdi-refresh"
        variant="flat"
        :loading="historyStore.isLoading"
        @click="load()"
      >
        Muat Ulang
      </v-btn>
    </div>

    <div
      v-if="!historyStore.isLoading && !historyStore.error"
      class="text-sm text-gray-500 dark:text-gray-300"
    >
      {{ historyStore.total }} riwayat pengajuan
    </div>

    <!-- Loading -->
    <div v-if="historyStore.isLoading">
      <v-card v-for="n in 2" :key="n" flat class="p-3">
        <v-skeleton-loader
          type="heading, divider, list-item-two-line@3"
          elevation="0"
        ></v-skeleton-loader>
      </v-card>
    </div>

    <!-- Error -->
    <v-alert
      v-else-if="historyStore.error"
      type="error"
      variant="tonal"
      density="compact"
    >
      {{ historyStore.error }}
    </v-alert>

    <!-- Kosong -->
    <div
      v-else-if="viewRequests.length === 0"
      class="flex flex-col items-center py-10 text-gray-500 dark:text-gray-300"
    >
      <v-icon icon="mdi-history" size="48"></v-icon>
      <span class="text-sm mt-2"
        >Belum ada riwayat perubahan data pendidikan</span
      >
    </div>

    <!-- Daftar riwayat -->
    <div v-else class="flex flex-col gap-5">
      <v-card
        v-for="req in viewRequests"
        :key="req.id"
        variant="flat"
        border
        class="mx-auto w-full rounded-lg"
      >
        <v-card-item class="bg-gray-100 dark:bg-gray-800">
          <div class="flex items-center justify-between gap-2">
            <v-card-title class="text-base font-bold">
              ID Pengajuan #{{ req.id }}
              <span
                class="text-xs font-normal text-gray-500 dark:text-gray-300"
              >
                ({{ req.items.length }} data pendidikan)
              </span>
            </v-card-title>
            <v-chip
              :color="req.statusMeta.color"
              size="small"
              variant="flat"
              label
            >
              {{ req.statusMeta.label }}
            </v-chip>
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-300 mt-1">
            Diajukan {{ req.createdAtText }}
            <template v-if="req.processedAtText">
              · Diproses {{ req.processedAtText }}
            </template>
          </div>
        </v-card-item>

        <v-divider></v-divider>

        <v-card-text class="p-4 space-y-4">
          <!-- Catatan reviewer -->
          <v-alert
            v-if="req.reviewNote"
            :type="req.status === 'rejected' ? 'error' : 'success'"
            variant="tonal"
            density="compact"
            class="text-sm"
          >
            <span class="font-bold">Catatan:</span> {{ req.reviewNote }}
          </v-alert>

          <div
            v-for="item in req.items"
            :key="item.key"
            class="rounded-lg border p-3"
          >
            <div class="flex items-center justify-between gap-2 mb-3">
              <div class="flex items-center gap-2 font-bold text-sm">
                <v-icon
                  :icon="item.meta.icon"
                  :color="item.meta.color"
                  size="small"
                ></v-icon>
                {{ item.title }}
              </div>
              <v-chip
                :color="item.meta.color"
                size="small"
                variant="tonal"
                label
              >
                {{ item.meta.label }}
              </v-chip>
            </div>

            <div
              v-if="item.rows.length"
              class="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div
                v-for="row in item.rows"
                :key="row.key"
                :class="[
                  'flex flex-col rounded-md',
                  row.cols,
                  row.changed ? 'bg-amber-50 dark:bg-amber-900/20 p-2' : '',
                ]"
              >
                <span class="text-gray-500 text-sm dark:text-gray-300">
                  {{ row.label }}
                </span>
                <span
                  v-if="row.oldValue !== null"
                  class="text-xs text-gray-400 line-through"
                >
                  {{ row.oldValue }}
                </span>
                <DataChangeFilePreview
                  v-if="row.isFile && row.fileName"
                  :folder="FILE_FOLDER"
                  :user-id="req.userId"
                  :file-name="row.fileName"
                  class="mt-1"
                />
                <span v-else class="font-bold text-sm break-words">{{
                  row.value
                }}</span>
              </div>
            </div>

            <div v-else class="text-sm text-gray-500 dark:text-gray-300">
              <template v-if="item.action === 'delete'">
                Pengajuan penghapusan data pendidikan
                <span v-if="item.entityId">(ID {{ item.entityId }})</span>.
              </template>
              <template v-else>Tidak ada rincian perubahan.</template>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <div v-if="historyStore.hasMore" class="flex justify-center">
        <v-btn
          variant="outlined"
          :loading="historyStore.isLoadingMore"
          @click="loadMore"
        >
          Muat Lebih Banyak
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useEducationHistoryStore } from "@/stores/education-history.store";
import type {
  ChangeFieldDetail,
  ChangeRequestItem,
  ReviewStatus,
} from "@/api/modules/education-data-change.api";
import DataChangeFilePreview from "@/components/employee/DataChangeFilePreview.vue";

const route = useRoute();
const userId = route.params.id as string;
const historyStore = useEducationHistoryStore();

const statusFilter = ref<"all" | ReviewStatus>("all");

// Folder file di server: VITE_API_URL/image/{FILE_FOLDER}/{user_id}/{nama_file}
const FILE_FOLDER = "hrd-education";

// ── Format ──────────────────────────────────────────────────────────────
const actionMeta = {
  create: {
    label: "Tambah Data",
    color: "green-500",
    icon: "mdi-plus-circle-outline",
  },
  update: {
    label: "Ubah Data",
    color: "warning-500",
    icon: "mdi-pencil-circle-outline",
  },
  delete: {
    label: "Hapus Data",
    color: "red-500",
    icon: "mdi-delete-circle-outline",
  },
} as const;

const statusMeta = {
  approved: { label: "DISETUJUI", color: "green-500" },
  rejected: { label: "DITOLAK", color: "red-500" },
  pending: { label: "PENDING", color: "orange" },
} as const;

// Field yang lebar penuh di grid
const wideFields = ["school_name"];

function fmtDateTime(v?: string | null): string {
  if (!v) return "";
  const d = new Date(v);
  if (isNaN(d.getTime())) return "";

  const date = d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const time = d
    .toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(".", ":");

  return `${date}, ${time}`;
}

// Teks yang ditampilkan untuk satu sisi (lama / baru) dari sebuah field.
// Field select (jenjang) memakai label hasil terjemahan; file tampil nama filenya.
function show(f: ChangeFieldDetail, side: "old" | "new"): string {
  const raw = side === "old" ? f.old_value : f.new_value;
  const label = side === "old" ? f.old_label : f.new_label;

  if (raw === null || raw === undefined || raw === "") return "-";

  return String(label ?? raw);
}

function buildItem(it: ChangeRequestItem, idx: number) {
  const fields = it.fields ?? [];
  const side = it.action === "delete" ? "old" : "new";

  const rows = fields.map((f) => {
    const value = show(f, side);
    const oldText = it.action === "update" ? show(f, "old") : null;
    const changed = oldText !== null && oldText !== value;

    return {
      key: f.field_name,
      label: f.label,
      cols: wideFields.includes(f.field_name) ? "md:col-span-3" : "",
      value,
      oldValue: changed ? oldText : null,
      changed,
      // Field file: tampilkan pratinjau dari nama file (sisi lama untuk hapus)
      isFile: f.input_type === "file",
      fileName: (side === "old" ? f.old_value : f.new_value) || null,
    };
  });

  // Judul: jenjang pendidikan, fallback ke nama sekolah
  const level = fields.find((f) => f.field_name === "hrd_master_education_id");
  const school = fields.find((f) => f.field_name === "school_name");
  const title = level
    ? show(level, side)
    : school
      ? show(school, side)
      : "Pendidikan";

  return {
    key: `${it.request_id}-${it.item_id}-${idx}`,
    action: it.action,
    meta: actionMeta[it.action] ?? actionMeta.update,
    entityId: it.entity_id,
    title,
    rows,
  };
}

const viewRequests = computed(() =>
  historyStore.historyRequests.map((req) => ({
    id: req.id,
    userId: req.user_id,
    status: req.status,
    statusMeta: statusMeta[req.status] ?? statusMeta.pending,
    reviewNote: req.review_note,
    createdAtText: fmtDateTime(req.created_at),
    processedAtText: fmtDateTime(req.updated_at),
    items: req.item.map((it, idx) => buildItem(it, idx)),
  })),
);

// ── Load ────────────────────────────────────────────────────────────────
const currentStatus = computed(() =>
  statusFilter.value === "all" ? undefined : statusFilter.value,
);

function load() {
  return historyStore.fetchHistory(userId, currentStatus.value);
}

function loadMore() {
  return historyStore.fetchHistory(userId, currentStatus.value, true);
}

watch(statusFilter, () => load());

onMounted(() => {
  load();
});
</script>
