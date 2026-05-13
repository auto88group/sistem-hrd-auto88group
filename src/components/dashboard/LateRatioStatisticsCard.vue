<template>
  <v-card
    class="w-full !rounded-[24px] !p-3 border border-slate-100 dark:border-slate-900 transition-all duration-300 hover:shadow-xl shadow-md"
    variant="flat"
  >
    <div class="flex items-center justify-between">
      <h2
        class="text-md font-bold text-slate-800 dark:text-slate-200 tracking-tight"
      >
        Rasio Keterlambatan
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
      <div
        v-if="showFilter"
        class="mb-4 px-1 space-y-4 md:space-y-0 md:flex gap-2"
      >
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
          class="custom-input"
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
        <date-range-picker
          v-model="form.periodForm"
          :max-date="today"
          @update:model-value="onChangePeriod"
        />
      </div>
    </v-expand-transition>

    <!-- Loading state -->
    <div
      v-if="isLoadingLatePercentage"
      class="flex justify-center items-center h-[350px]"
    >
      <v-progress-circular indeterminate color="indigo" size="40" />
    </div>

    <!-- Empty state -->
    <div
      v-else-if="!latePercentage.length"
      class="flex flex-col justify-center items-center h-[350px] text-slate-400"
    >
      <v-icon size="48" class="mb-2">mdi-chart-bar-stacked</v-icon>
      <span class="text-sm">Tidak ada data tersedia</span>
    </div>

    <!-- Chart -->
    <div v-else class="w-full">
      <vue-apex-charts
        type="bar"
        :height="chartHeight"
        :options="chartOptions"
        :series="series"
      />
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import VueApexCharts from "vue3-apexcharts";
import type { ApexOptions } from "apexcharts";
import { useTheme } from "vuetify";
import { useHighlightStore } from "@/stores/highlight.store"; // sesuaikan path
import { storeToRefs } from "pinia";
import { useBranchStore } from "@/stores/branch.store";
import { useDebounceFn } from "@/composables/UseDebounce";
import { useDateFormatter } from "@/composables/UseDateFormatter";
import DateRangePicker from "../DateRangePicker.vue";

const theme = useTheme();
const { toRangeYMD } = useDateFormatter();
const isDark = computed(() => theme.global.name.value === "dark");
const today = new Date().toISOString().split("T")[0];

// --- Store ---
const highlightStore = useHighlightStore();
const {
  latePercentage,
  isLoadingLatePercentage,
  latePercentageParams: form,
} = storeToRefs(highlightStore);
const { fetchLatePercentage } = highlightStore;

const branchStore = useBranchStore();
const { branchData, isLoadingData: isLoadingBranch } = storeToRefs(branchStore);
const { fetchBranchData } = branchStore;

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

  // group by alias, gabungkan name
  const groupedByAlias = filtered.reduce((acc, branch) => {
    if (!acc.has(branch.alias)) {
      acc.set(branch.alias, { ...branch, names: [branch.name] });
    } else {
      acc.get(branch.alias).names.push(branch.name);
    }
    return acc;
  }, new Map());

  return Array.from(groupedByAlias.values()).map((branch) => ({
    title: branch.names.join(", "),
    alias: branch.alias,
    value: branch.alias,
  }));
});
const onSearchBranch = (val: any) => {
  searchBranch.value = val ?? "";
};
const onChangeBranch = useDebounceFn((val: string) => {
  fetchLatePercentage();
}, 400);

// --- Filter State ---
const showFilter = ref(false);
const selectedDates = ref<Date[]>([]);

// --- Computed: tinggi chart menyesuaikan jumlah data ---
const chartHeight = computed(() =>
  Math.max(350, latePercentage.value.length * 60),
);

// --- Chart Series ---
const series = computed(() => [
  {
    name: "Rasio Keterlambatan (%)",
    data: latePercentage.value.map((item) => item.late_percentage),
  },
]);

// --- Chart Options ---
const chartOptions = computed<ApexOptions>(() => {
  const textColor = isDark.value ? "#cbd5e1" : "#334155";
  const gridColor = isDark.value ? "#1e293b" : "#f1f5f9";

  return {
    chart: {
      type: "bar",
      toolbar: { show: false },
      background: "transparent",
    },
    theme: { mode: isDark.value ? "dark" : "light" },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        dataLabels: { position: "top" },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val}%`,
      offsetX: 30,
      style: {
        fontSize: "12px",
        colors: [textColor],
      },
    },
    xaxis: {
      categories: latePercentage.value.map((item) => item.branch_group_code),
      max: 100,
      labels: {
        formatter: (val: string) => `${val}%`,
        style: { colors: textColor },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: textColor, fontSize: "12px" },
      },
    },
    grid: {
      borderColor: gridColor,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
    },
    tooltip: {
      x: {
        // ✅ Judul tooltip: "A88KR — Auto 88 Kuburaya"
        formatter: (val: string, opts?: any) => {
          const item = latePercentage.value[opts?.dataPointIndex];
          return item
            ? `${item.branch_group_code} — ${item.branch_group_name}`
            : val;
        },
      },
      y: {
        formatter: (val: number, opts?: any) => {
          const item = latePercentage.value[opts?.dataPointIndex];
          return item ? `${val}% — ${item.note}` : `${val}%`;
        },
      },
    },
    colors: ["#6366f1"],
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "horizontal",
        shadeIntensity: 0.3,
        gradientToColors: ["#818cf8"],
        stops: [0, 100],
      },
    },
  };
});

const onChangePeriod = useDebounceFn((val: string[]) => {
  const dates = val.map((v) => new Date(v));
  form.value.period = toRangeYMD(dates);
  fetchLatePercentage();
}, 400);

// --- Init ---
onMounted(() => {
  fetchLatePercentage();
  fetchBranchData();
});
</script>

<style scoped>
.v-card {
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease;
}
</style>
