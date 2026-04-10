<template>
  <v-dialog v-model="dialog" max-width="700" scrollable>
    <v-card rounded="lg">
      <v-card-title class="flex items-center gap-2 px-6 pt-5 pb-3">
        <v-icon
          :icon="isEditMode ? 'mdi-pencil' : 'mdi-briefcase'"
          color="primary"
          size="small"
        ></v-icon>
        <span class="text-base font-bold">
          {{ isEditMode ? "Edit Data" : "Tambah Data " }}
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
            <v-col cols="12" md="6">
              <v-text-field
                id="code"
                v-model="form.code"
                type="text"
                variant="outlined"
                hide-details="auto"
                density="compact"
                :rules="[rules.required]"
                :error-messages="serverErrors.code"
              >
                <template v-slot:label>
                  Code<span class="text-red-500">*</span>
                </template>
              </v-text-field>
            </v-col>

            <v-col cols="12" md="6">
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
                  Nama<span class="text-red-500">*</span>
                </template>
              </v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-menu
                v-model="openTimeIn"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
              >
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-model="form.time_in"
                    readonly
                    density="compact"
                    variant="outlined"
                    v-bind="props"
                    hide-details="auto"
                    :rules="[rules.required]"
                    :error-messages="serverErrors.time_in"
                  >
                    <template v-slot:label>
                      Jam Masuk<span class="text-red-500">*</span>
                    </template>
                  </v-text-field>
                </template>

                <v-time-picker
                  v-model="form.time_in"
                  format="24hr"
                  @update:minute="openTimeIn = false"
                />
              </v-menu>
            </v-col>

            <v-col cols="12" md="6">
              <v-menu
                v-model="openTimeOut"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
              >
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-model="form.time_out"
                    readonly
                    density="compact"
                    variant="outlined"
                    v-bind="props"
                    hide-details="auto"
                    :rules="[rules.required]"
                    :error-messages="serverErrors.time_out"
                  >
                    <template v-slot:label>
                      Jam Pulang<span class="text-red-500">*</span>
                    </template>
                  </v-text-field>
                </template>

                <v-time-picker
                  v-model="form.time_out"
                  format="24hr"
                  @update:minute="openTimeOut = false"
                />
              </v-menu>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                id="note"
                label="Catatan"
                v-model="form.note"
                type="text"
                variant="outlined"
                hide-details="auto"
                density="compact"
                :error-messages="serverErrors.note"
              >
              </v-text-field>
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
            isEditMode ? shiftStore.isLoadingUpdate : shiftStore.isLoadingCreate
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
import { useShiftStore } from "@/stores/shift.store";
import { reactive, ref } from "vue";

const defaultForm = () => ({
  id: 0 as number | null,
  code: "",
  name: "",
  time_in: "",
  time_out: "",
  note: "",
});

const openTimeIn = ref(false);
const openTimeOut = ref(false);

const props = defineProps<{
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}>();

const shiftStore = useShiftStore();
const form = reactive(defaultForm());
const serverErrors = reactive<Record<string, string>>({});

const dialog = ref(false);
const isEditMode = ref(false);
const formRef = ref();

const rules = {
  required: (v: any) =>
    (v !== null && v !== undefined && v !== "") || "Wajib diisi",
};

function closeDialog() {
  dialog.value = false;
  formRef.value?.reset();
  Object.keys(serverErrors).forEach((key) => delete serverErrors[key]);
}

function openAddDialog() {
  isEditMode.value = false;
  Object.assign(form, defaultForm());
  dialog.value = true;
}

function openEditDialog(item: any) {
  console.log(item);
  isEditMode.value = true;
  Object.assign(form, {
    id: item.id,
    code: item.code,
    name: item.name,
    time_in: item.time_in ? item.time_in.slice(0, 5) : null,
    time_out: item.time_out ? item.time_out.slice(0, 5) : null,
    note: item.note,
  });
  dialog.value = true;
}
async function submitForm() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  Object.keys(serverErrors).forEach((key) => delete serverErrors[key]);

  if (isEditMode.value) {
    try {
      await shiftStore.updateShift(Number(form.id), form);
      props.showSuccess("Data berhasil diperbarui.");
      closeDialog();
    } catch (err: any) {
      handleServerErrors(err);
    }
  } else {
    try {
      await shiftStore.createShift(form);
      props.showSuccess("Data berhasil ditambahkan.");
      closeDialog();
    } catch (err: any) {
      handleServerErrors(err);
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
    }
  } else {
    props.showError(err?.message ?? "Terjadi kesalahan, coba lagi.");
  }
}

defineExpose({
  openAddDialog,
  openEditDialog,
});
</script>
