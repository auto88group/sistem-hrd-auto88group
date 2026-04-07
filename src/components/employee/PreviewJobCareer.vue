<template>
  <div v-if="jobCareerStore.isLoadingSelected">
    <v-card v-for="n in 3" :key="n" flat class="p-3">
      <v-skeleton-loader
        type="heading, divider, list-item-two-line@3"
        elevation="0"
      ></v-skeleton-loader>
    </v-card>
  </div>
  <v-card v-else flat class="p-1 md:p-3 space-y-3">
    <!-- ───── Toolbar ───── -->
    <div class="flex justify-end w-full gap-2">
      <v-btn
        color="bg-gray-300 dark:bg-gray-600 text-indigo-900 dark:text-indigo-100 text-sm"
        prepend-icon="mdi-pencil-box"
        variant="flat"
        @click="openAddDialog(jobCareerStore.JobCareerSelectedParams.user_id)"
      >
        Tambah Data
      </v-btn>
    </div>

    <confirm-dialog />

    <!-- ───── Snackbar Error ───── -->
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

    <!-- ───── Snackbar Success ───── -->
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

    <div class="flex flex-col gap-5">
      <v-card
        v-for="(item, index) in jobCareerStore.JobCareerSelected"
        :key="item.id"
        variant="flat"
        border
        class="mx-auto w-full rounded-lg"
      >
        <v-card-item class="bg-gray-100 dark:bg-gray-800">
          <div class="flex items-center justify-between">
            <v-card-title class="text-base font-bold flex items-center gap-2">
              <v-icon icon="mdi-school" color="primary" size="small"></v-icon>
              {{ getEmployeeStatusLabel(item.status_id) ?? "-" }}
            </v-card-title>
            <div class="flex gap-2">
              <v-btn
                icon="mdi-pencil"
                variant="text"
                color="text-amber-500"
                size="small"
                @click="openEditDialog(item)"
              ></v-btn>
              <v-btn
                icon="mdi-delete"
                variant="text"
                color="text-red-600"
                size="small"
                :loading="jobCareerStore.isLoadingDestroy"
                @click="handleDelete(item.id)"
              ></v-btn>
            </div>
          </div>
        </v-card-item>

        <v-divider></v-divider>

        <v-card-text class="p-4">
          <div class="space-y-3 md:space-y-0 md:grid grid-cols-3 gap-4">
            <div class="flex flex-col col-span-3">
              <span class="text-gray-500 text-sm dark:text-gray-300"
                >Nomor Surat Keputusan</span
              >
              <span class="font-bold text-sm">{{
                item.reference_number ?? "-"
              }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-gray-500 text-sm dark:text-gray-300"
                >Jabatan</span
              >
              <span class="font-bold text-sm">{{ item.position ?? "-" }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-gray-500 text-sm dark:text-gray-300"
                >Cabang</span
              >
              <span class="font-bold text-sm">{{
                item.branch_name ?? "-"
              }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-gray-500 text-sm dark:text-gray-300"
                >Tanggal Mulai</span
              >
              <span class="font-bold text-sm">
                {{ toFullDate(item.start_date) ?? "-" }}
              </span>
            </div>
            <div class="flex flex-col">
              <span class="text-gray-500 text-sm dark:text-gray-300"
                >Tanggal Berakhir</span
              >
              <span class="font-bold text-sm">
                {{ toFullDate(item.end_date) ?? "-" }}
              </span>
            </div>
            <div class="flex flex-col">
              <span class="text-gray-500 text-sm dark:text-gray-300"
                >Status</span
              >
              <div
                class="font-bold text-sm inline-block px-2 py-0.5 rounded w-fit"
                :class="statusColor(item.status_id ?? 0)"
              >
                {{ statusLabel(item.status_id ?? 0) }}
              </div>
            </div>
            <div class="flex flex-col">
              <span class="text-gray-500 text-sm dark:text-gray-300"
                >Keterangan Status</span
              >
              <span class="font-bold text-sm">{{ item.note ?? "-" }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-gray-500 text-sm dark:text-gray-300"
                >Data Ini Berlaku</span
              >
              <div
                class="font-bold text-sm inline-block px-2 py-0.5 rounded w-fit"
                :class="statusYesOrNoColor(item.status_id ?? 0)"
              >
                {{ statusYesOrNoLabel(item.status_id ?? 0) }}
              </div>
            </div>

            <v-card-text class="w-full col-span-3 p-0">
              <span class="text-xs font-bold text-gray-400 uppercase block"
                >Dokumen Pendukung</span
              >
              <div class="md:grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-2">
                  <span class="text-sm font-semibold flex items-center gap-2">
                    <v-icon size="x-small">mdi-attachment-check</v-icon>
                    Lampiran
                  </span>
                  <div v-if="item.attachment" class="h-40 w-full">
                    <a
                      :href="getStorageUrl(item.attachment) || undefined"
                      target="_blank"
                      class="block h-full group relative"
                    >
                      <v-img
                        v-if="isImageFile(item.attachment)"
                        :src="getStorageUrl(item.attachment) || undefined"
                        class="h-40 w-full rounded border bg-white"
                        cover
                      >
                        <div
                          class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <v-icon color="white">mdi-eye</v-icon>
                        </div>
                      </v-img>
                      <div
                        v-else
                        class="h-40 flex flex-col items-center justify-center border-2 border-dashed rounded bg-white dark:bg-gray-800 hover:border-indigo-500 transition-colors"
                      >
                        <v-icon color="red-lighten-1" size="large"
                          >mdi-file-pdf-box</v-icon
                        >
                        <span
                          class="text-xs mt-2 px-4 text-center truncate w-full text-indigo-600"
                        >
                          {{ form.attachment }}
                        </span>
                      </div>
                    </a>
                  </div>
                  <div
                    v-else
                    class="h-40 flex items-center justify-center border rounded bg-gray-100 dark:bg-gray-800 text-gray-400 text-xs italic"
                  >
                    Tidak ada sertifikat
                  </div>
                </div>
              </div>
            </v-card-text>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-card>

  <!-- ───── Dialog Tambah / Edit ───── -->
  <v-dialog v-model="dialog" max-width="700" scrollable>
    <v-card rounded="lg">
      <v-card-title class="flex items-center gap-2 px-6 pt-5 pb-3">
        <v-icon
          :icon="isEditMode ? 'mdi-pencil' : 'mdi-briefcase'"
          color="primary"
          size="small"
        ></v-icon>
        <span class="text-base font-bold">
          {{
            isEditMode
              ? "Edit Data Karir Pekerjaan"
              : "Tambah Data Karir Pekerjaan"
          }}
        </span>
        <v-spacer></v-spacer>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="closeDialog"
        ></v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="px-6 py-4">
        <v-form ref="formRef">
          <div class="space-y-3 md:space-y-0 md:grid grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <v-text-field
                id="reference_number"
                v-model="form.reference_number"
                variant="outlined"
                density="compact"
                hide-details="auto"
                :rules="[rules.required]"
                :error-messages="serverErrors.reference_number"
              >
                <template v-slot:label>
                  Nomor Surat Keputusan<span class="text-red-500">*</span>
                </template>
              </v-text-field>
            </div>
            <v-autocomplete
              v-model="form.master_position_id"
              :items="listPosition"
              :loading="positionStore.isLoadingData"
              item-title="title"
              item-value="value"
              placeholder="Pilih jabatan"
              variant="outlined"
              density="compact"
              color="primary"
              hide-details="auto"
              clearable
              no-filter
              @update:search="onSearchPosition"
              :rules="[rules.required]"
              :error-messages="serverErrors.master_position_id"
            >
              <template v-slot:label>
                Jabatan<span class="text-red-500">*</span>
              </template>
            </v-autocomplete>

            <v-autocomplete
              v-model="form.branch_id"
              :items="listBranch"
              :loading="branchStore.isLoadingData"
              prepend-inner-icon="mdi-map-marker-outline"
              item-title="alias"
              item-value="value"
              placeholder="Pilih cabang"
              variant="outlined"
              density="compact"
              color="primary"
              class="custom-input"
              hide-details="auto"
              clearable
              no-filter
              @update:search="onSearchBranch"
              :rules="[rules.required]"
              :error-messages="serverErrors.branch_id"
            >
              <template v-slot:label>
                Cabang <span class="text-red-500">*</span>
              </template>
              <template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :title="item.alias"
                  :subtitle="item.title"
                >
                </v-list-item>
              </template>
            </v-autocomplete>

            <app-date-picker
              id="start_date"
              v-model="form.start_date"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :rules="[rules.required]"
              :error-messages="serverErrors.start_date"
            >
              <template v-slot:label>
                Tanggal Mulai<span class="text-red-500">*</span>
              </template>
            </app-date-picker>

            <app-date-picker
              id="end_date"
              v-model="form.end_date"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :rules="[rules.required]"
              :error-messages="serverErrors.end_date"
            >
              <template v-slot:label>
                Tanggal Berakhir<span class="text-red-500">*</span>
              </template>
            </app-date-picker>

            <v-select
              v-model="form.status_id"
              variant="outlined"
              density="compact"
              :items="employeeStatusOptions"
              item-title="label"
              item-value="value"
              hide-details="auto"
              :rules="[rules.required]"
              :error-messages="serverErrors.status_id"
            >
              <template v-slot:label>
                Status <span class="text-red-500">*</span>
              </template>
            </v-select>

            <v-text-field
              id="note"
              v-model="form.note"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :rules="[rules.required]"
              :error-messages="serverErrors.note"
            >
              <template v-slot:label>
                Catatan Status<span class="text-red-500">*</span>
              </template>
            </v-text-field>

            <div class="flex flex-col gap-1 col-span-2">
              <v-file-input
                v-model="form.attachment"
                label="Lampiran"
                variant="outlined"
                density="compact"
                hide-details="auto"
                accept=".pdf,.jpg,.jpeg,.png"
                prepend-icon=""
                prepend-inner-icon="mdi-paperclip"
                :error-messages="serverErrors.attachment"
              ></v-file-input>

              <!-- Preview existing + tombol hapus -->
              <div
                v-if="
                  form.attachment_existing &&
                  !getFileFromModel(form.attachment as any)
                "
                class="flex items-center gap-2 text-xs text-gray-500 border rounded px-3 py-2 bg-gray-50 dark:bg-gray-800"
              >
                <v-icon size="x-small" color="red">mdi-file-pdf-box</v-icon>
                <span class="truncate flex-1">{{
                  form.attachment_existing
                }}</span>
                <v-btn
                  icon="mdi-close-circle"
                  variant="text"
                  size="x-small"
                  color="red"
                  @click="removeAttachment"
                ></v-btn>
              </div>
            </div>

            <v-select
              v-model="form.is_active"
              variant="outlined"
              density="compact"
              :items="employeeIsActiveOptions"
              item-title="label"
              item-value="value"
              hide-details="auto"
              :rules="[rules.required]"
              :error-messages="serverErrors.is_active"
            >
              <template v-slot:label>
                Status<span class="text-red-500">*</span>
              </template>
            </v-select>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useJobCareerStore } from "@/stores/job-career.store";
import { computed, onMounted, reactive, ref } from "vue";
import ConfirmDialog from "../ConfirmDialog.vue";
import { useConfirmDialog } from "@/composables/useConfirmDialog";
import { useRoute } from "vue-router";
import { useDateFormatter } from "@/composables/UseDateFormatter";
import { useEmployeeStatus } from "@/composables/UseEmployeeStatus";
import { useYesOrNoStatus } from "@/composables/UseYesOrNoStatus";
import { usePositionStore } from "@/stores/position.store";
import { useBranchStore } from "@/stores/branch.store";
import AppDatePicker from "../AppDatePicker.vue";
// ─────────────────────────────────────────────────────────────
// 1. STORES, COMPOSSABLE & ROUTE
// ─────────────────────────────────────────────────────────────
const jobCareerStore = useJobCareerStore();
const positionStore = usePositionStore();
const branchStore = useBranchStore();
const route = useRoute();
const { ask } = useConfirmDialog();
const { toFullDate } = useDateFormatter();
const { statusLabel, statusColor } = useEmployeeStatus();
const { statusYesOrNoLabel, statusYesOrNoColor } = useYesOrNoStatus();

const userId = route.params.id;
const apiUrl = import.meta.env.VITE_API_URL ?? "";

// ─────────────────────────────────────────────────────────────
// 2. SNACKBAR STATE
// ─────────────────────────────────────────────────────────────
const showErrorSnackbar = ref(false);
const snackbarMessage = ref("");
const showSuccessSnackbar = ref(false);
const successMessage = ref("");

function showError(message: string) {
  snackbarMessage.value = message;
  showErrorSnackbar.value = true;
}

function showSuccess(message: string) {
  successMessage.value = message;
  showSuccessSnackbar.value = true;
}

const searchPosition = ref("");
const searchBranch = ref("");
const listPosition = computed(() => {
  const keyword = searchPosition.value.toLowerCase();

  return positionStore.positionData
    .filter((position) =>
      keyword ? position.name.toLowerCase().includes(keyword) : true,
    )
    .map((position) => ({
      title: position.name,
      value: position.id,
      level_name: position.level_name,
    }));
});
const listBranch = computed(() => {
  const keyword = searchBranch.value.toLowerCase();
  return branchStore.branchData
    .filter((branch) => {
      if (!keyword) return true;

      return (
        branch.name.toLowerCase().includes(keyword) ||
        branch.alias.toLowerCase().includes(keyword)
      );
    })
    .map((branch) => ({
      title: branch.name,
      alias: branch.alias,
      value: branch.id,
    }));
});

const onSearchPosition = (val: any) => {
  searchPosition.value = val ?? "";
};

const onSearchBranch = (val: any) => {
  searchBranch.value = val ?? "";
};

// ─────────────────────────────────────────────────────────────
// 3. DIALOG STATE
// ─────────────────────────────────────────────────────────────
const dialog = ref(false);
const isEditMode = ref(false);
const formRef = ref();

// ─────────────────────────────────────────────────────────────
// 4. FORM MODEL
// ─────────────────────────────────────────────────────────────
const defaultForm = () => ({
  id: null as number | null,
  user_id: null as number | null,
  reference_number: "",
  position: "",
  master_position_id: null as number | null,
  branch_id: null as number | null,
  start_date: "",
  end_date: "",
  status_id: "",
  note: "",
  is_active: "",
  attachment: [] as File[],
  attachment_existing: null as any,
  remove_attachment: false,
});

const form = reactive(defaultForm());
const serverErrors = reactive<Record<string, string>>({});

const rules = {
  required: (v: any) => !!v || "Field ini wajib diisi",
};

// ─────────────────────────────────────────────────────────────
// 6. FILE HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────
function getStorageUrl(
  filename: string | File | null | undefined,
): string | null {
  if (!filename) return null;
  if (filename instanceof File) return URL.createObjectURL(filename);
  return `${apiUrl}/image/career-job/${userId}/${filename}`;
}

function isImageFile(filename: string | File): boolean {
  const name = filename instanceof File ? filename.name : filename;
  return /\.(jpg|jpeg|png|webp|gif)$/i.test(name);
}

function getFileFromModel(model: File | File[] | null): File | null {
  if (!model) return null;
  const file = Array.isArray(model) ? model[0] : model;
  return file instanceof File ? file : null;
}

function buildPreview(
  file: File,
  objectUrlRef: ReturnType<typeof ref<string | null>>,
): { url: string; name: string; type: "image" | "pdf" } | null {
  if (!objectUrlRef.value) return null;
  return {
    url: objectUrlRef.value,
    name: file.name,
    type: file.type.startsWith("image/") ? "image" : "pdf",
  };
}

function removeAttachment() {
  form.attachment_existing = null;
  form.remove_attachment = true;
}

// ─────────────────────────────────────────────
// 8. COMPUTED (list dropdown)
// ─────────────────────────────────────────────
const employeeStatusOptions = [
  { label: "Kontrak", value: 1 },
  { label: "Tetap", value: 2 },
  { label: "Resign", value: 3 },
  { label: "Dikeluarkan", value: 4 },
  { label: "Pensiun", value: 5 },
];
const employeeIsActiveOptions = [
  { label: "Berlaku", value: 1 },
  { label: "Tidak", value: 0 },
];

const getEmployeeStatusLabel = (id: any) => {
  const found = employeeStatusOptions.find((item) => item.value === id);
  return found ? found.label : "-";
};

// ─────────────────────────────────────────────────────────────
// 9. DIALOG ACTIONS (open / close)
// ─────────────────────────────────────────────────────────────
function openAddDialog(userId: any) {
  isEditMode.value = false;
  Object.assign(form, defaultForm());
  form.user_id = userId;
  dialog.value = true;
}
function openEditDialog(item: any) {
  isEditMode.value = true;
  Object.assign(form, {
    id: item.id,
    user_id: item.user_id,
    reference_number: item.reference_number ?? "",
    position: item.position ?? "",
    master_position_id: item.master_position_id ?? null,
    branch_id: item.branch_id ?? null,
    start_date: item.start_date ?? "",
    end_date: item.end_date ?? "",
    status_id: item.status_id ?? "",
    note: item.note ?? "",
    is_active: item.is_active ?? "",
    attachment: [],
    attachment_existing: item.attachment ?? null,
  });
  dialog.value = true;
}

function closeDialog() {
  dialog.value = false;
  formRef.value?.reset();
  Object.keys(serverErrors).forEach((key) => delete serverErrors[key]);
}

// ─────────────────────────────────────────────────────────────
// 11. CRUD ACTIONS
// ─────────────────────────────────────────────────────────────
async function handleDelete(id: number) {
  const confirmed = await ask({
    title: "Hapus Karir Pekerjaan",
    message: "Data ini akan dihapus. Lanjutkan?",
    confirmText: "Ya, Hapus",
    color: "red-darken-1",
  });
  if (confirmed) deleteEducation(id);
}
async function deleteEducation(id: number) {
  try {
    await jobCareerStore.destroyJobCareer(id);
    showSuccess("Data berhasil dihapus.");
  } catch (err: any) {
    showError(err?.message ?? "Gagal menghapus data.");
  }
}

// ─────────────────────────────────────────────────────────────
// 12. LIFECYCLE
// ─────────────────────────────────────────────────────────────
onMounted(async () => {
  if (jobCareerStore.JobCareerSelected.length === 0) {
    jobCareerStore.JobCareerSelectedParams.user_id = userId as string;
    await jobCareerStore.fetchJobCareerSelected();
  }
  branchStore.fetchBranchData();
  positionStore.fetchPositionData();
});
</script>
