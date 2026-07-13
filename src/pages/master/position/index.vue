<template>
  <div class="space-y-5">
    <confirm-dialog />

    <!-- ───── Snackbar Error ───── -->
    <v-snackbar
      v-model="appStore.showErrorSnackbar"
      color="bg-red-500"
      elevation="24"
      location="top"
      timeout="4000"
      rounded="lg"
    >
      <div class="d-flex align-center">
        <v-icon icon="mdi-alert-circle" class="me-3"></v-icon>
        <span class="font-weight-medium">{{ appStore.errorMessage }}</span>
      </div>
      <template v-slot:actions>
        <v-btn
          variant="text"
          icon="mdi-close"
          @click="appStore.showErrorSnackbar = false"
        ></v-btn>
      </template>
    </v-snackbar>

    <!-- ───── Snackbar Success ───── -->
    <v-snackbar
      v-model="appStore.showSuccessSnackbar"
      color="bg-green-500"
      elevation="24"
      location="top"
      timeout="4000"
      rounded="lg"
    >
      <div class="d-flex align-center">
        <v-icon icon="mdi-check-circle" class="me-3"></v-icon>
        <span class="font-weight-medium">{{ appStore.successMessage }}</span>
      </div>
      <template v-slot:actions>
        <v-btn
          variant="text"
          icon="mdi-close"
          @click="appStore.showSuccessSnackbar = false"
        ></v-btn>
      </template>
    </v-snackbar>

    <header-master-position @add="handleAdd" />
    <table-master-position @edit="handleEdit" :ask="ask" />
    <form-dialog-master-position ref="formDialogRef" />
  </div>
</template>
<script setup lang="ts">
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import FormDialogMasterPosition from "@/components/master-position/FormDialogMasterPosition.vue";
import HeaderMasterPosition from "@/components/master-position/HeaderMasterPosition.vue";
import TableMasterPosition from "@/components/master-position/TableMasterPosition.vue";
import HeaderShift from "@/components/shift/HeaderShift.vue";

import { useConfirmDialog } from "@/composables/useConfirmDialog";
import { useAppStore } from "@/stores/app";

import { ref } from "vue";

const { ask } = useConfirmDialog();
const appStore = useAppStore();
const formDialogRef = ref();

function handleAdd() {
  formDialogRef.value.openAddDialog();
}
function handleEdit(item: any) {
  formDialogRef.value.openEditDialog(item);
}
</script>
