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
        <p class="text-red-500 text-xs">
          *Pastikan user belum memiliki shift pada tanggal tersebut, karena data
          shift yang sudah ada akan diganti.
        </p>
        <v-form ref="formRef">
          <v-row class="gy-4">
            <v-col cols="12" v-if="!isEditMode">
              <v-autocomplete
                v-model="form.branch_id"
                :items="listBranch"
                :loading="branchStore.isLoadingData"
                prepend-inner-icon="mdi-map-marker-outline"
                item-title="alias"
                item-value="value"
                placeholder="Pilih cabang"
                variant="outlined"
                density="compact"
                color="primary"
                class="custom-input"
                hide-details="auto"
                clearable
                no-filter
                :rules="[rules.required]"
                @update:search="onSearchBranch"
              >
                <template v-slot:label>
                  Cabang<span class="text-red-500">*</span>
                </template>

                <template v-slot:item="{ props, item }">
                  <v-list-item
                    v-bind="props"
                    :title="item.alias"
                    :subtitle="item.title"
                  />
                </template>
              </v-autocomplete>
            </v-col>

            <v-col cols="12" v-if="!isEditMode">
              <v-autocomplete
                ref="autocompleteRef"
                v-model="form.user_ids"
                :items="listUser"
                multiple
                chips
                closable-chips
                variant="outlined"
                density="compact"
                item-title="name"
                item-value="value"
                placeholder="Cari nama..."
                hide-details="auto"
                clearable
                no-filter
                :rules="[rules.required]"
                @click:clear="onClearUser"
                @update:search="onSearchUser"
                @update:modelValue="onUserSelected"
              >
                <template v-slot:label>
                  Karyawan<span class="text-red-500">*</span>
                </template>

                <template v-slot:item="{ props, item }">
                  <v-list-item
                    v-bind="props"
                    :title="formatName(item)"
                    :subtitle="item.email"
                  />
                </template>

                <template v-slot:selection="{ item, index }">
                  <v-chip size="small" class="ma-1" closable>
                    {{
                      selectedUsers[index]?.name || item.full_name || item.value
                    }}
                  </v-chip>
                </template>
              </v-autocomplete>
            </v-col>

            <v-col cols="12" v-if="!isEditMode">
              <date-range-picker
                v-model="form.period"
                :rules="[rules.required]"
              >
                <template v-slot:label>
                  Periode<span class="text-red-500">*</span>
                </template>
              </date-range-picker>
            </v-col>

            <v-col cols="12">
              <v-autocomplete
                v-model="form.hrd_master_shift_id"
                :items="listShift"
                :loading="shiftStore.isLoadingData"
                prepend-inner-icon="mdi-map-marker-outline"
                item-title="title"
                item-value="value"
                placeholder="Pilih shift"
                variant="outlined"
                density="compact"
                color="primary"
                class="custom-input"
                hide-details="auto"
                clearable
                no-filter
                :rules="[rules.required]"
                @update:search="onSearchShift"
              >
                <template v-slot:label>
                  Shift<span class="text-red-500">*</span>
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
              ? shiftScheduleStore.isLoadingUpdate
              : shiftScheduleStore.isLoadingCreate
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
/* =========================
 * IMPORTS
 * ========================= */
import { ref, reactive, computed, watch, onMounted, nextTick } from "vue";
import { useDebounceFn } from "@/composables/UseDebounce";
import { useFormatName } from "@/composables/useFormatName";

import { useBranchStore } from "@/stores/branch.store";
import { useUserStore } from "@/stores/user.store";
import { useShiftScheduleStore } from "@/stores/shift-schedule.store";

import DateRangePicker from "../DateRangePicker.vue";
import { useShiftStore } from "@/stores/shift.store";

/* =========================
 * COMPOSABLE
 * ========================= */
const { formatName } = useFormatName();

/* =========================
 * REFS
 * ========================= */
const dialog = ref(false);
const formRef = ref();
const autocompleteRef = ref();
const isEditMode = ref(false);
const isSelectingUser = ref(false);
const selectedUserText = ref<string>("");
const selectedUsers = ref<any[]>([]);
const searchBranch = ref("");
const searchShift = ref("");

/* =========================
 * STORES
 * ========================= */
const branchStore = useBranchStore();
const userStore = useUserStore();
const shiftScheduleStore = useShiftScheduleStore();
const shiftStore = useShiftStore();

/* =========================
 * PROPS
 * ========================= */
const props = defineProps<{
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}>();

/* =========================
 * FORM STATE
 * ========================= */
const defaultForm = () => ({
  id: 0 as number | null,
  branch_id: null as number | null,
  user_ids: [] as number[],
  user_names: [] as string[],
  user_emails: [] as string[],
  user_email: "",
  hrd_master_shift_id: null as number | null,
  period: [] as string[],
});

const form = reactive(defaultForm());
const serverErrors = reactive<Record<string, string>>({});

/* =========================
 * COMPUTED
 * ========================= */
const listBranch = computed(() => {
  const keyword = searchBranch.value.toLowerCase();

  return branchStore.branchData
    .filter((b) => {
      if (!keyword) return true;
      return (
        b.name.toLowerCase().includes(keyword) ||
        b.alias.toLowerCase().includes(keyword)
      );
    })
    .map((b) => ({
      title: b.name,
      alias: b.alias,
      value: b.id,
    }));
});

const listShift = computed(() => {
  const keyword = searchShift.value.toLowerCase();

  return shiftStore.shiftData
    .filter((b) => {
      if (!keyword) return true;
      return b.name.toLowerCase().includes(keyword);
    })
    .map((b) => ({
      title: b.name,
      value: b.id,
    }));
});

const listUser = computed(() => {
  const users = userStore.usersData.map((u) => ({
    value: u.id,
    name: u.name,
    full_name: u.full_name,
    email: u.email,
  }));

  if (form.user_ids?.length && form.user_names?.length) {
    form.user_ids.forEach((id, index) => {
      const exists = users.some((u) => u.value === id);

      if (!exists) {
        users.unshift({
          value: id,
          name: form.user_names?.[index] ?? "",
          full_name: form.user_names?.[index] ?? "",
          email: form.user_emails?.[index] ?? "",
        });
      }
    });
  }

  return users;
});

/* =========================
 * METHODS
 * ========================= */
const onSearchBranch = (val: any) => {
  searchBranch.value = val ?? "";
};

const onSearchShift = (val: any) => {
  searchShift.value = val ?? "";
};

const onClearUser = async () => {
  form.user_ids = [];
  selectedUserText.value = "";
  selectedUsers.value = [];
  userStore.userDataParams.search = "";
  await userStore.fetchUsersData();
};

const onUserSelected = (val: number[]) => {
  isSelectingUser.value = true;

  // ambil dari listUser + cache lama
  const mergedSource = [...listUser.value, ...selectedUsers.value];

  selectedUsers.value = val.map((id) => {
    return (
      mergedSource.find((u) => u.value === id) || {
        value: id,
        name: form.user_names?.[0] ?? "",
        email: "",
      }
    );
  });

  form.user_names = selectedUsers.value.map((u) => u.name);
  form.user_emails = selectedUsers.value.map((u) => u.email);

  nextTick(() => {
    autocompleteRef.value?.blur();
    isSelectingUser.value = false;
  });
};

const onSearchUser = useDebounceFn(async (val: string) => {
  if (isSelectingUser.value) return;
  if (val === null || val === undefined) return;
  if (val === userStore.userDataParams.search) return;

  userStore.userDataParams.search = val;
  await userStore.fetchUsersData();
}, 400);

/* =========================
 * WATCHERS
 * ========================= */
watch(
  () => form.branch_id,
  (newVal) => {
    userStore.userDataParams.branch_id = newVal ?? undefined;

    form.user_ids = [];
    selectedUserText.value = "";
    selectedUsers.value = [];
    userStore.userDataParams.search = "";

    userStore.fetchUsersData();
  },
);

/* =========================
 * RULES
 * ========================= */
const rules = {
  required: (v: any) =>
    (v !== null && v !== undefined && v !== "") || "Wajib diisi",
};

/* =========================
 * FORM ACTIONS
 * ========================= */
function closeDialog() {
  dialog.value = false;
  formRef.value?.reset();
  Object.keys(serverErrors).forEach((k) => delete serverErrors[k]);
}

function openAddDialog() {
  isEditMode.value = false;
  Object.assign(form, defaultForm());
  dialog.value = true;
}

function openEditDialog(item: any) {
  isEditMode.value = true;

  Object.assign(form, {
    id: item.id,
    hrd_master_shift_id: item.hrd_master_shift_id,
  });

  dialog.value = true;
}

async function submitForm() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  Object.keys(serverErrors).forEach((k) => delete serverErrors[k]);

  try {
    if (isEditMode.value) {
      await shiftScheduleStore.update(form.id!, {
        hrd_master_shift_id: form.hrd_master_shift_id!,
      });
      props.showSuccess("Data berhasil diperbarui.");
      shiftScheduleStore.fetchShiftSchedule();
      closeDialog();
    } else {
      await shiftScheduleStore.store({
        branch_id: form.branch_id!,
        user_ids: form.user_ids,
        hrd_master_shift_id: form.hrd_master_shift_id!,
        period: form.period,
      });
      props.showSuccess("Data berhasil ditambahkan.");
      shiftScheduleStore.fetchShiftSchedule();
      closeDialog();
    }
  } catch (err: any) {
    handleServerErrors(err);
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

/* =========================
 * LIFECYCLE
 * ========================= */
onMounted(() => {
  userStore.fetchUsersData();
  // branchStore.fetchBranchData();
  shiftStore.fetchShiftData();
});

/* =========================
 * EXPOSE
 * ========================= */
defineExpose({
  openAddDialog,
  openEditDialog,
});
</script>
