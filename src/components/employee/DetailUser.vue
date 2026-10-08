<template>
  <v-sheet elevation="0">
    <v-tabs v-model="subTabPersonal" color="primary" class="text-sm">
      <v-tab value="verification">Verifikasi</v-tab>
      <v-tab v-if="isHrd" value="submission">Pengajuan</v-tab>
      <v-tab v-if="isHrd" value="history">Histori</v-tab>
    </v-tabs>
    <v-divider></v-divider>
    <v-tabs-window v-model="subTabPersonal">
      <v-tabs-window-item value="verification">
        <preview-detail-user v-if="!isEditing" @edit="isEditing = true" />
        <edit-detail-user
          v-else
          @cancel="isEditing = false"
          @saved="isEditing = false"
        />
      </v-tabs-window-item>
      <v-tabs-window-item v-if="isHrd" value="submission">
        <preview-pending-user />
      </v-tabs-window-item>
      <v-tabs-window-item v-if="isHrd" value="history">
        <preview-history-user />
      </v-tabs-window-item>
    </v-tabs-window>
  </v-sheet>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth.store";
import PreviewDetailUser from "./PreviewDetailUser.vue";
import EditDetailUser from "./EditDetailUser.vue";
import PreviewPendingUser from "./PreviewPendingUser.vue";
import PreviewHistoryUser from "./PreviewHistoryUser.vue";

const authStore = useAuthStore();

const subTabPersonal = ref("verification");
const isEditing = ref(false);

// pastikan state terisi dari localStorage (misal setelah refresh halaman)
onMounted(() => {
  if (!authStore.level) authStore.initAuth();
});

const isHrd = computed(() => (authStore.level ?? "").toLowerCase() === "hrd");
</script>
