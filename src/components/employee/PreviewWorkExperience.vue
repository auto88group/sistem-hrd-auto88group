<template>
  <v-card flat class="p-1 md:p-3 space-y-3">
    <!-- ───── Toolbar ───── -->
    <div class="flex justify-end w-full gap-2">
      <v-text-field
        v-model="searchQuery"
        placeholder="Cari perusahaan, jabatan..."
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="compact"
        clearable
        hide-details
        class="max-w-xs"
        @update:model-value="onSearch"
        @click:clear="onClear"
      />
      <v-btn
        color="bg-gray-300 dark:bg-gray-600 text-indigo-900 dark:text-indigo-100 text-sm"
        prepend-icon="mdi-pencil-box"
        variant="flat"
        @click="openAddDialog(userId)"
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

    <!-- ───── Data Table ───── -->
    <v-data-table-server
      :headers="headers as any"
      :items="workExperience"
      :items-length="workExperienceStore.totalRecords"
      :items-per-page="workExperienceStore.params.length"
      :loading="workExperienceStore.isLoading"
      class="elevation-1 custom-header-table"
      @update:options="onTableOptionsChange"
    >
      <template #[`item.no`]="{ index }">
        {{ (workExperienceStore.params.start ?? 0) + index + 1 }}
      </template>

      <template #[`item.actions`]="{ item }">
        <div class="flex justify-end items-center gap-1">
          <v-btn
            icon="mdi-information-outline"
            variant="text"
            density="comfortable"
            @click="openPreviewDialog(item)"
            class="!text-blue-600 hover:!bg-blue-50 transition-all duration-300"
          />
          <v-btn
            icon="mdi-pencil-circle-outline"
            variant="text"
            density="comfortable"
            @click="openEditDialog(item)"
            class="!text-amber-600 hover:!bg-amber-50 transition-all duration-300"
          />
          <v-btn
            icon="mdi-delete-outline"
            variant="text"
            density="comfortable"
            @click="handleDelete(item.id)"
            :loading="workExperienceStore.isLoadingDestroy"
            class="!text-red-500 hover:!bg-red-50 transition-all duration-300"
          />
        </div>
      </template>
    </v-data-table-server>
  </v-card>

  <!-- ───── Dialog Tambah / Edit / Preview ───── -->
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
            isPreviewMode
              ? "Data Pengalaman Kerja"
              : isEditMode
                ? "Edit Data Pengalaman Kerja"
                : "Tambah Data Pengalaman Kerja"
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

      <!-- ── Mode Preview ── -->
      <v-card-text v-if="isPreviewMode" class="p-4">
        <div class="space-y-3 md:space-y-0 md:grid grid-cols-2 gap-4">
          <div class="col-span">
            <div class="flex flex-col">
              <span class="text-gray-500 text-sm dark:text-gray-300"
                >Nama Perusahaan</span
              >
              <span class="font-bold text-sm">{{ form.company ?? "-" }}</span>
            </div>
          </div>
          <div class="flex flex-col">
            <span class="text-gray-500 text-sm dark:text-gray-300"
              >Jenis Perusahaan</span
            >
            <span class="font-bold text-sm">{{
              form.company_type ?? "-"
            }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-gray-500 text-sm dark:text-gray-300"
              >Jabatan Terakhir</span
            >
            <span class="font-bold text-sm">{{ form.position ?? "-" }}</span>
          </div>
          <div class="flex flex-col col-span-3">
            <span class="text-gray-500 text-sm dark:text-gray-300"
              >Alamat Perusahaan</span
            >
            <span class="font-bold text-sm">{{ form.address ?? "-" }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-gray-500 text-sm dark:text-gray-300"
              >Provinsi</span
            >
            <span class="font-bold text-sm">{{
              form.province_name ?? "-"
            }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-gray-500 text-sm dark:text-gray-300"
              >Kabupaten</span
            >
            <span class="font-bold text-sm">{{
              form.regency_name ?? "-"
            }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-gray-500 text-sm dark:text-gray-300"
              >Tanggal Mulai Kerja</span
            >
            <span class="font-bold text-sm">{{
              toFullDate(form.start_date) ?? "-"
            }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-gray-500 text-sm dark:text-gray-300"
              >Tanggal Keluar</span
            >
            <span class="font-bold text-sm">{{
              toFullDate(form.end_date) ?? "-"
            }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-gray-500 text-sm dark:text-gray-300"
              >Alasan Keluar</span
            >
            <span class="font-bold text-sm">{{ form.quit_reason ?? "-" }}</span>
          </div>

          <v-card-text class="w-full col-span-3 p-0">
            <span class="text-xs font-bold text-gray-400 uppercase block"
              >Dokumen Pendukung</span
            >
            <div class="md:grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-2">
                <span class="text-sm font-semibold flex items-center gap-2">
                  <v-icon size="x-small">mdi-attachment-check</v-icon> Lampiran
                </span>
                <div v-if="form.attachment_existing" class="h-40 w-full">
                  <a
                    :href="getStorageUrl(form.attachment_existing) || undefined"
                    target="_blank"
                    class="block h-full group relative"
                  >
                    <v-img
                      v-if="isImageFile(form.attachment_existing)"
                      :src="
                        getStorageUrl(form.attachment_existing) || undefined
                      "
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

      <!-- ── Mode Tambah / Edit ── -->
      <v-card-text v-else class="p-4">
        <v-form ref="formRef">
          <div class="space-y-3 md:space-y-0 md:grid grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <v-text-field
                id="company"
                v-model="form.company"
                variant="outlined"
                density="compact"
                hide-details="auto"
                :rules="[rules.required]"
                :error-messages="serverErrors.company"
              >
                <template v-slot:label>
                  Nama Perusahaan<span class="text-red-500">*</span>
                </template>
              </v-text-field>
            </div>

            <v-text-field
              id="company_type"
              v-model="form.company_type"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :rules="[rules.required]"
              :error-messages="serverErrors.company_type"
            >
              <template v-slot:label>
                Jenis Perusahaan<span class="text-red-500">*</span>
              </template>
            </v-text-field>

            <v-text-field
              id="position"
              v-model="form.position"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :rules="[rules.required]"
              :error-messages="serverErrors.position"
            >
              <template v-slot:label>
                Jabatan Terakhir<span class="text-red-500">*</span>
              </template>
            </v-text-field>

            <v-text-field
              id="address"
              v-model="form.address"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :rules="[rules.required]"
              :error-messages="serverErrors.address"
            >
              <template v-slot:label>
                Alamat<span class="text-red-500">*</span>
              </template>
            </v-text-field>

            <v-autocomplete
              v-model="form.master_area_province_id"
              label="Provinsi"
              :items="listProvince"
              :loading="provinceStore.isLoading"
              item-title="title"
              item-value="value"
              placeholder="Pilih provinsi"
              variant="outlined"
              density="compact"
              color="primary"
              hide-details="auto"
              clearable
              no-filter
              @update:search="onSearchProvince"
              @update:model-value="onProvinceChange"
            ></v-autocomplete>

            <v-autocomplete
              v-model="form.master_area_regency_id"
              label="Kabupaten"
              :items="listRegency"
              :loading="regencyStore.isLoading"
              item-title="title"
              item-value="value"
              placeholder="Pilih Kabupaten"
              variant="outlined"
              density="compact"
              color="primary"
              hide-details="auto"
              clearable
              no-filter
              :disabled="!form.master_area_province_id"
              @update:search="onSearchRegency"
            ></v-autocomplete>

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
                Tanggal Mulai Kerja<span class="text-red-500">*</span>
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
                Tanggal Keluar<span class="text-red-500">*</span>
              </template>
            </app-date-picker>

            <v-text-field
              id="quit_reason"
              v-model="form.quit_reason"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :rules="[rules.required]"
              :error-messages="serverErrors.quit_reason"
            >
              <template v-slot:label>
                Alasan Keluar<span class="text-red-500">*</span>
              </template>
            </v-text-field>

            <div class="flex flex-col gap-1 col-span-2">
              <v-file-input
                v-model="form.attachment"
                label="Sertifikat"
                variant="outlined"
                density="compact"
                hide-details="auto"
                accept=".pdf,.jpg,.jpeg,.png"
                prepend-icon=""
                prepend-inner-icon="mdi-paperclip"
                :rules="[rules.file]"
                :error-messages="serverErrors.certificate"
              ></v-file-input>

              <!-- Preview file existing + tombol hapus -->
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
          </div>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions v-if="!isPreviewMode" class="px-6 py-4 gap-2 justify-end">
        <v-btn variant="outlined" @click="closeDialog">Batal</v-btn>
        <v-btn
          color="bg-indigo-300 dark:bg-indigo-500"
          variant="flat"
          :prepend-icon="isEditMode ? 'mdi-content-save' : 'mdi-plus'"
          :loading="
            isEditMode
              ? workExperienceStore.isLoadingUpdate
              : workExperienceStore.isLoadingCreate
          "
          @click="submitForm"
        >
          {{ isEditMode ? "Simpan Perubahan" : "Tambah Data" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
// ─────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────
import { nextTick, reactive, ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";

import { useDateFormatter } from "@/composables/UseDateFormatter";
import { useConfirmDialog } from "@/composables/useConfirmDialog";
import { useProvinceStore } from "@/stores/province.store";
import { useRegencyStore } from "@/stores/regency.store";
import { useWorkExperienceStore } from "@/stores/work-experience.store";

import AppDatePicker from "../AppDatePicker.vue";
import ConfirmDialog from "../ConfirmDialog.vue";

// ─────────────────────────────────────────────
// 2. COMPOSABLES & STORES
// ─────────────────────────────────────────────
const route = useRoute();
const { ask } = useConfirmDialog();
const { toFullDate } = useDateFormatter();

const workExperienceStore = useWorkExperienceStore();
const provinceStore = useProvinceStore();
const regencyStore = useRegencyStore();

// ─────────────────────────────────────────────
// 3. CONSTANTS & ENV
// ─────────────────────────────────────────────
const apiUrl = import.meta.env.VITE_API_URL;
const userId = route.params.id;

const headers = [
  { title: "No", key: "no", sortable: false, width: "60px" },
  { title: "Nama Perusahaan", key: "company", sortable: false },
  { title: "Jenis Perusahaan", key: "company_type", sortable: false },
  { title: "Jabatan Terakhir", key: "position", sortable: false },
  { title: "Aksi", key: "actions", sortable: false, align: "end" },
];

const PRIORITY_FIELDS = [
  "company",
  "company_type",
  "position",
  "address",
  "master_area_province_id",
  "master_area_regency_id",
  "start_date",
  "end_date",
  "quit_reason",
  "attachment",
];

// ─────────────────────────────────────────────
// 4. REACTIVE STATE
// ─────────────────────────────────────────────

// — Computed data dari store —
const workExperience = computed(() => workExperienceStore.workExperience);

// — Search —
const searchQuery = ref("");
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

// — Area (Provinsi & Kabupaten) —
const searchProvince = ref("");
const searchRegency = ref("");

// — Snackbar —
const showErrorSnackbar = ref(false);
const snackbarMessage = ref("");
const showSuccessSnackbar = ref(false);
const successMessage = ref("");

// — Dialog —
const dialog = ref(false);
const isPreviewMode = ref(false);
const isEditMode = ref(false);
const formRef = ref();

// — Form default & reactive —
const defaultForm = () => ({
  id: null as number | null,
  user_id: null as number | null,
  company: "",
  company_type: "",
  position: "",
  address: "",
  master_area_province_id: null as string | null,
  province_name: null as string | null,
  master_area_regency_id: null as string | null,
  regency_name: null as string | null,
  start_date: "",
  end_date: "",
  quit_reason: "",
  attachment: [] as File[],
  attachment_existing: null as any,
  remove_attachment: false,
});

const form = reactive(defaultForm());
const serverErrors = reactive<Record<string, string>>({});

// — Validation rules —
const rules = {
  required: (v: any) => !!v || "Field ini wajib diisi",
  file: (v: File | File[]) => {
    if (!v) return true;
    const file = Array.isArray(v) ? v[0] : v;
    if (!file) return true;

    const maxSize = 15 * 1024 * 1024;
    if (file.size > maxSize) return "Ukuran file maksimal 15MB";

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type))
      return "Format file harus jpg, jpeg, png, webp, atau pdf";

    return true;
  },
};

// ─────────────────────────────────────────────
// 5. COMPUTED (list dropdown)
// ─────────────────────────────────────────────
const listProvince = computed(() => {
  const keyword = searchProvince.value.toLowerCase();
  return provinceStore.province
    .filter((p) => !keyword || p.name.toLowerCase().includes(keyword))
    .map((p) => ({ title: p.name, value: p.id }));
});

const listRegency = computed(() => {
  const keyword = searchRegency.value.toLowerCase();
  return regencyStore.regency
    .filter((r) => !keyword || r.name.toLowerCase().includes(keyword))
    .map((r) => ({ title: r.name, value: r.id }));
});

// ─────────────────────────────────────────────
// 6. HELPER / UTILITY FUNCTIONS
// ─────────────────────────────────────────────
function showError(message: string) {
  snackbarMessage.value = message;
  showErrorSnackbar.value = true;
}

function showSuccess(message: string) {
  successMessage.value = message;
  showSuccessSnackbar.value = true;
}

function getStorageUrl(
  filename: string | File | null | undefined,
): string | null {
  if (!filename) return null;
  if (filename instanceof File) return URL.createObjectURL(filename);
  return `${apiUrl}/image/work-experience/${userId}/${filename}`;
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

function buildFormData(): FormData {
  const fd = new FormData();
  fd.append("user_id", String(form.user_id));
  fd.append("company", form.company);
  fd.append("company_type", form.company_type);
  fd.append("position", form.position);
  fd.append("address", form.address);
  fd.append("master_area_province_id", String(form.master_area_province_id));
  fd.append("master_area_regency_id", String(form.master_area_regency_id));
  fd.append("start_date", form.start_date);
  fd.append("end_date", form.end_date);
  fd.append("quit_reason", form.quit_reason);

  const attFile = Array.isArray(form.attachment)
    ? form.attachment[0]
    : form.attachment;
  if (attFile instanceof File) fd.append("attachment", attFile);
  if (form.attachment_existing !== null)
    fd.append("attachment_preview", form.attachment_existing);
  if (form.remove_attachment) fd.append("remove_attachment", "1");

  return fd;
}

function scrollToFirstError(serverErr?: Record<string, string>) {
  if (serverErr) {
    for (const field of PRIORITY_FIELDS) {
      if (serverErr[field]) {
        document
          .getElementById(field)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
    }
  }
  for (const field of PRIORITY_FIELDS) {
    const el = document.getElementById(field);
    if (el?.closest(".v-input")?.classList.contains("v-input--error")) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
  }
}

function handleServerErrors(err: any) {
  if (err?.status === 422) {
    const errors = err.errors as Record<string, string[]>;
    if (errors) {
      Object.entries(errors).forEach(([field, messages]) => {
        serverErrors[field] = messages[0];
      });
      nextTick(() => scrollToFirstError(serverErrors));
    }
  } else {
    showError(err?.message ?? "Terjadi kesalahan, coba lagi.");
  }
}

// ─────────────────────────────────────────────
// 7. SEARCH & TABLE HANDLERS
// ─────────────────────────────────────────────
function onSearch(value: string | null) {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    workExperienceStore.params.search_slug = value ?? "";
    workExperienceStore.params.start = 0;
    workExperienceStore.fetchWorkExperience();
  }, 400);
}

function onClear() {
  searchQuery.value = "";
  workExperienceStore.params.search_slug = "";
  workExperienceStore.params.start = 0;
  workExperienceStore.fetchWorkExperience();
}

function onTableOptionsChange(options: { page: number; itemsPerPage: number }) {
  workExperienceStore.params.length = options.itemsPerPage;
  workExperienceStore.params.start = (options.page - 1) * options.itemsPerPage;
  workExperienceStore.fetchWorkExperience();
}

// ─────────────────────────────────────────────
// 8. AREA (PROVINSI & KABUPATEN) HANDLERS
// ─────────────────────────────────────────────
function onSearchProvince(val: any) {
  searchProvince.value = val ?? "";
}

function onSearchRegency(val: any) {
  searchRegency.value = val ?? "";
}

function onProvinceChange() {
  form.master_area_regency_id = null;
  regencyStore.regency = [];
  regencyStore.regencyParams.province_id = form.master_area_province_id ?? "";
  regencyStore.fetchRegency();
}

function loadFirstTimeMasterArea() {
  if (form.master_area_province_id) {
    regencyStore.regencyParams.province_id = form.master_area_province_id;
    regencyStore.fetchRegency();
  }
}

// ─────────────────────────────────────────────
// 9. DIALOG HANDLERS (open / close)
// ─────────────────────────────────────────────
function closeDialog() {
  dialog.value = false;
  formRef.value?.reset();
  Object.keys(serverErrors).forEach((key) => delete serverErrors[key]);
}

function openPreviewDialog(item: any) {
  isEditMode.value = false;
  isPreviewMode.value = true;
  Object.assign(form, {
    id: item.id,
    user_id: item.user_id,
    company: item.company,
    company_type: item.company_type,
    position: item.position,
    address: item.address,
    master_area_province_id: item.master_area_province_id,
    province_name: item.province_name,
    master_area_regency_id: item.master_area_regency_id,
    regency_name: item.regency_name,
    start_date: item.start_date,
    end_date: item.end_date,
    quit_reason: item.quit_reason,
    attachment: [],
    attachment_existing: item.attachment ?? null,
  });
  dialog.value = true;
}

function openAddDialog(userId: any) {
  isEditMode.value = false;
  isPreviewMode.value = false;
  Object.assign(form, defaultForm());
  form.user_id = userId;
  dialog.value = true;
}

function openEditDialog(item: any) {
  isEditMode.value = true;
  isPreviewMode.value = false;
  Object.assign(form, {
    id: item.id,
    user_id: item.user_id,
    company: item.company,
    company_type: item.company_type,
    position: item.position,
    address: item.address,
    master_area_province_id: item.master_area_province_id,
    province_name: item.province_name,
    master_area_regency_id: item.master_area_regency_id,
    regency_name: item.regency_name,
    start_date: item.start_date,
    end_date: item.end_date,
    quit_reason: item.quit_reason,
    attachment: [],
    attachment_existing: item.attachment ?? null,
  });
  loadFirstTimeMasterArea();
  dialog.value = true;
}

// ─────────────────────────────────────────────
// 10. FORM & ATTACHMENT ACTIONS
// ─────────────────────────────────────────────
function removeAttachment() {
  form.attachment_existing = null;
  form.remove_attachment = true;
}

async function submitForm() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  Object.keys(serverErrors).forEach((key) => delete serverErrors[key]);

  if (isEditMode.value) {
    try {
      await workExperienceStore.updateWorkExperience(
        Number(form.id),
        buildFormData(),
      );
      showSuccess("Data pengelaman kerja berhasil diperbarui.");
      closeDialog();
    } catch (err: any) {
      handleServerErrors(err);
    }
  } else {
    try {
      await workExperienceStore.createWorkExperience(buildFormData());
      showSuccess("Data pengalaman kerja berhasil ditambahkan.");
      closeDialog();
    } catch (err: any) {
      handleServerErrors(err);
    }
  }
}

// ─────────────────────────────────────────────
// 11. CRUD ACTIONS (Delete)
// ─────────────────────────────────────────────
async function handleDelete(id: number) {
  const confirmed = await ask({
    title: "Hapus Pengalaman Kerja",
    message: "Data ini akan dihapus. Lanjutkan?",
    confirmText: "Ya, Hapus",
    color: "red-darken-1",
  });
  if (confirmed) deleteWorkExperience(id);
}

async function deleteWorkExperience(id: number) {
  try {
    await workExperienceStore.destroyWorkExperience(id);
    showSuccess("Data pengalaman kerja berhasil dihapus.");
  } catch (err: any) {
    showError(err?.message ?? "Gagal menghapus data pengalaman kerja.");
  }
}

// ─────────────────────────────────────────────
// 12. LIFECYCLE
// ─────────────────────────────────────────────
onMounted(() => {
  workExperienceStore.fetchWorkExperience();
  provinceStore.fetchProvince();
});
</script>
