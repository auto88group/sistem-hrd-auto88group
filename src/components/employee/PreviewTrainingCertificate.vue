<template>
  <div v-if="trainingCertificateStore.isLoadingSelected">
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
          openAddDialog(
            trainingCertificateStore.trainingCertificateSelectedParams.user_id,
          )
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
        v-for="(
          item, index
        ) in trainingCertificateStore.trainingCertificateSelected"
        :key="item.id"
        variant="flat"
        border
        class="mx-auto w-full rounded-lg"
      >
        <v-card-item class="bg-gray-100 dark:bg-gray-800">
          <div class="flex items-center justify-between">
            <v-card-title class="text-base font-bold flex items-center gap-2">
              <v-icon icon="mdi-school" color="primary" size="small"></v-icon>
              {{ item.certificate_name ?? "-" }}
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
                :loading="trainingCertificateStore.isLoadingDestroy"
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
                >Nama Sertifikat/Pelatihan</span
              >
              <span class="font-bold text-sm">{{
                item.certificate_name ?? "-"
              }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-gray-500 text-sm dark:text-gray-300"
                >Penyelenggara</span
              >
              <span class="font-bold text-sm">{{ item.organizer ?? "-" }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-gray-500 text-sm dark:text-gray-300"
                >Tanggal Berlaku</span
              >
              <span class="font-bold text-sm">{{
                toFullDate(item.issue_date) ?? "-"
              }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-gray-500 text-sm dark:text-gray-300"
                >Tanggal Berakhir</span
              >
              <span class="font-bold text-sm">{{
                toFullDate(item.expiry_date) ?? "-"
              }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-gray-500 text-sm dark:text-gray-300"
                >Catatan</span
              >
              <span class="font-bold text-sm">{{ item.notes ?? "-" }}</span>
            </div>
            <v-card-text class="w-full col-span-3 p-0">
              <span class="text-xs font-bold text-gray-400 uppercase block"
                >Dokumen Pendukung</span
              >

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex flex-col gap-2">
                  <span class="text-sm font-semibold flex items-center gap-2">
                    <v-icon size="x-small">mdi-certificate</v-icon> Lampiran
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
                          >{{ item.attachment }}</span
                        >
                      </div>
                    </a>
                  </div>
                  <div
                    v-else
                    class="h-40 flex items-center justify-center border rounded bg-gray-100 dark:bg-gray-800 text-gray-400 text-xs italic"
                  >
                    Tidak ada lampiran
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
          {{
            isEditMode
              ? "Edit Data Setifikat/Pelatihan"
              : "Tambah Data Setifikat/Pelatihan"
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
            <v-text-field
              id="certificate_name"
              v-model="form.certificate_name"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :rules="[rules.required]"
              :error-messages="serverErrors.certificate_name"
            >
              <template v-slot:label>
                Nama Sertifikat/Pelatihan<span class="text-red-500">*</span>
              </template>
            </v-text-field>

            <v-text-field
              id="organizer"
              v-model="form.organizer"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :rules="[rules.required]"
              :error-messages="serverErrors.organizer"
            >
              <template v-slot:label
                >Penyelenggara<span class="text-red-500">*</span></template
              >
            </v-text-field>

            <app-date-picker
              id="issue_date"
              v-model="form.issue_date"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :error-messages="serverErrors.issue_date"
            >
              <template v-slot:label>Tanggal Berlaku</template>
            </app-date-picker>

            <app-date-picker
              id="expiry_date"
              v-model="form.expiry_date"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :error-messages="serverErrors.expiry_date"
            >
              <template v-slot:label>Tanggal Berakhir</template>
            </app-date-picker>

            <v-text-field
              id="notes"
              v-model="form.notes"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :error-messages="serverErrors.notes"
            >
              <template v-slot:label>Catatan</template>
            </v-text-field>

            <div class="flex flex-col gap-1">
              <v-file-input
                id="attachment"
                v-model="form.attachment"
                variant="outlined"
                density="compact"
                hide-details="auto"
                accept=".pdf,.jpg,.jpeg,.png"
                prepend-icon=""
                prepend-inner-icon="mdi-paperclip"
                :error-messages="serverErrors.attachment"
              >
                <template v-slot:label
                  >Lampiran<span class="text-red-500">*</span></template
                >
              </v-file-input>

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
              ? trainingCertificateStore.isLoadingUpdate
              : trainingCertificateStore.isLoadingCreate
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
import { useEducationStore } from "@/stores/education.store";
import {
  onMounted,
  ref,
  reactive,
  nextTick,
  watch,
  onBeforeUnmount,
} from "vue";
import { useRoute } from "vue-router";
import { useConfirmDialog } from "@/composables/useConfirmDialog";
import ConfirmDialog from "../ConfirmDialog.vue";
import { useTrainingCertificateStore } from "@/stores/training-certificate.store";
import { useDateFormatter } from "@/composables/UseDateFormatter";
import AppDatePicker from "../AppDatePicker.vue";

// ─────────────────────────────────────────────────────────────
// 1. STORES, COMPOSSABLE & ROUTE
// ─────────────────────────────────────────────────────────────
const { toFullDate } = useDateFormatter();
const trainingCertificateStore = useTrainingCertificateStore();

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
  certificate_name: "",
  organizer: "",
  issue_date: "",
  expiry_date: "",
  notes: "",
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
// 5. FILE PREVIEW (object URLs)
// ─────────────────────────────────────────────────────────────
const attachmentObjectUrl = ref<string | null>(null);

watch(
  () => form.attachment,
  (newVal) => {
    if (attachmentObjectUrl.value) {
      URL.revokeObjectURL(attachmentObjectUrl.value);
      attachmentObjectUrl.value = null;
    }
    const file = Array.isArray(newVal) ? newVal[0] : newVal;
    if (file instanceof File) {
      attachmentObjectUrl.value = URL.createObjectURL(file);
    }
  },
);

onBeforeUnmount(() => {
  if (attachmentObjectUrl.value) URL.revokeObjectURL(attachmentObjectUrl.value);
});

// ─────────────────────────────────────────────────────────────
// 6. FILE HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────
function getStorageUrl(
  filename: string | File | null | undefined,
): string | null {
  if (!filename) return null;
  if (filename instanceof File) return URL.createObjectURL(filename);
  return `${apiUrl}/image/training-certificate/${userId}/${filename}`;
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

function removeAttachment() {
  form.attachment_existing = null;
  form.remove_attachment = true;
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
    certificate_name: item.certificate_name,
    organizer: item.organizer,
    issue_date: item.issue_date,
    expiry_date: item.expiry_date,
    notes: item.notes,
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
  fd.append("certificate_name", form.certificate_name);
  fd.append("organizer", form.organizer);
  fd.append("organizer", form.organizer);
  fd.append("issue_date", form.issue_date);
  fd.append("expiry_date", form.expiry_date);
  fd.append("notes", form.notes);
  const attFile = Array.isArray(form.attachment)
    ? form.attachment[0]
    : form.attachment;

  if (attFile instanceof File) {
    fd.append("attachment", attFile);
  }

  if (form.attachment_existing !== null) {
    fd.append("attachment_preview", form.attachment_existing);
  }

  if (form.remove_attachment) {
    fd.append("remove_attachment", "1");
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
      let result = await trainingCertificateStore.updateTrainingCertificate(
        Number(form.id),
        buildFormData(),
      );

      if (result.success) {
        showSuccess(result.message);
      } else {
        showError(result.message ?? "Gagal mengupdate prospek");
      }
      closeDialog();
    } catch (err: any) {
      handleServerErrors(err);
    }
  } else {
    try {
      let result =
        await trainingCertificateStore.createTrainingCertificate(
          buildFormData(),
        );
      if (result.success) {
        showSuccess(result.message);
      } else {
        showError(result.message ?? "Gagal mengupdate prospek");
      }
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
    title: "Hapus Sertifikat/Pelatihan",
    message: "Data ini akan dihapus. Lanjutkan?",
    confirmText: "Ya, Hapus",
    color: "red-darken-1",
  });
  if (confirmed) deleteEducation(id);
}
async function deleteEducation(id: number) {
  try {
    await trainingCertificateStore.destroyTrainingCertificate(id);
    showSuccess("Data berhasil dihapus.");
  } catch (err: any) {
    showError(err?.message ?? "Gagal menghapus data ini.");
  }
}

// ─────────────────────────────────────────────────────────────
// 12. LIFECYCLE
// ─────────────────────────────────────────────────────────────
onMounted(async () => {
  if (trainingCertificateStore.trainingCertificateSelected.length === 0) {
    trainingCertificateStore.trainingCertificateSelectedParams.user_id =
      userId as string;
    await trainingCertificateStore.fetchTrainingCertificateSelected();
  }

  educationStore.fetchEducationData();
});
</script>
