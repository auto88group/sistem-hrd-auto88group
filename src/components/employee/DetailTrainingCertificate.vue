<template>
  <v-sheet elevation="0">
    <v-tabs
      v-model="subTabPerTrainingCertificate"
      color="primary"
      class="text-sm"
    >
      <v-tab value="verification">Verifikasi</v-tab>
      <v-tab v-if="isHrd" value="submission">Pengajuan</v-tab>
      <v-tab v-if="isHrd" value="history">Histori</v-tab>
    </v-tabs>
    <v-divider></v-divider>
    <v-tabs-window v-model="subTabPerTrainingCertificate">
      <v-tabs-window-item value="verification">
        <preview-training-certificate />
      </v-tabs-window-item>
      <v-tabs-window-item v-if="isHrd" value="submission">
        <preview-pending-training-certificate />
      </v-tabs-window-item>
      <v-tabs-window-item v-if="isHrd" value="history">
        <preview-history-training-certificate />
      </v-tabs-window-item>
    </v-tabs-window>
  </v-sheet>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth.store";
import PreviewTrainingCertificate from "./PreviewTrainingCertificate.vue";
import PreviewPendingTrainingCertificate from "./PreviewPendingTrainingCertificate.vue";
import PreviewHistoryTrainingCertificate from "./PreviewHistoryTrainingCertificate.vue";

const authStore = useAuthStore();

const subTabPerTrainingCertificate = ref("verification");

onMounted(() => {
  if (!authStore.level) authStore.initAuth();
});

const isHrd = computed(() => (authStore.level ?? "").toLowerCase() === "hrd");
</script>
