<template>
  <v-dialog
    v-model="leaveRequestStore.createEditDialog"
    max-width="700"
    scrollable
  >
    <v-card rounded="lg">
      <v-card-title class="flex items-center gap-2 px-6 pt-5 pb-3">
        <v-icon icon="mdi-tune-variant" color="primary" size="small"></v-icon>
        <span class="text-base font-bold">
          {{ form.id ? "Edit Permohonan" : "Tambah Permohonan" }}
        </span>
        <v-spacer></v-spacer>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="closeDialog"
        ></v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="p-4">
        <v-row>
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
              @click:clear="onClearUser"
              :rules="[rules.required]"
              :error-messages="serverErrors.user_id"
            >
              <template v-slot:label>
                Karyawan<span class="text-red-500">*</span>
              </template>
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

          <v-col cols="12" md="6">
            <v-autocomplete
              v-model="form.hrd_leave_type_id"
              :items="listLeaveType"
              :loading="leaveTypeStore.isLoadingData"
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
              @update:modelValue="onSelectLeaveType"
              :rules="[rules.required]"
              :error-messages="serverErrors.branch_id"
            >
              <template v-slot:label>
                Jenis Izin<span class="text-red-500">*</span>
              </template>
            </v-autocomplete>
          </v-col>

          <v-col cols="12" md="6">
            <app-date-picker
              v-model="form.start_date"
              variant="outlined"
              density="compact"
              :rules="[rules.required]"
              :error-messages="serverErrors.start_date"
            >
              <template v-slot:label>
                Tanggal <span class="text-red-500">*</span>
              </template>
            </app-date-picker>
          </v-col>

          <v-col cols="12" md="6">
            <app-date-picker
              v-model="form.end_date"
              variant="outlined"
              density="compact"
              :rules="[rules.required]"
              :error-messages="serverErrors.end_date"
            >
              <template v-slot:label>
                Tanggal Selesai<span class="text-red-500">*</span>
              </template>
            </app-date-picker>
          </v-col>

          <!-- Note otomatis kalau periode cuti melintasi tanggal libur -->
          <v-col cols="12" v-if="holidayInfoText">
            <v-alert
              type="warning"
              variant="tonal"
              density="compact"
              class="text-sm"
              icon="mdi-information-outline"
            >
              {{ holidayInfoText }}
            </v-alert>
          </v-col>

          <v-col v-if="isShowStartTime" cols="12" md="6">
            <v-menu
              v-model="openStartTime"
              :close-on-content-click="false"
              transition="scale-transition"
            >
              <template #activator="{ props }">
                <div class="space-y-1">
                  <v-text-field
                    v-model="form.start_time"
                    readonly
                    v-bind="props"
                    variant="outlined"
                    density="compact"
                    color="blue-darken-1"
                    :rules="[rules.required]"
                    hide-details="auto"
                    prepend-inner-icon="mdi-clock-outline"
                    class="rounded-lg shadow-sm"
                    :error-messages="serverErrors.time_in"
                  >
                    <template v-slot:label>
                      Jam Masuk<span class="text-red-500">*</span>
                    </template>
                  </v-text-field>
                </div>
              </template>

              <v-card class="rounded-xl elevation-12">
                <v-time-picker
                  v-model="form.start_time"
                  format="24hr"
                  color="blue-darken-1"
                  @update:minute="openStartTime = false"
                />
              </v-card>
            </v-menu>
          </v-col>

          <v-col v-if="isShowEndTime" cols="12" md="6">
            <v-menu
              v-model="openEndTime"
              :close-on-content-click="false"
              transition="scale-transition"
            >
              <template #activator="{ props }">
                <div class="space-y-1">
                  <v-text-field
                    v-model="form.end_time"
                    readonly
                    v-bind="props"
                    variant="outlined"
                    density="compact"
                    color="blue-darken-1"
                    :rules="[rules.required]"
                    hide-details="auto"
                    prepend-inner-icon="mdi-clock-outline"
                    class="rounded-lg shadow-sm"
                    :error-messages="serverErrors.end_in"
                  >
                    <template v-slot:label>
                      Jam Pulang<span class="text-red-500">*</span>
                    </template>
                  </v-text-field>
                </div>
              </template>

              <v-card class="rounded-xl elevation-12">
                <v-time-picker
                  v-model="form.end_time"
                  format="24hr"
                  color="blue-darken-1"
                  @update:minute="openEndTime = false"
                />
              </v-card>
            </v-menu>
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="form.reason"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :rules="[rules.required]"
              :error-messages="serverErrors.reason"
            >
              <template v-slot:label>
                Alasan<span class="text-red-500">*</span>
              </template>
            </v-text-field>
          </v-col>

          <v-col cols="12">
            <v-card-title class="font-bold px-0 text-base">
              Lampiran
            </v-card-title>
            <v-divider class="mb-4"></v-divider>
            <div class="flex flex-col gap-3">
              <div v-if="imagePreview || form.attachment_preview">
                <v-img
                  :src="
                    imagePreview ??
                    apiUrl +
                      '/image/leave-request/' +
                      form.user_id +
                      '/' +
                      form.attachment_preview
                  "
                  max-width="200"
                  aspect-ratio="1/1"
                  class="rounded-lg bg-grey-lighten-2 mb-3"
                ></v-img>
              </div>
              <v-file-input
                id="field-image"
                v-model="form.attachment"
                label="Upload Lampiran"
                variant="outlined"
                density="compact"
                accept="image/*"
                prepend-icon="mdi-camera"
                hide-details="auto"
                :rules="[rules.imageSize]"
                @update:model-value="onImageChange"
                :error-messages="serverErrors.attachment"
              ></v-file-input>
              <div class="text-gray-400 text-xs">
                Format: JPG, PNG. Maks. 1MB.
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="px-6 py-4 gap-2 justify-end">
        <v-btn variant="outlined" @click="closeDialog">Batal</v-btn>
        <v-btn
          color="bg-blue-300 dark:bg-blue-500"
          variant="flat"
          prepend-icon="mdi-content-save"
          :loading="leaveRequestStore.isLoadingCreateEdit"
          @click="submitForm"
        >
          {{ form.id ? "Perbarui" : "Simpan" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { useDebounceFn } from "@/composables/UseDebounce";
import { useFormatName } from "@/composables/useFormatName";
import { useDateFormatter } from "@/composables/UseDateFormatter";
import { useLeaveRequestStore } from "@/stores/leave-request.store";
import { useLeaveTypeStore } from "@/stores/leave_type.store";
import { useUserStore } from "@/stores/user.store";
import { useHolidayStore } from "@/stores/holiday.store";
import type { Holiday } from "@/api/modules/holiday.api";
import { storeToRefs } from "pinia";
import { nextTick, onMounted, watch } from "vue";
import { computed, ref } from "vue";
import AppDatePicker from "../AppDatePicker.vue";
import { useAppStore } from "@/stores/app";

const { formatName } = useFormatName();
const { toFullDate } = useDateFormatter();
const userStore = useUserStore();
const appStore = useAppStore();
const leaveRequestStore = useLeaveRequestStore();
const leaveTypeStore = useLeaveTypeStore();
const holidayStore = useHolidayStore();
const imagePreview = ref<string | null>(null);
const apiUrl = import.meta.env.VITE_API_URL;

const { payloadCreateUpdate: form, serverErrors } =
  storeToRefs(leaveRequestStore);

const searchLeaveType = ref("");

const isSelectingUser = ref(false);
const selectedUserText = ref<string>("");

const isShowStartTime = ref(false);
const openStartTime = ref<boolean>(false);
const isShowEndTime = ref(false);
const openEndTime = ref<boolean>(false);

const rules = {
  required: (v: any) =>
    (v !== null && v !== undefined && v !== "") || "Wajib diisi",
  imageSize: (v: File | File[]) => {
    if (!v) return true;
    const file = Array.isArray(v) ? v[0] : v;
    if (!file) return true;
    return file.size <= 10 * 1024 * 1024 || "Ukuran file maksimal 10MB";
  },
};

function onImageChange(files: File | File[]) {
  const file = Array.isArray(files) ? files[0] : files;
  if (file) {
    imagePreview.value = URL.createObjectURL(file);
  } else {
    imagePreview.value = null;
  }
}

const listUser = computed(() => {
  const users = userStore.usersData.map((u) => ({
    value: u.id,
    name: u.name,
    full_name: u.full_name,
    email: u.email,
  }));

  if (form.value.user_id && form.value.user_name) {
    const exists = users.some(
      (u) => u.value === leaveRequestStore.payloadCreateUpdate.user_id,
    );
    if (!exists) {
      users.unshift({
        value: form.value.user_id,
        name: form.value.user_name ?? "",
        full_name: form.value.user_full_name ?? "",
        email: form.value.user_email ?? "",
      });
    }
  }
  return users;
});

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
      isFullDay: leaveType.is_full_day,
      changeTime: leaveType.change_time,
    }));
});

const onSearchLeaveType = (val: any) => {
  searchLeaveType.value = val ?? "";
};

const onSearchUser = useDebounceFn(async (val: string) => {
  if (isSelectingUser.value) return;

  if (val === selectedUserText.value) return;
  userStore.usersData = await userStore.fetchUsersDataWithParams({
    search: val ?? "",
  });
}, 400);

const onClearUser = async () => {
  selectedUserText.value = "";
  isSelectingUser.value = false;
  // Reset list ke data awal
  userStore.usersData = await userStore.fetchUsersDataWithParams({
    search: "",
  });
};

function applyLeaveTypeVisibility(selectedValue: any) {
  if (!selectedValue) {
    isShowStartTime.value = false;
    isShowEndTime.value = false;
    form.value.start_time = null;
    form.value.end_time = null;
    return;
  }

  const selectedItem = listLeaveType.value.find(
    (item) => item.value === selectedValue,
  );

  if (selectedItem?.isFullDay == 0) {
    isShowEndTime.value = selectedItem?.changeTime === "end";
    isShowStartTime.value = false;

    form.value.start_time = null;
    if (!isShowEndTime.value) form.value.end_time = null;
  } else {
    isShowStartTime.value = false;
    isShowEndTime.value = false;
    form.value.start_time = null;
    form.value.end_time = null;
  }
}

// Panggil dari handler select
const onSelectLeaveType = (selectedValue: any) => {
  applyLeaveTypeVisibility(selectedValue);
};

watch(
  () => leaveRequestStore.createEditDialog,
  (isOpen) => {
    if (isOpen) {
      // listLeaveType mungkin belum terisi, tunggu sebentar
      nextTick(() => {
        applyLeaveTypeVisibility(form.value.hrd_leave_type_id);
      });
    } else {
      // Reset saat dialog ditutup
      isShowStartTime.value = false;
      isShowEndTime.value = false;
    }
  },
);

// ─── HOLIDAY LOGIC ──────────────────────────────────────────────────────────

/**
 * fetchHolidayByMonth di holiday.store.ts meng-REPLACE holidayByMonth setiap
 * dipanggil (bukan append). Karena kita butuh gabungan 7 bulan sekaligus dan
 * tidak boleh mengubah store, gabungan hasilnya disimpan di state lokal
 * komponen ini saja — bukan bergantung pada holidayStore.holidayByMonth.
 */
const allHolidays = ref<Holiday[]>([]);

/**
 * Cek apakah sebuah tanggal ('YYYY-MM-DD') termasuk hari libur.
 * ⚠️ Pastikan format `dateStr` sama persis dengan format `tanggal` di data libur
 * (default: 'YYYY-MM-DD'). Kalau AppDatePicker mengirim format lain, sesuaikan di sini.
 */
function isHoliday(dateStr: string | null | undefined): boolean {
  if (!dateStr) return false;
  return allHolidays.value.some((item) => item.tanggal === dateStr);
}

/**
 * Ambil data libur untuk 1 bulan sebelum s/d 5 bulan setelah bulan berjalan.
 * Total 7 bulan: -1, 0, +1, +2, +3, +4, +5.
 *
 * fetchHolidayByMonth() TIDAK diubah sama sekali — dipanggil sesuai signature
 * aslinya (month, year) satu per satu, lalu hasilnya digabung manual ke
 * `allHolidays` di sini supaya tidak saling menimpa.
 */
async function fetchHolidayRange() {
  const now = new Date();
  const merged: Holiday[] = [];
  const seenDates = new Set<string>();

  for (let offset = -1; offset <= 5; offset++) {
    const target = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    await holidayStore.fetchHolidayByMonth(
      target.getMonth() + 1,
      target.getFullYear(),
    );

    // holidayStore.holidayByMonth sudah di-replace oleh store untuk bulan ini,
    // jadi langsung disalin ke `merged` sebelum bulan berikutnya menimpanya lagi.
    for (const item of holidayStore.holidayByMonth) {
      if (!seenDates.has(item.tanggal)) {
        seenDates.add(item.tanggal);
        merged.push(item);
      }
    }
  }

  allHolidays.value = merged;
}

/** Tambah N hari ke string tanggal 'YYYY-MM-DD' tanpa masalah timezone. */
function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d + days);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Kumpulan tanggal libur yang jatuh di antara start_date dan end_date (inclusive).
 */
const holidaysInSelectedRange = computed<string[]>(() => {
  const start = form.value.start_date;
  const end = form.value.end_date;
  if (!start || !end || start > end) return [];

  const holidays: string[] = [];
  let cursor = start;
  // guard sederhana biar tidak infinite loop kalau data tanggal aneh
  let safety = 0;
  while (cursor <= end && safety < 1000) {
    if (isHoliday(cursor)) holidays.push(cursor);
    cursor = addDays(cursor, 1);
    safety++;
  }
  return holidays;
});

/** Teks note otomatis kalau periode cuti melintasi tanggal libur. */
const holidayInfoText = computed<string>(() => {
  const holidays = holidaysInSelectedRange.value;
  if (!holidays.length) return "";

  const formatted = holidays.map((h) => toFullDate(h)).join(", ");
  return `Catatan: tanggal ${formatted} merupakan hari libur dan tidak dihitung sebagai hari cuti.`;
});

// Blokir kalau start_date yang dipilih adalah hari libur
watch(
  () => form.value.start_date,
  (newVal, oldVal) => {
    if (newVal && isHoliday(newVal)) {
      appStore.showErrorSnackbar = true;
      appStore.errorMessage =
        "Tanggal tersebut adalah hari libur dan tidak bisa dipilih.";
      form.value.start_date = oldVal ?? null;
    }
  },
);

// Blokir kalau end_date yang dipilih adalah hari libur
watch(
  () => form.value.end_date,
  (newVal, oldVal) => {
    if (newVal && isHoliday(newVal)) {
      appStore.showErrorSnackbar = true;
      appStore.errorMessage =
        "Tanggal tersebut adalah hari libur dan tidak bisa dipilih.";
      form.value.end_date = oldVal ?? null;
    }
  },
);

// ─── DIALOG & SUBMIT ────────────────────────────────────────────────────────

function closeDialog() {
  imagePreview.value = null;
  leaveRequestStore.createEditDialog = false;
  leaveRequestStore.clearCreateUpdatePayload();
  Object.keys(leaveRequestStore.serverErrors).forEach(
    (key) => delete leaveRequestStore.serverErrors[key],
  );
}

async function submitForm() {
  const originalReason = form.value.reason;

  try {
    // Sisipkan note libur ke reason hanya saat submit,
    // supaya textfield yang diketik user tidak ikut berubah/menumpuk.
    if (holidayInfoText.value) {
      form.value.reason =
        `${originalReason?.trim() ?? ""}\n\n${holidayInfoText.value}`.trim();
    }

    let res = null;
    if (form.value.id) {
      res = await leaveRequestStore.updateLeaveRequest();
    } else {
      res = await leaveRequestStore.createLeaveRequest();
    }

    if (res?.success) {
      appStore.showSuccessSnackbar = true;
      appStore.successMessage = res.message;
      leaveRequestStore.fetchLeaveRequest();
      leaveRequestStore.createEditDialog = false;
      leaveRequestStore.clearCreateUpdatePayload();
    }
  } catch (error: any) {
    handleServerErrors(error);
  } finally {
    // Kembalikan reason asli di textfield (biar tidak menumpuk kalau submit gagal/di-retry)
    form.value.reason = originalReason;
  }
}

function handleServerErrors(err: any) {
  if (err?.status === 422) {
    appStore.showErrorSnackbar = true;
    appStore.errorMessage = err?.message ?? "Terjadi kesalahan, coba lagi.";

    const errors = err.errors as Record<string, string[]>;
    if (errors) {
      Object.entries(errors).forEach(([field, messages]) => {
        leaveRequestStore.serverErrors[field] = messages[0];
      });
    }
  } else {
    appStore.showErrorSnackbar = true;
    appStore.errorMessage = err?.message ?? "Terjadi kesalahan, coba lagi.";
  }
}

onMounted(async () => {
  userStore.fetchUsersData();
  leaveTypeStore.fetchLeaveTypeData();
  fetchHolidayRange();
});
</script>
