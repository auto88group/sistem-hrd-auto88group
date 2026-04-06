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
      >
        Tambah Data
      </v-btn>
    </div>

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
            class="!text-red-500 hover:!bg-red-50 transition-all duration-300"
          />
        </div>
      </template>
    </v-data-table-server>
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

      <v-card-text v-if="isPreviewMode" class="p-4">
        <div class="space-y-3 md:space-y-0 md:grid grid-cols-2 gap-4">
          <div class="flex flex-col col-span-2">
            <span class="text-gray-500 text-sm dark:text-gray-300"
              >Nama Perusahaan</span
            >
            <span class="font-bold text-sm">{{ form.company ?? "-" }}</span>
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
          <div class="flex flex-col col-span-2">
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
            <span class="font-bold text-sm">
              {{ toFullDate(form.start_date) ?? "-" }}
            </span>
          </div>
          <div class="flex flex-col">
            <span class="text-gray-500 text-sm dark:text-gray-300"
              >Tanggal Keluar</span
            >
            <span class="font-bold text-sm">
              {{ toFullDate(form.end_date) ?? "-" }}
            </span>
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
                        >{{ form.attachment }}</span
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
            </div>
          </v-card-text>
        </div>
      </v-card-text>

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
              @update:search="onSearchRegency"
              :disabled="!form.master_area_province_id"
            ></v-autocomplete>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { WorkExperienceDatatablesParams } from "@/api/modules/work-experience.api";
import { useDateFormatter } from "@/composables/UseDateFormatter";
import { useProvinceStore } from "@/stores/province.store";
import { useRegencyStore } from "@/stores/regency.store";
import { useWorkExperienceStore } from "@/stores/work-experience.store";
import { reactive } from "vue";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const userId = route.params.id;
const apiUrl = import.meta.env.VITE_API_URL;
const workExperienceStore = useWorkExperienceStore();
const workExperience = computed(() => workExperienceStore.workExperience);
const { toFullDate } = useDateFormatter();

const provinceStore = useProvinceStore();
const regencyStore = useRegencyStore();

const searchProvince = ref("");
const searchRegency = ref("");

const listProvince = computed(() => {
  const keyword = searchProvince.value.toLowerCase();
  return provinceStore.province
    .filter((province) => {
      if (!keyword) return true;
      return province.name.toLowerCase().includes(keyword);
    })
    .map((province) => ({
      title: province.name,
      value: province.id,
    }));
});
const listRegency = computed(() => {
  const keyword = searchRegency.value.toLowerCase();
  return regencyStore.regency
    .filter((regency) => {
      if (!keyword) return true;
      return regency.name.toLowerCase().includes(keyword);
    })
    .map((regency) => ({
      title: regency.name,
      value: regency.id,
    }));
});

const onSearchProvince = (val: any) => {
  searchProvince.value = val ?? "";
};
const onSearchRegency = (val: any) => {
  searchRegency.value = val ?? "";
};

const searchQuery = ref("");
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

function onSearch(value: string | null) {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    workExperienceStore.params.search_slug = value ?? "";
    workExperienceStore.params.start = 0;
    workExperienceStore.fetchWorkExperience();
  }, 400); // debounce 400ms
}

function onProvinceChange() {
  form.master_area_regency_id = null;
  regencyStore.regency = [];
  regencyStore.regencyParams.province_id = form.master_area_province_id ?? "";
  regencyStore.fetchRegency();
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

function loadFirstTimeMaserArea() {
  if (form.master_area_province_id) {
    regencyStore.regencyParams.province_id = form.master_area_province_id;
    regencyStore.fetchRegency();
  }
}

const headers = [
  { title: "No", key: "no", sortable: false, width: "60px" },
  { title: "Nama Perusahaan", key: "company", sortable: false },
  { title: "Jenis Perusahaan", key: "company_type", sortable: false },
  { title: "Jabatan Terakhir", key: "position", sortable: false },
  { title: "Aksi", key: "actions", sortable: false, align: "end" },
];

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
const rules = {
  required: (v: any) => !!v || "Field ini wajib diisi",
};

const dialog = ref(false);
const isPreviewMode = ref(false);
const isEditMode = ref(false);
const formRef = ref();

function closeDialog() {
  dialog.value = false;
  formRef.value?.reset();
  Object.keys(serverErrors).forEach((key) => delete serverErrors[key]);
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

function openPreviewDialog(item: any) {
  isEditMode.value = false;
  isPreviewMode.value = true;
  Object.assign(form, {
    id: item.id,
    user_id: item.user_id,
    company: item.company,
    company_type: item.company_type,
    position: item.position,
    address: item.string,
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

function openEditDialog(item: any) {
  isEditMode.value = true;
  isPreviewMode.value = false;
  Object.assign(form, {
    id: item.id,
    user_id: item.user_id,
    company: item.company,
    company_type: item.company_type,
    position: item.position,
    address: item.string,
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
  loadFirstTimeMaserArea();
  dialog.value = true;
}

onMounted(() => {
  workExperienceStore.fetchWorkExperience();
  provinceStore.fetchProvince();
});
</script>
