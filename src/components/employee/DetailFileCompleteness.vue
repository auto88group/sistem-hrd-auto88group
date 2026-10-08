<template>
  <v-sheet elevation="0">
    <v-tabs v-model="subTabPerFileCompleteness" color="primary" class="text-sm">
      <v-tab value="verification">Verifikasi</v-tab>
      <v-tab v-if="isHrd" value="submission">Pengajuan</v-tab>
      <v-tab v-if="isHrd" value="history">Histori</v-tab>
    </v-tabs>
    <v-divider></v-divider>
    <v-tabs-window v-model="subTabPerFileCompleteness">
      <v-tabs-window-item value="verification">
        <preview-file-completeness />
      </v-tabs-window-item>
      <v-tabs-window-item v-if="isHrd" value="submission">
        <preview-pending-file-completeness />
      </v-tabs-window-item>
      <v-tabs-window-item v-if="isHrd" value="history">
        <preview-history-file-completeness />
      </v-tabs-window-item>
    </v-tabs-window>
  </v-sheet>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth.store";
import PreviewFileCompleteness from "./PreviewFileCompleteness.vue";
import PreviewPendingFileCompleteness from "./PreviewPendingFileCompleteness.vue";
import PreviewHistoryFileCompleteness from "./PreviewHistoryFileCompleteness.vue";

const authStore = useAuthStore();

const subTabPerFileCompleteness = ref("verification");

onMounted(() => {
  if (!authStore.level) authStore.initAuth();
});

const isHrd = computed(() => (authStore.level ?? "").toLowerCase() === "hrd");
</script>
