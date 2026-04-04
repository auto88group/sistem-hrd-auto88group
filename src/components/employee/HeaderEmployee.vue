<template>
  <v-card
    class="p-3 rounded-lg shadow-md space-y-3 md:space-y-0 md:flex w-full items-center justify-between"
  >
    <div>
      <p class="text-lg font-bold m-0 text-indigo-500">Karyawan</p>
      <v-breadcrumbs
        :items="items"
        class="m-0 p-0 text-gray-500 dark:text-gray-300 text-sm"
      ></v-breadcrumbs>
    </div>
    <div
      v-if="isVisible('index')"
      class="space-y-1 space-x-1 md:space-y-1 md:space-x-1 md:flex gap-2 justify-start"
    >
      <v-btn
        prepend-icon="mdi-family-tree"
        variant="flat"
        class="bg-amber-300 dark:bg-amber-500 text-sm"
        >Bagan Organisasi</v-btn
      >
      <v-btn
        prepend-icon="mdi-file-import"
        variant="flat"
        class="bg-teal-500 dark:bg-teal-500 text-sm text-white"
        >Import Data Karyawan</v-btn
      >
      <v-btn
        prepend-icon="mdi-plus"
        variant="flat"
        class="bg-sky-500 dark:bg-sky-500 text-sm text-white"
        >Tambah Data</v-btn
      >
    </div>
    <div v-if="isVisible('back')">
      <v-btn
        @click="handleBack"
        prepend-icon="mdi-keyboard-backspace"
        variant="flat"
        class="bg-gray-500 dark:bg-gray-500 text-sm text-white"
        >Kembali</v-btn
      >
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user.store";
import { useRouter } from "vue-router";
const router = useRouter();
const userStore = useUserStore();

const items = [
  { title: "Master", disabled: false, href: "/master" },
  { title: "Karyawan", disabled: true, href: "/master/karyawan" },
];
const props = defineProps({
  hideFields: {
    type: Array,
    default: () => [], // Defaultnya tidak ada yang disembunyikan
  },
});
const isVisible = (fieldName: string) => !props.hideFields.includes(fieldName);
const handleBack = () => {
  userStore.usersSelected = null;
  router.push("/master/employee");
};
</script>

<style scoped>
:deep(.v-breadcrumbs-item--disabled) {
  color: #615fff !important;
  opacity: 1;
}
:deep(.v-breadcrumbs-item) {
  padding: 0;
}
</style>
