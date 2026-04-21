<template>
  <v-app>
    <div class="flex flex-col items-start justify-center">
      <v-app-bar
        class="!sticky z-10 top-0 md:!relative"
        :color="theme.global.current.value.dark ? '#1e1e2e' : 'white'"
        elevation="1"
        border="b"
      >
        <template v-slot:prepend>
          <v-app-bar-nav-icon
            v-if="!mdAndUp"
            color="indigo"
            @click="toggleDrawerAndScroll"
          ></v-app-bar-nav-icon>
        </template>

        <v-app-bar-title class="font-weight-bold text-indigo-darken-2"
          >Sistem HRD</v-app-bar-title
        >

        <v-spacer></v-spacer>

        <v-btn
          icon
          @click="toggleTheme"
          class="mr-2"
          :color="
            theme.global.current.value.dark ? 'yellow' : 'indigo-grey-darken-3'
          "
        >
          <v-icon>{{
            theme.global.current.value.dark
              ? "mdi-weather-sunny"
              : "mdi-weather-night"
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
              <v-avatar color="indigo-lighten-4" size="default">
                <v-icon color="indogo">mdi-account</v-icon>
              </v-avatar>
            </v-btn>
          </template>

          <v-card>
            <v-list>
              <v-list-item
                prepend-avatar="https://cdn.vuetifyjs.com/images/john.jpg"
                :title="authStore.name as string"
                :subtitle="authStore.email as string"
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
        <v-sheet border="b" class="flex px-5 bg-indigo-50 dark:bg-zinc-950">
          <v-tabs
            v-model="activeGroup"
            color="indigo-darken-1"
            align-tabs="start"
            density="compact"
            class="min-h-[40px]"
          >
            <v-tab
              v-for="item in menuItems"
              :key="item.value"
              :value="item.value"
              class="!text-sm !capitalize !min-w-0 !px-3"
              selected-class="text-indigo-600 dark:text-indigo-400"
            >
              <template v-slot:prepend>
                <v-icon :icon="item.icon" size="18" class="mr-1" />
              </template>
              {{ item.label }}
            </v-tab>
          </v-tabs>
        </v-sheet>
        <v-sheet
          class="px-5 d-flex justify-center py-2 shadow-sm"
          :color="theme.global.current.value.dark ? '#181825' : 'white'"
        >
          <div v-if="activeGroup === 'dashboard'" class="d-flex flex-wrap">
            <v-btn
              variant="text"
              size="small"
              prepend-icon="mdi-clock-check"
              to="/dashboard/attendance"
              class="btn-nav-custom"
              >Absensi</v-btn
            >
            <v-btn
              variant="text"
              size="small"
              prepend-icon="mdi-account-tie"
              to="/dashboard/personnel"
              class="btn-nav-custom"
              >Kepegawaian</v-btn
            >
          </div>

          <div v-if="activeGroup === 'master'" class="d-flex flex-wrap">
            <v-btn
              variant="text"
              size="small"
              prepend-icon="mdi-map-marker"
              to="/absensi"
              class="btn-nav-custom"
              >Lokasi</v-btn
            >
            <v-btn
              variant="text"
              size="small"
              to="/master/leave-type"
              :active="$route.path.startsWith('/master/leave-type')"
              prepend-icon="mdi-card-account-details"
              class="btn-nav-custom"
              >Jenis Izin</v-btn
            >
            <v-btn
              to="/master/shift"
              :active="$route.path.startsWith('/master/shift')"
              variant="text"
              size="small"
              prepend-icon="mdi-rotate-right"
              class="btn-nav-custom"
              >Shift</v-btn
            >
            <v-btn
              to="/master/employee"
              :active="$route.path.startsWith('/master/employee')"
              variant="text"
              size="small"
              prepend-icon="mdi-account-group"
              class="btn-nav-custom"
              >Karyawan</v-btn
            >
            <v-btn
              to="/master/remaining-leave"
              :active="$route.path.startsWith('/master/remaining-leave')"
              variant="text"
              size="small"
              prepend-icon="mdi-calendar-heart"
              class="btn-nav-custom"
              >Saldo Cuti</v-btn
            >
          </div>

          <div v-if="activeGroup === 'setting'" class="d-flex flex-wrap">
            <v-btn
              to="/absensi"
              variant="text"
              size="small"
              prepend-icon="mdi-shield-account"
              class="btn-nav-custom"
              >Admin</v-btn
            >
            <v-btn
              to="/absensi"
              variant="text"
              size="small"
              prepend-icon="mdi-earth"
              class="btn-nav-custom"
              >Umum</v-btn
            >
            <v-btn
              to="/setting/working-hour"
              :active="$route.path.startsWith('/setting/working-hour')"
              variant="text"
              size="small"
              prepend-icon="mdi-timer-outline"
              class="btn-nav-custom"
              >Jam Kerja</v-btn
            >
            <v-btn
              to="/setting/holiday"
              :active="$route.path.startsWith('/setting/holiday')"
              variant="text"
              size="small"
              prepend-icon="mdi-calendar-remove"
              class="btn-nav-custom"
              >Hari Libur</v-btn
            >
            <v-btn
              to="/absensi"
              variant="text"
              size="small"
              prepend-icon="mdi-account-star"
              class="btn-nav-custom"
              >Kepala Cabang</v-btn
            >
            <v-btn
              to="/absensi"
              variant="text"
              size="small"
              prepend-icon="mdi-briefcase-variant"
              class="btn-nav-custom"
              >Kepala Departemen</v-btn
            >
            <v-btn
              to="/absensi"
              variant="text"
              size="small"
              prepend-icon="mdi-check-decagram"
              class="btn-nav-custom"
              >Approval</v-btn
            >
            <v-btn
              to="/setting/shift-schedule"
              :active="$route.path.startsWith('/setting/shift-schedule')"
              variant="text"
              size="small"
              prepend-icon="mdi-calendar-clock"
              class="btn-nav-custom"
              >Jadwal Shift</v-btn
            >
          </div>

          <div
            v-if="activeGroup === 'manage-attendance'"
            class="d-flex flex-wrap"
          >
            <v-btn
              to="/absensi"
              variant="text"
              size="small"
              prepend-icon="mdi-file-chart"
              class="btn-nav-custom"
              >Laporan Absensi</v-btn
            >
            <v-btn
              to="/absensi"
              variant="text"
              size="small"
              prepend-icon="mdi-file-table"
              class="btn-nav-custom"
              >Rekap Absensi</v-btn
            >
            <v-btn
              to="/absensi"
              variant="text"
              size="small"
              prepend-icon="mdi-file-table"
              class="btn-nav-custom"
              >Pengajuan Lembur</v-btn
            >
            <v-btn
              to="/manage-attendance/leave-request"
              :active="
                $route.path.startsWith('/manage-attendance/leave-request')
              "
              variant="text"
              size="small"
              prepend-icon="mdi-email-outline"
              class="btn-nav-custom"
              >Pengajuan Izin</v-btn
            >
          </div>
        </v-sheet>
      </div>

      <v-navigation-drawer
        v-model="drawer"
        border="r-sm"
        width="280"
        temporary
        app
      >
        <v-list density="compact" nav>
          <v-list-group value="dashboard">
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                :class="{
                  'bg-indigo-50 dark:bg-indigo-100 dark:text-[#695de7]':
                    $route.path.includes('dashboard'),
                }"
              >
                <template v-slot:prepend>
                  <v-icon
                    icon="mdi-view-dashboard"
                    size="25"
                    class="!text-indigo-600 !opacity-100 mr-1"
                  />
                </template>
                Dashboard
              </v-list-item>
            </template>

            <v-list-item
              title="Absensi"
              to="/dashboard/attendance"
              active-class="text-indigo-600 dark:text-indigo-200"
            ></v-list-item>

            <v-list-item
              title="Kepegawaian"
              to="/dashboard/personnel"
              active-class="text-indigo-600 dark:text-indigo-200"
            ></v-list-item>
          </v-list-group>

          <v-list-group value="master">
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                :class="{
                  'bg-indigo-50 dark:bg-indigo-100 dark:text-[#695de7]':
                    $route.path.includes('master'),
                }"
              >
                <template v-slot:prepend>
                  <v-icon
                    icon="mdi-database"
                    size="25"
                    class="!text-indigo-600 !opacity-100 mr-1"
                  />
                </template>
                Master Data</v-list-item
              >
            </template>
            <v-list-item
              title="Lokasi"
              value="lokasi"
              active-class="text-indigo-600 dark:text-indigo-200"
            ></v-list-item>
            <v-list-item
              to="/master/leave-type"
              :active="$route.path.startsWith('/master/leave-type')"
              title="Jenis Izin"
              value="jenis-izin"
              active-class="text-indigo-600 dark:text-indigo-200"
            ></v-list-item>
            <v-list-item
              title="Shift"
              to="/master/shift"
              :active="$route.path.startsWith('/master/shift')"
              value="shift"
              active-class="text-indigo-600 dark:text-indigo-200"
            ></v-list-item>
            <v-list-item
              to="/master/employee"
              :active="$route.path.startsWith('/master/employee')"
              title="Karyawan"
              value="karyawan"
              active-class="text-indigo-600 dark:text-indigo-200"
            ></v-list-item>
            <v-list-item
              to="/master/remaining-leave"
              :active="$route.path.startsWith('/master/remaining-leave')"
              title="Saldo Cuti"
              value="saldo-cuti"
              active-class="text-indigo-600 dark:text-indigo-200"
            ></v-list-item>
          </v-list-group>

          <v-list-group value="setting">
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                :class="{
                  'bg-indigo-50 dark:bg-indigo-100 dark:text-[#695de7]':
                    $route.path.includes('setting'),
                }"
              >
                <template v-slot:prepend>
                  <v-icon
                    icon="mdi-cog"
                    size="25"
                    class="!text-indigo-600 !opacity-100 mr-1"
                  />
                </template>
                Pengaturan</v-list-item
              >
            </template>
            <v-list-item
              title="Admin"
              active-class="text-indigo-600 dark:text-indigo-200"
              value="admin"
            ></v-list-item>
            <v-list-item
              title="Umum"
              active-class="text-indigo-600 dark:text-indigo-200"
              value="umum"
            ></v-list-item>
            <v-list-item
              to="/setting/working-hour"
              :active="$route.path.startsWith('/setting/working-hour')"
              title="Jam Kerja"
              active-class="text-indigo-600 dark:text-indigo-200"
              value="jam-kerja"
            ></v-list-item>
            <v-list-item
              to="/setting/holiday"
              :active="$route.path.startsWith('/setting/holiday')"
              title="Hari Libur"
              active-class="text-indigo-600 dark:text-indigo-200"
              value="hari-libur"
            ></v-list-item>
            <v-list-item
              title="Kepala Cabang"
              active-class="text-indigo-600 dark:text-indigo-200"
              value="kpcab"
            ></v-list-item>
            <v-list-item
              active-class="text-indigo-600 dark:text-indigo-200"
              title="Kepala Departemen"
              value="kep-dept"
            ></v-list-item>
            <v-list-item
              title="Approval"
              active-class="text-indigo-600 dark:text-indigo-200"
              value="approval"
            ></v-list-item>
            <v-list-item
              to="/setting/shift-schedule"
              :active="$route.path.startsWith('/setting/shift-schedule')"
              active-class="text-indigo-600 dark:text-indigo-200"
              title="Jadwal Shift"
              value="jadwal-shift"
            ></v-list-item>
          </v-list-group>

          <v-list-group value="manage-attendance">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props">
                <template v-slot:prepend>
                  <v-icon
                    icon="mdi-calendar-check"
                    size="25"
                    class="!text-indigo-600 !opacity-100 mr-1"
                  />
                </template>
                Kelola Absensi</v-list-item
              >
            </template>
            <v-list-item
              active-class="text-indigo-600"
              title="Laporan Absensi"
              value="laporan-absensi"
            ></v-list-item>
            <v-list-item
              active-class="text-indigo-600"
              title="Rekap Absensi"
              value="rekap-absensi"
            ></v-list-item>
            <v-list-item
              title="Pengajuan Lembur"
              active-class="text-indigo-600"
              value="lembur"
            ></v-list-item>
            <v-list-item
              to="/manage-attendance/leave-request"
              :active="
                $route.path.startsWith('/manage-attendance/leave-request')
              "
              title="Pengajuan Izin"
              active-class="text-indigo-600"
              value="izin"
            ></v-list-item>
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
    <v-fade-transition>
      <v-btn
        v-show="showScrollTop"
        icon="mdi-chevron-up"
        color="bg-indigo-300 dark:bg-indigo-800"
        elevation="4"
        class="fixed"
        style="bottom: 20px; right: 20px; z-index: 99"
        @click="scrollToTop"
      >
      </v-btn>
    </v-fade-transition>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useDisplay, useTheme } from "vuetify";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const theme = useTheme();
const { mdAndUp } = useDisplay();
const drawer = ref(false);
const activeGroup = ref("dashboard");
const showScrollTop = ref(false);

const menuItems = [
  { value: "dashboard", label: "Dashboard", icon: "mdi-view-dashboard" },
  { value: "master", label: "Master Data", icon: "mdi-database" },
  { value: "setting", label: "Pengaturan", icon: "mdi-cog" },
  {
    value: "manage-attendance",
    label: "Kelola Absensi",
    icon: "mdi-calendar-check",
  },
];

const handleScroll = () => {
  // Tombol muncul jika scroll lebih dari 300px
  showScrollTop.value = window.scrollY > 300;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const syncTabWithRoute = () => {
  const currentPath = route.path;
  if (route.path.startsWith("/dashboard")) {
    activeGroup.value = "dashboard";
  } else if (route.path.startsWith("/master")) {
    activeGroup.value = "master";
  } else if (route.path.startsWith("/setting")) {
    activeGroup.value = "setting";
  } else if (route.path.startsWith("/manage-attendance")) {
    activeGroup.value = "manage-attendance";
  }
};
onMounted(() => {
  const savedTheme = localStorage.getItem("user-theme");
  let targetTheme: "light" | "dark";

  if (savedTheme) {
    targetTheme = savedTheme as "light" | "dark";
  } else {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: light)",
    ).matches;
    targetTheme = prefersDark ? "dark" : "light";
  }

  theme.global.name.value = targetTheme;
  window.addEventListener("scroll", handleScroll);
  syncTabWithRoute();
});
watch(
  () => route.path,
  () => {
    syncTabWithRoute();
  },
);

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
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

const handleLogout = async () => {
  await authStore.logout();
  router.push("/login");
};
</script>

<style scoped>
:deep(.v-tabs-slider) {
  color: #2563eb !important; /* indigo-600 Tailwind */
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

.btn-nav-custom.v-btn--active {
  background-color: #e0e7ff !important;
  color: #695de7 !important;
  opacity: 1 !important;
}

/* Mode Gelap */
.v-theme--dark .btn-nav-custom.v-btn--active {
  background-color: rgba(99, 102, 241, 0.2) !important; /* Indigo transparan */
  color: #a5b4fc !important; /* Indigo terang agar terbaca */
}

.v-list-group--open .parent-group {
  background: red;
}

/* Saat group aktif (ada child yang aktif), ubah style activator-nya */
:deep(.v-list-group--active > .v-list-item--activator) {
  background-color: rgba(79, 70, 229, 0.1) !important;
  color: rgb(79, 70, 229) !important;
}

/* Support Dark Mode */
.v-theme--dark :deep(.v-list-group--active > .v-list-item--activator) {
  background-color: rgba(
    165,
    180,
    252,
    0.15
  ) !important; /* indigo soft untuk dark */
  color: #a5b4fc !important;
}
</style>
