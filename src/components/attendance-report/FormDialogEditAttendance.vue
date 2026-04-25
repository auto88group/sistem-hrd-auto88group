<template>
  <v-dialog
    v-model="employeeAttendanceStore.formDialog"
    max-width="700"
    scrollable
  >
    <v-card rounded="lg">
      <v-card-title class="flex items-center gap-2 px-6 pt-5 pb-3">
        <v-icon icon="mdi-tune-variant" color="primary" size="small"></v-icon>
        <span class="text-base font-bold">Edit Absensi</span>
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
        <v-row>
          <v-col cols="12">
            <v-autocomplete
              v-model="form.user_id"
              :items="listUser"
              :loading="userStore.isLoadingData"
              item-title="name"
              item-value="value"
              prepend-inner-icon="mdi-account"
              placeholder="Cari nama..."
              variant="outlined"
              density="compact"
              color="primary"
              class="custom-input"
              hide-details="auto"
              clearable
              no-filter
              @update:search="onSearchUser"
              @click:clear="onClearUser"
              :rules="[rules.required]"
              :error-messages="serverErrors.user_id"
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
              <template v-slot:selection="{ item }">
                {{ formatName(item) }}
              </template>
            </v-autocomplete>
          </v-col>

          <v-col cols="12">
            <app-date-picker
              v-model="form.period_date"
              variant="outlined"
              density="compact"
              :rules="[rules.required]"
              :error-messages="serverErrors.period_date"
            >
              <template v-slot:label>
                Tanggal<span class="text-red-500">*</span>
              </template>
            </app-date-picker>
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

          <v-col cols="12">
            <div class="bg-blue-400 text-white flex rounded-md overflow-hidden">
              <div class="bg-blue-500 flex items-center p-3">
                <v-icon icon="mdi-clock-outline" color="white"></v-icon>
              </div>
              <div class="p-3">Jam Kerja:</div>
            </div>
          </v-col>

          <v-col cols="12" md="6"> </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useDebounceFn } from "@/composables/UseDebounce";
import { useFormatName } from "@/composables/useFormatName";
import { useAppStore } from "@/stores/app";
import { useEmployeeAttendanceRequestStore } from "@/stores/employee-attendance.store";
import { useUserStore } from "@/stores/user.store";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import AppDatePicker from "../AppDatePicker.vue";
import { useShiftStore } from "@/stores/shift.store";

const employeeAttendanceStore = useEmployeeAttendanceRequestStore();

const { payloadEdit: form, serverErrors } = storeToRefs(
  employeeAttendanceStore,
);

const appStore = useAppStore();
const userStore = useUserStore();
const shiftStore = useShiftStore();
const { formatName } = useFormatName();

const isSelectingUser = ref(false);
const selectedUserText = ref<string>("");
const searchShift = ref("");

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

  if (form.value.user_id && form.value.user_name) {
    const exists = users.some((u) => u.value === form.value.user_id);
    if (!exists) {
      users.unshift({
        value: form.value.user_id,
        name: form.value.user_name ?? "",
        full_name: form.value.user_full_name ?? "",
        email: form.value.user_email ?? "",
      });
    }
  }
  return users;
});

const rules = {
  required: (v: any) =>
    (v !== null && v !== undefined && v !== "") || "Wajib diisi",
};

const onSearchUser = useDebounceFn(async (val: string) => {
  if (isSelectingUser.value) return;

  if (val === selectedUserText.value) return;
  userStore.usersData = await userStore.fetchUsersDataWithParams({
    search: val ?? "",
  });
}, 400);

const onSearchShift = (val: any) => {
  searchShift.value = val ?? "";
};

const onClearUser = async () => {
  selectedUserText.value = "";
  isSelectingUser.value = false;
  // Reset list ke data awal
  userStore.usersData = await userStore.fetchUsersDataWithParams({
    search: "",
  });
};

async function submitForm() {
  try {
    let res = null;
    if (form.value.id) {
      //  res = await employeeAttendanceStore.updateLeaveRequest();
    } else {
      //res = await employeeAttendanceStore.createLeaveRequest();
    }

    // if (res?.success) {

    //   appStore.showSuccessSnackbar = true;
    //   appStore.successMessage = res.message;
    //   employeeAttendanceStore.fetchLeaveRequest();
    //   employeeAttendanceStore.createEditDialog = false;
    //   employeeAttendanceStore.clearCreateUpdatePayload();
    // }
  } catch (error: any) {
    handleServerErrors(error);
  }
}

function handleServerErrors(err: any) {
  if (err?.status === 422) {
    appStore.showErrorSnackbar = true;
    appStore.errorMessage = err?.message ?? "Terjadi kesalahan, coba lagi.";

    const errors = err.errors as Record<string, string[]>;
    if (errors) {
      Object.entries(errors).forEach(([field, messages]) => {
        employeeAttendanceStore.serverErrors[field] = messages[0];
      });
    }
  } else {
    appStore.showErrorSnackbar = true;
    appStore.errorMessage = err?.message ?? "Terjadi kesalahan, coba lagi.";
  }
}

function closeDialog() {
  employeeAttendanceStore.formDialog = false;
  employeeAttendanceStore.clearpayloadEdit();
  Object.keys(employeeAttendanceStore.serverErrors).forEach(
    (key) => delete employeeAttendanceStore.serverErrors[key],
  );
}

onMounted(() => {
  userStore.fetchUsersData();
  // branchStore.fetchBranchData();
  shiftStore.fetchShiftData();
});
</script>
