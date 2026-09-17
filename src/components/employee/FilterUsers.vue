<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-end">
    <!-- Dipindahkan ke posisi pertama -->
    <div class="flex flex-col gap-1">
      <v-radio-group
        v-model="userStatusFilter"
        hide-details
        density="compact"
        class="mt-0"
      >
        <v-radio
          label="Hanya Aktif"
          value="active"
          color="text-green-500"
          density="compact"
        ></v-radio>
        <v-radio
          label="Hanya Dihapus"
          value="deleted"
          color="text-red-500"
          density="compact"
        ></v-radio>
      </v-radio-group>
    </div>

    <div v-if="isVisible('nama')">
      <label class="input-label">Nama Karyawan</label>
      <v-autocomplete
        v-model="selectedUserId"
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

    <div v-if="isVisible('employee_id')">
      <label class="input-label">ID Karyawan</label>
      <v-text-field
        v-model="userStore.params.employee_id"
        prepend-inner-icon="mdi-badge-account-outline"
        placeholder="Cari ID Karyawan..."
        variant="outlined"
        density="compact"
        color="primary"
        class="custom-input"
        hide-details="auto"
        clearable
      ></v-text-field>
    </div>

    <div v-if="isVisible('jabatan')">
      <label class="input-label">Jabatan</label>
      <v-autocomplete
        v-model="userStore.params.master_position_id"
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
        v-model="userStore.params.branch_id"
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
          />
        </template>

        <template v-slot:selection="{ item }">
          {{ formatBranch(item) }}
        </template>
      </v-autocomplete>
    </div>

    <div v-if="isVisible('pendidikan')">
      <label class="input-label">Pendidikan</label>
      <v-autocomplete
        v-model="userStore.params.hrd_master_education_id"
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
        v-model="userStore.params.status_id"
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
      ></v-autocomplete>
    </div>

    <div v-if="isVisible('jenis_kelamin')">
      <label class="input-label">Jenis Kelamin</label>
      <v-autocomplete
        v-model="userStore.params.gender"
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

    <div v-if="userStore.params.only_deleted">
      <label class="input-label">Tanggal Keluar</label>
      <date-range-picker
        v-model="periodForm"
        label=""
        placeholder="Pilih rentang tanggal keluar"
        @update:model-value="onChangePeriod"
      />
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
import { computed, onMounted, ref } from "vue";
import { useDebounceFn } from "@/composables/UseDebounce";
import { useUserStore } from "@/stores/user.store";
import { usePositionStore } from "@/stores/position.store";
import { useBranchStore } from "@/stores/branch.store";
import { useEducationStore } from "@/stores/education.store";
import { useFormatName } from "@/composables/useFormatName";
import DateRangePicker from "../DateRangePicker.vue";
import { useDateFormatter } from "@/composables/UseDateFormatter";

const { toRangeYMD } = useDateFormatter();
const periodForm = ref<string[]>([]);

const { formatName } = useFormatName();
const userStore = useUserStore();
const positionStore = usePositionStore();
const branchStore = useBranchStore();
const educationStore = useEducationStore();

const isSelecting = ref(false);
const selectedUserText = ref("");
const searchPosition = ref("");
const searchBranch = ref("");
const searchEducation = ref("");

const userStatusFilter = computed<"active" | "deleted">({
  get: () => (userStore.params.only_deleted ? "deleted" : "active"),
  set: (value) => {
    if (value === "deleted") {
      userStore.params.only_active = false;
      userStore.params.only_deleted = true;
      userStore.userDataParams.deleted = 1;
    } else {
      userStore.params.only_active = true;
      userStore.params.only_deleted = false;
      periodForm.value = [];
      userStore.params.resign_date_start = undefined;
      userStore.params.resign_date_end = undefined;
      userStore.userDataParams.deleted = undefined;
    }
    userStore.fetchUsersData();
  },
});

// listUser: hasil fetch + sisipkan user yang sedang terpilih (dari user_option)
// supaya autocomplete tetap menampilkan nama walau tidak ada di hasil fetch terakhir
const listUser = computed(() => {
  const fetched = userStore.usersData.map((user) => ({
    name: user.name,
    full_name: user.full_name,
    email: user.email,
    value: user.id,
  }));

  const selected = userStore.params.user_option;
  if (selected && !fetched.some((u) => u.value === selected.value)) {
    fetched.unshift(selected as any);
  }
  return fetched;
});

const listPosition = computed(() => {
  const keyword = searchPosition.value.toLowerCase();
  return positionStore.positionData
    .filter((p) => (keyword ? p.name.toLowerCase().includes(keyword) : true))
    .map((p) => ({ title: p.name, value: p.id, level_name: p.level_name }));
});

const listBranch = computed(() => {
  const keyword = searchBranch.value.toLowerCase();
  return (branchStore.branchData || [])
    .filter((b) =>
      keyword
        ? b.name.toLowerCase().includes(keyword) ||
          b.alias.toLowerCase().includes(keyword)
        : true,
    )
    .map((b) => ({ title: b.name, alias: b.alias, value: b.id }));
});

const listEducation = computed(() => {
  const keyword = searchEducation.value.toLowerCase();
  return educationStore.educationData
    .filter((e) => (keyword ? e.name.toLowerCase().includes(keyword) : true))
    .map((e) => ({ title: e.name, value: e.id }));
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
  if (val && val === selectedUserText.value) return; // hanya skip kalau val TIDAK kosong dan sama dgn nama terakhir dipilih
  userStore.userDataParams.search = val ?? "";
  userStore.fetchUsersData();
}, 400);

const selectedUserId = computed<number | undefined>({
  get: () => userStore.params.user_id,
  set: (value) => {
    onSelectUser(value ?? null);
  },
});

const onChangePeriod = useDebounceFn((val: string[]) => {
  const dates = val.map((v) => new Date(v));
  const range = toRangeYMD(dates); // "YYYY-MM-DD - YYYY-MM-DD" | undefined

  if (range) {
    const [start, end] = range.split(" - ");
    userStore.params.resign_date_start = start;
    userStore.params.resign_date_end = end;
  } else {
    userStore.params.resign_date_start = undefined;
    userStore.params.resign_date_end = undefined;
  }
}, 400);

function onSelectUser(value: number | null) {
  const selected = value
    ? listUser.value.find((u) => u.value === value)
    : undefined;

  // satu-satunya tempat yang boleh mengubah user_id & user_option
  userStore.params.user_id = value ?? undefined;
  userStore.params.user_option = selected as any;

  if (!value) {
    selectedUserText.value = "";
    isSelecting.value = false;
    // reset juga search dropdown supaya listUser balik ke daftar penuh
    userStore.userDataParams.search = "";
    userStore.fetchUsersData();
    return;
  }

  isSelecting.value = true;
  if (selected) selectedUserText.value = selected.name;

  setTimeout(() => {
    isSelecting.value = false;
  }, 500);
}

const onSearchPosition = (val: any) => (searchPosition.value = val ?? "");
const onSearchBranch = (val: any) => (searchBranch.value = val ?? "");
const onSearchEducation = (val: any) => (searchEducation.value = val ?? "");

onMounted(() => {
  userStore.fetchUsersData();
  positionStore.fetchPositionData();
  branchStore.fetchBranchData();
  educationStore.fetchEducationData();
});

const props = defineProps({
  hideFields: {
    type: Array,
    default: () => [],
  },
});
const isVisible = (fieldName: string) => !props.hideFields.includes(fieldName);

// Tidak perlu emit lagi — v-model sudah langsung ke userStore.params.
// Tombol "Filter Data" cukup reset pagination lalu fetch ulang.
function onFilter() {
  userStore.params.start = 0;
  userStore.fetchUsers();
}

function formatBranch(branch: { alias: string; title: string }) {
  return `${branch.alias} - ${branch.title}`;
}
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
