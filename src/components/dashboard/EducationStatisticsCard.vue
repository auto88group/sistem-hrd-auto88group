<template>
  <v-card
    class="w-full !rounded-[24px] !p-3 border border-slate-100 dark:border-slate-900 transition-all duration-300 hover:shadow-xl shadow-md"
    variant="flat"
  >
    <div class="flex items-center justify-between z-10 relative">
      <h2
        class="text-md font-bold text-slate-800 dark:text-slate-200 tracking-tight"
      >
        Pendidikan
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
        <v-autocomplete
          v-model="form.alias"
          :items="listBranch"
          :loading="isLoadingBranch"
          prepend-inner-icon="mdi-map-marker-outline"
          item-title="alias"
          item-value="value"
          placeholder="Lokasi cabang"
          variant="outlined"
          density="compact"
          color="primary"
          class="custom-input mt-2"
          hide-details="auto"
          clearable
          no-filter
          @update:search="onSearchBranch"
          @update:model-value="onChangeBranch"
        >
          <template v-slot:item="{ props, item }">
            <v-list-item
              v-bind="props"
              :title="item.alias"
              :subtitle="item.title"
            >
            </v-list-item>
          </template>
        </v-autocomplete>
      </div>
    </v-expand-transition>
    <div class="space-y-3 w-full md:h-100 md:flex md:space-y-0 items-center">
      <div
        v-if="isLoading"
        class="absolute inset-0 z-6 flex items-center justify-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-2xl"
      >
        <v-progress-circular indeterminate color="indigo" size="36" />
      </div>
      <div class="w-full">
        <apexchart
          width="100%"
          height="320"
          type="donut"
          :options="chartOptions as any"
          :series="series"
        ></apexchart>
      </div>
      <div
        class="py-3 w-full h-70 overflow-y-scroll [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300 dark:hover:[&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:hover:bg-indigo-500"
      >
        <table class="w-full text-left">
          <thead>
            <tr
              class="text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800"
            >
              <th class="pb-2 font-semibold">Pendidikan</th>
              <th class="pb-2 font-semibold text-right">Jumlah</th>
              <th class="pb-2 font-semibold text-right text-indigo-500">%</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-900">
            <tr
              v-for="(item, index) in tableData"
              :key="index"
              class="group even:bg-slate-50/50 dark:even:bg-slate-800/30"
            >
              <td class="pl-2 py-2.5 flex items-center gap-3">
                <div
                  class="w-3 h-3 rounded-full shrink-0"
                  :style="{ backgroundColor: chartColors[index] }"
                ></div>
                <span
                  class="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition-colors"
                >
                  {{ item.name }}
                </span>
              </td>
              <td
                class="py-2.5 text-sm font-bold text-slate-800 dark:text-slate-200 text-right"
              >
                {{ item.value }}
              </td>
              <td
                class="pr-2 py-2.5 text-xs font-medium text-slate-400 dark:text-slate-500 text-right"
              >
                {{ calculatePercentage(item.value) }}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import VueApexCharts from "vue3-apexcharts";
import { useTheme } from "vuetify";
import { storeToRefs } from "pinia";
import { useHighlightStore } from "@/stores/highlight.store";
import { useBranchStore } from "@/stores/branch.store";
import { useDebounceFn } from "@/composables/UseDebounce";

const theme = useTheme();
const apexchart = VueApexCharts;

const highlightStore = useHighlightStore();
const branchStore = useBranchStore();

const {
  employeeEducation: rawData,
  isLoadingEmployeeEducation: isLoading,
  employeeEducationParams: form,
} = storeToRefs(highlightStore);

const { branchData, isLoadingData: isLoadingBranch } = storeToRefs(branchStore);

const showFilter = ref(false);

// Filter options dinamis dari branchData
const searchBranch = ref("");
const listBranch = computed(() => {
  const keyword = searchBranch.value.toLowerCase();

  const filtered = branchData.value.filter((branch) => {
    if (!keyword) return true;

    return (
      branch.name.toLowerCase().includes(keyword) ||
      branch.alias.toLowerCase().includes(keyword)
    );
  });

  // group / unique by alias
  const uniqueByAlias = Array.from(
    new Map(filtered.map((branch) => [branch.alias, branch])).values(),
  );

  return uniqueByAlias.map((branch) => ({
    title: branch.name,
    alias: branch.alias,
    value: branch.alias,
  }));
});
const onSearchBranch = (val: any) => {
  searchBranch.value = val ?? "";
};
const onChangeBranch = useDebounceFn((val: string) => {
  highlightStore.fetchEmployeeEducation();
}, 400);

// Warna acak yang konsisten berdasarkan index
const generateColors = (count: number): string[] => {
  const palette = [
    "#6366f1",
    "#f59e0b",
    "#10b981",
    "#ef4444",
    "#3b82f6",
    "#ec4899",
    "#14b8a6",
    "#f97316",
    "#8b5cf6",
    "#84cc16",
    "#06b6d4",
    "#e11d48",
    "#d97706",
    "#7c3aed",
    "#059669",
  ];
  return Array.from({ length: count }, (_, i) => palette[i % palette.length]);
};

// Transformasi data
const series = computed(() => Object.values(rawData.value));
const labels = computed(() => Object.keys(rawData.value));
const totalData = computed(() => series.value.reduce((a, b) => a + b, 0));
const chartColors = computed(() => generateColors(labels.value.length));

const tableData = computed(() =>
  labels.value.map((name, index) => ({
    name,
    value: series.value[index],
  })),
);

const calculatePercentage = (value: number) => {
  if (totalData.value === 0) return "0.0";
  return ((value / totalData.value) * 100).toFixed(1);
};

const chartOptions = computed(() => {
  const isDark = theme.global.name.value === "dark";
  return {
    chart: {
      type: "donut",
      fontFamily: "Inter, sans-serif",
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: { enabled: true, delay: 150 },
      },
    },
    labels: labels.value,
    colors: chartColors.value,
    stroke: {
      show: true,
      width: 2,
      colors: [isDark ? "#0f172a" : "#ffffff"],
    },
    plotOptions: {
      pie: {
        donut: {
          size: "75%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              fontSize: "14px",
              fontWeight: 600,
              color: isDark ? "#94a3b8" : "#64748b",
              formatter: () => totalData.value,
            },
            value: {
              show: true,
              fontSize: "24px",
              fontWeight: 700,
              color: isDark ? "#f8fafc" : "#1e293b",
              offsetY: 4,
            },
          },
        },
      },
    },
    dataLabels: { enabled: false },
    legend: {
      position: "bottom",
      fontSize: "12px",
      fontWeight: 500,
      labels: { colors: isDark ? "#cbd5e1" : "#475569" },
      markers: { width: 10, height: 10, radius: 12 },
      itemMargin: { horizontal: 10, vertical: 5 },
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: { formatter: (val: number) => `${val} Orang` },
    },
    states: {
      hover: { filter: { type: "darken", value: 0.9 } },
    },
  };
});

onMounted(() => {
  branchStore.fetchBranchData();
  highlightStore.fetchEmployeeEducation();
});
</script>

<style scoped>
/* Transisi halus saat ganti theme */
.v-card {
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease;
}
</style>
