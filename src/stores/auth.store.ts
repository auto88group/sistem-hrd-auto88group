// src/stores/auth.store.ts
import { defineStore } from "pinia";
import { loginService, logoutService } from "@/services/auth.service";
import type { LoginPayload } from "@/types/auth.type";

interface AuthState {
  token: string | null;
  name: string | null;
  email: string | null;
  level: string | null;
  image: string | null;
  id: string | null;

  loading: boolean;
  error: string | null;
  validationErrors: Record<string, string[]>;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    token: null,
    name: null,
    email: null,
    level: null,
    image: null,
    id: null,

    loading: false,
    error: null,
    validationErrors: {},
  }),

  actions: {
    initAuth() {
      this.token = localStorage.getItem("token");
      this.name = localStorage.getItem("name");
      this.id = localStorage.getItem("id");
      this.email = localStorage.getItem("email");
      this.level = localStorage.getItem("level");
      this.image = localStorage.getItem("image");
    },

    async login(payload: LoginPayload) {
      this.loading = true;
      this.error = null;
      this.validationErrors = {};

      try {
        const data = await loginService(payload);

        // ✅ simpan ke state
        this.token = data.token;
        this.name = data.name;
        this.email = data.email;
        this.level = data.level;
        this.image = data.image;
        this.id = data.id;

        // ✅ simpan ke localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.name);
        localStorage.setItem("email", data.email);
        localStorage.setItem("level", data.level);
        localStorage.setItem("image", data.image);
        localStorage.setItem("id", data.id);

        return true;
      } catch (err: any) {
        // 🔥 ambil dari axios interceptor (normalized)
        this.error = err.message;

        if (err.errors) {
          this.validationErrors = err.errors;
        }

        return false;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      this.loading = true;

      try {
        await logoutService();
      } catch (err) {
        // tetap lanjut clear meski API gagal
        console.error("Logout API error:", err);
      } finally {
        // ✅ clear state
        this.token = null;
        this.name = null;
        this.email = null;
        this.level = null;
        this.image = null;
        this.id = null;

        // ✅ clear localStorage
        localStorage.clear();

        this.loading = false;
      }
    },
  },
});
