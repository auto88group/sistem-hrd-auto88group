<template>
  <div class="space-y-4">
    <div class="space-y-3 md:space-y-0 md:flex gap-3 items-end">
      <v-row gap="12">
        <v-col cols="12" md="2">
          <date-range-picker
            v-model="form.periodForm"
            :max-date="today"
            @update:model-value="onChangePeriod"
          />
        </v-col>

        <v-col cols="12" md="2">
          <v-autocomplete
            v-model="form.branch_id"
            :items="listBranch"
            :loading="branchStore.isLoadingData"
            prepend-inner-icon="mdi-map-marker-outline"
            item-title="alias"
            item-value="value"
            placeholder="Lokasi cabang"
            variant="outlined"
            density="compact"
            color="primary"
            class="custom-input"
            hide-details="auto"
            clearable
            no-filter
            @update:search="onSearchBranch"
          >
            <template v-slot:item="{ props, item }">
              <v-list-item
                v-bind="props"
                :title="item.alias"
                :subtitle="item.title"
              >
              </v-list-item>
            </template>
          </v-autocomplete>
        </v-col>

        <v-col cols="12" md="2">
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
            @update:model-value="onSelectUser"
            @click:clear="onClearUser"
          >
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

        <v-col cols="12" md="2">
          <div>
            <v-btn
              color="bg-blue-300 dark:bg-blue-500"
              variant="flat"
              prepend-icon="mdi-filter-check"
              :loading="employeeAttendanceStore.isLoading"
              @click="filter"
            >
              Filter
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </div>

    <div
      class="flex flex-col justify-center p-3 bg-gray-100 dark:bg-gray-800 rounded-xl"
    >
      <v-row class="m-0">
        <v-col cols="4"><span class="font-bold">H</span></v-col>
        <v-col cols="8">: Hadir</v-col>
      </v-row>
      <v-row class="m-0">
        <v-col cols="4"><span class="font-bold">T</span></v-col>
        <v-col cols="8">: Terlambat</v-col>
      </v-row>
      <v-row class="m-0">
        <v-col cols="4"><span class="font-bold">PC</span></v-col>
        <v-col cols="8">: Pulang Cepat</v-col>
      </v-row>
      <v-row class="m-0">
        <v-col cols="4"><span class="font-bold">TAP</span></v-col>
        <v-col cols="8">: Tidak Absen Pulang</v-col>
      </v-row>
      <v-row class="m-0">
        <v-col cols="4"><span class="font-bold">A</span></v-col>
        <v-col cols="8">: Alpa</v-col>
      </v-row>
      <v-row class="m-0">
        <v-col cols="4"><div class="bg-purple-500 w-5 h-5"></div></v-col>
        <v-col cols="8">: Shift</v-col>
      </v-row>
      <v-row class="m-0">
        <v-col cols="4"><div class="bg-red-500 w-5 h-5"></div></v-col>
        <v-col cols="8">: Libur</v-col>
      </v-row>
    </div>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from "pinia";
import DateRangePicker from "../DateRangePicker.vue";
import { useEmployeeAttendanceRequestStore } from "@/stores/employee-attendance.store";
import { useDebounceFn } from "@/composables/UseDebounce";
import { useDateFormatter } from "@/composables/UseDateFormatter";
import { computed, onMounted, ref, watch } from "vue";
import { useBranchStore } from "@/stores/branch.store";
import { useUserStore } from "@/stores/user.store";
import { useFormatName } from "@/composables/useFormatName";

const { toRangeYMD } = useDateFormatter();
const { formatName } = useFormatName();

const employeeAttendanceStore = useEmployeeAttendanceRequestStore();
const today = new Date().toISOString().split("T")[0];
const { recapParams: form } = storeToRefs(employeeAttendanceStore);

const userStore = useUserStore();
const branchStore = useBranchStore();

const isSelecting = ref(false);
const selectedUserText = ref<string>("");
const searchBranch = ref("");

const listUser = computed(() =>
  userStore.usersData.map((user) => ({
    name: user.name,
    full_name: user.full_name,
    email: user.email,
    value: user.id,
  })),
);

const onSearchUser = useDebounceFn((val: string) => {
  if (isSelecting.value) return;

  // ⛔ tambahan penting
  if (!val) return;

  if (val === selectedUserText.value) return;

  userStore.userDataParams.search = val ?? "";
  userStore.fetchUsersData();
}, 400);
function onSelectUser(value: number | null) {
  if (!value) {
    selectedUserText.value = "";
    isSelecting.value = false;
    return;
  }

  isSelecting.value = true; // ← set flag sebelum Vuetify trigger search
  const selected = listUser.value.find((u) => u.value === value);
  if (selected) selectedUserText.value = selected.name;

  // Reset flag setelah debounce selesai (lebih dari 400ms)
  setTimeout(() => {
    isSelecting.value = false;
  }, 500);
}

const onClearUser = async () => {
  selectedUserText.value = "";
  // Reset list ke data awal
  userStore.usersData = await userStore.fetchUsersDataWithParams({
    search: "",
  });
};

const listBranch = computed(() => {
  const keyword = searchBranch.value.toLowerCase();
  return branchStore.branchData
    .filter((branch) => {
      if (!keyword) return true;

      return (
        branch.name.toLowerCase().includes(keyword) ||
        branch.alias.toLowerCase().includes(keyword)
      );
    })
    .map((branch) => ({
      title: branch.name,
      alias: branch.alias,
      value: branch.id,
    }));
});

const onSearchBranch = (val: any) => {
  searchBranch.value = val ?? "";
};
watch(
  () => form.value.branch_id,
  (newBranchId) => {
    userStore.userDataParams.branch_id = newBranchId ?? undefined;

    form.value.user_id = null;
    selectedUserText.value = "";

    userStore.fetchUsersData();
  },
);

const onChangePeriod = useDebounceFn((val: string[]) => {
  const dates = val.map((v) => new Date(v));
  form.value.period = toRangeYMD(dates);
}, 400);

async function filter() {
  employeeAttendanceStore.fetchEmployeeAttendanceRecap();
}

onMounted(async () => {
  branchStore.fetchBranchData();
  userStore.fetchUsersData();
});
</script>
