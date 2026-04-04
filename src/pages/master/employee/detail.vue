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
            <v-card flat>
              <v-card-text>
                <p>
                  Morbi nec metus. Suspendisse faucibus, nunc et pellentesque
                  egestas, lacus ante convallis tellus, vitae iaculis lacus elit
                  id tortor. Sed mollis, eros et ultrices tempus, mauris ipsum
                  aliquam libero, non adipiscing dolor urna a orci. Curabitur
                  ligula sapien, tincidunt non, euismod vitae, posuere
                  imperdiet, leo. Nunc sed turpis.
                </p>

                <p>
                  Suspendisse feugiat. Suspendisse faucibus, nunc et
                  pellentesque egestas, lacus ante convallis tellus, vitae
                  iaculis lacus elit id tortor. Proin viverra, ligula sit amet
                  ultrices semper, ligula arcu tristique sapien, a accumsan nisi
                  mauris ac eros. In hac habitasse platea dictumst. Fusce ac
                  felis sit amet ligula pharetra condimentum.
                </p>

                <p>
                  Sed consequat, leo eget bibendum sodales, augue velit cursus
                  nunc, quis gravida magna mi a libero. Nam commodo suscipit
                  quam. In consectetuer turpis ut velit. Sed cursus turpis vitae
                  tortor. Aliquam eu nunc.
                </p>

                <p>
                  Etiam ut purus mattis mauris sodales aliquam. Ut varius
                  tincidunt libero. Aenean viverra rhoncus pede. Duis leo. Fusce
                  fermentum odio nec arcu.
                </p>

                <p class="mb-0">
                  Donec venenatis vulputate lorem. Aenean viverra rhoncus pede.
                  In dui magna, posuere eget, vestibulum et, tempor auctor,
                  justo. Fusce commodo aliquam arcu. Suspendisse enim turpis,
                  dictum sed, iaculis a, condimentum nec, nisi.
                </p>
              </v-card-text>
            </v-card>
          </v-tabs-window-item>

          <v-tabs-window-item value="education">
            <v-card flat>
              <v-card-text>
                <p>
                  Fusce a quam. Phasellus nec sem in justo pellentesque
                  facilisis. Nam eget dui. Proin viverra, ligula sit amet
                  ultrices semper, ligula arcu tristique sapien, a accumsan nisi
                  mauris ac eros. In dui magna, posuere eget, vestibulum et,
                  tempor auctor, justo.
                </p>

                <p class="mb-0">
                  Cras sagittis. Phasellus nec sem in justo pellentesque
                  facilisis. Proin sapien ipsum, porta a, auctor quis, euismod
                  ut, mi. Donec quam felis, ultricies nec, pellentesque eu,
                  pretium quis, sem. Nam at tortor in tellus interdum sagittis.
                </p>
              </v-card-text>
            </v-card>
          </v-tabs-window-item>
        </v-tabs-window>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import DetailUser from "@/components/employee/DetailUser.vue";
import HeaderEmployee from "@/components/employee/HeaderEmployee.vue";
import { ref } from "vue";
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
