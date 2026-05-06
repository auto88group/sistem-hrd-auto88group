<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-end">
    <div v-if="isVisible('nama')">
      <label class="input-label">Nama Karyawan</label>
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
    </div>

    <div v-if="isVisible('jabatan')">
      <label class="input-label">Jabatan</label>
      <v-autocomplete
        v-model="form.master_position_id"
        :items="listPosition"
        :loading="positionStore.isLoadingData"
        item-title="title"
        item-value="value"
        prepend-inner-icon="mdi-briefcase-outline"
        placeholder="Pilih jabatan..."
        variant="outlined"
        density="compact"
        color="primary"
        class="custom-input"
        hide-details="auto"
        clearable
        no-filter
        @update:search="onSearchPosition"
      ></v-autocomplete>
    </div>

    <div v-if="isVisible('cabang')">
      <label class="input-label">Cabang</label>
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
    </div>

    <div v-if="isVisible('pendidikan')">
      <label class="input-label">Pendidikan</label>
      <v-autocomplete
        v-model="form.hrd_master_education_id"
        :items="listEducation"
        :loading="educationStore.isLoadingData"
        prepend-inner-icon="mdi-school-outline"
        item-title="title"
        item-value="value"
        placeholder="Pilih pendidikan"
        variant="outlined"
        density="compact"
        color="primary"
        class="custom-input"
        hide-details="auto"
        clearable
        no-filter
        @update:search="onSearchEducation"
      ></v-autocomplete>
    </div>

    <div v-if="isVisible('status')">
      <label class="input-label">Status</label>
      <v-autocomplete
        v-model="form.status_id"
        :items="listStatus"
        item-title="title"
        item-value="value"
        prepend-inner-icon="mdi-check-circle-outline"
        placeholder="Pilih status"
        variant="outlined"
        density="compact"
        color="primary"
        class="custom-input"
        hide-details="auto"
        clearable
      >
      </v-autocomplete>
    </div>

    <div v-if="isVisible('jenis_kelamin')">
      <label class="input-label">Jenis Kelamin</label>
      <v-autocomplete
        v-model="form.gender"
        :items="listGender"
        prepend-inner-icon="mdi-gender-male-female"
        placeholder="Pilih jenis kelamin"
        variant="outlined"
        density="compact"
        color="primary"
        class="custom-input"
        hide-details="auto"
        clearable
      ></v-autocomplete>
    </div>

    <div>
      <v-checkbox
        v-model="form.show_deleted"
        label="Tampilkan User Dihapus"
        color="text-red-500"
        hide-details
        density="compact"
        class="mt-0"
      ></v-checkbox>
    </div>

    <div>
      <v-btn
        @click="onFilter"
        color="primary"
        class="px-8 font-weight-bold text-white"
        variant="flat"
        rounded="lg"
        prepend-icon="mdi-magnify"
      >
        Filter Data
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useDebounceFn } from "@/composables/UseDebounce";
import { useUserStore } from "@/stores/user.store";
import { usePositionStore } from "@/stores/position.store";
import { useBranchStore } from "@/stores/branch.store";
import { useEducationStore } from "@/stores/education.store";
import type { UserDatatablesParams } from "@/api/modules/user.api";
import { useFormatName } from "@/composables/useFormatName";

const { formatName } = useFormatName();
const userStore = useUserStore();
const positionStore = usePositionStore();
const branchStore = useBranchStore();
const educationStore = useEducationStore();

const isSelecting = ref(false);
const selectedUserText = ref<string>("");
const searchPosition = ref("");
const searchBranch = ref("");
const searchEducation = ref("");

const listUser = computed(() =>
  userStore.usersData.map((user) => ({
    name: user.name,
    full_name: user.full_name,
    email: user.email,
    value: user.id,
  })),
);
const listPosition = computed(() => {
  const keyword = searchPosition.value.toLowerCase();

  return positionStore.positionData
    .filter((position) =>
      keyword ? position.name.toLowerCase().includes(keyword) : true,
    )
    .map((position) => ({
      title: position.name,
      value: position.id,
      level_name: position.level_name,
    }));
});
const listBranch = computed(() => {
  const keyword = searchBranch.value.toLowerCase();

  return (branchStore.branchData || [])
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
const listEducation = computed(() => {
  const keyword = searchEducation.value.toLowerCase();

  return educationStore.educationData
    .filter((education) =>
      keyword ? education.name.toLowerCase().includes(keyword) : true,
    )
    .map((education) => ({
      title: education.name,
      value: education.id,
    }));
});
const listStatus = [
  { value: 1, title: "Kontrak" },
  { value: 2, title: "Tetap" },
  { value: 3, title: "Resign" },
  { value: 4, title: "Dikeluarkan" },
];
const listGender = [
  { value: "M", title: "Laki-laki" },
  { value: "F", title: "Perempuan" },
];

const onSearchUser = useDebounceFn((val: string) => {
  if (isSelecting.value) return;
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
const onSearchPosition = (val: any) => {
  searchPosition.value = val ?? "";
};
const onSearchBranch = (val: any) => {
  searchBranch.value = val ?? "";
};
const onSearchEducation = (val: any) => {
  searchEducation.value = val ?? "";
};

onMounted(() => {
  userStore.fetchUsersData();
  positionStore.fetchPositionData();
  branchStore.fetchBranchData();
  educationStore.fetchEducationData();
});

const props = defineProps({
  hideFields: {
    type: Array,
    default: () => [], // Defaultnya tidak ada yang disembunyikan
  },
});

const isVisible = (fieldName: string) => !props.hideFields.includes(fieldName);

const emit = defineEmits<{
  filter: [value: Partial<UserDatatablesParams>];
}>();

function onFilter() {
  emit("filter", { ...form });
}

const form = reactive<Partial<UserDatatablesParams>>({
  user_id: undefined,
  master_position_id: undefined,
  branch_id: undefined,
  hrd_master_education_id: undefined,
  status_id: undefined,
  gender: undefined,
  show_deleted: false,
});
</script>

<style scoped>
.input-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b; /* Warna Slate-500 (Light Mode) */
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  transition: color 0.3s ease; /* Transisi halus saat ganti tema */
}

/* Kondisi jika menggunakan tema Dark dari Vuetify */
:deep(.v-theme--dark) .input-label {
  color: #94a3b8; /* Warna Slate-400 (Lebih terang untuk Dark Mode) */
}

/* OPSI TAMBAHAN: Kondisi berdasarkan sistem operasi user */
@media (prefers-color-scheme: dark) {
  /* Jika Anda tidak menggunakan library tema khusus, gunakan ini */
  .input-label {
    color: #94a3b8;
  }
}

:deep(.v-field__input) {
  min-height: 36px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  font-size: 0.875rem !important;
}

:deep(.v-field__outline) {
  --v-field-border-opacity: 0.15;
}
</style>
