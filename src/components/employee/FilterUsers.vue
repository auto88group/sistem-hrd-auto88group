<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-end">
    <div v-if="isVisible('nama')">
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

    <div v-if="isVisible('jabatan')">
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
        clearable
      ></v-autocomplete>
    </div>

    <div v-if="isVisible('cabang')">
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
        clearable
      ></v-autocomplete>
    </div>

    <div v-if="isVisible('pendidikan')">
      <label class="input-label">Pendidikan</label>
      <v-autocomplete
        v-model="form.pendidikan"
        :items="listPendidikan"
        prepend-inner-icon="mdi-school-outline"
        placeholder="Pilih pendidikan"
        variant="outlined"
        density="compact"
        color="primary"
        class="custom-input"
        hide-details="auto"
        clearable
      ></v-autocomplete>
    </div>

    <div v-if="isVisible('status')">
      <label class="input-label">Status</label>
      <v-autocomplete
        v-model="form.status"
        :items="['Aktif', 'Non-Aktif', 'Cuti']"
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
        :items="['Laki-laki', 'Perempuan']"
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
      <v-btn
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
import { ref } from "vue";
const props = defineProps({
  hideFields: {
    type: Array,
    default: () => [], // Defaultnya tidak ada yang disembunyikan
  },
});

const isVisible = (fieldName: string) => !props.hideFields.includes(fieldName);

const form = ref({
  nama: null,
  jabatan: null,
  cabang: null,
  pendidikan: null, // Tambahkan ini
  status: null,
  gender: null,
});

// Data Dummy
const listKaryawan = [
  "Budi Santoso",
  "Siti Aminah",
  "Andi Wijaya",
  "Dewi Lestari",
];
const listJabatan = ["Manager", "Supervisor", "Staff Admin", "IT Support"];
const listCabang = ["Jakarta", "Surabaya", "Bandung", "Medan"];
const listPendidikan = ["SMA/SMK", "D3", "S1", "S2", "S3"]; // Tambahkan ini
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
