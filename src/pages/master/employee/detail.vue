<template>
  <div class="space-y-5">
    <header-employee :hide-fields="['index']" />
    <v-card elevation="1" class="p-3 rounded-lg shadow-md w-full">
      <div class="md:flex w-full">
        <v-tabs
          v-model="tab"
          color="primary"
          direction="vertical"
          class="text-sm border-r-1 border-gray-200 dark:border-gray-600"
        >
          <v-tab text="Data Diri" value="detail-user"></v-tab>
          <v-tab text="Data Keluarga" value="family"></v-tab>
          <v-tab text="Data Pendidikan" value="education"></v-tab>
          <v-tab text="Data Pengalaman Kerja" value="work-experience"></v-tab>
          <v-tab text="Data Karir Pekerjaan" value="career-job"></v-tab>
          <v-tab
            text="Sertifikat/Pelatihan"
            value="training-certificate"
          ></v-tab>
          <v-tab text="Akses Akun" value="account-access"></v-tab>
          <v-tab text="Kelengkapan File" value="completement-file"></v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab" class="w-full">
          <v-tabs-window-item value="detail-user" class="w-full">
            <detail-user />
          </v-tabs-window-item>

          <v-tabs-window-item value="family">
            <detail-family />
          </v-tabs-window-item>

          <v-tabs-window-item value="education">
            <detail-education />
          </v-tabs-window-item>

          <v-tabs-window-item value="work-experience">
            <detail-work-experience />
          </v-tabs-window-item>
        </v-tabs-window>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import DetailFamily from "@/components/employee/DetailFamily.vue";
import DetailEducation from "@/components/employee/DetailEducation.vue";
import DetailUser from "@/components/employee/DetailUser.vue";
import HeaderEmployee from "@/components/employee/HeaderEmployee.vue";
import { ref } from "vue";
import DetailWorkExperience from "@/components/employee/DetailWorkExperience.vue";
const tab = ref("personal");
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
