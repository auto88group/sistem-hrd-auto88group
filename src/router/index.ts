import AdminLayout from "@/layouts/AdminLayout.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: AdminLayout, // Layout membungkus rute di bawahnya
      children: [
        {
          path: "/dashboard",
          redirect: "/dashboard/attendance",
        },
        {
          path: "/dashboard/personnel", // Diakses via /dashboard
          name: "Dashboard Kepegawaian",
          component: () => import("@/pages/dashboard/personnel.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "/dashboard/attendance", // Diakses via /dashboard
          name: "Dashboard Absensi",
          component: () => import("@/pages/dashboard/attendance.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "/dashboard/contract-end", // Diakses via /dashboard
          name: "Daftar Kontrak Akan Berakhir",
          component: () => import("@/pages/user-contract-end/index.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "/master",
          redirect: "/master/employee",
        },
        {
          path: "/master/employee",
          name: "Master Karyawan",
          component: () => import("@/pages/master/employee/index.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "/master/employee/create",
          name: "Tambah Karyawan",
          component: () => import("@/pages/master/employee/detail.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "/master/employee/detail/:id",
          name: "Master Detail Karyawan",
          component: () => import("@/pages/master/employee/detail.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "/master/leave-type",
          name: "Jenis Izin",
          component: () => import("@/pages/master/leave-type/index.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "/master/shift",
          name: "Shift",
          component: () => import("@/pages/master/shift/index.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "/master/remaining-leave",
          name: "Saldo Cuti",
          component: () => import("@/pages/master/remaining-leave/index.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "/master/remaining-leave/:id/detail",
          name: "Detail Cuti",
          component: () => import("@/pages/master/remaining-leave/detail.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "/setting",
          redirect: "/setting/working-hour",
        },
        {
          path: "/setting/working-hour",
          name: "Jam Kerja",
          component: () => import("@/pages/setting/working-hour/index.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "/setting/holiday",
          name: "Hari Libur",
          component: () => import("@/pages/setting/holiday/index.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "/setting/shift-schedule",
          name: "Penjadwalan Shift",
          component: () => import("@/pages/setting/shift-schedule/index.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "/manage-attendance/leave-request",
          name: "Pengajuan Izin",
          component: () =>
            import("@/pages/manage-attendance/leave-request/index.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "/manage-attendance/overtime-request",
          name: "Pengajuan Lembur",
          component: () =>
            import("@/pages/manage-attendance/overtime-request/index.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "/manage-attendance/attendance-report",
          name: "Laporan Absensi",
          component: () =>
            import("@/pages/manage-attendance/attendance-report/index.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "/manage-attendance/attendance-recap",
          name: "Rekap Absensi",
          component: () =>
            import("@/pages/manage-attendance/attendance-recap/index.vue"),
          meta: { requiresAuth: true },
        },
      ],
    },
    {
      path: "/login",
      component: import("@/pages/login.vue"),
    },
  ],
});

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  if (to.path === "/") {
    // Redirect dari root berdasarkan status login
    return isAuthenticated ? next("/dashboard/attendance") : next("/login");
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Akses halaman protected tanpa token → ke login
    return next("/login");
  }

  if (to.path === "/login" && isAuthenticated) {
    // Sudah login tapi mau ke login → redirect ke dashboard
    return next("/dashboard/attendance");
  }

  next();
});

export default router;
