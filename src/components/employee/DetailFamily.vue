<template>
  <v-sheet elevation="0">
    <v-tabs v-model="subTabFamily" color="primary" class="text-sm">
      <v-tab value="verification">Verifikasi</v-tab>
      <v-tab v-if="isHrd" value="pending">Pengajuan</v-tab>
      <v-tab v-if="isHrd" value="history">Histori</v-tab>
    </v-tabs>
    <v-divider></v-divider>
    <v-tabs-window v-model="subTabFamily">
      <v-tabs-window-item value="verification">
        <preview-detail-family />
      </v-tabs-window-item>
      <v-tabs-window-item v-if="isHrd" value="pending">
        <preview-pending-family />
      </v-tabs-window-item>
      <v-tabs-window-item v-if="isHrd" value="history">
        <preview-history-family />
      </v-tabs-window-item>
    </v-tabs-window>
  </v-sheet>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth.store";
import PreviewDetailFamily from "./PreviewDetailFamily.vue";
import PreviewPendingFamily from "./PreviewPendingFamily.vue";
import PreviewHistoryFamily from "./PreviewHistoryFamily.vue";

const authStore = useAuthStore();

const subTabFamily = ref("verification");

onMounted(() => {
  if (!authStore.level) authStore.initAuth();
});

const isHrd = computed(() => (authStore.level ?? "").toLowerCase() === "hrd");
</script>
