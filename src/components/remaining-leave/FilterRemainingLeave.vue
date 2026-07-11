<template>
  <v-row>
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
    <div class="flex gap-2">
      <v-btn
        color="bg-blue-300 dark:bg-blue-500"
        variant="flat"
        prepend-icon="mdi-filter-check"
        :loading="remainingLeaveStore.isLoading"
        @click="filter"
      >
        Filter
      </v-btn>
      <v-btn
        color="bg-green-500"
        variant="flat"
        prepend-icon="mdi-file-excel"
        :loading="remainingLeaveStore.isLoadingExport"
        @click="handleExport"
      >
        Export Excel
      </v-btn>
    </div>
  </v-row>
</template>

<script setup lang="ts">
import { useDebounceFn } from "@/composables/UseDebounce";
import { useFormatName } from "@/composables/useFormatName";
import { useBranchStore } from "@/stores/branch.store";
import { useRemainingLeaveStore } from "@/stores/remaining-leave.store";
import { useUserStore } from "@/stores/user.store";
import { computed, onMounted, reactive, ref, watch } from "vue";

const { formatName } = useFormatName();

const branchStore = useBranchStore();
const remainingLeaveStore = useRemainingLeaveStore();
const userStore = useUserStore();

const isSelecting = ref(false);
const selectedUserText = ref<string>("");
const searchBranch = ref("");

const form = reactive({
  branch_id: null,
  user_id: null,
});

async function handleExport() {
  try {
    await remainingLeaveStore.exportToExcel();
  } catch (err) {
    // Jika Anda memiliki toast notification global (seperti appStore), bisa dipasang di sini
    alert("Terjadi kesalahan saat mengekspor data.");
  }
}

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
async function filter() {
  remainingLeaveStore.fetchRemainingLeave?.();
}

watch(
  () => form.branch_id,
  (newBranchId) => {
    userStore.userDataParams.branch_id = newBranchId ?? undefined;

    form.user_id = null;
    selectedUserText.value = "";

    remainingLeaveStore.params.branch_id = newBranchId ?? undefined;
    remainingLeaveStore.fetchRemainingLeave?.();

    userStore.fetchUsersData();
  },
);

watch(
  () => form.user_id,
  (newUserId) => {
    remainingLeaveStore.params.user_id = newUserId ?? undefined;
    remainingLeaveStore.fetchRemainingLeave?.();
  },
);

onMounted(() => {
  userStore.fetchUsersData();
  branchStore.fetchBranchData();
});
</script>
