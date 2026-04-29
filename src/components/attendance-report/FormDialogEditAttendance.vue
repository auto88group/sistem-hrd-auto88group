<template>
  <v-dialog
    v-model="employeeAttendanceStore.formDialog"
    max-width="700"
    scrollable
    persistent
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
              @update:model-value="onShiftSelected"
              @update:search="onSearchShift"
            >
              <template v-slot:label> Shift </template>
            </v-autocomplete>
          </v-col>

          <v-col cols="12">
            <div class="bg-blue-400 text-white flex rounded-md overflow-hidden">
              <div class="bg-blue-500 flex items-center p-3">
                <v-icon icon="mdi-clock-outline" color="white"></v-icon>
              </div>
              <div class="p-3 font-bold">
                Jam Kerja: {{ form.working_hour }}
              </div>
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <v-menu
              v-model="openTimeIn"
              :close-on-content-click="false"
              transition="scale-transition"
            >
              <template #activator="{ props }">
                <div class="space-y-1">
                  <v-text-field
                    v-model="form.time_in"
                    readonly
                    v-bind="props"
                    variant="outlined"
                    density="compact"
                    color="blue-darken-1"
                    :rules="[rules.required]"
                    hide-details="auto"
                    prepend-inner-icon="mdi-clock-outline"
                    class="rounded-lg shadow-sm"
                  >
                    <template v-slot:label>
                      Jam Masuk<span class="text-red-500">*</span>
                    </template>
                  </v-text-field>
                </div>
              </template>

              <v-card class="rounded-xl elevation-12">
                <v-time-picker
                  v-model="form.time_in"
                  format="24hr"
                  color="blue-darken-1"
                  @update:minute="openTimeIn = false"
                />
              </v-card>
            </v-menu>
          </v-col>

          <v-col cols="12" md="6">
            <v-menu
              v-model="openTimeOut"
              :close-on-content-click="false"
              transition="scale-transition"
            >
              <template #activator="{ props }">
                <div class="space-y-1">
                  <v-text-field
                    v-model="form.time_out"
                    readonly
                    v-bind="props"
                    variant="outlined"
                    density="compact"
                    color="blue-darken-1"
                    hide-details="auto"
                    prepend-inner-icon="mdi-clock-outline"
                    class="rounded-lg shadow-sm"
                  >
                    <template v-slot:label> Jam Keluar </template>
                  </v-text-field>
                </div>
              </template>

              <v-card class="rounded-xl elevation-12">
                <v-time-picker
                  v-model="form.time_out"
                  format="24hr"
                  color="blue-darken-1"
                  @update:minute="openTimeOut = false"
                />
              </v-card>
            </v-menu>
          </v-col>
        </v-row>
        <div class="flex justify-end w-full gap-2 mt-6">
          <v-btn
            color="bg-blue-200"
            prepend-icon="mdi-content-save"
            variant="flat"
          >
            Perbarui
          </v-btn>
        </div>
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
import { useBranchStore } from "@/stores/branch.store";

const employeeAttendanceStore = useEmployeeAttendanceRequestStore();
const branchStore = useBranchStore();
const { payloadEdit: form, serverErrors } = storeToRefs(
  employeeAttendanceStore,
);
const shiftStore = useShiftStore();
const { branchData } = storeToRefs(branchStore);
const { shiftData } = storeToRefs(shiftStore);

const openTimeIn = ref<boolean>(false);
const openTimeOut = ref<boolean>(false);

const appStore = useAppStore();
const userStore = useUserStore();

const { formatName } = useFormatName();

const isSelectingUser = ref(false);
const selectedUserText = ref<string>("");
const searchShift = ref("");

const listShift = computed(() => {
  const keyword = searchShift.value.toLowerCase();

  const regularOption = { title: "Regular", value: 0 };

  const filtered = shiftStore.shiftData
    .filter((b) => {
      if (!keyword) return true;
      return b.name.toLowerCase().includes(keyword);
    })
    .map((b) => ({
      title: b.name,
      value: b.id,
    }));

  // Tampilkan "Regular" hanya jika keyword kosong atau cocok
  const showRegular = !keyword || "regular".includes(keyword);

  return showRegular ? [regularOption, ...filtered] : filtered;
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
const onShiftSelected = (val: any) => {
  if (!val === null) return;
  if (val === 0) {
    const result = getTimeByIdBranch(form.value.branch_id ?? 0);
    const time = result?.time;
    const date = form.value.period_date;

    const dayCode = date ? new Date(date).getDay() : null;

    if (dayCode !== null) {
      const matchedDay = time?.find((item) => Number(item.dayCode) === dayCode);

      if (matchedDay) {
        form.value.working_hour = `${matchedDay.time_in} - ${matchedDay.time_out}`;
      } else {
        form.value.working_hour = null;
      }
    }
  } else {
    // Cari shift berdasarkan id yang sama dengan val
    const matchedShift = shiftData.value.find((item) => item.id === val);

    if (matchedShift) {
      form.value.working_hour = `${matchedShift.time_in} - ${matchedShift.time_out}`;
    } else {
      form.value.working_hour = null;
    }
  }
};

function getTimeByIdBranch(id: number) {
  const item = branchData.value.find((d) => d.id === id);
  if (!item) return null;

  const timeSchedule: { dayCode: string; time_in: string; time_out: string }[] =
    JSON.parse(item.time);

  return {
    ...item,
    time: timeSchedule,
  };
}

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
  searchShift.value = "";
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
