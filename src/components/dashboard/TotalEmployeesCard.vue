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
      v-show="highlightStore.isLoadingEmployeeTotal"
      class="flex items-center justify-center h-[430px]"
    >
      <v-progress-circular indeterminate color="indigo"></v-progress-circular>
    </div>

    <!-- Chart -->
    <div v-show="!highlightStore.isLoadingEmployeeTotal" class="mt-2 w-full">
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
import { useHighlightStore } from "@/stores/highlight.store";
import { storeToRefs } from "pinia";
import { useBranchStore } from "@/stores/branch.store";
import { useDebounceFn } from "@/composables/UseDebounce";

const apexchart = VueApexCharts;
const branchStore = useBranchStore();
const highlightStore = useHighlightStore();
const showFilter = ref(false);

const { employeeTotalParams: form, employeeTotal } =
  storeToRefs(highlightStore);
const { branchData } = storeToRefs(branchStore);

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

const series = computed(() => [
  {
    name: "Karyawan",
    data: employeeTotal.value.map((item) => item.volume),
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
  colors: ["#4f46e5"],
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
    categories: highlightStore.employeeTotal.map((item) => item.year),
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

const onSearchBranch = (val: any) => {
  searchBranch.value = val ?? "";
};

const onChangeBranch = useDebounceFn((val: string) => {
  highlightStore.fetchEmployeeTotal();
}, 400);

onMounted(() => {
  highlightStore.fetchEmployeeTotal();
});
</script>
