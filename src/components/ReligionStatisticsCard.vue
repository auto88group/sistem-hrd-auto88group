<template>
  <v-card
    class="w-full !rounded-[24px] !p-3 border border-slate-100 dark:border-slate-900 transition-all duration-300 hover:shadow-xl shadow-md"
    variant="flat"
  >
    <div class="flex items-center justify-between">
      <div class="flex flex-col">
        <h2
          class="text-md font-bold text-slate-800 dark:text-slate-200 tracking-tight"
        >
          Agama
        </h2>
      </div>
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
          label="Pilih Lokasi Utama"
          variant="outlined"
          density="compact"
          class="mt-2"
          hide-details
          rounded="xl"
        ></v-select>
      </div>
    </v-expand-transition>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="(item, index) in dataAgama" :key="index" class="flex gap-4">
        <div
          :class="`mt-4 flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${item.bgColor}`"
        >
          <v-icon :color="item.iconColor" size="24">{{ item.icon }}</v-icon>
        </div>

        <div class="flex-grow">
          <div class="flex items-baseline justify-between">
            <h3 class="text-lg font-black text-slate-900 dark:text-slate-200">
              <span v-if="item.percentage !== null"
                >{{ item.percentage }}%</span
              >
              <span class="ml-2">{{ item.label }}</span>
            </h3>
          </div>

          <div
            v-if="item.percentage !== null"
            class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"
          >
            <div
              class="h-full rounded-full transition-all duration-1000"
              :class="item.barColor"
              :style="{ width: `${item.percentage}%` }"
            ></div>
          </div>

          <ul class="!p-0 !my-2">
            <li
              v-for="(detail, dIndex) in item.details"
              :key="dIndex"
              class="flex items-center text-xs text-slate-500 mb-1"
            >
              <span
                :class="`w-1.5 h-1.5 rounded-full mr-2 ${item.dotColor}`"
              ></span>
              <span class="font-bold text-slate-700 dark:text-slate-300 mr-1">
                {{ detail.split(" ")[0] }}
              </span>
              <span class="truncate">
                {{ detail.substring(detail.indexOf(" ")) }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface AgamaItem {
  label: string;
  percentage: number | null;
  icon: string;
  iconColor: string;
  bgColor: string;
  barColor: string;
  dotColor: string;
  details: string[];
}

const dataAgama = ref<AgamaItem[]>([
  {
    label: "Islam",
    percentage: 60,
    icon: "mdi-star-crescent",
    iconColor: "text-green-900",
    bgColor: "bg-green-50",
    barColor: "bg-green-500",
    dotColor: "bg-green-400",
    details: ["15 Cb. Autoplaza", "8 Cb. Auto 88 KBR", "2 Cb. Sintang"],
  },
  {
    label: "Kristen",
    percentage: 25,
    icon: "mdi-cross",
    iconColor: "text-blue-900",
    bgColor: "bg-blue-50",
    barColor: "bg-blue-500",
    dotColor: "bg-blue-400",
    details: ["5 Cb. Autoplaza", "4 Cb. Auto 88 KBR", "1 Cb. Sintang"],
  },
  {
    label: "Katolik",
    percentage: 10,
    icon: "mdi-church",
    iconColor: "text-purple-900",
    bgColor: "bg-purple-50",
    barColor: "bg-purple-500",
    dotColor: "bg-purple-400",
    details: ["2 Cb. Autoplaza", "2 Cb. Wahidin"],
  },
  {
    label: "Buddha",
    percentage: 5,
    icon: "mdi-dharmachakra",
    iconColor: "text-amber-900",
    bgColor: "bg-amber-50",
    barColor: "bg-amber-500",
    dotColor: "bg-amber-400",
    details: ["2 Cb. Autoplaza"],
  },
  {
    label: "Hindu",
    percentage: 0,
    icon: "mdi-om",
    iconColor: "text-orange-900",
    bgColor: "bg-orange-50",
    barColor: "bg-orange-500",
    dotColor: "bg-orange-400",
    details: ["0 Orang"],
  },
  {
    label: "Lainnya",
    percentage: 0,
    icon: "mdi-dots-horizontal-circle-outline",
    iconColor: "text-slate-900",
    bgColor: "bg-slate-100",
    barColor: "bg-slate-400",
    dotColor: "bg-slate-400",
    details: ["0 Orang"],
  },
]);

const showFilter = ref(false);
const selectedFilter = ref(null);
const filterOptions = [
  "Semua Cabang",
  "Autoplaza 88 (Pontianak)",
  "Auto 88 Kuburaya",
  "Auto 88 Sintang",
];
</script>
