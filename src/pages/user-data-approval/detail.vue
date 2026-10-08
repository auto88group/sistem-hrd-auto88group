<template>
  <div class="space-y-4 p-1 md:p-3">
    <!-- ───── Header ───── -->
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <v-btn
          icon="mdi-arrow-left"
          variant="text"
          size="small"
          @click="goBack"
        ></v-btn>
        <h2 class="text-base font-bold text-slate-800 dark:text-slate-200">
          Detail Pengajuan
          <span v-if="requestId" class="text-slate-500">#{{ requestId }}</span>
        </h2>
      </div>

      <v-chip
        v-if="detailStore.request"
        :color="statusMeta[detailStore.request.status]?.color ?? 'grey'"
        size="small"
        variant="flat"
        label
      >
        {{
          statusMeta[detailStore.request.status]?.label ??
          detailStore.request.status
        }}
      </v-chip>
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

    <!-- ───── Loading ───── -->
    <div v-if="detailStore.isLoading">
      <v-card v-for="n in 2" :key="n" flat class="p-3">
        <v-skeleton-loader
          type="heading, divider, list-item-two-line@3"
          elevation="0"
        ></v-skeleton-loader>
      </v-card>
    </div>

    <!-- ───── Error ───── -->
    <v-alert
      v-else-if="paramError || detailStore.error"
      type="error"
      variant="tonal"
      density="compact"
    >
      {{ paramError ?? detailStore.error }}
    </v-alert>

    <template v-else-if="view">
      <!-- ───── Info pengaju ───── -->
      <v-card variant="flat" border class="rounded-lg">
        <v-card-text class="p-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div
                class="bg-white dark:bg-slate-700 p-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-600"
              >
                <v-icon color="indigo">mdi-account-clock-outline</v-icon>
              </div>
              <div>
                <div class="font-bold text-slate-800 dark:text-white">
                  {{ view.employeeName }}
                </div>
                <div class="text-xs text-slate-500">
                  {{ view.employeeSub }}
                </div>
              </div>
            </div>
            <div class="text-xs text-slate-500 dark:text-gray-300">
              Diajukan {{ view.createdAtText }}
              <template v-if="view.processedAtText">
                · Diproses {{ view.processedAtText }}
              </template>
            </div>
          </div>

          <div class="mt-3 flex flex-wrap gap-1.5">
            <span
              v-for="(lbl, i) in view.labels"
              :key="i"
              class="px-3 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[11px] font-bold rounded-full border border-red-100 dark:border-red-800"
            >
              {{ lbl }}
            </span>
          </div>
        </v-card-text>
      </v-card>

      <!-- Catatan reviewer (pengajuan yang sudah diproses) -->
      <v-alert
        v-if="view.reviewNote"
        :type="view.status === 'rejected' ? 'error' : 'success'"
        variant="tonal"
        density="compact"
        class="text-sm"
      >
        <span class="font-bold">Catatan:</span> {{ view.reviewNote }}
      </v-alert>

      <!-- ───── Daftar perubahan ───── -->
      <v-card
        v-for="item in view.items"
        :key="item.key"
        variant="flat"
        border
        class="rounded-lg"
      >
        <v-card-item class="bg-gray-100 dark:bg-gray-800">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-2 font-bold text-sm">
              <v-icon
                :icon="item.meta.icon"
                :color="item.meta.color"
                size="small"
              ></v-icon>
              {{ item.title }}
            </div>
            <div class="flex items-center gap-2">
              <v-chip size="small" variant="outlined" label>
                {{ item.entityLabel }}
              </v-chip>
              <v-chip
                :color="item.meta.color"
                size="small"
                variant="tonal"
                label
              >
                {{ item.meta.label }}
              </v-chip>
            </div>
          </div>
        </v-card-item>

        <v-divider></v-divider>

        <v-card-text class="p-4">
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
                v-if="row.isFile && row.fileName && item.fileFolder"
                :folder="item.fileFolder"
                :user-id="view.userId"
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
              Pengajuan penghapusan data
              <span v-if="item.entityId">(ID {{ item.entityId }})</span>.
            </template>
            <template v-else>Tidak ada rincian perubahan.</template>
          </div>
        </v-card-text>
      </v-card>

      <!-- ───── Aksi (hanya untuk pengajuan pending) ───── -->
      <div v-if="view.status === 'pending'" class="flex justify-end gap-2">
        <v-btn
          variant="outlined"
          color="red-500"
          prepend-icon="mdi-close-circle-outline"
          @click="openReview('rejected')"
        >
          Tolak
        </v-btn>
        <v-btn
          variant="flat"
          color="green-500"
          prepend-icon="mdi-check-circle-outline"
          @click="openReview('approved')"
        >
          Setujui
        </v-btn>
      </div>
    </template>
  </div>

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
          :disabled="detailStore.isSubmitting"
          @click="closeReview"
        ></v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="px-6 py-4 space-y-3">
        <div class="text-sm text-gray-600 dark:text-gray-300">
          Pengajuan #{{ requestId }} ({{ view?.items.length ?? 0 }} perubahan)
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
          :disabled="detailStore.isSubmitting"
          @click="closeReview"
        >
          Batal
        </v-btn>
        <v-btn
          :color="isApprove ? 'green-500' : 'red-500'"
          variant="flat"
          :loading="detailStore.isSubmitting"
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
import { useRoute, useRouter } from "vue-router";
import { useDateFormatter } from "@/composables/UseDateFormatter";
import { useFormatName } from "@/composables/useFormatName";
import { useUserDataApprovalDetailStore } from "@/stores/user-data-approval-detail.store";
import type {
  UserDataApprovalChangeItem,
  UserDataApprovalField,
} from "@/api/modules/user-data-approval.api";
import DataChangeFilePreview from "@/components/employee/DataChangeFilePreview.vue";
import { ENTITY_LABELS } from "@/stores/user-data-approvals.labels";

const route = useRoute();
const router = useRouter();
const detailStore = useUserDataApprovalDetailStore();
const { formatName } = useFormatName();
const { toFullDate } = useDateFormatter();

// Halaman daftar (file-based routing: src/pages/user-data-approval/index.vue)
const LIST_PATH = "/dashboard/personnel/user-data-approvals";

// ── Parameter dari URL ──────────────────────────────────────────────────
// /user-data-approval/detail?id=8&user_id=187&status=pending
const requestId = Number(route.query.id);
const userIdParam = route.query.user_id ? String(route.query.user_id) : "";
const statusParam = (route.query.status as string) || "pending";

const paramError = computed(() =>
  !requestId || !userIdParam ? "Parameter pengajuan tidak lengkap." : null,
);

// ── Snackbar ────────────────────────────────────────────────────────────
const showErrorSnackbar = ref(false);
const snackbarMessage = ref("");
const showSuccessSnackbar = ref(false);
const successMessage = ref("");

// ── Format ──────────────────────────────────────────────────────────────
const statusMeta: Record<string, { label: string; color: string }> = {
  pending: { label: "PENDING", color: "orange" },
  approved: { label: "DISETUJUI", color: "green-500" },
  rejected: { label: "DITOLAK", color: "red-500" },
};

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

// Folder file di server per entity_type: VITE_API_URL/image/{folder}/{user_id}/{nama_file}
// TODO: cek folder untuk hrd_work_experience dan hrd_file_completenesses
const FILE_FOLDERS: Record<string, string> = {
  hrd_education: "hrd-education",
  hrd_work_experience: "work-experience",
  hrd_training_certificates: "training-certificate",
  hrd_file_completenesses: "file-completeness",
};

// Field yang lebar penuh di grid
const wideFields = [
  "name",
  "school_name",
  "certificate_name",
  "company",
  "address",
  "notes",
];

// Kandidat judul item, dicari berurutan
const titleFields = [
  "hrd_master_employee_relation_id", // keluarga
  "hrd_master_education_id", // pendidikan
  "certificate_name", // sertifikat pelatihan
  "hrd_file_category_id", // kelengkapan berkas
  "company", // pengalaman kerja
  "position",
  "name",
];

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

function isDateField(f: UserDataApprovalField): boolean {
  return f.input_type === "date" || /date/i.test(f.field_name);
}

// Teks yang ditampilkan untuk satu sisi (lama / baru) dari sebuah field
function show(f: UserDataApprovalField, side: "old" | "new"): string {
  const raw = side === "old" ? f.old_value : f.new_value;
  const label = side === "old" ? f.old_label : f.new_label;

  if (raw === null || raw === undefined || raw === "") return "-";

  if (f.field_name === "gender") {
    return raw === "M" ? "Laki-Laki" : raw === "F" ? "Perempuan" : raw;
  }
  if (f.field_name === "life_status") {
    return raw === "alive" ? "Hidup" : raw === "deceased" ? "Meninggal" : raw;
  }
  if (isDateField(f)) return toFullDate(raw) ?? raw;

  return String(label ?? raw);
}

function buildItem(it: UserDataApprovalChangeItem, idx: number) {
  const fields = it.fields ?? [];
  // Pengajuan hapus menyimpan keterangannya di old_value
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
      isFile: f.input_type === "file",
      fileName: (side === "old" ? f.old_value : f.new_value) || null,
    };
  });

  const entityLabel = ENTITY_LABELS[it.entity_type] ?? it.entity_type;

  const titleField = titleFields
    .map((name) => fields.find((f) => f.field_name === name))
    .find((f) => f && show(f, side) !== "-");
  const title = titleField ? show(titleField, side) : entityLabel;

  return {
    key: `${it.request_id}-${it.item_id}-${idx}`,
    action: it.action,
    meta: actionMeta[it.action] ?? actionMeta.update,
    entityId: it.entity_id,
    entityLabel,
    fileFolder: FILE_FOLDERS[it.entity_type] ?? null,
    title,
    rows,
  };
}

const view = computed(() => {
  const req = detailStore.request;
  if (!req) return null;

  const items = (req.item ?? []).map((it, idx) => buildItem(it, idx));
  const labels = Array.from(new Set(items.map((i) => i.entityLabel)));

  return {
    id: req.id,
    userId: req.user_id,
    status: req.status,
    reviewNote: req.review_note,
    employeeName: formatName({
      name: req.user_name,
      full_name: req.user_full_name,
    }),
    employeeSub:
      req.user_employee_id ?? req.user_email ?? req.branch_alias ?? "-",
    createdAtText: fmtDateTime(req.created_at),
    processedAtText:
      req.status !== "pending" ? fmtDateTime(req.updated_at) : "",
    labels,
    items,
  };
});

// ── Load ────────────────────────────────────────────────────────────────
function goBack() {
  router.push(LIST_PATH);
}

function load() {
  if (paramError.value) return;
  return detailStore.fetchDetail(
    requestId,
    userIdParam,
    statusParam as "pending" | "approved" | "rejected",
  );
}

// ── Approve / Reject ────────────────────────────────────────────────────
const reviewDialog = ref(false);
const reviewFormRef = ref();
const reviewNote = ref("");
const reviewStatus = ref<"approved" | "rejected">("approved");
const serverErrors = reactive<Record<string, string>>({});

const isApprove = computed(() => reviewStatus.value === "approved");

const rules = {
  requiredNote: (v: any) =>
    !!(v && String(v).trim()) || "Catatan wajib diisi jika ditolak",
};

function clearServerErrors() {
  Object.keys(serverErrors).forEach((key) => delete serverErrors[key]);
}

function openReview(status: "approved" | "rejected") {
  reviewStatus.value = status;
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
  const { valid } = await reviewFormRef.value.validate();
  if (!valid) return;

  clearServerErrors();
  const status = reviewStatus.value;

  try {
    const res = await detailStore.review(
      requestId,
      status,
      reviewNote.value.trim(),
    );

    successMessage.value =
      res?.message ??
      (status === "approved"
        ? "Pengajuan perubahan data disetujui."
        : "Pengajuan perubahan data ditolak.");
    showSuccessSnackbar.value = true;
    closeReview();
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
  load();
});
</script>
