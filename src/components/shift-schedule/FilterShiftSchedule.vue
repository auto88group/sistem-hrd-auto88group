<template>
  <v-row>
    <v-col cols="12" md="4">
      <date-range-picker
        v-model="form.period"
        @update:model-value="onChangePeriod"
      />
    </v-col>
    <v-col cols="12" md="4">
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
    <v-col cols="12" md="4">
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

const { formatName } = useFormatName();
formatName;
const { toRangeYMD } = useDateFormatter();
const shiftScheduleStore = useShiftScheduleStore();
const branchStore = useBranchStore();
const userStore = useUserStore();

const isSelecting = ref(false);
const selectedUserText = ref<string>("");
const searchBranch = ref("");

const form = reactive({
  period: [] as Date[],
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

const onChangePeriod = useDebounceFn((val: Date[]) => {
  shiftScheduleStore.params.period = toRangeYMD(val);

  shiftScheduleStore.fetchShiftSchedule?.();
}, 400);

watch(
  () => form.branch_id,
  (newBranchId) => {
    userStore.userDataParams.branch_id = newBranchId ?? undefined;

    form.user_id = null;
    selectedUserText.value = "";

    userStore.fetchUsersData();
  },
);

onMounted(() => {
  userStore.fetchUsersData();
  branchStore.fetchBranchData();
});
</script>
