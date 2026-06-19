<template>
  <div class="space-y-10">
    <confirm-dialog />

    <!-- ───── Snackbar Error ───── -->
    <v-snackbar
      v-model="showErrorSnackbar"
      color="bg-red-500"
      elevation="24"
      location="top"
      timeout="4000"
      rounded="lg"
    >
      <div class="d-flex align-center">
        <v-icon icon="mdi-alert-circle" class="me-3"></v-icon>
        <span class="font-weight-medium">{{ snackbarMessage }}</span>
      </div>
      <template v-slot:actions>
        <v-btn
          variant="text"
          icon="mdi-close"
          @click="showErrorSnackbar = false"
        ></v-btn>
      </template>
    </v-snackbar>

    <!-- ───── Snackbar Success ───── -->
    <v-snackbar
      v-model="showSuccessSnackbar"
      color="bg-green-500"
      elevation="24"
      location="top"
      timeout="4000"
      rounded="lg"
    >
      <div class="d-flex align-center">
        <v-icon icon="mdi-check-circle" class="me-3"></v-icon>
        <span class="font-weight-medium">{{ successMessage }}</span>
      </div>
      <template v-slot:actions>
        <v-btn
          variant="text"
          icon="mdi-close"
          @click="showSuccessSnackbar = false"
        ></v-btn>
      </template>
    </v-snackbar>
    <filter-users :hide-fields="['pendidikan', 'status']" @filter="onFilter" />

    <v-data-table-server
      :headers="headers as any"
      :items="karyawan"
      :items-length="store.totalRecords"
      :items-per-page="store.params.length"
      :loading="store.isLoading"
      class="elevation-1 custom-header-table"
      @update:options="onTableOptionsChange"
    >
      <template #[`item.no`]="{ index }">
        {{ (store.params.start ?? 0) + index + 1 }}
      </template>
      <template #[`item.foto`]="{ item }">
        <v-avatar size="40">
          <v-img
            v-if="item.image"
            :src="apiUrl + '/image/user-profile/' + item.id + '/' + item.image"
            alt="Avatar"
            @click="openImage(item)"
          >
            >
            <template #placeholder>
              <v-icon>mdi-account-circle</v-icon>
            </template>

            <template #error>
              <v-icon size="40" color="grey-lighten-1"
                >mdi-account-circle</v-icon
              >
            </template>
          </v-img>

          <v-icon v-else size="40" color="grey-lighten-1">
            mdi-account-circle
          </v-icon>
        </v-avatar>
      </template>

      <template #[`item.employee_id`]="{ item }">
        <div class="d-flex flex-column">
          <span class="font-weight-bold">{{ item.employee_id ?? "-" }}</span>
        </div>
      </template>

      <template #[`item.karyawan`]="{ item }">
        <div class="flex flex-col">
          <span
            @click="goToDetail(item)"
            class="font-bold text-blue-500 dark:text-blue-300 cursor-pointer"
            >{{ formatName(item) }}</span
          >
          <span class="text-sm text-gray-500 dark:text-gray-300">{{
            item.email
          }}</span>
        </div>
      </template>

      <template #[`item.cabang`]="{ item }">
        <div class="flex flex-col whitespace-nowrap">
          <span class="font-bold">
            {{ item.branch?.alias }} ({{ item.branch?.code }})
          </span>
          <span class="text-sm text-gray-500 dark:text-gray-300">{{
            item.branch?.name
          }}</span>
        </div>
      </template>

      <!-- POSITION -->
      <template #[`item.position`]="{ item }">
        <div class="d-flex flex-column">
          <span class="font-weight-bold">{{ item.position ?? "-" }}</span>
        </div>
      </template>

      <!-- STATUS -->
      <template #[`item.status`]="{ item }">
        <v-chip
          size="small"
          :color="statusColor(item.status_id)"
          variant="tonal"
        >
          {{ statusLabel(item.status_id) }}
        </v-chip>
      </template>

      <template #[`item.join_date`]="{ item }">
        <span class="text-green-600 font-bold text-sm">
          {{ toFullDate(item.join_date ?? item.created_at) }}
        </span>
      </template>

      <template #[`item.effective_end_date`]="{ item }">
        <span
          v-if="[3, 4, 5].includes(item.status_id)"
          class="text-red-500 font-bold text-sm"
        >
          {{ toFullDate(item.effective_end_date) }}
        </span>
        <span v-else class="text-gray-400 text-sm">-</span>
      </template>

      <!-- PROSPECT -->
      <template #[`item.prospect`]="{ item }">
        <template v-if="item.level === 'admin_telemarketing'">
          <v-btn
            size="small"
            :color="prospectColor(item.disabled)"
            variant="tonal"
            @click="prospectChange(item)"
          >
            {{ item.disabled === 0 ? "Aktif" : "Nonaktif" }}
          </v-btn>
        </template>

        <template v-else-if="item.level === 'telemarketing'">
          <v-btn
            size="small"
            :color="prospectColor(item.telemarketing?.disabled ?? 0)"
            variant="tonal"
            @click="prospectChange(item)"
          >
            {{ item.telemarketing?.disabled === 0 ? "Aktif" : "Nonaktif" }}
          </v-btn>
        </template>

        <!-- level lain: tidak tampilkan apapun -->
        <template v-else>
          <span></span>
        </template>
      </template>

      <template #[`item.actions`]="{ item }">
        <div class="ms-auto flex items-center gap-1">
          <v-btn
            @click="goToDetail(item)"
            icon="mdi-information-outline"
            variant="text"
            density="comfortable"
            class="!text-blue-600 hover:!bg-blue-50 transition-all duration-300"
          />
          <v-btn
            v-if="item.deleted === 1"
            :loading="store.isLoadingDestroy"
            @click="handleRestore(item.id)"
            icon="mdi-file-restore-outline"
            variant="text"
            density="comfortable"
            class="!text-red-500 hover:!bg-red-50 transition-all duration-300"
          />
          <v-btn
            v-else
            :loading="store.isLoadingDestroy"
            @click="handleDelete(item.id)"
            icon="mdi-delete-outline"
            variant="text"
            density="comfortable"
            class="!text-red-500 hover:!bg-red-50 transition-all duration-300"
          />
        </div>
      </template>
    </v-data-table-server>

    <v-dialog v-model="isDialogDeleteOpen" max-width="450" persistent>
      <v-card
        elevation="1"
        prepend-icon="mdi-alert-circle-outline"
        title="Konfirmasi Hapus Karyawan"
      >
        <!-- Bungkus konten dengan v-form -->
        <v-form ref="formDelete" @submit.prevent="deleteUser">
          <div class="p-[16px] space-y-5">
            <v-select
              v-model="userDestoryParams.is_resign"
              label="Karyawan Resign?"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :items="[
                { title: 'Ya', value: 1 },
                { title: 'Tidak', value: 0 },
              ]"
              item-title="title"
              item-value="value"
              :rules="[rules.required]"
              @update:model-value="
                userDestoryParams.is_resign === 0
                  ? (userDestoryParams.resign_date = undefined)
                  : ''
              "
            ></v-select>

            <app-date-picker
              v-if="userDestoryParams.is_resign === 1"
              v-model="userDestoryParams.resign_date"
              variant="outlined"
              label="Tanggal Resign"
              density="compact"
              :rules="[rules.required]"
              clearable
            >
            </app-date-picker>
          </div>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              text="Batal"
              color="bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-200 font-bold"
              variant="plain"
              @click="isDialogDeleteOpen = false"
            ></v-btn>

            <!-- Button type diset ke 'submit' -->
            <v-btn
              type="submit"
              color="bg-indigo-200 dark:bg-indigo-800 text-indigo-500 dark:text-indigo-200 font-bold"
              text="Ya, Hapus"
              variant="flat"
              :loading="isLoadingDestroy"
            ></v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isDialogProspectOpen" max-width="450">
      <v-card
        elevation="1"
        prepend-icon="mdi-alert-circle-outline"
        title="Konfirmasi Status"
      >
        <v-card-text>
          Apakah Anda yakin ingin mengubah prospek
          <strong>{{ targetProspect?.name || "item ini" }}</strong>
          menjadi

          <template v-if="targetProspect?.level === 'telemarketing'">
            <v-chip
              size="x-small"
              :color="
                prospectColor(
                  targetProspect.telemarketing?.disabled == 1 ? 0 : 1,
                )
              "
            >
              {{
                targetProspect?.telemarketing?.disabled === 0
                  ? "Nonaktif"
                  : "Aktif"
              }}
            </v-chip>
          </template>

          <template v-else-if="targetProspect?.level === 'admin_telemarketing'">
            <v-chip
              size="x-small"
              :color="prospectColor(targetProspect.disabled == 1 ? 0 : 1)"
            >
              {{ targetProspect?.disabled === 0 ? "Nonaktif" : "Aktif" }}
            </v-chip>
          </template>

          ?
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text="Batal"
            color="bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-200 font-bold"
            variant="plain"
            @click="isDialogProspectOpen = false"
          ></v-btn>
          <v-btn
            color="bg-indigo-200 dark:bg-indigo-800 text-indigo-500 dark:text-indigo-200 font-bold"
            text="Ya, Ubah"
            variant="flat"
            @loading="store.isLoadingProspect"
            @click="handleConfirmStatus"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from "vue";
import FilterUsers from "./FilterUsers.vue";
import { useUserStore } from "@/stores/user.store";
import type { UserDatatablesParams } from "@/api/modules/user.api";
import { useRouter } from "vue-router";
import { useEmployeeStatus } from "@/composables/UseEmployeeStatus";
import { useFormatName } from "@/composables/useFormatName";
import { useConfirmDialog } from "@/composables/useConfirmDialog";
import ConfirmDialog from "../ConfirmDialog.vue";
import { storeToRefs } from "pinia";
import AppDatePicker from "../AppDatePicker.vue";
import type { VForm } from "vuetify/components";
import { useDateFormatter } from "@/composables/UseDateFormatter.ts";

const { toFullDate } = useDateFormatter();
const apiUrl = import.meta.env.VITE_API_URL;
const { formatName } = useFormatName();
const store = useUserStore();
const {
  users: karyawan,
  userDestoryParams,
  isLoadingDestroy,
} = storeToRefs(store);

const router = useRouter();
const { statusLabel, statusColor } = useEmployeeStatus();
const { ask } = useConfirmDialog();

onMounted(() => store.fetchUsers());

function onTableOptionsChange(options: any) {
  store.params.length = options.itemsPerPage;
  store.params.start = (options.page - 1) * options.itemsPerPage;

  if (options.sortBy.length > 0) {
    store.params.sortBy = options.sortBy[0].key;
    store.params.sortDirection = options.sortBy[0].order;
  } else {
    store.params.sortBy = "id";
    store.params.sortDirection = "desc";
  }

  store.fetchUsers();
}

const formDelete = ref<VForm | null>(null);
const rules = {
  required: (v: any) =>
    (v !== null && v !== undefined && v !== "") || "Wajib diisi",
};

const showErrorSnackbar = ref(false);
const snackbarMessage = ref("");
const showSuccessSnackbar = ref(false);
const successMessage = ref("");

const headers = [
  { title: "No", key: "no", sortable: false, width: "60px" },
  { title: "Foto", key: "foto", sortable: false },
  { title: "ID", key: "employee_id", sortable: true },
  { title: "Karyawan", key: "karyawan", sortable: false },
  { title: "Cabang", key: "cabang", sortable: false },
  { title: "Jabatan", key: "position", sortable: true },
  { title: "Status", key: "status", sortable: true },
  { title: "Tanggal Masuk", key: "join_date", sortable: true },
  { title: "Tanggal Keluar", key: "effective_end_date", sortable: false },
  { title: "Prospek", key: "prospect", sortable: false, align: "center" },
  { title: "Aksi", key: "actions", sortable: false, align: "end" },
];

function showError(message: string) {
  snackbarMessage.value = message;
  showErrorSnackbar.value = true;
}

function showSuccess(message: string) {
  successMessage.value = message;
  showSuccessSnackbar.value = true;
}

function onFilter(filterValues: Partial<UserDatatablesParams>) {
  store.params.start = 0;
  Object.assign(store.params, filterValues);
  store.fetchUsers();
}

const PROSPECT_MAP: Record<number, { label: string; container: string }> = {
  0: {
    label: "Aktif",
    container:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  1: {
    label: "Nonaktif",
    container:
      "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  },
};
function prospectColor(id: number): string {
  return (
    PROSPECT_MAP[id]?.container ??
    "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
  );
}

const isDialogDeleteOpen = ref(false);
const isDialogProspectOpen = ref(false);
const targetProspect = ref<any>(null);
function prospectChange(item: any) {
  targetProspect.value = item;
  isDialogProspectOpen.value = true;
}

const openImage = (item: any) => {
  if (item.image) {
    const url = `${apiUrl}/image/user-profile/${item.id}/${item.image}`;
    window.open(url, "_blank");
  }
};

function goToDetail(item: any) {
  router.push({
    name: "Master Detail Karyawan",
    params: { id: item.id },
  });
}

async function handleRestore(id: number) {
  const confirmed = await ask({
    title: "Kembalikan Data User",
    message:
      "Data akan dikembalikan sebagai </br><b>TANPA KONTRAK</b>. Lanjutkan?",
    confirmText: "Ya, Setuju",
    color: "red-darken-1",
  });
  if (confirmed) {
    userDestoryParams.value.id = id.toString();
    userDestoryParams.value.action = "restore";
    try {
      await store.destroyUser();
      showSuccess("Karyawan berhasil dikembalikan.");
      resetUserDestoryParams();
    } catch (err: any) {
      showError(err?.message ?? "Gagal mengembalikan data karyawan.");
    }
  } else {
    resetUserDestoryParams();
  }
}
function handleDelete(id: number) {
  isDialogDeleteOpen.value = true;
  userDestoryParams.value.id = id.toString();
  userDestoryParams.value.action = "delete";
}
async function deleteUser() {
  const validation = await formDelete.value?.validate();
  try {
    if (validation) {
      await store.destroyUser();
      showSuccess("Karyawan berhasil dihapus.");
      resetUserDestoryParams();
    } else {
      showError("Form belum valid, cek inputan kembali.");
    }
  } catch (err: any) {
    showError(err?.message ?? "Gagal menghapus data karyawan.");
  }
}
function resetUserDestoryParams() {
  isDialogDeleteOpen.value = false;
  userDestoryParams.value.id = undefined;
  userDestoryParams.value.is_resign = 0;
  userDestoryParams.value.resign_date = undefined;
  userDestoryParams.value.action = undefined;
}

const handleConfirmStatus = async () => {
  const currentDisabled =
    targetProspect.value?.level === "telemarketing"
      ? targetProspect.value?.telemarketing?.disabled
      : targetProspect.value?.disabled;

  const id = targetProspect.value?.id;

  store.userProspectParams.action =
    currentDisabled === 0 ? "disable" : "enable";

  try {
    let result = await store.updateUserProspect(id);
    if (result.success) {
      showSuccess(result.message);
      store.fetchUsers();
    } else {
      showError(result.message ?? "Gagal mengupdate prospek");
    }
  } catch (err: any) {
    showError(err?.message ?? "Gagal mengupdate prospek");
  } finally {
    isDialogProspectOpen.value = false;
  }
};
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
