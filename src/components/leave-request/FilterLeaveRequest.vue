<template>
  <div class="md:grid grid-cols-2 items-end gap-2">
    <v-row
      ><v-col cols="12">
        <date-range-picker
          v-model="form.periodForm"
          @update:model-value="onChangePeriod"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-autocomplete
          v-model="form.hrd_leave_type_id"
          :items="listLeaveType"
          :loading="leaveTypeStore.isLoadingData"
          label="Jenis Izin"
          prepend-inner-icon="mdi-map-marker-outline"
          item-title="title"
          item-value="value"
          placeholder="Pilih cabang"
          variant="outlined"
          density="compact"
          color="primary"
          class="custom-input"
          hide-details="auto"
          clearable
          no-filter
          @update:search="onSearchLeaveType"
        >
        </v-autocomplete>
      </v-col>
      <v-col cols="12" md="6">
        <v-autocomplete
          v-model="form.status"
          :items="listStatus"
          label="Status Approval"
          placeholder="Pilih status"
          variant="outlined"
          density="compact"
          color="primary"
          item-title="label"
          item-value="value"
          hide-details="auto"
          clearable
        >
        </v-autocomplete>
      </v-col>
      <v-col cols="12" md="6">
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
      <v-col cols="12" md="6">
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
    </v-row>
    <div>
      <v-btn
        color="bg-blue-300 dark:bg-blue-500"
        variant="flat"
        prepend-icon="mdi-filter-check"
        :loading="leaveRequestStore.isLoading"
        @click="filter"
      >
        Filter
      </v-btn>
    </div>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from "pinia";
import DateRangePicker from "../DateRangePicker.vue";
import { useLeaveRequestStore } from "@/stores/leave-request.store";
import { computed, onMounted, ref, watch } from "vue";
import { useLeaveTypeStore } from "@/stores/leave_type.store";
import { useFormatName } from "@/composables/useFormatName";
import { useUserStore } from "@/stores/user.store";
import { useDebounceFn } from "@/composables/UseDebounce";
import { useBranchStore } from "@/stores/branch.store";
import { useDateFormatter } from "@/composables/UseDateFormatter";

const { formatName } = useFormatName();
const { toRangeYMD } = useDateFormatter();
const userStore = useUserStore();
const branchStore = useBranchStore();
const leaveRequestStore = useLeaveRequestStore();
const leaveTypeStore = useLeaveTypeStore();
const { params: form } = storeToRefs(leaveRequestStore);

const searchLeaveType = ref("");
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

const listStatus = [
  { label: "Pengajuan", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const listLeaveType = computed(() => {
  const keyword = searchLeaveType.value.toLowerCase();

  return leaveTypeStore.leaveTypeData
    .filter((leaveType) =>
      keyword ? leaveType.name.toLowerCase().includes(keyword) : true,
    )
    .map((leaveType) => ({
      title: leaveType.name,
      value: leaveType.id,
      backDate: leaveType.back_date,
    }));
});

const onSearchLeaveType = (val: any) => {
  searchLeaveType.value = val ?? "";
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

const onClearUser = async () => {
  selectedUserText.value = "";
  // Reset list ke data awal
  userStore.usersData = await userStore.fetchUsersDataWithParams({
    search: "",
  });
};

const onChangePeriod = useDebounceFn((val: string[]) => {
  const dates = val.map((v) => new Date(v));
  form.value.period = toRangeYMD(dates);
}, 400);

watch(
  () => form.value.branch_id,
  (newBranchId) => {
    userStore.userDataParams.branch_id = newBranchId ?? undefined;

    form.value.user_id = null;
    selectedUserText.value = "";

    userStore.fetchUsersData();
  },
);

async function filter() {
  leaveRequestStore.fetchLeaveRequest();
}

onMounted(async () => {
  branchStore.fetchBranchData();
  userStore.fetchUsersData();
  leaveTypeStore.fetchLeaveTypeData();
});
</script>
