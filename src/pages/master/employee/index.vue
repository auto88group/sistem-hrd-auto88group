<template>
  <div class="space-y-5">
    <header-employee :hide-fields="['back']" />
    <v-sheet class="p-3 rounded-lg shadow-md">
      <v-tabs v-model="tab" color="primary" class="text-sm" show-arrows>
        <v-tab prepend-icon="mdi-account-group" value="one"
          >Pengguna Aktif</v-tab
        >

        <v-tab prepend-icon="mdi-school" value="two">Pendidikan</v-tab>

        <v-tab prepend-icon="mdi-map-marker-lock" value="three"
          >Lock Lokasi Absensi</v-tab
        >
        <v-tab prepend-icon="mdi-list-status" value="four">Status</v-tab>
      </v-tabs>

      <v-divider></v-divider>

      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="one">
          <v-sheet class="py-5" color="purple">
            <active-users />
          </v-sheet>
        </v-tabs-window-item>
        <v-tabs-window-item value="two">
          <v-sheet class="pa-5" color="orange">Two</v-sheet>
        </v-tabs-window-item>
        <v-tabs-window-item value="three">
          <v-sheet class="pa-5" color="brown">Three</v-sheet>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-sheet>
  </div>
</template>

<script setup lang="ts">
import HeaderEmployee from "@/components/employee/HeaderEmployee.vue";
import ActiveUsers from "@/components/employee/ActiveUsers.vue";
import { ref } from "vue";

const tab = ref("one");
</script>
<style scoped>
/* Memastikan tab yang aktif memiliki teks yang kontras */
.v-tab--selected {
  font-weight: bold !important;
  /* Jika di dark mode warna primary-mu kurang kontras, paksa warnanya di sini */
  color: #615fff !important; /* Contoh warna ungu terang untuk dark mode */
}

/* Mengatur warna slider (garis bawah) agar lebih menyala */
:deep(.v-tabs--density-default) {
  --v-tabs-height: 48px;
}
</style>
