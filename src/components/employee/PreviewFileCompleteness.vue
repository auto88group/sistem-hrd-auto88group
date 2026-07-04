<template>
  <div v-if="fileCompletenessStore.isLoadingSelected">
    <v-card v-for="n in 3" :key="n" flat class="p-3">
      <v-skeleton-loader
        type="heading, divider, list-item-two-line@3"
        elevation="0"
      />
    </v-card>
  </div>

  <v-card v-else flat class="p-1 md:p-3 space-y-3">
    <div
      v-if="isBulkMode"
      class="flex items-center justify-between bg-indigo-50 dark:bg-indigo-950 p-3 rounded-xl border border-indigo-200 dark:border-indigo-800 transition-all duration-300"
    >
      <div
        class="flex items-center gap-3 text-indigo-900 dark:text-indigo-200 font-semibold flex-wrap"
      >
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="exitBulkMode"
        />
        <span>{{ selectedIds.length }} Item Terpilih</span>

        <span class="text-gray-300 dark:text-gray-700">|</span>

        <v-btn
          variant="text"
          color="indigo-darken-2"
          density="comfortable"
          size="small"
          class="font-bold text-xs capitalize"
          :prepend-icon="
            isAllSelected
              ? 'mdi-checkbox-multiple-marked'
              : 'mdi-checkbox-multiple-blank-outline'
          "
          @click="toggleSelectAll"
        >
          {{ isAllSelected ? "Batal Pilih Semua" : "Pilih Semua" }}
        </v-btn>
      </div>

      <div class="flex gap-2">
        <v-btn
          color="indigo"
          variant="flat"
          size="small"
          prepend-icon="mdi-download"
          @click="downloadSelected"
        >
          Download
        </v-btn>
        <v-btn
          color="red"
          variant="flat"
          size="small"
          prepend-icon="mdi-delete"
          :loading="fileCompletenessStore.isLoadingDestroy"
          @click="deleteSelected"
        >
          Hapus
        </v-btn>
      </div>
    </div>

    <div v-else class="flex justify-end w-full gap-2">
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
          openAddDialog(
            fileCompletenessStore.fileCompletenessSelectedParams.user_id,
          )
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
      v-if="
        !fileCompletenessStore.isLoadingSelected &&
        !fileCategoryStore.isLoadingFetch
      "
      class="w-full"
    >
      <v-alert
        v-if="missingMandatoryCategories.length > 0"
        type="error"
        variant="tonal"
        class="mb-4 rounded-xl border"
        border="start"
      >
        <div class="font-bold text-sm text-red-700 dark:text-red-400 mb-2">
          Perhatian! Ada dokumen WAJIB yang belum diunggah:
        </div>
        <div class="flex flex-wrap gap-2">
          <v-chip
            v-for="cat in missingMandatoryCategories"
            :key="cat.id"
            color="red"
            size="small"
            variant="flat"
            class="font-semibold"
          >
            {{ cat.name }}
          </v-chip>
        </div>
      </v-alert>

      <v-alert
        v-else-if="
          fileCategoryStore.categories.length > 0 &&
          completedCategories.length > 0
        "
        type="success"
        variant="tonal"
        class="mb-4 rounded-xl border"
        border="start"
      >
        <div class="font-bold text-sm text-green-700 dark:text-green-400">
          Semua dokumen WAJIB sudah terunggah
        </div>
      </v-alert>

      <div
        v-if="missingOptionalCategories.length > 0"
        class="mb-4 px-2 flex flex-wrap items-center gap-2"
      >
        <span class="text-xs font-medium text-gray-500 dark:text-gray-400"
          >Dokumen opsional belum diunggah:</span
        >
        <v-chip
          v-for="cat in missingOptionalCategories"
          :key="cat.id"
          size="x-small"
          variant="outlined"
          color="grey"
        >
          {{ cat.name }}
        </v-chip>
      </div>
    </div>

    <div
      v-if="fileCompletenessStore.fileCompletenessSelected.length === 0"
      class="flex flex-col items-center justify-center py-16 text-gray-400 border-2 border-dashed rounded-xl dark:border-gray-700"
    >
      <v-icon
        icon="mdi-file-document-outline"
        size="56"
        class="mb-3 opacity-40"
      />
      <span class="text-base font-medium">Belum ada file yang diunggah</span>
      <span class="text-sm mt-1 opacity-70"
        >Klik "Tambah Data" untuk mengunggah file</span
      >
    </div>

    <v-row v-else>
      <v-col
        v-for="item in fileCompletenessStore.fileCompletenessSelected"
        :key="item.id"
        cols="12"
        sm="6"
        md="6"
        lg="2"
      >
        <v-card
          elevation="2"
          rounded="xl"
          class="overflow-hidden group relative select-none transition-all duration-200"
          :class="{
            'border-2 border-indigo-500 ring-4 ring-indigo-100 dark:ring-indigo-950':
              selectedIds.includes(item.id),
          }"
          @mousedown="startPress(item)"
          @touchstart="startPress(item)"
          @mouseup="cancelPress()"
          @touchend="cancelPress()"
          @touchmove="cancelPress()"
          @mouseleave="cancelPress()"
          @click="handleCardClick(item)"
        >
          <div
            v-if="isBulkMode"
            class="absolute top-2 left-2 z-10 pointer-events-none"
          >
            <v-checkbox-btn
              :model-value="selectedIds.includes(item.id)"
              color="indigo"
              density="compact"
            />
          </div>

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
              :color="item.is_mandatory ? 'red' : 'grey'"
              size="small"
              variant="tonal"
              class="font-semibold"
            >
              {{ item.is_mandatory ? "Wajib" : "Opsional" }}
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
              v-if="!isBulkMode"
              class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2"
            >
              <v-btn
                icon="mdi-eye"
                color="white"
                variant="elevated"
                size="small"
                @click.stop="viewFile(item.file)"
              />
              <v-btn
                icon="mdi-download"
                color="indigo"
                variant="elevated"
                size="small"
                @click.stop="downloadFileSingle(item)"
              />
              <v-btn
                icon="mdi-pencil"
                color="amber"
                variant="elevated"
                size="small"
                @click.stop="openEditDialog(item)"
              />
              <v-btn
                icon="mdi-delete"
                color="red"
                variant="elevated"
                size="small"
                :loading="fileCompletenessStore.isLoadingDestroy"
                @click.stop="handleDelete(item.id)"
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

  <v-dialog v-model="dialog" max-width="750" scrollable>
    <v-card rounded="lg">
      <v-card-title class="flex items-center gap-2 px-6 pt-5 pb-3">
        <v-icon
          :icon="isEditMode ? 'mdi-pencil' : 'mdi-file'"
          color="primary"
          size="small"
        />
        <span class="text-base font-bold">{{
          isEditMode ? "Edit File" : "Tambah File"
        }}</span>
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
          <div class="space-y-4">
            <v-select
              v-model="form.hrd_file_category_id"
              :items="fileCategoryStore.categories"
              item-title="name"
              item-value="id"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :loading="fileCategoryStore.isLoadingFetch"
              :rules="[rules.required]"
              :error-messages="serverErrors.hrd_file_category_id"
            >
              <template v-slot:label>
                Kategori<span class="text-red-500">*</span>
              </template>
            </v-select>

            <v-file-input
              v-model="uploadedFiles"
              variant="outlined"
              density="compact"
              hide-details="auto"
              accept=".pdf,.jpg,.jpeg,.png"
              prepend-icon=""
              prepend-inner-icon="mdi-paperclip"
              :multiple="!isEditMode"
              @update:model-value="handleFileChange"
              :error-messages="serverErrors.file"
            >
              <template v-slot:label>
                {{ isEditMode ? "Ganti Lampiran file" : "Input banyak file"
                }}<span class="text-red-500">*</span>
              </template>
            </v-file-input>

            <div
              v-if="form.items.length > 0"
              class="space-y-3 mt-4 max-h-[350px] overflow-y-auto p-1 border rounded-lg bg-gray-50 dark:bg-gray-900"
            >
              <div
                v-for="(subItem, idx) in form.items"
                :key="idx"
                class="p-3 border rounded-xl bg-white dark:bg-gray-800 flex flex-col sm:flex-row gap-4 items-start sm:items-center relative transition-shadow hover:shadow-sm"
              >
                <div
                  class="w-16 h-16 rounded-lg border overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0"
                >
                  <v-img
                    v-if="subItem.previewUrl"
                    :src="subItem.previewUrl"
                    cover
                    class="w-full h-full"
                  />
                  <v-icon v-else color="red-lighten-1" size="36"
                    >mdi-file-pdf-box</v-icon
                  >
                </div>

                <div class="flex-1 w-full">
                  <v-text-field
                    v-model="subItem.name"
                    variant="outlined"
                    density="compact"
                    hide-details="auto"
                    :rules="[rules.required]"
                  >
                    <template v-slot:label
                      >Nama File<span class="text-red-500">*</span></template
                    >
                  </v-text-field>
                  <span
                    v-if="subItem.file"
                    class="text-[10px] text-gray-400 block mt-1 truncate max-w-[300px]"
                  >
                    Ori: {{ subItem.file.name }} ({{
                      (subItem.file.size / 1024).toFixed(1)
                    }}
                    KB)
                  </span>
                  <span
                    v-else-if="subItem.file_existing"
                    class="text-[10px] text-gray-400 block mt-1 truncate max-w-[300px]"
                  >
                    Eksis: {{ subItem.file_existing }}
                  </span>
                </div>

                <v-btn
                  v-if="!isEditMode"
                  icon="mdi-delete-outline"
                  variant="text"
                  color="red"
                  size="small"
                  @click="removeFormItem(idx)"
                />
                <v-btn
                  v-else-if="subItem.file_existing"
                  icon="mdi-close-circle"
                  variant="text"
                  color="red"
                  size="small"
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
              ? fileCompletenessStore.isLoadingUpdate
              : fileCompletenessStore.isLoadingCreate
          "
          :disabled="form.items.length === 0"
          @click="submitForm"
        >
          {{
            isEditMode
              ? "Simpan Perubahan"
              : `Tambah (${form.items.length}) Data`
          }}
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
                  <template v-slot:label
                    >Nama Kategori<span class="text-red-500">*</span></template
                  >
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
                      <span class="text-sm"
                        >Tandai sebagai dokumen
                        <b class="text-red-500">Wajib</b></span
                      >
                    </template>
                  </v-switch>
                  <div class="flex gap-2">
                    <v-btn
                      v-if="isEditCategoryMode"
                      variant="outlined"
                      color="grey-darken-1"
                      @click="resetCategoryForm"
                      >Batal</v-btn
                    >
                    <v-btn
                      :prepend-icon="
                        isEditCategoryMode ? 'mdi-content-save' : 'mdi-plus'
                      "
                      color="bg-indigo-500 text-white"
                      variant="flat"
                      :loading="
                        isEditCategoryMode
                          ? fileCategoryStore.isLoadingUpdate
                          : fileCategoryStore.isLoadingCreate
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
          <v-chip size="small" variant="tonal" color="indigo"
            >{{ fileCategoryStore.categories.length }} Kategori</v-chip
          >
        </div>

        <div
          v-if="fileCategoryStore.isLoadingFetch"
          class="flex justify-center py-8"
        >
          <v-progress-circular indeterminate color="indigo" />
        </div>

        <div
          v-else-if="fileCategoryStore.categories.length === 0"
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
            v-for="cat in fileCategoryStore.categories"
            :key="cat.id"
            border
            flat
            class="rounded-lg bg-white dark:bg-gray-800 transition-colors hover:border-indigo-300 dark:hover:border-indigo-500"
          >
            <div
              class="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div class="flex flex-col gap-1">
                <span class="font-medium text-gray-800 dark:text-gray-100">{{
                  cat.name
                }}</span>
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
                  {{ cat.is_mandatory ? "Dokumen Wajib" : "Dokumen Opsional" }}
                </v-chip>
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
                      :loading="fileCategoryStore.isLoadingToggle"
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
                  :loading="fileCategoryStore.isLoadingDestroy"
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
import { useFileCompletenessStore } from "@/stores/file-completeness.store";
import { useFileCategoryStore } from "@/stores/file-category.store";
import { computed, onMounted, reactive, ref } from "vue";
import ConfirmDialog from "../ConfirmDialog.vue";
import { useRoute } from "vue-router";
import { useConfirmDialog } from "@/composables/useConfirmDialog";
import type { FileCategory } from "@/api/modules/file-category.api.ts";
import JSZip from "jszip";

const { ask } = useConfirmDialog();
const fileCompletenessStore = useFileCompletenessStore();
const fileCategoryStore = useFileCategoryStore();
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

// ───── Logika Mode Pilih Banyak (Bulk Select) ─────
const isBulkMode = ref(false);
const selectedIds = ref<number[]>([]);
let pressTimer: any = null;

const isAllSelected = computed(() => {
  const totalItems = fileCompletenessStore.fileCompletenessSelected.length;
  return totalItems > 0 && selectedIds.value.length === totalItems;
});

function toggleSelectAll() {
  if (isAllSelected.value) {
    selectedIds.value = [];
  } else {
    selectedIds.value = fileCompletenessStore.fileCompletenessSelected.map(
      (item) => item.id,
    );
  }
}

function startPress(item: any) {
  pressTimer = setTimeout(() => {
    if (!isBulkMode.value) {
      isBulkMode.value = true;
      toggleSelect(item.id);
    }
  }, 600);
}

function cancelPress() {
  if (pressTimer) clearTimeout(pressTimer);
}

function handleCardClick(item: any) {
  if (isBulkMode.value) {
    toggleSelect(item.id);
  }
}

function toggleSelect(id: number) {
  const index = selectedIds.value.indexOf(id);
  if (index > -1) {
    selectedIds.value.splice(index, 1);
    if (selectedIds.value.length === 0) exitBulkMode();
  } else {
    selectedIds.value.push(id);
  }
}

function exitBulkMode() {
  isBulkMode.value = false;
  selectedIds.value = [];
}

async function downloadSelected() {
  const itemsToDownload = fileCompletenessStore.fileCompletenessSelected.filter(
    (i) => selectedIds.value.includes(i.id),
  );
  if (itemsToDownload.length === 0) return;

  if (itemsToDownload.length === 1) {
    const item = itemsToDownload[0];
    if (item.file) downloadFileSingle(item);
    exitBulkMode();
    return;
  }

  showSuccess("Sedang mengumpulkan file dan membuat ZIP, mohon tunggu...");
  const zip = new JSZip();

  try {
    for (const item of itemsToDownload) {
      if (!item.file) continue;
      const url = getStorageUrl(item.file);
      if (!url) continue;

      const response = await fetch(url);
      if (!response.ok) continue;
      const blob = await response.blob();

      const ext = item.file.split(".").pop();
      const fileNameWithExt = item.name.endsWith(`.${ext}`)
        ? item.name
        : `${item.name}.${ext}`;
      zip.file(fileNameWithExt, blob);
    }

    const zipContent = await zip.generateAsync({ type: "blob" });
    const zipUrl = URL.createObjectURL(zipContent);

    const a = document.createElement("a");
    a.href = zipUrl;
    a.download = `Arsip_Kelengkapan_File_${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(zipUrl);

    showSuccess("File ZIP berhasil diunduh.");
    exitBulkMode();
  } catch (err) {
    showError("Terjadi kesalahan saat membuat file ZIP.");
  }
}

async function deleteSelected() {
  const confirmed = await ask({
    title: "Hapus Banyak Data",
    message: `${selectedIds.value.length} dokumen yang dipilih akan dihapus permanen. Lanjutkan?`,
    confirmText: "Ya, Hapus Semua",
    color: "red-darken-1",
  });
  if (!confirmed) return;

  try {
    // Memanggil action massal Pinia (Single Request ke Backend)
    const result = await fileCompletenessStore.bulkDestroyFileCompleteness(
      selectedIds.value,
    );
    showSuccess(
      result.message || "Semua data terpilih berhasil dihapus sekaligus.",
    );
    exitBulkMode();
  } catch (err: any) {
    showError(err?.message ?? "Terjadi kesalahan saat menghapus data massal.");
  }
}

// ───── Dialog File & Form Berbasis Array ─────
const dialog = ref(false);
const isEditMode = ref(false);
const formRef = ref();
const uploadedFiles = ref<File[]>([]);

interface FormItem {
  file: File | null;
  name: string;
  file_existing: string | null;
  previewUrl: string | null;
  isImage: boolean;
}

const form = reactive({
  id: null as number | null,
  user_id: null as number | null,
  hrd_file_category_id: null as number | null,
  items: [] as FormItem[],
  remove_file: false,
});

const serverErrors = reactive<Record<string, string>>({});
const rules = { required: (v: any) => !!v || "Field ini wajib diisi" };

// ───── LOGIKA STATUS KELENGKAPAN KATEGORI ─────
const uploadedCategoryIds = computed(() => {
  return fileCompletenessStore.fileCompletenessSelected.map(
    (item) => item.hrd_file_category_id,
  );
});

const missingMandatoryCategories = computed(() => {
  return fileCategoryStore.categories.filter(
    (cat) => cat.is_mandatory && !uploadedCategoryIds.value.includes(cat.id),
  );
});

const missingOptionalCategories = computed(() => {
  return fileCategoryStore.categories.filter(
    (cat) => !cat.is_mandatory && !uploadedCategoryIds.value.includes(cat.id),
  );
});

const completedCategories = computed(() => {
  return fileCategoryStore.categories.filter((cat) =>
    uploadedCategoryIds.value.includes(cat.id),
  );
});

function handleFileChange(files: File | File[] | null) {
  if (!files) return;
  const fileList = Array.isArray(files) ? files : [files];

  if (isEditMode.value) {
    const file = fileList[0];
    if (file) {
      const isImg = isImageFile(file);
      form.items[0] = {
        file,
        name: form.items[0]?.name || file.name.replace(/\.[^/.]+$/, ""),
        file_existing: null,
        previewUrl: isImg ? URL.createObjectURL(file) : null,
        isImage: isImg,
      };
    }
  } else {
    fileList.forEach((file) => {
      const isImg = isImageFile(file);
      form.items.push({
        file,
        name: file.name.replace(/\.[^/.]+$/, ""),
        file_existing: null,
        previewUrl: isImg ? URL.createObjectURL(file) : null,
        isImage: isImg,
      });
    });
  }
  uploadedFiles.value = [];
}

function removeFormItem(index: number) {
  const item = form.items[index];
  if (item.previewUrl && item.file) URL.revokeObjectURL(item.previewUrl);
  form.items.splice(index, 1);
}

function removeFile() {
  if (form.items[0]) form.items[0].file_existing = null;
  form.remove_file = true;
}

async function submitForm() {
  const { valid } = await formRef.value.validate();
  if (!valid || form.items.length === 0) return;
  Object.keys(serverErrors).forEach((k) => delete serverErrors[k]);

  try {
    if (isEditMode.value) {
      const subItem = form.items[0];
      let fileToSend: File | null = subItem.file;
      if (fileToSend && subItem.isImage) {
        fileToSend = await compressImage(fileToSend, 1000, 0.5);
      }

      const fd = new FormData();
      fd.append("user_id", String(form.user_id));
      fd.append("hrd_file_category_id", String(form.hrd_file_category_id));
      fd.append("name", subItem.name);
      if (fileToSend) fd.append("file", fileToSend);
      if (subItem.file_existing)
        fd.append("file_preview", subItem.file_existing);
      if (form.remove_file) fd.append("remove_file", "1");

      const result = await fileCompletenessStore.updateFileCompleteness(
        Number(form.id),
        fd,
      );
      if (result.success) showSuccess(result.message);
    } else {
      // ─── PENGIRIMAN DATA MASSAL SEKALIGUS (SINGLE REQUEST) ───
      const fd = new FormData();
      fd.append("user_id", String(form.user_id));
      fd.append("hrd_file_category_id", String(form.hrd_file_category_id));

      for (const subItem of form.items) {
        let fileToSend: File | null = subItem.file;
        if (fileToSend && subItem.isImage) {
          fileToSend = await compressImage(fileToSend, 1000, 0.5);
        }

        if (fileToSend) fd.append("files[]", fileToSend);
        fd.append("names[]", subItem.name);
      }

      const result = await fileCompletenessStore.bulkCreateFileCompleteness(fd);
      if (result.success)
        showSuccess(
          result.message ||
            "Semua berkas kelengkapan berhasil ditambahkan sekaligus.",
        );
    }
    closeDialog();
    await fileCompletenessStore.fetchFileCompletenessSelected();
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

function getStorageUrl(
  filename: string | File | null | undefined,
): string | null {
  if (!filename) return null;
  if (filename instanceof File) return URL.createObjectURL(filename);
  return `${apiUrl}/image/file-completeness/${userId}/${filename}`;
}

function isImageFile(filename: string | File): boolean {
  const name = filename instanceof File ? filename.name : filename;
  return /\.(jpg|jpeg|png|webp|gif)$/i.test(name);
}

function openAddDialog(currentUserId: any) {
  isEditMode.value = false;
  form.id = null;
  form.user_id = currentUserId;
  form.hrd_file_category_id = null;
  form.items = [];
  form.remove_file = false;
  dialog.value = true;
}

function openEditDialog(item: any) {
  isEditMode.value = true;
  form.id = item.id;
  form.user_id = item.user_id;
  form.hrd_file_category_id = item.hrd_file_category_id;
  form.remove_file = false;

  form.items = [
    {
      file: null,
      name: item.name,
      file_existing: item.file ?? null,
      previewUrl:
        item.file && isImageFile(item.file) ? getStorageUrl(item.file) : null,
      isImage: item.file ? isImageFile(item.file) : false,
    },
  ];
  dialog.value = true;
}

function closeDialog() {
  dialog.value = false;
  form.items.forEach((item) => {
    if (item.previewUrl && item.file) URL.revokeObjectURL(item.previewUrl);
  });
  formRef.value?.reset();
  Object.keys(serverErrors).forEach((k) => delete serverErrors[k]);
}

function downloadFileSingle(item: any) {
  if (item.file) {
    const ext = item.file.split(".").pop();
    const fullName = item.name.endsWith(`.${ext}`)
      ? item.name
      : `${item.name}.${ext}`;
    downloadUrl(item.file, fullName);
  }
}

async function downloadUrl(filename: string, nameToSave: string) {
  const url = getStorageUrl(filename);
  if (!url) return;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Gagal mengunduh berkas");
    const blob = await response.blob();
    const localUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = localUrl;
    a.download = nameToSave;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(localUrl);
  } catch (err) {
    showError("Gagal mengunduh file secara langsung.");
  }
}

function viewFile(file: string | File | null | undefined) {
  const url = getStorageUrl(file);
  url
    ? window.open(url, "_blank")
    : showError("File tidak ditemukan atau tidak valid.");
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
      await fileCompletenessStore.destroyFileCompleteness(id);
      showSuccess("Data berhasil dihapus.");
    } catch (err: any) {
      showError(err?.message ?? "Gagal menghapus data ini.");
    }
  }
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
  if (fileCategoryStore.categories.length === 0)
    fileCategoryStore.fetchCategories();
}

function resetCategoryForm() {
  isEditCategoryMode.value = false;
  Object.assign(categoryForm, { id: null, name: "", is_mandatory: false });
  categoryFormRef.value?.reset();
  Object.keys(categoryServerErrors).forEach(
    (k) => delete categoryServerErrors[k],
  );
}

function editCategory(cat: FileCategory) {
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
      ? await fileCategoryStore.updateCategory(Number(categoryForm.id), params)
      : await fileCategoryStore.createCategory(params);

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
    await fileCategoryStore.toggleMandatory(id);
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
    const result = await fileCategoryStore.destroyCategory(id);
    showSuccess(result.message);
  } catch (err: any) {
    showError(err?.message ?? "Gagal menghapus kategori.");
  }
}

// ───── Kompresi Gambar Canvas Client-Side ─────
function compressImage(
  file: File,
  maxWidth = 1000,
  quality = 0.5,
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Gagal memproses context canvas"));
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob)
              return reject(new Error("Gagal melakukan kompresi gambar"));
            let fileName = file.name;
            if (!/\.(jpg|jpeg)$/i.test(fileName))
              fileName = fileName.replace(/\.[^/.]+$/, "") + ".jpg";
            resolve(
              new File([blob], fileName, {
                type: "image/jpeg",
                lastModified: Date.now(),
              }),
            );
          },
          "image/jpeg",
          quality,
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

onMounted(async () => {
  await fileCategoryStore.fetchCategories();
  if (fileCompletenessStore.fileCompletenessSelected.length === 0) {
    fileCompletenessStore.fileCompletenessSelectedParams.user_id =
      userId as string;
    await fileCompletenessStore.fetchFileCompletenessSelected();
  }
});
</script>
