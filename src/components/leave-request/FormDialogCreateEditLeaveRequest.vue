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
                Tanggal Mulai<span class="text-red-500">*</span>
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
                Format: JPG, PNG. Maks. 2MB.
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
import { useLeaveRequestStore } from "@/stores/leave-request.store";
import { useLeaveTypeStore } from "@/stores/leave_type.store";
import { useUserStore } from "@/stores/user.store";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { computed, ref } from "vue";
import AppDatePicker from "../AppDatePicker.vue";
import { useAppStore } from "@/stores/app";

const { formatName } = useFormatName();
const userStore = useUserStore();
const appStore = useAppStore();
const leaveRequestStore = useLeaveRequestStore();
const leaveTypeStore = useLeaveTypeStore();
const imagePreview = ref<string | null>(null);
const apiUrl = import.meta.env.VITE_API_URL;

const { payloadCreateUpdate: form, serverErrors } =
  storeToRefs(leaveRequestStore);

const searchLeaveType = ref("");

const isSelectingUser = ref(false);
const selectedUserText = ref<string>("");

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

function closeDialog() {
  leaveRequestStore.createEditDialog = false;
  leaveRequestStore.clearCreateUpdatePayload();
  Object.keys(leaveRequestStore.serverErrors).forEach(
    (key) => delete leaveRequestStore.serverErrors[key],
  );
}

async function submitForm() {
  try {
    let res = null;
    if (form.value.id) {
      res = await leaveRequestStore.updateLeaveRequest();
    } else {
      res = await leaveRequestStore.createLeaveRequest();
    }

    if (res?.success) {
      // ✅ tambah optional chaining untuk keamanan
      appStore.showSuccessSnackbar = true;
      appStore.successMessage = res.message;
      leaveRequestStore.fetchLeaveRequest();
      leaveRequestStore.createEditDialog = false;
      leaveRequestStore.clearCreateUpdatePayload();
    }
  } catch (error: any) {
    handleServerErrors(error);
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
});
</script>
