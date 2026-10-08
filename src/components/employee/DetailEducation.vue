<template>
  <v-sheet elevation="0">
    <v-tabs v-model="subTabPerEducation" color="primary" class="text-sm">
      <v-tab value="verification">Verifikasi</v-tab>
      <v-tab v-if="isHrd" value="submission">Pengajuan</v-tab>
      <v-tab v-if="isHrd" value="history">Histori</v-tab>
    </v-tabs>
    <v-divider></v-divider>
    <v-tabs-window v-model="subTabPerEducation">
      <v-tabs-window-item value="verification">
        <preview-detail-education />
      </v-tabs-window-item>
      <v-tabs-window-item v-if="isHrd" value="submission">
        <preview-pending-education />
      </v-tabs-window-item>
      <v-tabs-window-item v-if="isHrd" value="history">
        <preview-history-education />
      </v-tabs-window-item>
    </v-tabs-window>
  </v-sheet>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth.store";
import PreviewDetailEducation from "./PreviewDetailEducation.vue";
import PreviewPendingEducation from "./PreviewPendingEducation.vue";
import PreviewHistoryEducation from "./PreviewHistoryEducation.vue";

const authStore = useAuthStore();

const subTabPerEducation = ref("verification");

onMounted(() => {
  if (!authStore.level) authStore.initAuth();
});

const isHrd = computed(() => (authStore.level ?? "").toLowerCase() === "hrd");
</script>
