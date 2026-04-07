<template>
  <div v-if="hrdEducationStore.isLoadingSelected">
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
        @click="
          openAddDialog(hrdEducationStore.hrdEducationSelectedParams.user_id)
        "
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

    <!-- ───── Daftar Pendidikan ───── -->
    <div class="flex flex-col gap-5">
      <v-card
        v-for="(item, index) in hrdEducationStore.hrdEducationSelected"
        :key="item.id"
        variant="flat"
        border
        class="mx-auto w-full rounded-lg"
      >
        <v-card-item class="bg-gray-100 dark:bg-gray-800">
          <div class="flex items-center justify-between">
            <v-card-title class="text-base font-bold flex items-center gap-2">
              <v-icon icon="mdi-school" color="primary" size="small"></v-icon>
              {{ item.education_name ?? "-" }}
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
                :loading="hrdEducationStore.isLoadingDestroy"
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
                >Nama Sekolah / Institusi</span
              >
              <span class="font-bold text-sm">{{
                item.school_name ?? "-"
              }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-gray-500 text-sm dark:text-gray-300"
                >Jurusan</span
              >
              <span class="font-bold text-sm">{{ item.major ?? "-" }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-gray-500 text-sm dark:text-gray-300"
                >Gelar</span
              >
              <span class="font-bold text-sm">{{ item.title ?? "-" }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-gray-500 text-sm dark:text-gray-300">Asal</span>
              <span class="font-bold text-sm">{{ item.from ?? "-" }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-gray-500 text-sm dark:text-gray-300"
                >Tahun Masuk</span
              >
              <span class="font-bold text-sm">{{ item.year_in ?? "-" }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-gray-500 text-sm dark:text-gray-300"
                >Tahun Lulus</span
              >
              <span class="font-bold text-sm">{{
                item.graduation_year ?? "-"
              }}</span>
            </div>

            <v-card-text class="w-full col-span-3 p-0">
              <span class="text-xs font-bold text-gray-400 uppercase block"
                >Dokumen Pendukung</span
              >

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex flex-col gap-2">
                  <span class="text-sm font-semibold flex items-center gap-2">
                    <v-icon size="x-small">mdi-certificate</v-icon> Sertifikat
                  </span>
                  <div v-if="item.certificate" class="h-40 w-full">
                    <a
                      :href="getStorageUrl(item.certificate) || undefined"
                      target="_blank"
                      class="block h-full group relative"
                    >
                      <v-img
                        v-if="isImageFile(item.certificate)"
                        :src="getStorageUrl(item.certificate) || undefined"
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
                          >{{ item.certificate }}</span
                        >
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

                <div class="flex flex-col gap-2">
                  <span class="text-sm font-semibold flex items-center gap-2">
                    <v-icon size="x-small">mdi-file-document-outline</v-icon>
                    Transkrip Nilai
                  </span>
                  <div v-if="item.transcripts" class="h-40 w-full">
                    <a
                      :href="getStorageUrl(item.transcripts) || undefined"
                      target="_blank"
                      class="block h-full group relative"
                    >
                      <v-img
                        v-if="isImageFile(item.transcripts)"
                        :src="getStorageUrl(item.transcripts) || undefined"
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
                          >{{ item.transcripts }}</span
                        >
                      </div>
                    </a>
                  </div>
                  <div
                    v-else
                    class="h-40 flex items-center justify-center border rounded bg-gray-100 dark:bg-gray-800 text-gray-400 text-xs italic"
                  >
                    Tidak ada transkrip
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
          :icon="isEditMode ? 'mdi-pencil' : 'mdi-school'"
          color="primary"
          size="small"
        ></v-icon>
        <span class="text-base font-bold">
          {{ isEditMode ? "Edit Data Pendidikan" : "Tambah Data Pendidikan" }}
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
              <v-autocomplete
                id="hrd_master_education_id"
                v-model="form.hrd_master_education_id"
                :items="listEducation"
                :loading="educationStore.isLoadingData"
                item-title="title"
                item-value="value"
                placeholder="Pilih tingkat pendidikan"
                variant="outlined"
                density="compact"
                color="primary"
                hide-details="auto"
                clearable
                no-filter
                :rules="[rules.required]"
                @update:search="onSearchEducation"
                :error-messages="serverErrors.hrd_master_education_id"
              >
                <template v-slot:label>
                  Tingkat Pendidikan<span class="text-red-500">*</span>
                </template>
              </v-autocomplete>
            </div>

            <div class="md:col-span-2">
              <v-text-field
                id="school_name"
                v-model="form.school_name"
                variant="outlined"
                density="compact"
                hide-details="auto"
                :rules="[rules.required]"
                :error-messages="serverErrors.school_name"
              >
                <template v-slot:label>
                  Nama Sekolah / Institusi<span class="text-red-500">*</span>
                </template>
              </v-text-field>
            </div>

            <v-text-field
              id="major"
              v-model="form.major"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :rules="[rules.required]"
              :error-messages="serverErrors.major"
            >
              <template v-slot:label
                >Jurusan<span class="text-red-500">*</span></template
              >
            </v-text-field>

            <v-text-field
              id="title"
              v-model="form.title"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :rules="[rules.required]"
              :error-messages="serverErrors.title"
            >
              <template v-slot:label
                >Gelar<span class="text-red-500">*</span></template
              >
            </v-text-field>

            <v-text-field
              id="from"
              v-model="form.from"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :rules="[rules.required]"
              :error-messages="serverErrors.from"
            >
              <template v-slot:label
                >Asal<span class="text-red-500">*</span></template
              >
            </v-text-field>

            <v-text-field
              id="year_in"
              v-model="form.year_in"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :rules="[rules.required]"
              :error-messages="serverErrors.year_in"
            >
              <template v-slot:label
                >Tahun Masuk<span class="text-red-500">*</span></template
              >
            </v-text-field>

            <v-text-field
              id="graduation_year"
              v-model="form.graduation_year"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :rules="[rules.required]"
              :error-messages="serverErrors.graduation_year"
            >
              <template v-slot:label
                >Tahun Lulus<span class="text-red-500">*</span></template
              >
            </v-text-field>

            <div class="flex flex-col gap-1">
              <v-file-input
                v-model="form.certificate"
                label="Sertifikat"
                variant="outlined"
                density="compact"
                hide-details="auto"
                accept=".pdf,.jpg,.jpeg,.png"
                prepend-icon=""
                prepend-inner-icon="mdi-paperclip"
                :error-messages="serverErrors.certificate"
              ></v-file-input>

              <!-- Preview existing + tombol hapus -->
              <div
                v-if="
                  form.certificate_existing &&
                  !getFileFromModel(form.certificate as any)
                "
                class="flex items-center gap-2 text-xs text-gray-500 border rounded px-3 py-2 bg-gray-50 dark:bg-gray-800"
              >
                <v-icon size="x-small" color="red">mdi-file-pdf-box</v-icon>
                <span class="truncate flex-1">{{
                  form.certificate_existing
                }}</span>
                <v-btn
                  icon="mdi-close-circle"
                  variant="text"
                  size="x-small"
                  color="red"
                  @click="removeCertificate"
                ></v-btn>
              </div>
            </div>

            <!-- Ganti v-file-input transcripts -->
            <div class="flex flex-col gap-1">
              <v-file-input
                v-model="form.transcripts"
                label="Transkrip"
                variant="outlined"
                density="compact"
                hide-details="auto"
                accept=".pdf,.jpg,.jpeg,.png"
                prepend-icon=""
                prepend-inner-icon="mdi-paperclip"
                :error-messages="serverErrors.transcripts"
              ></v-file-input>

              <!-- Preview existing + tombol hapus -->
              <div
                v-if="
                  form.transcripts_existing &&
                  !getFileFromModel(form.transcripts as any)
                "
                class="flex items-center gap-2 text-xs text-gray-500 border rounded px-3 py-2 bg-gray-50 dark:bg-gray-800"
              >
                <v-icon size="x-small" color="red">mdi-file-pdf-box</v-icon>
                <span class="truncate flex-1">{{
                  form.transcripts_existing
                }}</span>
                <v-btn
                  icon="mdi-close-circle"
                  variant="text"
                  size="x-small"
                  color="red"
                  @click="removeTranscripts"
                ></v-btn>
              </div>
            </div>
          </div>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="px-6 py-4 gap-2 justify-end">
        <v-btn variant="outlined" @click="closeDialog">Batal</v-btn>
        <v-btn
          color="bg-indigo-300 dark:bg-indigo-500"
          variant="flat"
          :prepend-icon="isEditMode ? 'mdi-content-save' : 'mdi-plus'"
          :loading="
            isEditMode
              ? hrdEducationStore.isLoadingUpdate
              : hrdEducationStore.isLoadingCreate
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
import { useHrdEducationStore } from "@/stores/hrd-education.store";
import { useEducationStore } from "@/stores/education.store";
import {
  onMounted,
  ref,
  reactive,
  computed,
  nextTick,
  watch,
  onBeforeUnmount,
} from "vue";
import { useRoute } from "vue-router";
import { useConfirmDialog } from "@/composables/useConfirmDialog";
import ConfirmDialog from "../ConfirmDialog.vue";

// ─────────────────────────────────────────────────────────────
// 1. STORES, COMPOSSABLE & ROUTE
// ─────────────────────────────────────────────────────────────
const hrdEducationStore = useHrdEducationStore();
const educationStore = useEducationStore();
const route = useRoute();
const { ask } = useConfirmDialog();

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
  hrd_master_education_id: null as number | null,
  major: "",
  school_name: "",
  from: "",
  title: "",
  year_in: "",
  graduation_year: "",
  certificate: [] as File[],
  transcripts: [] as File[],
  certificate_existing: null as any,
  transcripts_existing: null as any,
  remove_certificate: false, // ← tambah ini
  remove_transcripts: false, // ← tambah ini
});

const form = reactive(defaultForm());
const serverErrors = reactive<Record<string, string>>({});

const rules = {
  required: (v: any) => !!v || "Field ini wajib diisi",
};

// ─────────────────────────────────────────────────────────────
// 5. FILE PREVIEW (object URLs)
// ─────────────────────────────────────────────────────────────
const certificateObjectUrl = ref<string | null>(null);
const transcriptsObjectUrl = ref<string | null>(null);

watch(
  () => form.certificate,
  (newVal) => {
    if (certificateObjectUrl.value) {
      URL.revokeObjectURL(certificateObjectUrl.value);
      certificateObjectUrl.value = null;
    }
    const file = Array.isArray(newVal) ? newVal[0] : newVal;
    if (file instanceof File) {
      certificateObjectUrl.value = URL.createObjectURL(file);
    }
  },
);

watch(
  () => form.transcripts,
  (newVal) => {
    if (transcriptsObjectUrl.value) {
      URL.revokeObjectURL(transcriptsObjectUrl.value);
      transcriptsObjectUrl.value = null;
    }
    const file = Array.isArray(newVal) ? newVal[0] : newVal;
    if (file instanceof File) {
      transcriptsObjectUrl.value = URL.createObjectURL(file);
    }
  },
);

onBeforeUnmount(() => {
  if (certificateObjectUrl.value)
    URL.revokeObjectURL(certificateObjectUrl.value);
  if (transcriptsObjectUrl.value)
    URL.revokeObjectURL(transcriptsObjectUrl.value);
});

// ─────────────────────────────────────────────────────────────
// 6. FILE HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────
function getStorageUrl(
  filename: string | File | null | undefined,
): string | null {
  if (!filename) return null;
  if (filename instanceof File) return URL.createObjectURL(filename);
  return `${apiUrl}/image/hrd-education/${userId}/${filename}`;
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

function removeCertificate() {
  form.certificate_existing = null;
  form.remove_certificate = true;
}

function removeTranscripts() {
  form.transcripts_existing = null;
  form.remove_transcripts = true;
}

// ─────────────────────────────────────────────────────────────
// 7. COMPUTED PREVIEWS
// ─────────────────────────────────────────────────────────────
const certificatePreview = computed(() => {
  const file = getFileFromModel(form.certificate as any);
  if (file) return buildPreview(file, certificateObjectUrl);

  if (form.certificate_existing) {
    return {
      url: getStorageUrl(form.certificate_existing)!,
      name: form.certificate_existing,
      type: isImageFile(form.certificate_existing) ? "image" : "pdf",
    } as const;
  }
  return null;
});

const transcriptsPreview = computed(() => {
  const file = getFileFromModel(form.transcripts as any);
  if (file) return buildPreview(file, transcriptsObjectUrl);

  if (form.transcripts_existing) {
    return {
      url: getStorageUrl(form.transcripts_existing)!,
      name: form.transcripts_existing,
      type: isImageFile(form.transcripts_existing) ? "image" : "pdf",
    } as const;
  }
  return null;
});

// ─────────────────────────────────────────────────────────────
// 8. EDUCATION DROPDOWN
// ─────────────────────────────────────────────────────────────
const searchEducation = ref("");

const listEducation = computed(() =>
  educationStore.educationData
    .filter((edu) =>
      searchEducation.value
        ? edu.name.toLowerCase().includes(searchEducation.value.toLowerCase())
        : true,
    )
    .map((edu) => ({ title: edu.name, value: edu.id })),
);

function onSearchEducation(val: any) {
  searchEducation.value = val ?? "";
}

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
    hrd_master_education_id: item.hrd_master_education_id ?? null,
    major: item.major ?? "",
    school_name: item.school_name ?? "",
    from: item.from ?? "",
    title: item.title ?? "",
    year_in: item.year_in ?? "",
    graduation_year: item.graduation_year ?? "",
    certificate: [],
    transcripts: [],
    certificate_existing: item.certificate ?? null,
    transcripts_existing: item.transcripts ?? null,
  });
  dialog.value = true;
}

function closeDialog() {
  dialog.value = false;
  formRef.value?.reset();
  Object.keys(serverErrors).forEach((key) => delete serverErrors[key]);
}

// ─────────────────────────────────────────────────────────────
// 10. FORM SUBMISSION
// ─────────────────────────────────────────────────────────────
const PRIORITY_FIELDS = [
  "hrd_master_education_id",
  "school_name",
  "major",
  "title",
  "from",
  "year_in",
  "graduation_year",
];

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

function buildFormData(): FormData {
  const fd = new FormData();
  fd.append("user_id", String(form.user_id));
  fd.append("hrd_master_education_id", String(form.hrd_master_education_id));
  fd.append("major", form.major);
  fd.append("school_name", form.school_name);
  fd.append("from", form.from);
  fd.append("title", form.title);
  fd.append("year_in", form.year_in);
  fd.append("graduation_year", form.graduation_year);

  const certFile = Array.isArray(form.certificate)
    ? form.certificate[0]
    : form.certificate;
  const transFile = Array.isArray(form.transcripts)
    ? form.transcripts[0]
    : form.transcripts;

  // CERTIFICATE
  if (certFile instanceof File) {
    fd.append("certificate", certFile);
  }

  // selalu kirim preview kalau ada
  if (form.certificate_existing !== null) {
    fd.append("certificate_preview", form.certificate_existing);
  }

  // flag hapus
  if (form.remove_certificate) {
    fd.append("remove_certificate", "1");
  }

  // TRANSCRIPTS
  if (transFile instanceof File) {
    fd.append("transcripts", transFile);
  }

  // selalu kirim preview kalau ada
  if (form.transcripts_existing !== null) {
    fd.append("transcripts_preview", form.transcripts_existing);
  }

  // flag hapus
  if (form.remove_transcripts) {
    fd.append("remove_transcripts", "1");
  }
  return fd;
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

async function submitForm() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  Object.keys(serverErrors).forEach((key) => delete serverErrors[key]);

  if (isEditMode.value) {
    try {
      await hrdEducationStore.updateHrdEducation(
        Number(form.id),
        buildFormData(),
      );
      showSuccess("Data pendidikan berhasil diperbarui.");
      closeDialog();
    } catch (err: any) {
      handleServerErrors(err);
    }
  } else {
    try {
      await hrdEducationStore.createHrdEducation(buildFormData());
      showSuccess("Data pendidikan berhasil ditambahkan.");
      closeDialog();
    } catch (err: any) {
      handleServerErrors(err);
    }
  }
}

// ─────────────────────────────────────────────────────────────
// 11. CRUD ACTIONS
// ─────────────────────────────────────────────────────────────
async function handleDelete(id: number) {
  const confirmed = await ask({
    title: "Hapus Pendidikan",
    message: "Data ini akan dihapus. Lanjutkan?",
    confirmText: "Ya, Hapus",
    color: "red-darken-1",
  });
  if (confirmed) deleteEducation(id);
}
async function deleteEducation(id: number) {
  try {
    await hrdEducationStore.destroyHrdEducation(id);
    showSuccess("Data pendidikan berhasil dihapus.");
  } catch (err: any) {
    showError(err?.message ?? "Gagal menghapus data pendidikan.");
  }
}

// ─────────────────────────────────────────────────────────────
// 12. LIFECYCLE
// ─────────────────────────────────────────────────────────────
onMounted(async () => {
  if (hrdEducationStore.hrdEducationSelected.length === 0) {
    hrdEducationStore.hrdEducationSelectedParams.user_id = userId as string;
    await hrdEducationStore.fetchHrdEducationSelected();
  }

  educationStore.fetchEducationData();
});
</script>
