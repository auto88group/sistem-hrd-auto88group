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
        <v-autocomplete
          id="field-year"
          v-model="form.year"
          :items="listYear"
          label="Tahun"
          prepend-inner-icon="mdi-calendar"
          placeholder="Pilih tahun"
          variant="outlined"
          class="custom-input mt-2"
          density="compact"
          color="primary"
          item-title="label"
          item-value="value"
          hide-details="auto"
          clearable
          no-filter
          @update:model-value="onChangeYear"
        >
        </v-autocomplete>
        <v-autocomplete
          v-model="form.alias"
          :items="listBranch"
          :loading="branchStore.isLoadingData"
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

    <!-- Loading -->
    <div
      v-if="highlightStore.isLoadingJoinTermination"
      class="flex items-center justify-center h-[430px]"
    >
      <v-progress-circular indeterminate color="indigo"></v-progress-circular>
    </div>

    <!-- Chart -->
    <div v-show="!highlightStore.isLoadingJoinTermination" class="mt-2 w-full">
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
import { computed, ref, onMounted } from "vue";
import VueApexCharts from "vue3-apexcharts";
import type { ApexOptions } from "apexcharts";
import { useTheme } from "vuetify";
import { useHighlightStore } from "@/stores/highlight.store";
import { useBranchStore } from "@/stores/branch.store";
import { storeToRefs } from "pinia";
import { useDebounceFn } from "@/composables/UseDebounce";

const apexchart = VueApexCharts;
const theme = useTheme();
const highlightStore = useHighlightStore();
const branchStore = useBranchStore();

const { joinTerminationParams: form, joinTermination } =
  storeToRefs(highlightStore);
const { branchData } = storeToRefs(branchStore);

const showFilter = ref(false);

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

const startYear = 2020;
const currentYear = new Date().getFullYear();
const listYear = Array.from(
  { length: currentYear - startYear + 1 },
  (_, index) => {
    const year = (currentYear - index).toString();

    return {
      label: year,
      value: year,
    };
  },
);
const onSearchBranch = (val: any) => {
  searchBranch.value = val ?? "";
};

const onChangeBranch = useDebounceFn((val: string) => {
  highlightStore.fetchJoinTermination();
}, 400);

const onChangeYear = useDebounceFn((val: number) => {
  highlightStore.fetchJoinTermination();
}, 400);

const series = computed(() => [
  {
    name: "Join",
    data: joinTermination.value.map((item) => item.join),
  },
  {
    name: "Termination",
    data: joinTermination.value.map((item) => item.termination),
  },
]);

const chartOptions = computed<ApexOptions>(() => ({
  chart: {
    type: "bar",
    toolbar: { show: false },
    fontFamily: "Inter, sans-serif",
    stacked: false,
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
    categories: joinTermination.value.map((item) => item.month),
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

onMounted(() => {
  highlightStore.fetchJoinTermination();
});
</script>
