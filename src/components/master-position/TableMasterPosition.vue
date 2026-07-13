<template>
  <div class="space-y-3">
    <div class="flex justify-end">
      <v-text-field
        v-model="searchQuery"
        placeholder="Cari jabatan/level..."
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="compact"
        clearable
        hide-details
        class="max-w-xs"
        @update:model-value="onSearch"
        @click:clear="onClear"
      />
    </div>
    <v-data-table-server
      :headers="headers as any"
      :items="positions"
      :items-length="masterPositionStore.totalRecords"
      :items-per-page="masterPositionStore.params.length"
      :loading="masterPositionStore.isLoading"
      class="elevation-1 custom-header-table"
      @update:options="onTableOptionsChange"
    >
      <template #[`item.no`]="{ index }">
        {{ (masterPositionStore.params.start ?? 0) + index + 1 }}
      </template>

      <template #[`item.name`]="{ item }">
        <span class="font-bold">{{ item.name }}</span>
      </template>

      <template #[`item.level_name`]="{ item }">
        <v-chip size="small" color="primary" variant="flat">
          {{ item.display_name }}
        </v-chip>
      </template>

      <template #[`item.actions`]="{ item }">
        <div class="flex justify-end items-center gap-1">
          <v-btn
            icon="mdi-file-edit-outline"
            variant="text"
            density="comfortable"
            class="!text-amber-600 hover:!bg-amber-50 transition-all duration-300"
            @click="handleEdit(item)"
          />

          <v-btn
            icon="mdi-delete-outline"
            variant="text"
            density="comfortable"
            @click="handleDelete(item.id)"
            :loading="masterPositionStore.isLoadingDestroy"
            class="!text-red-500 hover:!bg-red-50 transition-all duration-300"
          />
        </div>
      </template>
    </v-data-table-server>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useMasterPositionStore } from "@/stores/master-position.store";
import { useAppStore } from "@/stores/app";
const appStore = useAppStore();
const masterPositionStore = useMasterPositionStore();

const positions = computed(() => masterPositionStore.positions);

const props = defineProps<{
  ask: (options: any) => Promise<boolean>;
}>();

const emit = defineEmits(["edit"]);

const searchQuery = ref("");
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

function onSearch(value: string | null) {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    masterPositionStore.params.search = value ?? "";
    masterPositionStore.params.start = 0;
    masterPositionStore.fetchPositions();
  }, 400);
}

function onClear() {
  searchQuery.value = "";
  masterPositionStore.params.search = "";
  masterPositionStore.params.start = 0;
  masterPositionStore.fetchPositions();
}

const headers = [
  { title: "No", key: "no", sortable: false, width: "60px" },
  { title: "Nama Jabatan", key: "name", sortable: true },
  { title: "Level", key: "display_name", sortable: true }, // Ubah key jadi display_name
  { title: "Aksi", key: "actions", sortable: false, align: "end" },
];

function onTableOptionsChange(options: {
  page: number;
  itemsPerPage: number;
  sortBy: any[];
}) {
  masterPositionStore.params.length = options.itemsPerPage;
  masterPositionStore.params.start = (options.page - 1) * options.itemsPerPage;

  // Tangkap parameter sort dari Vuetify dan masukkan ke store
  if (options.sortBy && options.sortBy.length > 0) {
    masterPositionStore.params.sortBy = options.sortBy[0].key;
    masterPositionStore.params.sortDirection = options.sortBy[0].order; // 'asc' atau 'desc'
  } else {
    // Default jika user menghilangkan sorting (klik kolom 3x)
    masterPositionStore.params.sortBy = "id";
    masterPositionStore.params.sortDirection = "asc";
  }

  masterPositionStore.fetchPositions();
}
function handleEdit(item: any) {
  emit("edit", item);
}

async function handleDelete(id: number) {
  const confirmed = await props.ask({
    title: "Hapus Jabatan",
    message: "Data ini akan dihapus. Lanjutkan?",
    confirmText: "Ya, Hapus",
    color: "red-darken-1",
  });
  if (confirmed) execDelete(id);
}

async function execDelete(id: number) {
  try {
    await masterPositionStore.destroyPosition(id);
    showSuccess("Data jabatan berhasil dihapus.");
  } catch (err: any) {
    showError(
      err?.response?.data?.message ??
        err?.message ??
        "Gagal menghapus data jabatan.",
    );
  }
}

function showError(message: string) {
  appStore.errorMessage = message;
  appStore.showErrorSnackbar = true;
}

function showSuccess(message: string) {
  appStore.successMessage = message;
  appStore.showSuccessSnackbar = true;
}
onMounted(() => masterPositionStore.fetchPositions());
</script>

<style scoped>
:deep(.custom-header-table thead) {
  background-color: #e3f2fd;
}
:deep(.v-theme--dark .custom-header-table thead) {
  background-color: #1a237e;
}
:deep(.custom-header-table thead th) {
  font-weight: bold !important;
  color: #1976d2 !important;
}
:deep(.v-theme--dark .custom-header-table thead th) {
  color: #bbdefb !important;
}
</style>
