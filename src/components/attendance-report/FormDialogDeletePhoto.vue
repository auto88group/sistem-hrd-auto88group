<template>
  <v-dialog v-model="store.formDialogDeletePhoto" max-width="480" persistent>
    <v-card rounded="lg">
      <!-- Header -->
      <v-card-title class="flex items-center ga-2 pa-5 pb-4">
        <v-icon
          :icon="resultData ? 'mdi-check-circle' : 'mdi-image-remove'"
          :color="resultData ? 'text-green-500' : 'text-red-500'"
          size="22"
          class="me-2"
        />
        <span class="text-md font-semibold">
          {{ resultData ? "Foto Berhasil Dihapus" : "Hapus Foto Absensi" }}
        </span>
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          density="compact"
          :disabled="store.isLoadingDeletePhoto"
          @click="handleClose"
        />
      </v-card-title>

      <v-divider />

      <!-- ── STATE: RESULT ── -->
      <template v-if="resultData">
        <v-card-text class="pa-5">
          <v-alert
            type="success"
            variant="tonal"
            density="compact"
            class="mb-5 text-sm text-green-500"
            icon="mdi-check-circle-outline"
          >
            {{ resultData.message }}
          </v-alert>

          <div class="space-y-2">
            <div
              class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700"
            >
              <span class="text-sm text-medium-emphasis">Rentang Tanggal</span>
              <strong class="text-sm">{{ previewDateRangeResult }}</strong>
            </div>
            <div
              class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700"
            >
              <span class="text-sm text-medium-emphasis">Tipe Foto</span>
              <strong class="text-sm">{{ photoTypeLabelResult }}</strong>
            </div>
            <div
              class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700"
            >
              <span class="text-sm text-medium-emphasis">Data Ditemukan</span>
              <v-chip size="x-small" color="primary" variant="tonal">
                {{ resultData.data.total_found }} data
              </v-chip>
            </div>
            <div class="flex items-center justify-between py-2">
              <span class="text-sm text-medium-emphasis">Foto Dihapus</span>
              <v-chip size="x-small" color="success" variant="tonal">
                {{ resultData.data.total_updated }} data
              </v-chip>
            </div>
          </div>

          <v-alert
            v-if="resultData.data.total_found !== resultData.data.total_updated"
            type="info"
            variant="tonal"
            density="compact"
            class="mt-4 text-sm text-cyan-600"
            icon="mdi-information-outline"
          >
            {{ resultData.data.total_found - resultData.data.total_updated }}
            data dilewati karena foto sudah dihapus sebelumnya.
          </v-alert>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn color="primary text-white" variant="flat" @click="handleClose">
            Tutup
          </v-btn>
        </v-card-actions>
      </template>

      <!-- ── STATE: FORM ── -->
      <template v-else>
        <v-card-text class="pa-5">
          <v-alert
            type="warning"
            variant="tonal"
            density="compact"
            class="mb-5 text-sm"
            icon="mdi-alert-circle-outline"
          >
            Foto yang dihapus <strong>tidak dapat dikembalikan</strong>.
            Pastikan rentang tanggal yang dipilih sudah benar.
          </v-alert>

          <v-row dense>
            <!-- Date Range Picker -->
            <v-col cols="12">
              <date-range-picker v-model="dateRange" :max-date="today">
                <template #label>Rentang Tanggal</template>
              </date-range-picker>
              <div
                v-if="errors.dateRange"
                class="text-red-500 text-xs mt-1 ml-1"
              >
                {{ errors.dateRange }}
              </div>
            </v-col>

            <!-- Tipe foto -->
            <v-col cols="12" class="mt-2">
              <div class="text-body-2 text-medium-emphasis mb-2">
                Hapus foto
              </div>
              <v-btn-toggle
                v-model="store.payloadDeletePhoto.type"
                mandatory
                density="comfortable"
                color="primary"
                variant="outlined"
                divided
                class="w-100"
              >
                <v-btn value="in" class="flex-grow-1" size="small">
                  <v-icon start icon="mdi-login" size="16" />
                  Masuk
                </v-btn>
                <v-btn value="out" class="flex-grow-1" size="small">
                  <v-icon start icon="mdi-logout" size="16" />
                  Pulang
                </v-btn>
                <v-btn value="both" class="flex-grow-1" size="small">
                  <v-icon start icon="mdi-swap-horizontal" size="16" />
                  Keduanya
                </v-btn>
              </v-btn-toggle>
            </v-col>
          </v-row>

          <!-- Preview -->
          <div
            v-if="dateRange.length === 2"
            class="mt-4 p-3 rounded-lg bg-gray-200 dark:bg-gray-800"
          >
            <div class="flex items-center ga-2">
              <v-icon
                icon="mdi-calendar-check-outline"
                size="16"
                color="primary"
              />
              <span class="text-sm">
                Rentang dipilih:
                <strong class="text-primary">{{ previewDateRange }}</strong>
              </span>
            </div>
            <div class="flex items-center ga-2 mt-1">
              <v-icon
                icon="mdi-image-outline"
                size="16"
                color="grey-darken-1"
              />
              <span class="text-sm">
                Foto yang dihapus:
                <strong>{{ photoTypeLabel }}</strong>
              </span>
            </div>
          </div>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4 ga-2">
          <v-spacer />
          <v-btn
            variant="text"
            :disabled="store.isLoadingDeletePhoto"
            @click="handleClose"
          >
            Batal
          </v-btn>
          <v-btn
            color="bg-red-500 text-white"
            variant="flat"
            :loading="store.isLoadingDeletePhoto"
            prepend-icon="mdi-delete-outline"
            @click="handleSubmit"
          >
            Hapus Foto
          </v-btn>
        </v-card-actions>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import { useEmployeeAttendanceRequestStore } from "@/stores/employee-attendance.store";
import type { DeletePhotoResponse } from "@/api/modules/employee-attendance.api";
import DateRangePicker from "@/components/DateRangePicker.vue";

// ── store ────────────────────────────────────────────────────────────────────
const store = useEmployeeAttendanceRequestStore();

// ── local state ──────────────────────────────────────────────────────────────
const dateRange = ref<string[]>([]);
const errors = reactive<{ dateRange?: string }>({});
const resultData = ref<DeletePhotoResponse | null>(null);

const today = new Date().toISOString().split("T")[0];

// ── sync dateRange → store payload ───────────────────────────────────────────
watch(dateRange, (val) => {
  store.payloadDeletePhoto.start_date = val[0] ?? null;
  store.payloadDeletePhoto.end_date = val[1] ?? null;
  if (val.length === 2) delete errors.dateRange;
});

// ── helpers format tanggal ───────────────────────────────────────────────────
function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// ── computed ─────────────────────────────────────────────────────────────────
const previewDateRange = computed(() => {
  if (dateRange.value.length < 2) return "";
  const [start, end] = dateRange.value;
  if (start === end) return formatDate(start);
  return `${formatDate(start)} – ${formatDate(end)}`;
});

const photoTypeLabel = computed(() => {
  const map: Record<string, string> = {
    in: "Foto Masuk",
    out: "Foto Pulang",
    both: "Foto Masuk & Pulang",
  };
  return map[store.payloadDeletePhoto.type] ?? "-";
});

// ── computed untuk state result ───────────────────────────────────────────────
const previewDateRangeResult = computed(() => {
  if (!resultData.value) return "-";
  const { start_date, end_date } = resultData.value.data;
  if (start_date === end_date) return formatDate(start_date);
  return `${formatDate(start_date)} – ${formatDate(end_date)}`;
});

const photoTypeLabelResult = computed(() => {
  const map: Record<string, string> = {
    in: "Foto Masuk",
    out: "Foto Pulang",
    both: "Foto Masuk & Pulang",
  };
  return map[resultData.value?.data.type ?? ""] ?? "-";
});

// ── handlers ─────────────────────────────────────────────────────────────────
function validate(): boolean {
  delete errors.dateRange;
  if (
    dateRange.value.length < 2 ||
    !dateRange.value[0] ||
    !dateRange.value[1]
  ) {
    errors.dateRange = "Rentang tanggal wajib dipilih.";
    return false;
  }
  return true;
}

async function handleSubmit() {
  if (!validate()) return;

  try {
    const res = await store.deletePhoto();
    if (res?.success) {
      resultData.value = res;
    }
  } catch (err: any) {
    const msg: string =
      err?.response?.data?.message ?? "Terjadi kesalahan, coba lagi.";
    errors.dateRange = msg;
  }
}

function handleClose() {
  if (store.isLoadingDeletePhoto) return;
  store.formDialogDeletePhoto = false;
  store.clearPayloadDeletePhoto();
  dateRange.value = [];
  delete errors.dateRange;
  resultData.value = null;
}
</script>
