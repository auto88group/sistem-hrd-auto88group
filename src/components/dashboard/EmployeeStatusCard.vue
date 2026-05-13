<template>
  <v-card
    class="w-full !rounded-[24px] !p-3 border border-slate-100 dark:border-slate-900 transition-all duration-300 hover:shadow-xl shadow-md"
    variant="flat"
  >
    <div class="flex items-center justify-between">
      <h2
        class="text-md font-bold text-slate-800 dark:text-slate-200 tracking-tight"
      >
        Status Kepegawaian
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

    <div class="mt-2 w-full relative">
      <div
        v-if="isLoading"
        class="absolute inset-0 z-10 flex items-center justify-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-2xl"
      >
        <v-progress-circular indeterminate color="indigo" size="36" />
      </div>
      <apexchart
        type="donut"
        width="100%"
        height="300"
        :options="chartOptions as any"
        :series="series"
      />
    </div>

    <!-- Summary Cards -->
    <div class="mt-4 grid grid-cols-2 gap-4">
      <template v-if="isLoading">
        <div
          v-for="i in 2"
          :key="i"
          class="flex flex-col p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 animate-pulse h-16"
        />
      </template>
      <template v-else>
        <div
          v-for="(item, index) in chartData"
          :key="index"
          class="flex flex-col p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50"
        >
          <span class="text-xs text-slate-500 dark:text-slate-200 font-medium">
            {{ item.status }}
          </span>
          <span class="text-lg font-bold text-slate-800 dark:text-white">
            {{ item.total }}
            <small
              class="text-[10px] font-normal text-slate-400 dark:text-slate-200"
              >Orang</small
            >
          </span>
        </div>
      </template>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import VueApexCharts from "vue3-apexcharts";
import type { ApexOptions } from "apexcharts";
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
  employeeStatus: chartData,
  isLoadingEmployeeStatus: isLoading,
  employeStatusParams: form,
} = storeToRefs(highlightStore);

const { branchData, isLoadingData: isLoadingBranch } = storeToRefs(branchStore);

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
const onSearchBranch = (val: any) => {
  searchBranch.value = val ?? "";
};
const onChangeBranch = useDebounceFn((val: string) => {
  highlightStore.fetchEmployeeStatus();
}, 400);

const series = computed(() => chartData.value.map((item) => item.total));
const chartOptions = computed(() => ({
  // ... (sama persis seperti sebelumnya, hanya ganti chartData → chartData.value)
  labels: chartData.value.map((item) => item.status),
  // ...
}));

onMounted(() => {
  branchStore.fetchBranchData();
  highlightStore.fetchEmployeeStatus();
});
</script>
