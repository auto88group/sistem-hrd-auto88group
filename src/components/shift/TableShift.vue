<template>
  <div class="space-y-3">
    <div class="flex justify-end">
      <v-text-field
        v-model="searchQuery"
        placeholder="Cari kode/nama..."
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
      :items="shift"
      :items-length="shiftStore.totalRecords"
      :items-per-page="shiftStore.params.length"
      :loading="shiftStore.isLoading"
      class="elevation-1 custom-header-table"
      @update:options="onTableOptionsChange"
    >
      <template #[`item.no`]="{ index }">
        {{ (shiftStore.params.start ?? 0) + index + 1 }}
      </template>
      <template #[`item.code`]="{ item }">
        <span class="font-bold">{{ item.code }}</span>
      </template>

      <template #[`item.time_in`]="{ item }">
        {{ item.time_in ? item.time_in.slice(0, 5) : null }}
      </template>

      <template #[`item.time_out`]="{ item }">
        {{ item.time_out ? item.time_out.slice(0, 5) : null }}
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
            :loading="shiftStore.isLoadingDestroy"
            class="!text-red-500 hover:!bg-red-50 transition-all duration-300"
          />
        </div>
      </template>
    </v-data-table-server>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useShiftStore } from "@/stores/shift.store";

const shiftStore = useShiftStore();

const shift = computed(() => shiftStore.shift);

const props = defineProps<{
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  ask: (options: any) => Promise<boolean>;
}>();

const emit = defineEmits(["edit"]);

const searchQuery = ref("");
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

function onSearch(value: string | null) {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    shiftStore.params.search = value ?? "";
    shiftStore.params.start = 0;
    shiftStore.fetchShift();
  }, 400);
}

function onClear() {
  searchQuery.value = "";
  shiftStore.params.search = "";
  shiftStore.params.start = 0;
  shiftStore.fetchShift();
}

const headers = [
  { title: "No", key: "no", sortable: false, width: "60px" },
  { title: "Kode", key: "code", sortable: false },
  { title: "Nama", key: "name", sortable: false },
  { title: "Jam Masuk", key: "time_in", sortable: false },
  { title: "Jam Pulang", key: "time_out", sortable: false },

  { title: "Aksi", key: "actions", sortable: false, align: "end" },
];

function onTableOptionsChange(options: { page: number; itemsPerPage: number }) {
  shiftStore.params.length = options.itemsPerPage;
  shiftStore.params.start = (options.page - 1) * options.itemsPerPage;
  shiftStore.fetchShift();
}

function handleEdit(item: any) {
  emit("edit", item);
}

async function handleDelete(id: number) {
  const confirmed = await props.ask({
    title: "Hapus Shift",
    message:
      "Data ini akan dihapus & data jadwal shift juga akan terhapus. Lanjutkan?",
    confirmText: "Ya, Hapus",
    color: "red-darken-1",
  });
  if (confirmed) deleteWorkExperience(id);
}

async function deleteWorkExperience(id: number) {
  try {
    await shiftStore.destroyShift(id);
    props.showSuccess("Data shift berhasil dihapus.");
  } catch (err: any) {
    props.showError(err?.message ?? "Gagal menghapus data shift.");
  }
}

onMounted(() => shiftStore.fetchShift());
</script>
<style scoped>
/* Gunakan deep selector agar tembus ke dalam komponen Vuetify */
:deep(.custom-header-table thead) {
  background-color: #e3f2fd; /* Blue lighten-5 (sangat lembut) */
}

/* Penyesuaian untuk Dark Theme */
:deep(.v-theme--dark .custom-header-table thead) {
  background-color: #1a237e; /* Biru gelap yang lembut untuk mata */
}

:deep(.custom-header-table thead th) {
  font-weight: bold !important;
  /* Jika ingin warna teks biru tua di light mode */
  color: #1976d2 !important;
}

:deep(.v-theme--dark .custom-header-table thead th) {
  color: #bbdefb !important;
}
</style>
