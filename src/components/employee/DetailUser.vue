<template>
  <v-sheet elevation="0">
    <v-tabs v-model="subTabPersonal" color="primary" class="text-sm">
      <v-tab value="verification">Verifikasi</v-tab>
      <v-tab value="submission">Pengajuan</v-tab>
      <v-tab value="history">Histori</v-tab>
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
      <v-tabs-window-item value="submission">
        <v-sheet class="pa-5" color="orange">No Data</v-sheet>
      </v-tabs-window-item>
      <v-tabs-window-item value="history">
        <v-sheet class="pa-5" color="brown">No Data</v-sheet>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-sheet>
</template>
<script setup lang="ts">
import { ref } from "vue";
import PreviewDetailUser from "./PreviewDetailUser.vue";
import EditDetailUser from "./EditDetailUser.vue";
const subTabPersonal = ref("verification");
const isEditing = ref(false);
</script>
