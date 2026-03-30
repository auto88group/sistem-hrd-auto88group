<template>
  <v-card
    class="w-full !rounded-[24px] !p-3 border border-slate-100 dark:border-slate-900 transition-all duration-300 hover:shadow-xl shadow-md"
    variant="flat"
  >
    <div class="flex items-center justify-between">
      <h2
        class="text-md font-bold text-slate-800 dark:text-slate-200 tracking-tight"
      >
        Join VS Termination
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
      <div v-if="showFilter" class="mb-4 px-1 flex gap-3">
        <v-select
          v-model="filters.tahun"
          :items="[2024, 2025, 2026]"
          label="Tahun"
          variant="outlined"
          density="compact"
          hide-details
          rounded="xl"
        ></v-select>
        <v-select
          v-model="filters.cabang"
          :items="[
            'Semua Cabang',
            'Autoplaza 88 (Pontianak)',
            'Auto 88 Kuburaya',
          ]"
          label="Cabang"
          variant="outlined"
          density="compact"
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
import { useTheme } from "vuetify";

const theme = useTheme();

const apexchart = VueApexCharts;

const showFilter = ref(false);

const filters = ref({
  tahun: 2026,
  cabang: "Semua Cabang",
});

const rawData = [
  { bulan: "Jan", join: 13, termination: 10 },
  { bulan: "Feb", join: 7, termination: 0 },
  { bulan: "Mar", join: 8, termination: 0 },
  { bulan: "Apr", join: 0, termination: 0 },
  { bulan: "Mei", join: 0, termination: 0 },
  { bulan: "Jun", join: 0, termination: 0 },
  { bulan: "Jul", join: 0, termination: 0 },
  { bulan: "Agu", join: 0, termination: 0 },
  { bulan: "Sep", join: 0, termination: 0 },
  { bulan: "Okt", join: 0, termination: 0 },
  { bulan: "Nov", join: 0, termination: 0 },
  { bulan: "Des", join: 0, termination: 0 },
];

// Series dikelompokkan menjadi Join dan Termination
const series = computed(() => [
  {
    name: "Join",
    data: rawData.map((item) => item.join),
  },
  {
    name: "Termination",
    data: rawData.map((item) => item.termination),
  },
]);

const chartOptions = computed<ApexOptions>(() => ({
  chart: {
    type: "bar",
    toolbar: { show: false },
    fontFamily: "Inter, sans-serif",
    stacked: false, // Set true jika ingin grafik bertumpuk
  },
  theme: {
    mode: theme.global.current.value.dark ? "dark" : "light",
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      columnWidth: "55%",
      dataLabels: { position: "top" },
    },
  },
  colors: ["#4f46e5", "#94a3b8"],
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"],
  },
  dataLabels: {
    enabled: true,
    offsetY: -20,
    style: {
      fontSize: "10px",
      colors: ["#64748b"],
    },
  },
  legend: {
    position: "top",
    horizontalAlign: "left",
    fontWeight: 600,
    labels: {
      colors: theme.global.current.value.dark ? "#f8fafc" : "#64748b",
    },
  },
  xaxis: {
    categories: rawData.map((item) => item.bulan),
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      style: {
        colors: theme.global.current.value.dark ? "#94a3b8" : "#64748b",
        fontSize: "12px",
      },
    },
  },
  yaxis: {
    labels: {
      style: { colors: "#64748b" },
    },
  },
  grid: {
    borderColor: "#f1f5f9",
    strokeDashArray: 4,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
  },
  tooltip: {
    theme: "dark",
    y: {
      formatter: (val: number) => `${val} Orang`,
    },
  },
}));
</script>
