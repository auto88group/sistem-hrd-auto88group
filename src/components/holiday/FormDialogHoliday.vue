<template>
  <v-dialog v-model="dialog" max-width="900" scrollable persistent>
    <v-card rounded="lg">
      <v-card-title class="flex items-center gap-2 px-6 pt-5 pb-3">
        <v-icon icon="mdi-calendar" />
        <span class="text-base font-bold">Tambah Data</span>
        <v-spacer />
        <v-btn icon="mdi-close" variant="text" @click="closeDialog" />
      </v-card-title>

      <v-divider />

      <v-card-text class="p-4">
        <v-form ref="formRef" class="space-y-4">
          <v-row
            v-for="(item, index) in forms"
            :key="index"
            class="gy-2 bg-blue-100 dark:bg-blue-900/50 px-3 py-7 rounded-xl relative"
          >
            <v-btn
              v-if="forms.length > 1"
              icon="mdi-close"
              color="text-red-500"
              variant="text"
              size="x-small"
              class="absolute -top-2 -right-1 m-1"
              @click="removeItem(index)"
            />
            <v-col cols="12" md="6">
              <app-date-picker
                v-model="item.tanggal"
                variant="outlined"
                density="compact"
                bg-color="bg-white dark:bg-slate-900"
                :rules="[rules.required]"
                clearable
              >
                <template v-slot:label>
                  Tanggal<span class="text-red-500">*</span>
                </template>
              </app-date-picker>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="item.note"
                variant="outlined"
                density="compact"
                hide-details="auto"
                bg-color="bg-white dark:bg-slate-900"
                :rules="[rules.required]"
              >
                <template v-slot:label>
                  Catatan<span class="text-red-500">*</span>
                </template>
              </v-text-field>
            </v-col>
          </v-row>

          <div class="md:flex gap-3">
            <v-btn
              color="bg-black text-white"
              variant="flat"
              class="mt-2"
              prepend-icon="mdi-plus"
              @click="addItem"
            >
              Tambah Baris
            </v-btn>
            <v-btn
              color="bg-amber-400 dark:bg-amber-900 text-gray-900 dark:text-white"
              variant="flat"
              class="mt-2"
              prepend-icon="mdi-calendar"
              @click="monthDialogRef?.open()"
            >
              Generate Hari Minggu
            </v-btn>
            <v-btn
              color="bg-red-400 dark:bg-red-900 text-white"
              variant="flat"
              class="mt-2"
              prepend-icon="mdi-calendar"
              @click="nationalHolidayDialogRef?.open()"
            >
              Generate Libur Nasional
            </v-btn>
          </div>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="justify-end">
        <v-btn variant="outlined" @click="closeDialog">Batal</v-btn>
        <v-btn
          color="primary"
          :loading="holidayStore.isLoadingCreate"
          @click="submitForm"
        >
          Tambah
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <MonthDialog ref="monthDialogRef" @generated="onSundaysGenerated" />

  <NationalHolidayDialog
    ref="nationalHolidayDialogRef"
    @added="onHolidaysAdded"
  />
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";

import { useHolidayStore } from "@/stores/holiday.store";
import AppDatePicker from "../AppDatePicker.vue";
import MonthDialog from "./MonthDialog.vue";
import NationalHolidayDialog from "./NationalHolidayDialog.vue";

const props = defineProps<{
  showError: (msg: string) => void;
  showSuccess: (msg: string) => void;
}>();

const holidayStore = useHolidayStore();

const dialog = ref(false);
const formRef = ref();
const monthDialogRef = ref<InstanceType<typeof MonthDialog>>();
const nationalHolidayDialogRef =
  ref<InstanceType<typeof NationalHolidayDialog>>();

const forms = ref([{ tanggal: "", note: "" }]);
const serverErrors = reactive<Record<string, string>>({});

const rules = {
  required: (v: any) => !!v || "Wajib diisi",
};

// =========================
// FORM ITEMS
// =========================
function addItem() {
  forms.value.push({ tanggal: "", note: "" });
}

function removeItem(index: number) {
  forms.value.splice(index, 1);
}

// =========================
// CHILD DIALOG CALLBACKS
// =========================
function onSundaysGenerated(items: { tanggal: string; note: string }[]) {
  forms.value.push(...items);
}

function onHolidaysAdded(items: { tanggal: string; note: string }[]) {
  forms.value.push(...items);
}

// =========================
// OPEN ADD
// =========================
function openAddDialog() {
  forms.value = [{ tanggal: "", note: "" }];
  dialog.value = true;
}

// =========================
// SUBMIT
// =========================
async function submitForm() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  try {
    const result = await holidayStore.createHoliday(forms.value);
    if (result.success) {
      props.showSuccess(result.message || "Berhasil menambah hari libur");
    }
  } catch (err: any) {
    props.showError(err?.message || "Error");
  } finally {
    closeDialog();
  }
}

// =========================
// CLOSE
// =========================
function closeDialog() {
  dialog.value = false;
  formRef.value?.reset();
  Object.keys(serverErrors).forEach((k) => delete serverErrors[k]);
}

defineExpose({ openAddDialog });
</script>
