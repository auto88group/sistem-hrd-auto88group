<template>
  <v-app>
    <div class="flex flex-col items-start justify-center">
      <v-app-bar
        class="!sticky z-10 top-0 md:!relative"
        :color="theme.global.current.value.dark ? undefined : 'white'"
        elevation="1"
        border="b"
      >
        <template v-slot:prepend>
          <v-app-bar-nav-icon
            v-if="!mdAndUp"
            color="blue"
            @click="toggleDrawerAndScroll"
          ></v-app-bar-nav-icon>
        </template>

        <v-app-bar-title class="font-weight-bold text-blue-darken-2"
          >Sistem HRD</v-app-bar-title
        >

        <v-spacer></v-spacer>

        <v-btn
          icon
          @click="toggleTheme"
          class="mr-2"
          :color="
            theme.global.current.value.dark ? 'yellow' : 'blue-grey-darken-3'
          "
        >
          <v-icon>{{
            theme.global.current.value.dark
              ? "mdi-brightness-4"
              : "mdi-brightness-7"
          }}</v-icon>
          <v-tooltip activator="parent" location="bottom">
            {{
              theme.global.current.value.dark
                ? "Aktifkan Mode Terang"
                : "Aktifkan Mode Gelap"
            }}
          </v-tooltip>
        </v-btn>

        <v-menu min-width="200px" rounded>
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" class="mr-2">
              <v-avatar color="blue-lighten-4" size="default">
                <v-icon color="blue">mdi-account</v-icon>
              </v-avatar>
            </v-btn>
          </template>

          <v-card>
            <v-list>
              <v-list-item
                prepend-avatar="https://cdn.vuetifyjs.com/images/john.jpg"
                title="Administrator"
                subtitle="admin@hrd.com"
              >
              </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <v-list density="compact" nav>
              <v-list-item
                prepend-icon="mdi-cog"
                title="Pengaturan"
                value="settings"
              ></v-list-item>
              <v-list-item
                prepend-icon="mdi-logout"
                title="Keluar"
                value="logout"
                color="error"
                @click="handleLogout"
              ></v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </v-app-bar>
      <div v-if="mdAndUp" class="!sticky z-10 top-0 w-full">
        <v-sheet border="b" class="flex px-5 bg-blue-50 dark:bg-zinc-950">
          <v-tabs
            v-model="activeGroup"
            color="blue"
            align-tabs="start"
            density="compact"
            class="min-h-[40px]"
            :slider-color="'blue'"
          >
            <v-tab
              v-for="item in menuItems"
              :key="item.value"
              :value="item.value"
              class="!text-sm !capitalize !min-w-0 !px-3"
            >
              <template v-slot:prepend>
                <v-icon
                  :icon="item.icon"
                  size="18"
                  class="!text-blue-600 !opacity-100 mr-1"
                />
              </template>
              {{ item.label }}
            </v-tab>
          </v-tabs>
        </v-sheet>
        <v-sheet class="px-5 d-flex justify-center py-2 shadow-sm">
          <div v-if="activeGroup === 'dashboard'" class="d-flex flex-wrap">
            <v-btn
              variant="text"
              size="small"
              prepend-icon="mdi-clock-check"
              to="/absensi"
              >Absensi</v-btn
            >
            <v-btn
              variant="text"
              size="small"
              prepend-icon="mdi-account-tie"
              to="/kepegawaian"
              >Kepegawaian</v-btn
            >
          </div>

          <div v-if="activeGroup === 'master'" class="d-flex flex-wrap">
            <v-btn
              variant="text"
              size="small"
              prepend-icon="mdi-map-marker"
              to="/absensi"
              >Lokasi</v-btn
            >
            <v-btn
              variant="text"
              size="small"
              to="/absensi"
              prepend-icon="mdi-card-account-details"
              >Jenis Izin</v-btn
            >
            <v-btn
              to="/absensi"
              variant="text"
              size="small"
              prepend-icon="mdi-rotate-right"
              >Shift</v-btn
            >
            <v-btn
              to="/absensi"
              variant="text"
              size="small"
              prepend-icon="mdi-account-group"
              >Karyawan</v-btn
            >
            <v-btn
              to="/absensi"
              variant="text"
              size="small"
              prepend-icon="mdi-calendar-heart"
              >Saldo Cuti</v-btn
            >
          </div>

          <div v-if="activeGroup === 'pengaturan'" class="d-flex flex-wrap">
            <v-btn
              to="/absensi"
              variant="text"
              size="small"
              prepend-icon="mdi-shield-account"
              >Admin</v-btn
            >
            <v-btn
              to="/absensi"
              variant="text"
              size="small"
              prepend-icon="mdi-earth"
              >Umum</v-btn
            >
            <v-btn
              to="/absensi"
              variant="text"
              size="small"
              prepend-icon="mdi-timer-outline"
              >Jam Kerja</v-btn
            >
            <v-btn
              to="/absensi"
              variant="text"
              size="small"
              prepend-icon="mdi-calendar-remove"
              >Hari Libur</v-btn
            >
            <v-btn
              to="/absensi"
              variant="text"
              size="small"
              prepend-icon="mdi-account-star"
              >Kepala Cabang</v-btn
            >
            <v-btn
              to="/absensi"
              variant="text"
              size="small"
              prepend-icon="mdi-briefcase-variant"
              >Kepala Departemen</v-btn
            >
            <v-btn
              to="/absensi"
              variant="text"
              size="small"
              prepend-icon="mdi-check-decagram"
              >Approval</v-btn
            >
            <v-btn
              to="/absensi"
              variant="text"
              size="small"
              prepend-icon="mdi-calendar-clock"
              >Jadwal Shift</v-btn
            >
          </div>

          <div v-if="activeGroup === 'kelola'" class="d-flex flex-wrap">
            <v-btn
              to="/absensi"
              variant="text"
              size="small"
              prepend-icon="mdi-file-chart"
              >Laporan Absensi</v-btn
            >
            <v-btn
              to="/absensi"
              variant="text"
              size="small"
              prepend-icon="mdi-file-table"
              >Rekap Absensi</v-btn
            >
            <v-btn
              to="/absensi"
              variant="text"
              size="small"
              prepend-icon="mdi-file-table"
              >Pengajuan Lembur</v-btn
            >
            <v-btn
              to="/absensi"
              variant="text"
              size="small"
              prepend-icon="mdi-email-outline"
              >Pengajuan Izin</v-btn
            >
          </div>
        </v-sheet>
      </div>

      <v-navigation-drawer
        v-model="drawer"
        :color="theme.global.current.value.dark ? undefined : 'white'"
        border="r-sm"
        width="280"
        temporary
        app
      >
        <v-list density="compact" nav>
          <v-list-group value="dashboard">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props">
                <template v-slot:prepend>
                  <v-icon
                    icon="mdi-view-dashboard"
                    size="25"
                    class="!text-blue-600 !opacity-100 mr-1"
                  />
                </template>
                Dashboard</v-list-item
              >
            </template>
            <v-list-item title="Absensi" value="absensi"></v-list-item>
            <v-list-item title="Kepegawaian" value="kepegawaian"></v-list-item>
          </v-list-group>

          <v-list-group value="master">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props">
                <template v-slot:prepend>
                  <v-icon
                    icon="mdi-database"
                    size="25"
                    class="!text-blue-600 !opacity-100 mr-1"
                  />
                </template>
                Master Data</v-list-item
              >
            </template>
            <v-list-item title="Lokasi" value="lokasi"></v-list-item>
            <v-list-item title="Jenis Izin" value="jenis-izin"></v-list-item>
            <v-list-item title="Shift" value="shift"></v-list-item>
            <v-list-item title="Karyawan" value="karyawan"></v-list-item>
            <v-list-item title="Saldo Cuti" value="saldo-cuti"></v-list-item>
          </v-list-group>

          <v-list-group value="pengaturan">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props">
                <template v-slot:prepend>
                  <v-icon
                    icon="mdi-cog"
                    size="25"
                    class="!text-blue-600 !opacity-100 mr-1"
                  />
                </template>
                Pengaturan</v-list-item
              >
            </template>
            <v-list-item title="Admin" value="admin"></v-list-item>
            <v-list-item title="Umum" value="umum"></v-list-item>
            <v-list-item title="Jam Kerja" value="jam-kerja"></v-list-item>
            <v-list-item title="Hari Libur" value="hari-libur"></v-list-item>
            <v-list-item title="Kepala Cabang" value="kpcab"></v-list-item>
            <v-list-item
              title="Kepala Departemen"
              value="kep-dept"
            ></v-list-item>
            <v-list-item title="Approval" value="approval"></v-list-item>
            <v-list-item
              title="Jadwal Shift"
              value="jadwal-shift"
            ></v-list-item>
          </v-list-group>

          <v-list-group value="kelola-absensi">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props">
                <template v-slot:prepend>
                  <v-icon
                    icon="mdi-calendar-check"
                    size="25"
                    class="!text-blue-600 !opacity-100 mr-1"
                  />
                </template>
                Kelola Absensi</v-list-item
              >
            </template>
            <v-list-item
              title="Laporan Absensi"
              value="laporan-absensi"
            ></v-list-item>
            <v-list-item
              title="Rekap Absensi"
              value="rekap-absensi"
            ></v-list-item>
            <v-list-item title="Pengajuan Lembur" value="lembur"></v-list-item>
            <v-list-item title="Pengajuan Izin" value="izin"></v-list-item>
          </v-list-group>
        </v-list>
      </v-navigation-drawer>

      <v-main
        :class="theme.global.current.value.dark ? '' : 'bg-grey-lighten-4'"
        class="w-full bg-[#F6F8FA] dark:bg-[#0000]"
      >
        <v-container fluid>
          <router-view></router-view>
        </v-container>
      </v-main>
    </div>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useDisplay, useTheme } from "vuetify";

const theme = useTheme();
const { mdAndUp } = useDisplay();
const drawer = ref(false);
const activeGroup = ref("dashboard");

const menuItems = [
  { value: "dashboard", label: "Dashboard", icon: "mdi-view-dashboard" },
  { value: "master", label: "Master Data", icon: "mdi-database" },
  { value: "pengaturan", label: "Pengaturan", icon: "mdi-cog" },
  { value: "kelola", label: "Kelola Absensi", icon: "mdi-calendar-check" },
];

onMounted(() => {
  const savedTheme = localStorage.getItem("user-theme");
  let targetTheme: "light" | "dark";

  if (savedTheme) {
    targetTheme = savedTheme as "light" | "dark";
  } else {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    targetTheme = prefersDark ? "dark" : "light";
  }

  theme.global.name.value = targetTheme;
});

const toggleTheme = () => {
  const newTheme = theme.global.current.value.dark ? "light" : "dark";
  if (typeof (theme as any).change === "function") {
    (theme as any).change(newTheme);
  } else {
    theme.global.name.value = newTheme;
  }
  localStorage.setItem("user-theme", newTheme);
};

const toggleDrawerAndScroll = () => {
  drawer.value = !drawer.value;
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const handleLogout = () => {
  console.log("Logging out...");
};
</script>

<style scoped>
:deep(.v-tabs-slider) {
  color: #2563eb !important; /* Blue-600 Tailwind */
  height: 3px !important; /* Opsional: mempertebal garis agar lebih kelihatan */
}

/* Mengubah warna teks saat tab aktif agar ikut biru */
:deep(.v-tab--selected) {
  color: #2563eb !important;
}

/* Memastikan main content punya padding yang cukup */
:deep(.v-main) {
  --v-layout-top: 0px !important; /* Kita handle manual posisinya */
}
</style>
