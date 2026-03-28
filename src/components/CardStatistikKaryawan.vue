<template>
  <v-card
    class="w-full !rounded-[24px] !p-3 border border-slate-100 dark:border-slate-900 transition-all duration-300 hover:shadow-xl shadow-md"
    variant="flat"
  >
    <div class="flex items-center justify-between">
      <h2
        class="text-md font-bold text-slate-800 dark:text-slate-200 tracking-tight"
      >
        Karyawan
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

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        v-for="(item, index) in dataKaryawan"
        :key="index"
        class="flex gap-4"
      >
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
              <span class="ml-1">{{ item.label }}</span>
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
              class="flex items-center text-sm text-slate-500"
            >
              <span
                :class="`w-1.5 h-1.5 rounded-full mr-2 ${item.dotColor}`"
              ></span>
              <span class="font-bold text-slate-700 dark:text-slate-300 mr-1">{{
                detail.split(" ")[0]
              }}</span>
              <span class="truncate">{{
                detail.substring(detail.indexOf(" "))
              }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from "vue";

// Definisikan Interface agar bisa digunakan kembali
interface KaryawanItem {
  label: string;
  percentage: number | null;
  icon: string;
  iconColor: string;
  bgColor: string;
  barColor: string;
  dotColor: string;
  details: string[];
}

// Data ini bisa dijadikan props jika ingin dinamis dari parent,
// tapi untuk saat ini kita pindahkan saja logikanya ke sini.
const dataKaryawan: KaryawanItem[] = [
  {
    label: "Laki-Laki",
    percentage: 73,
    icon: "mdi-gender-male",
    iconColor: "text-blue-900",
    bgColor: "bg-blue-50",
    barColor: "bg-blue-500",
    dotColor: "bg-blue-400",
    details: ["20 Cb. Autoplaza", "20 Cb. Auto 88 Kuburaya", "2 Cb. Bengkel"],
  },
  {
    label: "Perempuan",
    percentage: 73,
    icon: "mdi-gender-female",
    iconColor: "text-rose-900",
    bgColor: "bg-pink-50",
    barColor: "bg-pink-500",
    dotColor: "bg-pink-400",
    details: ["20 Cb. Autoplaza", "20 Cb. Auto 88 Kuburaya", "2 Cb. Bengkel"],
  },
  {
    label: "Belum Diatur",
    percentage: 0,
    icon: "mdi-account-question-outline",
    iconColor: "text-amber-900",
    bgColor: "bg-amber-50",
    barColor: "bg-amber-400",
    dotColor: "bg-amber-400",
    details: ["0 Orang"],
  },
  {
    label: "Total Karyawan",
    percentage: 42,
    icon: "mdi-account-group",
    iconColor: "text-slate-900",
    bgColor: "bg-slate-100",
    barColor: "bg-slate-500",
    dotColor: "bg-slate-400",
    details: ["42 Orang"],
  },
];

const showFilter = ref(false);
const selectedFilter = ref(null);
const filterOptions = [
  "Autoplaza 88 (Cabang Pontianak)",
  "Autoplaza 88 (Cabang Wahidin)",
  "Auto 88 Kuburaya",
  "Auto 88 Sintang",
];
</script>
