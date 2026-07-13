<template>
  <v-dialog v-model="dialog" max-width="500" scrollable>
    <v-card rounded="lg">
      <v-card-title class="flex items-center gap-2 px-6 pt-5 pb-3">
        <v-icon
          :icon="isEditMode ? 'mdi-pencil' : 'mdi-briefcase'"
          color="primary"
          size="small"
        ></v-icon>
        <span class="text-base font-bold">
          {{ isEditMode ? "Edit Jabatan" : "Tambah Jabatan" }}
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
      <v-card-text class="p-4">
        <v-form ref="formRef">
          <v-row class="gy-4">
            <v-col cols="12">
              <v-text-field
                id="name"
                v-model="form.name"
                type="text"
                variant="outlined"
                hide-details="auto"
                density="compact"
                :rules="[rules.required]"
                :error-messages="serverErrors.name"
              >
                <template v-slot:label>
                  Nama Jabatan<span class="text-red-500">*</span>
                </template>
              </v-text-field>
            </v-col>

            <v-col cols="12">
              <v-autocomplete
                id="master_level_id"
                v-model="form.master_level_id"
                :items="masterPositionStore.levels"
                item-title="display_name"
                item-value="id"
                variant="outlined"
                hide-details="auto"
                density="compact"
                :loading="masterPositionStore.isLoadingLevels"
                :rules="[rules.required]"
                :error-messages="serverErrors.master_level_id"
                @update:model-value="onLevelChange"
              >
                <template v-slot:label>
                  Level<span class="text-red-500">*</span>
                </template>
                <template v-slot:item="{ props, item }">
                  <v-list-item
                    v-bind="props"
                    :subtitle="item.description"
                  ></v-list-item>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
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
              ? masterPositionStore.isLoadingUpdate
              : masterPositionStore.isLoadingCreate
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
import { useAppStore } from "@/stores/app";
import { useMasterPositionStore } from "@/stores/master-position.store";
import { reactive, ref } from "vue";

const appStore = useAppStore();

const defaultForm = () => ({
  id: 0 as number | null,
  name: "",
  master_level_id: null as number | null,
  level_name: "",
});

const masterPositionStore = useMasterPositionStore();
const form = reactive(defaultForm());
const serverErrors = reactive<Record<string, string>>({});

const dialog = ref(false);
const isEditMode = ref(false);
const formRef = ref();

const rules = {
  required: (v: any) =>
    (v !== null && v !== undefined && v !== "") || "Wajib diisi",
};

function onLevelChange(selectedId: number | null) {
  if (!selectedId) {
    form.level_name = "";
    return;
  }

  const selectedLevel = masterPositionStore.levels.find(
    (l) => l.id === selectedId,
  );
  if (selectedLevel) {
    form.level_name = selectedLevel.level_name;
  }
}

function closeDialog() {
  dialog.value = false;
  formRef.value?.reset();
  Object.keys(serverErrors).forEach((key) => delete serverErrors[key]);
}

async function prepareDialog() {
  // Panggil data level sebelum dialog ditampilkan agar dropdown sudah terisi
  await masterPositionStore.fetchLevels();
  dialog.value = true;
}

function openAddDialog() {
  isEditMode.value = false;
  Object.assign(form, defaultForm());
  prepareDialog();
}

function openEditDialog(item: any) {
  isEditMode.value = true;
  Object.assign(form, {
    id: item.id,
    name: item.name,
    master_level_id: item.master_level_id,
    level_name: item.level_name || "",
  });
  prepareDialog();
}

async function submitForm() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  Object.keys(serverErrors).forEach((key) => delete serverErrors[key]);

  // Hindari error typescript dengan mem-bypass parameter id di body
  const payload = {
    name: form.name,
    master_level_id: form.master_level_id as number,
    level_name: form.level_name,
  };

  if (isEditMode.value) {
    try {
      await masterPositionStore.updatePosition(Number(form.id), payload);
      showSuccess("Data berhasil diperbarui.");
      closeDialog();
    } catch (err: any) {
      handleServerErrors(err);
    }
  } else {
    try {
      await masterPositionStore.createPosition(payload);
      showSuccess("Data berhasil ditambahkan.");
      closeDialog();
    } catch (err: any) {
      handleServerErrors(err);
    }
  }
}

function showError(message: string) {
  appStore.errorMessage = message;
  appStore.showErrorSnackbar = true;
}

function showSuccess(message: string) {
  appStore.successMessage = message;
  appStore.showSuccessSnackbar = true;
}

function handleServerErrors(err: any) {
  // Tangkap error validasi Laravel (422) atau error relasi saat delete
  if (err?.response?.status === 422) {
    const errors = err.response.data.errors as Record<string, string[]>;
    if (errors) {
      Object.entries(errors).forEach(([field, messages]) => {
        serverErrors[field] = messages[0];
      });
    } else if (err.response.data.message) {
      // Menangkap custom message 422 (contoh saat gagal delete karena dipakai user)
      showError(err.response.data.message);
    }
  } else {
    showError(err?.message ?? "Terjadi kesalahan, coba lagi.");
  }
}

defineExpose({
  openAddDialog,
  openEditDialog,
});
</script>
