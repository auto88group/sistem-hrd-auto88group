<template>
  <div v-if="filePersonnelStore.isLoadingSelected">
    <v-card v-for="n in 3" :key="n" flat class="p-3">
      <v-skeleton-loader
        type="heading, divider, list-item-two-line@3"
        elevation="0"
      />
    </v-card>
  </div>

  <v-card v-else flat class="p-1 md:p-3 space-y-3">
    <div class="flex justify-end w-full gap-2">
      <v-btn
        color="bg-gray-300 dark:bg-gray-600 text-indigo-900 dark:text-indigo-100 text-sm"
        prepend-icon="mdi-tag-multiple"
        variant="flat"
        @click="openCategoryDialog"
      >
        Kelola Kategori
      </v-btn>
      <v-btn
        color="bg-gray-300 dark:bg-gray-600 text-indigo-900 dark:text-indigo-100 text-sm"
        prepend-icon="mdi-pencil-box"
        variant="flat"
        @click="
          openAddDialog(filePersonnelStore.filePersonnelSelectedParams.user_id)
        "
      >
        Tambah Data
      </v-btn>
    </div>

    <confirm-dialog />

    <v-snackbar
      v-model="showErrorSnackbar"
      color="bg-red-500"
      elevation="24"
      location="top"
      timeout="4000"
      rounded="lg"
    >
      <div class="d-flex align-center">
        <v-icon icon="mdi-alert-circle" class="me-3" />
        <span class="font-weight-medium">{{ snackbarMessage }}</span>
      </div>
      <template v-slot:actions>
        <v-btn
          variant="text"
          icon="mdi-close"
          @click="showErrorSnackbar = false"
        />
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
        <v-icon icon="mdi-check-circle" class="me-3" />
        <span class="font-weight-medium">{{ successMessage }}</span>
      </div>
      <template v-slot:actions>
        <v-btn
          variant="text"
          icon="mdi-close"
          @click="showSuccessSnackbar = false"
        />
      </template>
    </v-snackbar>

    <div
      v-if="filePersonnelStore.filePersonnelSelected.length === 0"
      class="flex flex-col items-center justify-center py-16 text-gray-400 border-2 border-dashed rounded-xl dark:border-gray-700"
    >
      <v-icon
        icon="mdi-file-document-outline"
        size="56"
        class="mb-3 opacity-40"
      />
      <span class="text-base font-medium"
        >Belum ada file personalia yang diunggah</span
      >
      <span class="text-sm mt-1 opacity-70"
        >Klik "Tambah Data" untuk mengunggah file</span
      >
    </div>

    <v-row v-else>
      <v-col
        v-for="item in filePersonnelStore.filePersonnelSelected"
        :key="item.id"
        cols="12"
        sm="6"
        md="6"
        lg="4"
      >
        <v-card elevation="2" rounded="xl" class="overflow-hidden group">
          <div class="px-4 pt-4 pb-2 flex items-center justify-between gap-2">
            <div class="flex items-center gap-2 min-w-0">
              <v-icon icon="mdi-tag" size="16" color="indigo" />
              <span
                class="text-sm font-semibold text-indigo-700 dark:text-indigo-300 truncate uppercase tracking-wide"
              >
                {{ item.category_name ?? "-" }}
              </span>
            </div>
            <v-chip
              v-if="item.is_mandatory"
              size="small"
              color="red"
              variant="tonal"
              class="font-semibold"
            >
              Wajib
            </v-chip>
            <v-chip
              v-else
              size="small"
              color="grey"
              variant="tonal"
              class="font-semibold"
            >
              Opsional
            </v-chip>
          </div>

          <div
            class="relative mx-4 mb-2 aspect-[4/3] overflow-hidden rounded-lg border bg-gray-50 dark:bg-gray-800"
          >
            <v-img
              v-if="item.file && isImageFile(item.file)"
              :src="getStorageUrl(item.file) || undefined"
              cover
              class="h-full w-full"
            >
              <template v-slot:placeholder>
                <div class="flex items-center justify-center h-full">
                  <v-progress-circular indeterminate color="grey-lighten-4" />
                </div>
              </template>
            </v-img>

            <div
              v-else-if="item.file"
              class="h-full w-full flex flex-col items-center justify-center border-2 border-dashed bg-gray-50 dark:bg-gray-900"
            >
              <v-icon color="red-lighten-1" size="52">mdi-file-pdf-box</v-icon>
              <span
                class="text-xs mt-2 px-4 text-center truncate w-full text-indigo-600 font-medium"
              >
                {{ item.file }}
              </span>
            </div>

            <div
              v-else
              class="h-full w-full flex flex-col items-center justify-center border-2 border-dashed bg-gray-50 dark:bg-gray-900"
            >
              <v-icon color="grey-lighten-1" size="52"
                >mdi-file-upload-outline</v-icon
              >
              <span class="text-sm mt-2 text-gray-400">Belum ada file</span>
            </div>

            <div
              class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3"
            >
              <v-btn
                icon="mdi-eye"
                color="white"
                variant="elevated"
                size="small"
                @click="viewFile(item.file)"
              />
              <v-btn
                icon="mdi-pencil"
                color="amber"
                variant="elevated"
                size="small"
                @click="openEditDialog(item)"
              />
              <v-btn
                icon="mdi-delete"
                color="red"
                variant="elevated"
                size="small"
                :loading="filePersonnelStore.isLoadingDestroy"
                @click="handleDelete(item.id)"
              />
            </div>
          </div>

          <div class="px-4 pb-4">
            <p
              class="text-base font-bold text-gray-800 dark:text-gray-100 truncate"
            >
              {{ item.name }}
            </p>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-card>

  <v-dialog v-model="dialog" max-width="700" scrollable>
    <v-card rounded="lg">
      <v-card-title class="flex items-center gap-2 px-6 pt-5 pb-3">
        <v-icon
          :icon="isEditMode ? 'mdi-pencil' : 'mdi-file'"
          color="primary"
          size="small"
        />
        <span class="text-base font-bold">
          {{ isEditMode ? "Edit File Personnel" : "Tambah File Personnel" }}
        </span>
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="closeDialog"
        />
      </v-card-title>
      <v-divider />

      <v-card-text class="px-6 py-4">
        <v-form ref="formRef">
          <div class="space-y-3 md:space-y-0 md:grid grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <v-select
                v-model="form.hrd_file_personnel_category_id"
                :items="filePersonnelCategoryStore.categories"
                item-title="name"
                item-value="id"
                variant="outlined"
                density="compact"
                hide-details="auto"
                :loading="filePersonnelCategoryStore.isLoadingFetch"
                :rules="[rules.required]"
                :error-messages="serverErrors.hrd_file_personnel_category_id"
              >
                <template v-slot:label>
                  Kategori<span class="text-red-500">*</span>
                </template>
              </v-select>
            </div>

            <div class="md:col-span-2">
              <v-text-field
                v-model="form.name"
                variant="outlined"
                density="compact"
                hide-details="auto"
                :rules="[rules.required]"
                :error-messages="serverErrors.name"
              >
                <template v-slot:label>
                  Nama<span class="text-red-500">*</span>
                </template>
              </v-text-field>
            </div>

            <div class="flex flex-col gap-1 col-span-2">
              <v-file-input
                v-model="form.file"
                variant="outlined"
                density="compact"
                hide-details="auto"
                accept=".pdf,.jpg,.jpeg,.png"
                prepend-icon=""
                prepend-inner-icon="mdi-paperclip"
                :error-messages="serverErrors.file"
              >
                <template v-slot:label>
                  Lampiran<span class="text-red-500">*</span>
                </template>
              </v-file-input>

              <div
                v-if="
                  form.file_existing &&
                  !getFileFromModel(form.file_existing as any)
                "
                class="flex items-center gap-2 text-xs text-gray-500 border rounded px-3 py-2 bg-gray-50 dark:bg-gray-800"
              >
                <v-icon size="x-small" color="red">mdi-file-pdf-box</v-icon>
                <span class="truncate flex-1">{{ form.file_existing }}</span>
                <v-btn
                  icon="mdi-close-circle"
                  variant="text"
                  size="x-small"
                  color="red"
                  @click="removeFile"
                />
              </div>
            </div>
          </div>
        </v-form>
      </v-card-text>

      <v-divider />
      <v-card-actions class="px-6 py-4 gap-2 justify-end">
        <v-btn variant="outlined" @click="closeDialog">Batal</v-btn>
        <v-btn
          color="bg-indigo-300 dark:bg-indigo-500"
          variant="flat"
          :prepend-icon="isEditMode ? 'mdi-content-save' : 'mdi-plus'"
          :loading="
            isEditMode
              ? filePersonnelStore.isLoadingUpdate
              : filePersonnelStore.isLoadingCreate
          "
          @click="submitForm"
        >
          {{ isEditMode ? "Simpan Perubahan" : "Tambah Data" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="categoryDialog" max-width="600" scrollable>
    <v-card rounded="lg">
      <v-card-title
        class="flex items-center gap-2 px-6 pt-5 pb-3 bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-800"
      >
        <v-icon icon="mdi-tag-multiple" color="indigo" size="small" />
        <span class="text-base font-bold">Kelola Kategori</span>
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="categoryDialog = false"
        />
      </v-card-title>

      <v-card-text class="px-6 py-5 bg-gray-50/50 dark:bg-gray-900/50">
        <v-card border flat class="mb-6 rounded-lg bg-white dark:bg-gray-800">
          <v-card-text class="p-4">
            <h3
              class="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-200"
            >
              {{
                isEditCategoryMode ? "Edit Kategori" : "Tambah Kategori Baru"
              }}
            </h3>
            <v-form ref="categoryFormRef">
              <div class="space-y-4">
                <v-text-field
                  v-model="categoryForm.name"
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                  placeholder="Masukkan nama kategori..."
                  :rules="[rules.required]"
                  :error-messages="categoryServerErrors.name"
                >
                  <template v-slot:label>
                    Nama Kategori<span class="text-red-500">*</span>
                  </template>
                </v-text-field>

                <div
                  class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <v-switch
                    v-model="categoryForm.is_mandatory"
                    color="red"
                    density="compact"
                    hide-details
                  >
                    <template v-slot:label>
                      <span class="text-sm">
                        Tandai sebagai dokumen <b class="text-red-500">Wajib</b>
                      </span>
                    </template>
                  </v-switch>

                  <div class="flex gap-2">
                    <v-btn
                      v-if="isEditCategoryMode"
                      variant="outlined"
                      color="grey-darken-1"
                      @click="resetCategoryForm"
                    >
                      Batal
                    </v-btn>
                    <v-btn
                      :prepend-icon="
                        isEditCategoryMode ? 'mdi-content-save' : 'mdi-plus'
                      "
                      color="bg-indigo-500 text-white"
                      variant="flat"
                      :loading="
                        isEditCategoryMode
                          ? filePersonnelCategoryStore.isLoadingUpdate
                          : filePersonnelCategoryStore.isLoadingCreate
                      "
                      @click="submitCategoryForm"
                    >
                      {{ isEditCategoryMode ? "Simpan" : "Tambah" }}
                    </v-btn>
                  </div>
                </div>
              </div>
            </v-form>
          </v-card-text>
        </v-card>

        <div class="flex items-center justify-between mb-3 px-1">
          <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Daftar Kategori
          </h3>
          <v-chip size="small" variant="tonal" color="indigo">
            {{ filePersonnelCategoryStore.categories.length }} Kategori
          </v-chip>
        </div>

        <div
          v-if="filePersonnelCategoryStore.isLoadingFetch"
          class="flex justify-center py-8"
        >
          <v-progress-circular indeterminate color="indigo" />
        </div>

        <div
          v-else-if="filePersonnelCategoryStore.categories.length === 0"
          class="flex flex-col items-center justify-center py-8 text-gray-400 border-2 border-dashed rounded-lg dark:border-gray-700"
        >
          <v-icon
            icon="mdi-tag-off-outline"
            size="48"
            class="mb-2 opacity-50"
          />
          <span class="text-sm">Belum ada kategori yang ditambahkan</span>
        </div>

        <div v-else class="space-y-2">
          <v-card
            v-for="cat in filePersonnelCategoryStore.categories"
            :key="cat.id"
            border
            flat
            class="rounded-lg bg-white dark:bg-gray-800 transition-colors hover:border-indigo-300 dark:hover:border-indigo-500"
          >
            <div
              class="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div class="flex flex-col gap-1">
                <span class="font-medium text-gray-800 dark:text-gray-100">
                  {{ cat.name }}
                </span>
                <div class="flex items-center gap-2">
                  <v-chip
                    size="x-small"
                    variant="flat"
                    :color="
                      cat.is_mandatory
                        ? 'bg-red-100 text-red-600'
                        : 'grey-lighten-4 text-grey-darken-1'
                    "
                    class="font-medium w-fit"
                  >
                    {{
                      cat.is_mandatory ? "Dokumen Wajib" : "Dokumen Opsional"
                    }}
                  </v-chip>
                </div>
              </div>

              <div class="flex items-center gap-1 sm:gap-2">
                <v-tooltip
                  location="top"
                  :text="
                    cat.is_mandatory ? 'Ubah ke Opsional' : 'Ubah ke Wajib'
                  "
                >
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      :icon="
                        cat.is_mandatory
                          ? 'mdi-asterisk'
                          : 'mdi-asterisk-circle-outline'
                      "
                      size="small"
                      variant="text"
                      :color="cat.is_mandatory ? 'red' : 'grey-lighten-1'"
                      :loading="filePersonnelCategoryStore.isLoadingToggle"
                      @click="handleToggleMandatory(cat.id)"
                    />
                  </template>
                </v-tooltip>

                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  color="amber-darken-2"
                  @click="editCategory(cat)"
                />
                <v-btn
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  color="red-darken-1"
                  :loading="filePersonnelCategoryStore.isLoadingDestroy"
                  @click="handleDeleteCategory(cat.id)"
                />
              </div>
            </div>
          </v-card>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useFilePersonnelStore } from "@/stores/file-personnel.store";
import { useFilePersonnelCategoryStore } from "@/stores/file-personnel-category.store";
import { onMounted, reactive, ref } from "vue";
import ConfirmDialog from "../ConfirmDialog.vue";
import { useRoute } from "vue-router";
import { useConfirmDialog } from "@/composables/useConfirmDialog";
import type { FilePersonnelCategory } from "@/api/modules/file-personnel-category.api";

const { ask } = useConfirmDialog();
const filePersonnelStore = useFilePersonnelStore();
const filePersonnelCategoryStore = useFilePersonnelCategoryStore();
const route = useRoute();
const userId = route.params.id;
const apiUrl = import.meta.env.VITE_API_URL ?? "";

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

// ───── Dialog File ─────
const dialog = ref(false);
const isEditMode = ref(false);
const formRef = ref();

const defaultForm = () => ({
  id: null as number | null,
  user_id: null as number | null,
  hrd_file_personnel_category_id: null as number | null,
  name: "",
  file: [] as File[],
  file_existing: null as any,
  remove_file: false,
});

const form = reactive(defaultForm());
const serverErrors = reactive<Record<string, string>>({});
const rules = { required: (v: any) => !!v || "Field ini wajib diisi" };

function buildFormData(): FormData {
  const fd = new FormData();
  fd.append("user_id", String(form.user_id));
  fd.append(
    "hrd_file_personnel_category_id",
    String(form.hrd_file_personnel_category_id),
  );
  fd.append("name", form.name);
  const file = Array.isArray(form.file) ? form.file[0] : form.file;
  if (file instanceof File) fd.append("file", file);
  if (form.file_existing !== null)
    fd.append("file_preview", form.file_existing);
  if (form.remove_file) fd.append("remove_file", "1");
  return fd;
}

async function submitForm() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;
  Object.keys(serverErrors).forEach((k) => delete serverErrors[k]);

  try {
    const result = isEditMode.value
      ? await filePersonnelStore.updateFilePersonnel(
          Number(form.id),
          buildFormData(),
        )
      : await filePersonnelStore.createFilePersonnel(buildFormData());

    result.success
      ? showSuccess(result.message)
      : showError(result.message ?? "Terjadi kesalahan");
    closeDialog();
  } catch (err: any) {
    handleServerErrors(err);
  }
}

function handleServerErrors(err: any) {
  if (err?.status === 422) {
    const errors = err.errors as Record<string, string[]>;
    if (errors)
      Object.entries(errors).forEach(([field, messages]) => {
        serverErrors[field] = messages[0];
      });
  } else {
    showError(err?.message ?? "Terjadi kesalahan, coba lagi.");
  }
}

function getFileFromModel(model: File | File[] | null): File | null {
  if (!model) return null;
  const file = Array.isArray(model) ? model[0] : model;
  return file instanceof File ? file : null;
}

function removeFile() {
  form.file_existing = null;
  form.remove_file = true;
}

function getStorageUrl(
  filename: string | File | null | undefined,
): string | null {
  if (!filename) return null;
  if (filename instanceof File) return URL.createObjectURL(filename);
  return `${apiUrl}/image/file-personnel/${userId}/${filename}`;
}

function isImageFile(filename: string | File): boolean {
  const name = filename instanceof File ? filename.name : filename;
  return /\.(jpg|jpeg|png|webp|gif)$/i.test(name);
}

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
    hrd_file_personnel_category_id: item.hrd_file_personnel_category_id,
    name: item.name,
    file: [],
    file_existing: item.file ?? null,
  });
  dialog.value = true;
}

function closeDialog() {
  dialog.value = false;
  formRef.value?.reset();
  Object.keys(serverErrors).forEach((k) => delete serverErrors[k]);
}

async function handleDelete(id: number) {
  const confirmed = await ask({
    title: "Hapus file",
    message: "File ini akan dihapus. Lanjutkan?",
    confirmText: "Ya, Hapus",
    color: "red-darken-1",
  });
  if (confirmed) {
    try {
      await filePersonnelStore.destroyFilePersonnel(id);
      showSuccess("Data berhasil dihapus.");
    } catch (err: any) {
      showError(err?.message ?? "Gagal menghapus data ini.");
    }
  }
}

function viewFile(file: string | File | null | undefined) {
  const url = getStorageUrl(file);
  url
    ? window.open(url, "_blank")
    : showError("File tidak ditemukan atau tidak valid.");
}

// ───── Dialog Kategori ─────
const categoryDialog = ref(false);
const isEditCategoryMode = ref(false);
const categoryFormRef = ref();
const categoryForm = reactive({
  id: null as number | null,
  name: "",
  is_mandatory: false,
});
const categoryServerErrors = reactive<Record<string, string>>({});

function openCategoryDialog() {
  categoryDialog.value = true;
  if (filePersonnelCategoryStore.categories.length === 0)
    filePersonnelCategoryStore.fetchCategories();
}

function resetCategoryForm() {
  isEditCategoryMode.value = false;
  Object.assign(categoryForm, { id: null, name: "", is_mandatory: false });
  categoryFormRef.value?.reset();
  Object.keys(categoryServerErrors).forEach(
    (k) => delete categoryServerErrors[k],
  );
}

function editCategory(cat: FilePersonnelCategory) {
  isEditCategoryMode.value = true;
  Object.assign(categoryForm, {
    id: cat.id,
    name: cat.name,
    is_mandatory: cat.is_mandatory,
  });
}

async function submitCategoryForm() {
  const { valid } = await categoryFormRef.value.validate();
  if (!valid) return;
  Object.keys(categoryServerErrors).forEach(
    (k) => delete categoryServerErrors[k],
  );

  try {
    const params = {
      name: categoryForm.name,
      is_mandatory: Boolean(categoryForm.is_mandatory),
    };
    const result = isEditCategoryMode.value
      ? await filePersonnelCategoryStore.updateCategory(
          Number(categoryForm.id),
          params,
        )
      : await filePersonnelCategoryStore.createCategory(params);

    showSuccess(result.message);
    resetCategoryForm();
  } catch (err: any) {
    if (err?.status === 422) {
      const errors = err.errors as Record<string, string[]>;
      if (errors)
        Object.entries(errors).forEach(([field, messages]) => {
          categoryServerErrors[field] = messages[0];
        });
    } else {
      showError(err?.message ?? "Terjadi kesalahan.");
    }
  }
}

async function handleToggleMandatory(id: number) {
  try {
    await filePersonnelCategoryStore.toggleMandatory(id);
  } catch (err: any) {
    showError(err?.message ?? "Gagal mengubah status mandatory.");
  }
}

async function handleDeleteCategory(id: number) {
  const confirmed = await ask({
    title: "Hapus kategori",
    message: "Kategori ini akan dihapus. Lanjutkan?",
    confirmText: "Ya, Hapus",
    color: "red-darken-1",
  });
  if (!confirmed) return;
  try {
    const result = await filePersonnelCategoryStore.destroyCategory(id);
    showSuccess(result.message);
  } catch (err: any) {
    showError(err?.message ?? "Gagal menghapus kategori.");
  }
}

onMounted(async () => {
  await filePersonnelCategoryStore.fetchCategories();
  if (filePersonnelStore.filePersonnelSelected.length === 0) {
    filePersonnelStore.filePersonnelSelectedParams.user_id = userId as string;
    await filePersonnelStore.fetchFilePersonnelSelected();
  }
});
</script>
