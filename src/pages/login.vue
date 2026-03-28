<template>
  <div
    class="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <v-card elevation="10" rounded="xl" class="overflow-hidden border-0">
        <div class="bg-primary py-8 text-center text-white">
          <v-icon icon="mdi-shield-lock" size="48" class="mb-2"></v-icon>
          <h2 class="text-3xl font-extrabold tracking-tight">Selamat Datang</h2>
          <p class="mt-2 text-sm opacity-80">Silakan masuk ke akun Anda</p>
        </div>

        <v-card-text class="pa-8 sm:pa-10">
          <div v-if="authStore.error" class="mb-4 text-sm text-red-500">
            {{ authStore.error }}
          </div>
          <v-form @submit.prevent="handleLogin" ref="form">
            <div class="mb-6">
              <label class="block text-sm font-semibold text-slate-500 mb-2"
                >Alamat Email</label
              >
              <v-text-field
                v-model="email"
                placeholder="nama@email.com"
                prepend-inner-icon="mdi-email-outline"
                variant="outlined"
                color="primary"
                density="comfortable"
                rounded="lg"
                :rules="emailRules"
                :error-messages="authStore.validationErrors.email"
                hide-details="auto"
              ></v-text-field>
            </div>

            <div class="mb-2">
              <div class="flex items-center justify-between mb-2">
                <label class="block text-sm font-semibold text-slate-500"
                  >Kata Sandi</label
                >
              </div>
              <v-text-field
                v-model="password"
                placeholder="••••••••"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visible ? 'text' : 'password'"
                variant="outlined"
                color="primary"
                density="comfortable"
                rounded="lg"
                :rules="passwordRules"
                @click:append-inner="visible = !visible"
                hide-details="auto"
                :error-messages="authStore.validationErrors.password"
              ></v-text-field>
            </div>

            <v-btn
              type="submit"
              color="primary"
              size="x-large"
              block
              flat
              rounded="lg"
              class="mt-8 text-none font-weight-bold"
              height="54"
              :loading="authStore.loading"
            >
              Masuk Sekarang
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>

      <p class="text-center text-xs text-slate-400 mt-4">
        &copy; 2026 HRD AUTO88GROUP
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

const router = useRouter();
const authStore = useAuthStore();

const form = ref();
const email = ref<string>("");
const password = ref<string>("");
const visible = ref(false);

// ✅ Rules tetap
const emailRules = [
  (v: string) => !!v || "Email wajib diisi",
  (v: string) => /.+@.+\..+/.test(v) || "Format email salah",
];

const passwordRules = [
  (v: string) => !!v || "Password wajib diisi",
  (v: string) => v.length >= 6 || "Minimal 6 karakter",
];

watch([email, password], () => {
  authStore.error = null;
  authStore.validationErrors = {};
});

// ✅ Handle login (clean)
const handleLogin = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  const success = await authStore.login({
    email: email.value,
    password: password.value,
  });

  if (success) {
    router.push("/");
  }
};
</script>
<style scoped>
/* Menghilangkan padding bawaan v-container jika masih ada */
:deep(.v-card-text) {
  line-height: 1.5;
}
</style>
