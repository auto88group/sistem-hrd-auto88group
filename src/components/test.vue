<template>
  <v-card
    variant="flat"
    class="border border-slate-200 rounded-xl overflow-hidden"
  >
    <div class="bg-slate-50 px-5 py-3 border-b border-slate-200">
      <h3 class="text-sm font-semibold text-slate-700 flex items-center gap-2">
        <v-icon size="small" color="primary">mdi-account-edit</v-icon>
        Informasi Karyawan
      </h3>
    </div>

    <div class="pa-5">
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-0"
      >
        <div class="field-container">
          <label class="input-label">Nama Karyawan</label>
          <v-autocomplete
            v-model="form.nama"
            :items="listKaryawan"
            prepend-inner-icon="mdi-account"
            placeholder="Cari nama..."
            variant="outlined"
            density="compact"
            color="primary"
            class="custom-input"
            hide-details="auto"
            clearable
          ></v-autocomplete>
        </div>

        <div class="field-container">
          <label class="input-label">Jabatan</label>
          <v-autocomplete
            v-model="form.jabatan"
            :items="listJabatan"
            prepend-inner-icon="mdi-briefcase-outline"
            placeholder="Pilih jabatan"
            variant="outlined"
            density="compact"
            color="primary"
            class="custom-input"
            hide-details="auto"
          ></v-autocomplete>
        </div>

        <div class="field-container">
          <label class="input-label">Cabang</label>
          <v-autocomplete
            v-model="form.cabang"
            :items="listCabang"
            prepend-inner-icon="mdi-map-marker-outline"
            placeholder="Lokasi cabang"
            variant="outlined"
            density="compact"
            color="primary"
            class="custom-input"
            hide-details="auto"
          ></v-autocomplete>
        </div>

        <div class="field-container">
          <label class="input-label">Status</label>
          <v-autocomplete
            v-model="form.status"
            :items="['Aktif', 'Non-Aktif', 'Cuti']"
            prepend-inner-icon="mdi-check-circle-outline"
            variant="outlined"
            density="compact"
            color="primary"
            class="custom-input"
            hide-details="auto"
          >
            <template v-slot:selection="{ item }">
              <v-chip
                size="x-small"
                :color="item.title === 'Aktif' ? 'success' : 'warning'"
                variant="tonal"
              >
                {{ item.title }}
              </v-chip>
            </template>
          </v-autocomplete>
        </div>

        <div class="field-container">
          <label class="input-label">Jenis Kelamin</label>
          <v-autocomplete
            v-model="form.gender"
            :items="['Laki-laki', 'Perempuan']"
            prepend-inner-icon="mdi-gender-male-female"
            variant="outlined"
            density="compact"
            color="primary"
            class="custom-input"
            hide-details="auto"
          ></v-autocomplete>
        </div>
      </div>

      <div class="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-2">
        <v-btn
          variant="text"
          color="grey-darken-1"
          size="small"
          class="text-none"
          >Batal</v-btn
        >
        <v-btn
          color="primary"
          elevation="0"
          size="small"
          class="text-none px-6"
          prepend-icon="mdi-content-save"
        >
          Simpan Data
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<style scoped>
/* Utility tambahan untuk menjaga ukuran tetap kecil dan rapi */
.input-label {
  display: block;
  font-size: 0.75rem; /* text-xs */
  font-weight: 600;
  color: #64748b; /* slate-500 */
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.field-container {
  margin-bottom: 16px;
}

/* Mengecilkan tinggi default Vuetify input sedikit lagi */
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

<script setup>
import { ref } from "vue";

const form = ref({
  nama: null,
  jabatan: null,
  cabang: null,
  status: null,
  gender: null,
});

const listKaryawan = [
  "Budi Santoso",
  "Siti Aminah",
  "Andi Wijaya",
  "Dewi Lestari",
];
const listJabatan = ["Manager", "Supervisor", "Staff Admin", "IT Support"];
const listCabang = ["Jakarta", "Surabaya", "Bandung", "Medan"];
</script>
