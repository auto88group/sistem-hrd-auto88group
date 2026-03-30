<template>
  <v-card
    class="w-full !rounded-[24px] !p-3 border border-slate-100 dark:border-slate-900 transition-all duration-300 hover:shadow-xl shadow-md"
    variant="flat"
  >
    <div class="flex items-center justify-between">
      <h2
        class="text-md font-bold text-slate-800 dark:text-slate-200 tracking-tight"
      >
        Total Karyawan
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
    <div class="mt-2 w-full">
      <apexchart
        type="bar"
        height="430"
        :options="chartOptions"
        :series="series"
      ></apexchart>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import VueApexCharts from "vue3-apexcharts";
import type { ApexOptions } from "apexcharts";

const apexchart = VueApexCharts;

const showFilter = ref(false);
const selectedFilter = ref(null);
const filterOptions = [
  "Semua Cabang",
  "Autoplaza 88 (Pontianak)",
  "Auto 88 Kuburaya",
  "Auto 88 Sintang",
];

const rawData = [
  { tahun: 2014, volume: 1 },
  { tahun: 2015, volume: 2 },
  { tahun: 2016, volume: 2 },
  { tahun: 2017, volume: 3 },
  { tahun: 2018, volume: 4 },
  { tahun: 2019, volume: 10 },
  { tahun: 2020, volume: 19 },
  { tahun: 2021, volume: 22 },
  { tahun: 2022, volume: 31 },
  { tahun: 2023, volume: 36 },
  { tahun: 2024, volume: 56 },
  { tahun: 2025, volume: 86 },
  { tahun: 2026, volume: 114 },
];

// Konfigurasi ApexCharts
const series = computed(() => [
  {
    name: "Karyawan",
    data: rawData.map((item) => item.volume),
  },
]);

const chartOptions = computed<ApexOptions>(() => ({
  chart: {
    type: "bar",
    toolbar: { show: false },
    fontFamily: "Inter, sans-serif",
  },
  plotOptions: {
    bar: {
      borderRadius: 6,
      columnWidth: "60%",
      distributed: false,
      dataLabels: { position: "top" },
    },
  },
  colors: ["#4f46e5"], // Warna Indigo sesuai button Anda
  dataLabels: {
    enabled: true,
    formatter: (val: number) => val,
    offsetY: -20,
    style: {
      fontSize: "10px",
      colors: ["#64748b"],
    },
  },
  xaxis: {
    categories: rawData.map((item) => item.tahun),
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      style: { colors: "#94a3b8", fontSize: "12px" },
    },
  },
  yaxis: {
    show: false,
  },
  grid: {
    show: false,
  },
  tooltip: {
    theme: "dark",
    x: { show: true },
    y: {
      formatter: (val: number) => `${val} Orang`,
    },
  },
}));
</script>
