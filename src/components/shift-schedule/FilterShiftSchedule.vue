<template>
  <v-row align="end">
    <v-col cols="12" md="4">
      <date-range-picker
        v-model="form.period"
        @update:model-value="onChangePeriod"
      />
    </v-col>

    <v-col cols="12" md="3">
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
        <template #item="{ props, item }">
          <v-list-item
            v-bind="props"
            :title="item.alias"
            :subtitle="item.title"
          />
        </template>
      </v-autocomplete>
    </v-col>

    <v-col cols="12" md="3">
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
      >
        <template #item="{ props, item }">
          <v-list-item
            v-bind="props"
            :title="formatName(item)"
            :subtitle="item.email"
          />
        </template>

        <template #selection="{ item }">
          {{ formatName(item) }}
        </template>
      </v-autocomplete>
    </v-col>

    <v-col cols="12" md="2">
      <div class="flex gap-2 justify-end">
        <v-btn
          color="bg-blue-300 dark:bg-blue-500"
          variant="flat"
          prepend-icon="mdi-filter-check"
          :loading="shiftScheduleStore.isLoading"
          @click="filter"
        >
          Filter
        </v-btn>

        <v-btn
          color="bg-green-500"
          variant="flat"
          prepend-icon="mdi-file-excel"
          :loading="shiftScheduleStore.isLoadingExport"
          @click="handleExport"
        >
          Export
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import DateRangePicker from "../DateRangePicker.vue";
import { useBranchStore } from "@/stores/branch.store";
import { useUserStore } from "@/stores/user.store";
import { useDebounceFn } from "@/composables/UseDebounce";
import { useFormatName } from "@/composables/useFormatName";
import { useShiftScheduleStore } from "@/stores/shift-schedule.store";
import { useDateFormatter } from "@/composables/UseDateFormatter";
import { useAppStore } from "@/stores/app.ts";
import { useHolidayStore } from "@/stores/holiday.store.ts";

const { formatName } = useFormatName();

const { toRangeYMD } = useDateFormatter();
const shiftScheduleStore = useShiftScheduleStore();
const holidayStore = useHolidayStore();
const branchStore = useBranchStore();
const userStore = useUserStore();
const appStore = useAppStore();

const isSelecting = ref(false);
const selectedUserText = ref<string>("");
const searchBranch = ref("");

async function handleExport() {
  try {
    await shiftScheduleStore.exportToExcel();
  } catch (err) {
    // Jika Anda memiliki toast notification global (seperti appStore), bisa dipasang di sini
    alert("Terjadi kesalahan saat mengekspor data.");
  }
}

const form = reactive({
  period: [] as string[],
  branch_id: null,
  user_id: null,
});

const listUser = computed(() =>
  userStore.usersData.map((user) => ({
    name: user.name,
    full_name: user.full_name,
    email: user.email,
    value: user.id,
  })),
);
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

const onChangePeriod = useDebounceFn((val: string[]) => {
  if (!val || val.length < 2) return;

  const [start, end] = val.map((v) => new Date(v));

  const isSameMonth = start.getMonth() === end.getMonth();
  const isSameYear = start.getFullYear() === end.getFullYear();

  if (!isSameMonth || !isSameYear) {
    appStore.showErrorSnackbar = true;
    appStore.errorMessage = "Periode harus dalam bulan dan tahun yang sama.";

    // Reset form.period ke kosong
    form.period = [];
    return;
  }

  shiftScheduleStore.params.period = toRangeYMD([start, end]);
  shiftScheduleStore.fetchShiftSchedule?.();
  const month = start.getMonth() + 1;
  const year = start.getFullYear();
  holidayStore.fetchHolidayByMonth(month, year);
}, 400);

watch(
  () => form.branch_id,
  (newBranchId) => {
    userStore.userDataParams.branch_id = newBranchId ?? undefined;
    form.user_id = null;
    selectedUserText.value = "";
    shiftScheduleStore.params.branch_id = newBranchId ?? undefined;
    userStore.fetchUsersData();
  },
);

watch(
  () => form.user_id,
  (newUserId) => {
    shiftScheduleStore.params.user_id = newUserId ?? undefined;
  },
);

async function filter() {
  await shiftScheduleStore.fetchShiftSchedule?.();
}

onMounted(() => {
  userStore.fetchUsersData();
  branchStore.fetchBranchData();
});
</script>
