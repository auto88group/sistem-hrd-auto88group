<template>
  <v-dialog v-model="isVisible" max-width="450" persistent>
    <v-card class="rounded-xl p-2">
      <div class="flex items-center">
        <v-avatar
          :color="options.color"
          variant="tonal"
          size="48"
          class="me-4 text-amber-500"
        >
          <v-icon size="28">mdi-alert-circle-outline</v-icon>
        </v-avatar>
        <div>
          <h3 class="font-bold">{{ options.title }}</h3>
        </div>
      </div>

      <v-card-text class="text-base pt-4">
        {{ options.message }}
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>

        <v-btn
          :text="options.cancelText"
          variant="text"
          class="text-base bg-gray-300 px-4"
          color="grey-darken-1"
          @click="cancel"
        ></v-btn>

        <v-btn
          :color="options.color"
          :text="options.confirmText"
          variant="flat"
          class="bg-amber-400 px-6 transition-all hover:scale-105"
          @click="confirm"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useConfirmDialog } from "@/composables/useConfirmDialog";

const { isVisible, options, confirm, cancel } = useConfirmDialog();
</script>

<style scoped>
/* Menambahkan efek transisi halus saat hover tombol confirm */
.transition-all {
  transition: all 0.2s ease-in-out;
}
</style>
