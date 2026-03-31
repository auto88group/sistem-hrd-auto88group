<template>
  <div class="space-y-5">
    <filter-users :hide-fields="['pendidikan']" />

    <v-data-table
      :headers="headers as any"
      :items="karyawan"
      class="elevation-1 custom-header-table"
    >
      <template #[`item.foto`]="{ item }">
        <v-avatar size="40">
          <v-img :src="item.foto" alt="Avatar"></v-img>
        </v-avatar>
      </template>

      <template #[`item.karyawan`]="{ item }">
        <div class="d-flex flex-column">
          <span class="font-weight-bold">{{ item.nama }}</span>
          <span class="text-caption text-grey">{{ item.email }}</span>
        </div>
      </template>

      <template #[`item.status`]="{ item }">
        <v-chip
          :color="item.status === 'Aktif' ? 'success' : 'red'"
          size="small"
        >
          {{ item.status }}
        </v-chip>
      </template>

      <template #[`item.is_enable`]="{ item }">
        <v-icon :color="item.is_enable ? 'primary' : 'grey'">
          {{ item.is_enable ? "mdi-check-circle" : "mdi-minus-circle" }}
        </v-icon>
      </template>

      <template #[`item.actions`]="{ item }">
        <v-btn
          icon="mdi-information"
          variant="text"
          color="info"
          size="small"
        ></v-btn>
        <v-btn
          icon="mdi-delete"
          variant="text"
          color="error"
          size="small"
        ></v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script setup lang="ts">
import FilterUsers from "./FilterUsers.vue";
const headers = [
  { title: "Foto", key: "foto", sortable: false },
  { title: "Karyawan", key: "karyawan" },
  { title: "Cabang", key: "cabang" },
  { title: "Jabatan", key: "jabatan" },
  { title: "L/P", key: "jenis_kelamin" },
  { title: "Status", key: "status" },
  { title: "Prospec", key: "is_enable", align: "center" },
  { title: "Aksi", key: "actions", sortable: false, align: "end" },
];

const karyawan = [
  {
    foto: "https://randomuser.me/api/portraits/men/1.jpg",
    nama: "Budi Santoso",
    email: "budi.s@perusahaan.com",
    cabang: "Jakarta Pusat",
    jabatan: "Manager",
    jenis_kelamin: "L",
    status: "Aktif",
    is_enable: true,
  },
  {
    foto: "https://randomuser.me/api/portraits/women/2.jpg",
    nama: "Siti Aminah",
    email: "siti.a@perusahaan.com",
    cabang: "Bandung",
    jabatan: "Staff Admin",
    jenis_kelamin: "P",
    status: "Non-Aktif",
    is_enable: false,
  },
  {
    foto: "https://randomuser.me/api/portraits/men/3.jpg",
    nama: "Andi Wijaya",
    email: "andi.w@perusahaan.com",
    cabang: "Surabaya",
    jabatan: "Sales",
    jenis_kelamin: "L",
    status: "Aktif",
    is_enable: true,
  },
];
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
