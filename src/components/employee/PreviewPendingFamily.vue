<template>
  <v-card flat class="p-1 md:p-3 space-y-3">
    <!-- Toolbar -->
    <div class="flex items-center justify-between gap-2">
      <span class="text-sm text-gray-500 dark:text-gray-300">
        <template v-if="!pendingStore.isLoading">
          {{ viewRequests.length }} pengajuan menunggu persetujuan
        </template>
      </span>
      <v-btn
        color="bg-gray-300 dark:bg-gray-600 text-indigo-900 dark:text-indigo-100 text-sm"
        prepend-icon="mdi-refresh"
        variant="flat"
        :loading="pendingStore.isLoading"
        @click="refresh"
      >
        Muat Ulang
      </v-btn>
    </div>

    <v-snackbar
      v-model="showErrorSnackbar"
      color="bg-red-500"
      elevation="24"
      location="top"
      timeout="4000"
      rounded="lg"
    >
      <div class="d-flex align-center">
        <v-icon icon="mdi-alert-circle" class="me-3"></v-icon>
        <span class="font-weight-medium">{{ snackbarMessage }}</span>
      </div>
      <template v-slot:actions>
        <v-btn
          variant="text"
          icon="mdi-close"
          @click="showErrorSnackbar = false"
        ></v-btn>
      </template>
    </v-snackbar>

    <v-snackbar
      v-model="showSuccessSnackbar"
      color="bg-green-500"
      elevation="24"
      location="top"
      timeout="4000"
      rounded="lg"
    >
      <div class="d-flex align-center">
        <v-icon icon="mdi-check-circle" class="me-3"></v-icon>
        <span class="font-weight-medium">{{ successMessage }}</span>
      </div>
      <template v-slot:actions>
        <v-btn
          variant="text"
          icon="mdi-close"
          @click="showSuccessSnackbar = false"
        ></v-btn>
      </template>
    </v-snackbar>

    <!-- Loading -->
    <div v-if="pendingStore.isLoading">
      <v-card v-for="n in 2" :key="n" flat class="p-3">
        <v-skeleton-loader
          type="heading, divider, list-item-two-line@3"
          elevation="0"
        ></v-skeleton-loader>
      </v-card>
    </div>

    <!-- Error -->
    <v-alert
      v-else-if="pendingStore.error"
      type="error"
      variant="tonal"
      density="compact"
    >
      {{ pendingStore.error }}
    </v-alert>

    <!-- Kosong -->
    <div
      v-else-if="viewRequests.length === 0"
      class="flex flex-col items-center py-10 text-gray-500 dark:text-gray-300"
    >
      <v-icon icon="mdi-check-circle-outline" size="48"></v-icon>
      <span class="text-sm mt-2">
        Tidak ada perubahan data keluarga yang menunggu persetujuan
      </span>
    </div>

    <!-- Daftar pengajuan -->
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
                ({{ req.items.length }} data keluarga)
              </span>
            </v-card-title>
            <v-chip color="orange" size="small" variant="flat" label>
              PENDING
            </v-chip>
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-300 mt-1">
            Diajukan {{ req.createdAtText }}
          </div>
        </v-card-item>

        <v-divider></v-divider>

        <v-card-text class="p-4 space-y-4">
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
                <span class="font-bold text-sm">{{ row.value }}</span>
              </div>
            </div>

            <!-- Tidak ada rincian field (mis. pengajuan hapus) -->
            <div v-else class="text-sm text-gray-500 dark:text-gray-300">
              <template v-if="item.action === 'delete'">
                Pengajuan penghapusan data keluarga
                <span v-if="item.entityId">(ID {{ item.entityId }})</span>.
              </template>
              <template v-else>Tidak ada rincian perubahan.</template>
            </div>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="px-4 py-3 gap-2 justify-end">
          <v-btn
            variant="outlined"
            color="red-500"
            prepend-icon="mdi-close-circle-outline"
            @click="openReview(req, 'rejected')"
          >
            Tolak
          </v-btn>
          <v-btn
            variant="flat"
            color="green-500"
            prepend-icon="mdi-check-circle-outline"
            @click="openReview(req, 'approved')"
          >
            Setujui
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-card>

  <!-- Dialog konfirmasi approve / reject -->
  <v-dialog v-model="reviewDialog" max-width="500" persistent>
    <v-card rounded="lg">
      <v-card-title class="flex items-center gap-2 px-6 pt-5 pb-3">
        <v-icon
          :icon="
            isApprove ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline'
          "
          :color="isApprove ? 'green-500' : 'red-500'"
          size="small"
        ></v-icon>
        <span class="text-base font-bold">
          {{ isApprove ? "Setujui Perubahan" : "Tolak Perubahan" }}
        </span>
        <v-spacer></v-spacer>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          :disabled="pendingStore.isSubmitting"
          @click="closeReview"
        ></v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="px-6 py-4 space-y-3">
        <div class="text-sm text-gray-600 dark:text-gray-300">
          Pengajuan #{{ reviewTarget?.id }} ({{ reviewTarget?.itemCount }}
          data keluarga)
        </div>

        <v-form ref="reviewFormRef">
          <v-textarea
            v-model="reviewNote"
            rows="3"
            variant="outlined"
            density="compact"
            hide-details="auto"
            :placeholder="
              isApprove
                ? 'Tulis catatan (opsional)...'
                : 'Alasan penolakan wajib diisi...'
            "
            :rules="isApprove ? [] : [rules.requiredNote]"
            :error-messages="serverErrors.review_note"
          >
            <template v-slot:label>
              Catatan<span v-if="!isApprove" class="text-red-500">*</span>
              <span v-else class="text-gray-400"> (opsional)</span>
            </template>
          </v-textarea>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="px-6 py-4 gap-2 justify-end">
        <v-btn
          variant="outlined"
          :disabled="pendingStore.isSubmitting"
          @click="closeReview"
        >
          Batal
        </v-btn>
        <v-btn
          :color="isApprove ? 'green-500' : 'red-500'"
          variant="flat"
          :loading="pendingStore.isSubmitting"
          @click="submitReview"
        >
          {{ isApprove ? "Konfirmasi Setujui" : "Konfirmasi Tolak" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { useDateFormatter } from "@/composables/UseDateFormatter";
import { useFamilyStore } from "@/stores/family.store";
import type {
  ChangeFieldDetail,
  ChangeRequestItem,
  ReviewStatus,
} from "@/api/modules/family-data-change.api";
import { useFamilyDataChange } from "@/stores/family-pending.store";
import DataChangeFilePreview from "@/components/employee/DataChangeFilePreview.vue";

const route = useRoute();
const userId = route.params.id as string;
const { toFullDate } = useDateFormatter();
const pendingStore = useFamilyDataChange();
const familyStore = useFamilyStore();

// ── Snackbar ────────────────────────────────────────────────────────────
const showErrorSnackbar = ref(false);
const snackbarMessage = ref("");
const showSuccessSnackbar = ref(false);
const successMessage = ref("");

// ── Format ──────────────────────────────────────────────────────────────
const actionMeta = {
  create: {
    label: "Tambah Data",
    color: "green-500",
    icon: "mdi-account-plus",
  },
  update: {
    label: "Ubah Data",
    color: "warning-500",
    icon: "mdi-account-edit",
  },
  delete: { label: "Hapus Data", color: "red-500", icon: "mdi-account-remove" },
} as const;

const dateFields = ["birth_date", "marriage_date"];

// Tanggal + jam, mengikuti zona waktu browser
function fmtDateTime(v?: string | null): string {
  if (!v) return "-";
  const d = new Date(v);
  if (isNaN(d.getTime())) return "-";

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

// Teks yang ditampilkan untuk satu sisi (lama / baru) dari sebuah field
function show(f: ChangeFieldDetail, side: "old" | "new"): string {
  const raw = side === "old" ? f.old_value : f.new_value;
  const label = side === "old" ? f.old_label : f.new_label;

  if (raw === null || raw === undefined || raw === "") return "-";

  if (f.field_name === "gender") {
    return raw === "M" ? "Laki-Laki" : raw === "F" ? "Perempuan" : raw;
  }
  if (f.field_name === "life_status") {
    return raw === "alive" ? "Hidup" : raw === "deceased" ? "Meninggal" : raw;
  }
  if (dateFields.includes(f.field_name)) {
    return toFullDate(raw) ?? raw;
  }

  return String(label ?? raw);
}

function buildItem(it: ChangeRequestItem, idx: number) {
  const fields = it.fields ?? [];

  const rows = fields.map((f) => {
    // Pengajuan hapus menyimpan keterangannya di old_value (deleted_record)
    const value = show(f, it.action === "delete" ? "old" : "new");
    const oldText = it.action === "update" ? show(f, "old") : null;
    const changed = oldText !== null && oldText !== value;

    return {
      key: f.field_name,
      label: f.label,
      cols: f.field_name === "name" ? "md:col-span-3" : "",
      value,
      oldValue: changed ? oldText : null,
      changed,
    };
  });

  // Judul: hubungan keluarga (kalau ada di rincian), fallback ke nama
  const relation = fields.find(
    (f) => f.field_name === "hrd_master_employee_relation_id",
  );
  const name = fields.find((f) => f.field_name === "name");
  const title = relation
    ? show(relation, "new")
    : name
      ? show(name, "new")
      : "Anggota Keluarga";

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
  pendingStore.pendingRequests.map((req) => ({
    id: req.id,
    createdAtText: fmtDateTime(req.created_at),
    items: req.item.map((it, idx) => buildItem(it, idx)),
  })),
);

// ── Refresh ─────────────────────────────────────────────────────────────
async function refresh() {
  await pendingStore.fetchPending(userId);
}

// ── Approve / Reject ────────────────────────────────────────────────────
const reviewDialog = ref(false);
const reviewFormRef = ref();
const reviewNote = ref("");
const reviewTarget = ref<{
  id: number;
  status: ReviewStatus;
  itemCount: number;
} | null>(null);
const serverErrors = reactive<Record<string, string>>({});

const isApprove = computed(() => reviewTarget.value?.status === "approved");

const rules = {
  requiredNote: (v: any) =>
    !!(v && String(v).trim()) || "Catatan wajib diisi jika ditolak",
};

function clearServerErrors() {
  Object.keys(serverErrors).forEach((key) => delete serverErrors[key]);
}

function openReview(
  req: { id: number; items: unknown[] },
  status: ReviewStatus,
) {
  reviewTarget.value = { id: req.id, status, itemCount: req.items.length };
  reviewNote.value = "";
  clearServerErrors();
  reviewDialog.value = true;
}

function closeReview() {
  reviewDialog.value = false;
  reviewFormRef.value?.resetValidation();
  clearServerErrors();
}

async function submitReview() {
  if (!reviewTarget.value) return;

  const { valid } = await reviewFormRef.value.validate();
  if (!valid) return;

  clearServerErrors();
  const { id, status } = reviewTarget.value;

  try {
    const res = await pendingStore.reviewRequest(
      id,
      status,
      reviewNote.value.trim(),
    );

    successMessage.value =
      res?.message ??
      (status === "approved"
        ? "Perubahan data keluarga disetujui."
        : "Perubahan data keluarga ditolak.");
    showSuccessSnackbar.value = true;
    closeReview();

    // Data keluarga sudah berubah, muat ulang daftar di tab "Keluarga"
    if (status === "approved") {
      familyStore.familySelectedParams.user_id = userId;
      await familyStore.fetchFamilySelected();
    }
  } catch (err: any) {
    if (err?.status === 422 && err.errors) {
      Object.entries(err.errors as Record<string, string[]>).forEach(
        ([field, messages]) => {
          serverErrors[field] = messages[0];
        },
      );
    } else {
      snackbarMessage.value = err?.message ?? "Terjadi kesalahan, coba lagi.";
      showErrorSnackbar.value = true;
    }
  }
}

onMounted(() => {
  // Pending selalu diambil ulang supaya tidak basi
  refresh();
});
</script>
