<template>
  <v-sheet elevation="0">
    <v-tabs v-model="subTabWorkExperience" color="primary" class="text-sm">
      <v-tab value="verification">Verifikasi</v-tab>
      <v-tab v-if="isHrd" value="submission">Pengajuan</v-tab>
      <v-tab v-if="isHrd" value="history">Histori</v-tab>
    </v-tabs>
    <v-divider></v-divider>
    <v-tabs-window v-model="subTabWorkExperience">
      <v-tabs-window-item value="verification">
        <preview-work-experience />
      </v-tabs-window-item>
      <v-tabs-window-item v-if="isHrd" value="submission">
        <preview-pending-work-experience />
      </v-tabs-window-item>
      <v-tabs-window-item v-if="isHrd" value="history">
        <preview-history-work-experience />
      </v-tabs-window-item>
    </v-tabs-window>
  </v-sheet>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth.store";
import PreviewWorkExperience from "./PreviewWorkExperience.vue";
import PreviewPendingWorkExperience from "./PreviewPendingWorkExperience.vue";
import PreviewHistoryWorkExperience from "./PreviewHistoryWorkExperience.vue";

const authStore = useAuthStore();

const subTabWorkExperience = ref("verification");

onMounted(() => {
  if (!authStore.level) authStore.initAuth();
});

const isHrd = computed(() => (authStore.level ?? "").toLowerCase() === "hrd");
</script>
