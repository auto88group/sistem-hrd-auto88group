<template>
  <v-card
    class="w-full !rounded-[24px] !p-3 border border-slate-100 dark:border-slate-900 transition-all duration-300 hover:shadow-xl shadow-md"
    variant="flat"
  >
    <div class="flex items-center justify-between">
      <h2 class="text-md tracking-tight">
        <span class="font-bold text-slate-800 dark:text-slate-200"
          >Kontrak yang Akan Berakhir</span
        >
        <v-chip class="ms-3 bg-blue-50 dark:bg-blue-900 font-bold">
          {{ filteredEmployees.length }}
        </v-chip>
      </h2>
      <button
        @click="showFilter = !showFilter"
        :class="
          showFilter
            ? 'bg-indigo-600 text-white'
            : 'bg-indigo-50 text-indigo-600'
        "
        class="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
      >
        <v-icon size="18">{{
          showFilter ? "mdi-close" : "mdi-filter-variant"
        }}</v-icon>
        Filter
      </button>
    </div>

    <v-expand-transition>
      <div v-if="showFilter" class="mb-4 px-1">
        <v-select
          v-model="selectedFilter"
          :items="filterOptions"
          label="Pilih Cabang"
          variant="outlined"
          density="compact"
          class="mt-2"
          hide-details
          rounded="xl"
        ></v-select>
      </div>
    </v-expand-transition>
    <div
      class="overflow-scroll h-[400px] md:h-[400px] custom-scrollbar space-y-3 pb-20"
    >
      <div
        v-for="employee in filteredEmployees"
        :key="employee.id"
        class="p-4 shadow-md rounded-[20px] border border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 transition-colors group"
      >
        <div class="flex items-start justify-between mb-2">
          <div class="flex gap-3">
            <div
              class="bg-white dark:bg-slate-700 p-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-600"
            >
              <v-icon color="indigo">mdi-account-clock-outline</v-icon>
            </div>
            <div>
              <div
                class="font-bold text-slate-800 dark:text-white leading-tight"
              >
                {{ employee.name }}
              </div>
              <div class="text-xs text-slate-500">{{ employee.email }}</div>
            </div>
          </div>
          <v-btn
            variant="tonal"
            size="small"
            rounded="pill"
            class="text-none"
            color="indigo"
          >
            Detail
          </v-btn>
        </div>

        <div class="mb-3">
          <span
            class="px-3 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[11px] font-bold rounded-full border border-red-100 dark:border-red-800"
          >
            Kontrak {{ employee.daysLeft }} Hari Lagi
          </span>
        </div>

        <div class="flex items-center gap-4 text-xs">
          <div class="flex items-center gap-1">
            <span class="text-green-600 font-medium">Mulai:</span>
            <span class="text-slate-900 dark:text-slate-300">{{
              employee.startDate
            }}</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="text-red-500 font-medium">Berakhir:</span>
            <span class="text-slate-900 dark:text-slate-300">{{
              employee.endDate
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <div
      class="border-t border-slate-100 dark:border-slate-800 backdrop-blur-md rounded-b-[24px]"
    >
      <v-btn
        block
        color="#6962e9"
        variant="flat"
        rounded="xl"
        size="large"
        class="text-none cursor-pointer !text-white font-bold"
      >
        Lihat Semua Detail
        <v-icon end>mdi-arrow-right</v-icon>
      </v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const showFilter = ref(false);
const selectedFilter = ref("Semua Cabang");
const filterOptions = [
  "Semua Cabang",
  "Autoplaza 88 (Pontianak)",
  "Auto 88 Kuburaya",
  "Auto 88 Sintang",
];
// Generate 50 dummy data
const employees = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Karyawan Ke-${i + 1}`,
  email: `user${i + 1}@auto88.co.id`,
  branch:
    filterOptions[Math.floor(Math.random() * (filterOptions.length - 1)) + 1],
  startDate: "29-06-2020",
  endDate: "31-03-2026",
  daysLeft: Math.floor(Math.random() * 10) + 1,
}));

const filteredEmployees = computed(() => {
  if (selectedFilter.value === "Semua Cabang") return employees;
  return employees.filter((emp) => emp.branch === selectedFilter.value);
});
</script>

<style scoped>
/* Opsional: Membuat scrollbar lebih rapi */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1e293b;
}
</style>
