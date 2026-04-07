<template>
  <div v-if="familyStore.isLoadingSelected">
    <v-card v-for="n in 3" :key="n" flat class="p-3">
      <v-skeleton-loader
        type="heading, divider, list-item-two-line@3"
        elevation="0"
      ></v-skeleton-loader>
    </v-card>
  </div>
  <v-card v-else flat class="p-1 md:p-3 space-y-3">
    <div class="flex justify-end w-full gap-2">
      <v-btn
        color="bg-gray-300 dark:bg-gray-600 text-indigo-900 dark:text-indigo-100 text-sm"
        prepend-icon="mdi-pencil-box"
        variant="flat"
        @click="openAddDialog(familyStore.familySelectedParams.user_id)"
        >Tambah Data</v-btn
      >
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
    <div class="flex flex-col gap-5">
      <v-card
        v-for="(item, index) in familyStore.familySelected"
        :key="item.id"
        variant="flat"
        border
        class="mx-auto w-full rounded-lg"
      >
        <v-card-item class="bg-gray-100 dark:bg-gray-800">
          <div class="flex items-center justify-between">
            <v-card-title class="text-base font-bold flex items-center gap-2">
              <v-icon icon="mdi-account" color="primary" size="small"></v-icon>
              {{ item.employee_relation_name ?? "-" }}
            </v-card-title>
            <div class="flex gap-2">
              <v-btn
                icon="mdi-pencil"
                variant="text"
                color="text-amber-500 "
                size="small"
                @click="openEditDialog(item)"
              ></v-btn>

              <v-btn
                icon="mdi-delete"
                variant="text"
                color="text-red-600"
                size="small"
                :loading="familyStore.isLoadingDestroy"
                @click="handleDelete(item.id)"
              ></v-btn>
            </div>
          </div>
        </v-card-item>

        <v-divider></v-divider>

        <v-card-text class="p-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="flex flex-col col-span-3">
              <span class="text-gray-500 text-sm dark:text-gray-300"
                >Nama Lengkap</span
              >
              <span class="font-bold text-sm">{{ item.name ?? "-" }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-gray-500 text-sm dark:text-gray-300"
                >Tempat, Tanggal Lahir</span
              >
              <span class="font-bold text-sm"
                >{{ item.birth_place ?? "-" }},
                {{ toFullDate(item.birth_date) ?? "-" }}</span
              >
            </div>
            <div class="flex flex-col">
              <span class="text-gray-500 text-sm dark:text-gray-300">NIK</span>
              <span class="font-bold text-sm">{{ item.nik ?? "-" }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-gray-500 text-sm dark:text-gray-300"
                >No. BPJS Kesehatan</span
              >
              <span class="font-bold text-sm">{{
                item.bpjs_health_number ?? "-"
              }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-gray-500 text-sm dark:text-gray-300"
                >No. HP</span
              >
              <span class="font-bold text-sm">{{
                item.phone_number ?? "-"
              }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-gray-500 text-sm dark:text-gray-300"
                >Jenis Kelamin</span
              >
              <span class="font-bold text-sm">{{
                item.gender == null
                  ? "-"
                  : item.gender == "M"
                    ? "Laki-Laki"
                    : "Perempuan"
              }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-gray-500 text-sm dark:text-gray-300"
                >Agama</span
              >
              <span class="font-bold text-sm">{{
                item.religion_name ?? "-"
              }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-gray-500 text-sm dark:text-gray-300"
                >Pekerjaan</span
              >
              <span class="font-bold text-sm">{{ item.job_name ?? "-" }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-gray-500 text-sm dark:text-gray-300"
                >Status Perkawinan</span
              >
              <span class="font-bold text-sm">{{
                item.marital_status_name
              }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-gray-500 text-sm dark:text-gray-300"
                >Tanggal Perkawinan</span
              >
              <span class="font-bold text-sm">{{
                toFullDate(item.marriage_date) ?? "-"
              }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-gray-500 text-sm dark:text-gray-300"
                >Pendidikan Terakhir</span
              >
              <span class="font-bold text-sm">{{
                item.education_name ?? "-"
              }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-gray-500 text-sm dark:text-gray-300"
                >Status</span
              >
              <span class="font-bold text-sm">
                {{
                  item.life_status === "alive"
                    ? "Hidup"
                    : item.life_status === "deceased"
                      ? "Meninggal"
                      : "-"
                }}
              </span>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-card>

  <!-- Dialog Tambah / Edit Data Keluarga -->
  <v-dialog v-model="dialog" max-width="700" scrollable>
    <v-card rounded="lg">
      <v-card-title class="flex items-center gap-2 px-6 pt-5 pb-3">
        <v-icon
          :icon="isEditMode ? 'mdi-pencil' : 'mdi-account-plus'"
          color="primary"
          size="small"
        ></v-icon>
        <span class="text-base font-bold">
          {{ isEditMode ? "Edit Data Keluarga" : "Tambah Data Keluarga" }}
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
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Hubungan -->
            <div class="md:col-span-2">
              <v-autocomplete
                id="hrd_master_employee_relation_id"
                v-model="form.hrd_master_employee_relation_id"
                :items="listEmployeeRelation"
                :loading="employeeRelationStore.isLoadingData"
                item-title="title"
                item-value="value"
                placeholder="Pilih hubungan keluarga"
                variant="outlined"
                density="compact"
                color="primary"
                hide-details="auto"
                clearable
                no-filter
                :rules="[rules.required]"
                @update:search="onSearchEmployeeRelation"
                :error-messages="serverErrors.hrd_master_employee_relation_id"
              >
                <template v-slot:label>
                  Hubungan Keluarga<span class="text-red-500">*</span>
                </template></v-autocomplete
              >
            </div>

            <!-- Nama Lengkap -->
            <div class="md:col-span-2">
              <v-text-field
                id="name"
                v-model="form.name"
                variant="outlined"
                density="compact"
                hide-details="auto"
                :rules="[rules.required]"
                :error-messages="serverErrors.name"
              >
                <template v-slot:label>
                  Nama Lengkap<span class="text-red-500">*</span>
                </template>
              </v-text-field>
            </div>

            <!-- Tempat Lahir -->
            <v-text-field
              id="birth_place"
              v-model="form.birth_place"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :rules="[rules.required]"
              :error-messages="serverErrors.birth_place"
            >
              <template v-slot:label>
                Tempat Lahir<span class="text-red-500">*</span>
              </template>
            </v-text-field>

            <!-- Tanggal Lahir -->
            <app-date-picker
              id="birth_date"
              v-model="form.birth_date"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :rules="[rules.required]"
              :error-messages="serverErrors.birth_date"
            >
              <template v-slot:label>
                Tanggal Lahir<span class="text-red-500">*</span>
              </template>
            </app-date-picker>

            <!-- NIK -->
            <v-text-field
              id="nik"
              v-model="form.nik"
              label="NIK"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :rules="[rules.required]"
              :error-messages="serverErrors.nik"
            >
              <template v-slot:label>
                NIK<span class="text-red-500">*</span>
              </template>
            </v-text-field>

            <!-- No. BPJS Kesehatan -->
            <v-text-field
              v-model="form.bpjs_health_number"
              label="No. BPJS Kesehatan"
              variant="outlined"
              density="compact"
              hide-details="auto"
            ></v-text-field>

            <!-- No. HP -->
            <v-text-field
              v-model="form.phone_number"
              label="No. HP"
              variant="outlined"
              density="compact"
              hide-details="auto"
            ></v-text-field>

            <!-- Jenis Kelamin -->
            <v-select
              id="gender"
              v-model="form.gender"
              label="Jenis Kelamin"
              :items="genderOptions"
              item-title="label"
              item-value="value"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :error-messages="serverErrors.gender"
            >
              <template v-slot:label>
                Jenis Kelamin<span class="text-red-500">*</span>
              </template></v-select
            >

            <!-- Agama -->
            <v-autocomplete
              id="hrd_master_religion_id"
              v-model="form.hrd_master_religion_id"
              :items="listReligion"
              :loading="religionStore.isLoadingData"
              item-title="title"
              item-value="value"
              placeholder="Pilih agama"
              variant="outlined"
              density="compact"
              color="primary"
              hide-details="auto"
              clearable
              no-filter
              :rules="[rules.required]"
              @update:search="onSearchReligion"
              :error-messages="serverErrors.hrd_master_religion_id"
            >
              <template v-slot:label>
                Agama<span class="text-red-500">*</span>
              </template></v-autocomplete
            >

            <!-- Pekerjaan -->
            <v-autocomplete
              id="hrd_master_job_id"
              v-model="form.hrd_master_job_id"
              :items="listJob"
              :loading="jobStore.isLoadingData"
              item-title="title"
              item-value="value"
              placeholder="Pilih pekerjaan"
              variant="outlined"
              density="compact"
              color="primary"
              hide-details="auto"
              clearable
              no-filter
              :rules="[rules.required]"
              @update:search="onSearchJob"
              :error-messages="serverErrors.hrd_master_job_id"
            >
              <template v-slot:label>
                Pekerjaan<span class="text-red-500">*</span>
              </template></v-autocomplete
            >

            <!-- Status Perkawinan -->
            <v-autocomplete
              id="hrd_master_marital_status_id"
              v-model="form.hrd_master_marital_status_id"
              :items="listMaritalStatus"
              :loading="maritalStatusStore.isLoadingData"
              item-title="title"
              item-value="value"
              placeholder="Pilih status pernikahan"
              variant="outlined"
              density="compact"
              color="primary"
              hide-details="auto"
              clearable
              no-filter
              :rules="[rules.required]"
              @update:search="onSearchMaritalStatus"
              :error-messages="serverErrors.hrd_master_marital_status_id"
            >
              <template v-slot:label>
                Status Pernikahan<span class="text-red-500">*</span>
              </template></v-autocomplete
            >

            <!-- Tanggal Perkawinan -->
            <app-date-picker
              v-model="form.marriage_date"
              label="Tanggal Pernikahan"
              variant="outlined"
              density="compact"
              hide-details="auto"
            />

            <!-- Pendidikan Terakhir -->
            <v-autocomplete
              id="hrd_master_education_id"
              v-model="form.hrd_master_education_id"
              :items="listEducation"
              :loading="educationStore.isLoadingData"
              item-title="title"
              item-value="value"
              placeholder="Pilih pendidikan terakhir"
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
                Pendidikan Terakhir<span class="text-red-500">*</span>
              </template></v-autocomplete
            >

            <!-- Status Hidup -->
            <v-select
              id="life_status"
              v-model="form.life_status"
              label="Jenis Kelamin"
              :items="lifeStatusOptions"
              item-title="label"
              item-value="value"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :error-messages="serverErrors.life_status"
            >
              <template v-slot:label>
                Status<span class="text-red-500">*</span>
              </template></v-select
            >
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
              ? familyStore.isLoadingUpdate
              : familyStore.isLoadingCreate
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
import { useDateFormatter } from "@/composables/UseDateFormatter";
import { useEmployeeRelationStore } from "@/stores/employee-relation.store";
import { useFamilyStore } from "@/stores/family.store";
import { onMounted, ref, reactive, computed, nextTick } from "vue";
import { useRoute } from "vue-router";
import AppDatePicker from "../AppDatePicker.vue";
import { useReligionStore } from "@/stores/religion.store";
import { useJobStore } from "@/stores/job.store";
import { useMaritalStatusStore } from "@/stores/maritall-status.store";
import { useEducationStore } from "@/stores/education.store";
import ConfirmDialog from "../ConfirmDialog.vue";
import { useConfirmDialog } from "@/composables/useConfirmDialog";

const employeeRelationStore = useEmployeeRelationStore();
const jobStore = useJobStore();
const religionStore = useReligionStore();
const maritalStatusStore = useMaritalStatusStore();
const educationStore = useEducationStore();
const familyStore = useFamilyStore();
const route = useRoute();
const { toFullDate } = useDateFormatter();
const userId = route.params.id;

const { ask } = useConfirmDialog();

const serverErrors = reactive<Record<string, string>>({});
const showErrorSnackbar = ref(false);
const snackbarMessage = ref("");
const showSuccessSnackbar = ref(false);
const successMessage = ref("");

// --- Dialog state ---
const dialog = ref(false);
const isEditMode = ref(false);
const formRef = ref();

// --- Form model ---
const defaultForm = () => ({
  id: null as number | null,
  user_id: null as number | null,
  hrd_master_employee_relation_id: null as number | null,
  hrd_master_marital_status_id: null as number | null,
  name: "",
  nik: "",
  birth_place: "",
  birth_date: "",
  bpjs_health_number: "",
  gender: null as string | null,
  hrd_master_religion_id: null as number | null,
  phone_number: "",
  hrd_master_job_id: null as number | null,
  marriage_date: "",
  hrd_master_education_id: null as number | null,
  life_status: null as string | null,
});

const form = reactive(defaultForm());

const searchEmployeeRelation = ref("");
const searchReligion = ref("");
const searchJob = ref("");
const searchMaritalStatus = ref("");
const searchEducation = ref("");

const listEmployeeRelation = computed(() => {
  const keyword = searchEmployeeRelation.value.toLowerCase();

  return employeeRelationStore.employeeRelationData
    .filter((employeeRelation) =>
      keyword ? employeeRelation.name.toLowerCase().includes(keyword) : true,
    )
    .map((employeeRelation) => ({
      title: employeeRelation.name,
      value: employeeRelation.id,
    }));
});
const listReligion = computed(() => {
  const keyword = searchReligion.value.toLowerCase();

  return religionStore.religionData
    .filter((religion) =>
      keyword ? religion.name.toLowerCase().includes(keyword) : true,
    )
    .map((religion) => ({
      title: religion.name,
      value: religion.id,
    }));
});
const listJob = computed(() => {
  const keyword = searchJob.value.toLowerCase();

  return jobStore.jobData
    .filter((job) =>
      keyword ? job.name.toLowerCase().includes(keyword) : true,
    )
    .map((job) => ({
      title: job.name,
      value: job.id,
    }));
});
const listMaritalStatus = computed(() => {
  const keyword = searchMaritalStatus.value.toLowerCase();

  return maritalStatusStore.maritalStatusData
    .filter((job) =>
      keyword ? job.name.toLowerCase().includes(keyword) : true,
    )
    .map((job) => ({
      title: job.name,
      value: job.id,
    }));
});
const listEducation = computed(() => {
  const keyword = searchEducation.value.toLowerCase();

  return educationStore.educationData
    .filter((job) =>
      keyword ? job.name.toLowerCase().includes(keyword) : true,
    )
    .map((job) => ({
      title: job.name,
      value: job.id,
    }));
});
const genderOptions = [
  { label: "Laki-Laki", value: "M" },
  { label: "Perempuan", value: "F" },
];
const lifeStatusOptions = [
  { label: "Hidup", value: "alive" },
  { label: "Meninggal", value: "deceased" },
];

const onSearchEmployeeRelation = (val: any) => {
  searchEmployeeRelation.value = val ?? "";
};
const onSearchReligion = (val: any) => {
  searchReligion.value = val ?? "";
};
const onSearchJob = (val: any) => {
  searchJob.value = val ?? "";
};
const onSearchMaritalStatus = (val: any) => {
  searchMaritalStatus.value = val ?? "";
};
const onSearchEducation = (val: any) => {
  searchEducation.value = val ?? "";
};

// --- Validation rules ---
const rules = {
  required: (v: any) => !!v || "Field ini wajib diisi",
};

// --- Actions ---
function openAddDialog(item: any) {
  isEditMode.value = false;
  Object.assign(form, defaultForm());
  dialog.value = true;
  form.user_id = item;
}

function openEditDialog(item: any) {
  isEditMode.value = true;

  Object.assign(form, {
    id: item.id,
    user_id: item.user_id,
    hrd_master_employee_relation_id:
      item.hrd_master_employee_relation_id ?? null,
    hrd_master_marital_status_id: item.hrd_master_marital_status_id ?? null,
    name: item.name ?? "",
    nik: item.nik ?? "",
    birth_place: item.birth_place ?? "",
    birth_date: item.birth_date ?? "",
    bpjs_health_number: item.bpjs_health_number ?? "",
    gender: item.gender ?? "",
    hrd_master_religion_id: item.hrd_master_religion_id ?? null,
    phone_number: item.phone_number ?? "",
    hrd_master_job_id: item.hrd_master_job_id ?? "",
    marriage_date: item.marriage_date ?? "",
    hrd_master_education_id: item.hrd_master_education_id ?? null,
    life_status: item.life_status ?? "",
  });
  dialog.value = true;
}

function closeDialog() {
  dialog.value = false;
  formRef.value?.reset();
  Object.keys(serverErrors).forEach((key) => delete serverErrors[key]);
}

function scrollToFirstError(serverErr?: Record<string, string>) {
  const priorityFields = [
    "nik",
    "hrd_master_employee_relation_id",
    "hrd_master_marital_status_id",
    "name",
    "birth_place",
    "birth_date",
    "gender",
    "hrd_master_religion_id",
    "hrd_master_job_id",
    "hrd_master_education_id",
    "life_status",
  ];

  // Cek apakah ada server error di salah satu field prioritas
  if (serverErr) {
    for (const field of priorityFields) {
      if (serverErr[field]) {
        const el = document.getElementById(`field-${field}`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
    }
  }

  // Cek apakah ada error validasi front-end di salah satu field prioritas
  for (const field of priorityFields) {
    const el = document.getElementById(`field-${field}`);
    if (el) {
      // Vuetify meletakkan class 'v-field--error' pada wrapper terdekat
      const wrapper = el.closest(".v-input");
      if (wrapper?.classList.contains("v-input--error")) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
    }
  }
}

async function submitForm() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  Object.keys(serverErrors).forEach((key) => delete serverErrors[key]);

  if (isEditMode.value) {
    try {
      const familyId = Number(form.id);
      await familyStore.updateFamily(familyId, {
        // required
        user_id: Number(form.user_id),
        hrd_master_employee_relation_id: Number(
          form.hrd_master_employee_relation_id,
        ),
        hrd_master_marital_status_id: Number(form.hrd_master_marital_status_id),
        name: form.name,
        birth_place: form.birth_place,
        birth_date: form.birth_date,
        gender: form.gender ?? "",
        hrd_master_religion_id: Number(form.hrd_master_religion_id),
        hrd_master_job_id: Number(form.hrd_master_job_id),
        hrd_master_education_id: Number(form.hrd_master_education_id),
        life_status: form.life_status ?? "",

        // optional
        nik: form.nik ?? "",
        bpjs_health_number: form.bpjs_health_number ?? "",
        phone_number: form.phone_number ?? "",
        marriage_date: form.marriage_date ?? "",
      });

      successMessage.value = "Data keluarga berhasil diperbarui.";
      showSuccessSnackbar.value = true;
      closeDialog();
    } catch (err: any) {
      if (err?.status === 422) {
        const errors = err.errors as Record<string, string[]>;
        if (errors) {
          Object.entries(errors).forEach(([field, messages]) => {
            serverErrors[field] = messages[0];
          });
          // Tunggu DOM update dulu sebelum scroll
          await nextTick();
          scrollToFirstError(serverErrors);
        }
      } else {
        snackbarMessage.value = err?.message ?? "Terjadi kesalahan, coba lagi.";
        showErrorSnackbar.value = true;
      }
    }
  } else {
    try {
      await familyStore.createFamily({
        // required
        user_id: Number(form.user_id),
        hrd_master_employee_relation_id: Number(
          form.hrd_master_employee_relation_id,
        ),
        hrd_master_marital_status_id: Number(form.hrd_master_marital_status_id),
        name: form.name,
        birth_place: form.birth_place,
        birth_date: form.birth_date,
        gender: form.gender ?? "",
        hrd_master_religion_id: Number(form.hrd_master_religion_id),
        hrd_master_job_id: Number(form.hrd_master_job_id),
        hrd_master_education_id: Number(form.hrd_master_education_id),
        life_status: form.life_status ?? "",

        // optional
        nik: form.nik ?? "",
        bpjs_health_number: form.bpjs_health_number ?? "",
        phone_number: form.phone_number ?? "",
        marriage_date: form.marriage_date ?? "",
      });

      successMessage.value = "Data keluarga berhasil ditambahkan.";
      showSuccessSnackbar.value = true;
      closeDialog();
    } catch (err: any) {
      if (err?.status === 422) {
        const errors = err.errors as Record<string, string[]>;
        if (errors) {
          Object.entries(errors).forEach(([field, messages]) => {
            serverErrors[field] = messages[0];
          });
          await nextTick();
          scrollToFirstError(serverErrors);
        }
      } else {
        snackbarMessage.value = err?.message ?? "Terjadi kesalahan, coba lagi.";
        showErrorSnackbar.value = true;
      }
    }
  }
}

async function handleDelete(id: number) {
  const confirmed = await ask({
    title: "Hapus Data Keluarga",
    message: "Data ini akan dihapus. Lanjutkan?",
    confirmText: "Ya, Hapus",
    color: "red-darken-1",
  });
  if (confirmed) deleteFamily(id);
}

async function deleteFamily(id: number) {
  try {
    await familyStore.destroyFamily(id);
    successMessage.value = "Data keluarga berhasil dihapus.";
    showSuccessSnackbar.value = true;
  } catch (err: any) {
    snackbarMessage.value = err?.message ?? "Gagal menghapus data keluarga.";
    showErrorSnackbar.value = true;
  }
}

onMounted(async () => {
  if (familyStore.familySelected.length == 0) {
    familyStore.familySelectedParams.user_id = userId as string;
    await familyStore.fetchFamilySelected();
  }

  employeeRelationStore.fetchEmployeeRelationData();
  religionStore.fetchReligionData();
  jobStore.fetchJobData();
  maritalStatusStore.fetchMaritalStatusData();
  educationStore.fetchEducationData();
});
</script>
