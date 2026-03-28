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
          path: "", // Diakses via /dashboard
          name: "Dashboard",
          component: () => import("@/pages/index.vue"),
        },

        // Tambahkan halaman lain di sini
      ],
    },
    {
      path: "/login",
      component: import("@/pages/login.vue"),
    },
  ],
});

export default router;
