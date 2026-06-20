<template>
  <v-card
    class="w-full !rounded-[24px] !p-3 border border-slate-100 dark:border-slate-900 transition-all duration-300 hover:shadow-xl shadow-md"
    variant="flat"
  >
    <div class="flex items-center justify-between">
      <h2
        class="text-md font-bold text-slate-800 dark:text-slate-200 tracking-tight"
      >
        Status Kelengkapan per Dokumen
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
      <div v-if="showFilter" class="mb-4 px-1 mt-2">
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
            ></v-list-item>
          </template>
        </v-autocomplete>
      </div>
    </v-expand-transition>

    <div
      v-show="highlightStore.isLoadingStatisticFileCompleteness"
      class="flex items-center justify-center h-[350px]"
    >
      <v-progress-circular indeterminate color="indigo"></v-progress-circular>
    </div>

    <div
      v-show="!highlightStore.isLoadingStatisticFileCompleteness"
      class="mt-4 w-full"
    >
      <apexchart
        v-if="hasData"
        type="bar"
        height="350"
        :options="chartOptions"
        :series="series"
      ></apexchart>

      <div
        v-else
        class="flex flex-col items-center justify-center h-[350px] text-gray-400"
      >
        <v-icon
          icon="mdi-file-cancel-outline"
          size="48"
          class="mb-2 opacity-50"
        />
        <span class="text-sm">Belum ada data dokumen wajib</span>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import VueApexCharts from "vue3-apexcharts";
import type { ApexOptions } from "apexcharts";
import { useHighlightStore } from "@/stores/highlight.store";
import { storeToRefs } from "pinia";
import { useBranchStore } from "@/stores/branch.store";
import { useDebounceFn } from "@/composables/UseDebounce";

const apexchart = VueApexCharts;
const branchStore = useBranchStore();
const highlightStore = useHighlightStore();
const router = useRouter();
const showFilter = ref(false);

const { statisticFileCompletenessParams: form, statisticFileCompleteness } =
  storeToRefs(highlightStore);
const { branchData } = storeToRefs(branchStore);

// --- SEARCH & FILTER LOKASI ---
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
  highlightStore.fetchStatisticFileCompleteness();
}, 400);

// --- CHART LOGIC (BAR CHART) ---
const hasData = computed(() => {
  return (
    statisticFileCompleteness.value &&
    statisticFileCompleteness.value.category_breakdown &&
    statisticFileCompleteness.value.category_breakdown.length > 0
  );
});

const series = computed(() => {
  if (!hasData.value) return [];
  const breakdown = statisticFileCompleteness.value!.category_breakdown;

  return [
    {
      name: "Belum Mengunggah",
      data: breakdown.map((item) => item.missing_count),
    },
    {
      name: "Sudah Mengunggah",
      data: breakdown.map((item) => item.uploaded_count),
    },
  ];
});

const chartOptions = computed<ApexOptions>(() => {
  const breakdown = statisticFileCompleteness.value?.category_breakdown || [];
  const categories = breakdown.map((item) => item.category_name);

  return {
    chart: {
      type: "bar",
      stacked: true, // Membuat bar menumpuk agar totalnya sama dengan total pegawai
      fontFamily: "Inter, sans-serif",
      toolbar: { show: false },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          // Tambahkan pengecekan ini agar TypeScript aman
          if (!config) return;

          // config.seriesIndex: 0 = "Belum Mengunggah", 1 = "Sudah Mengunggah"
          // config.dataPointIndex: Index dari kategori dokumen yang diklik
          const isMissing = config.seriesIndex === 0;
          const clickedCategory = breakdown[config.dataPointIndex];

          if (clickedCategory) {
            router.push({
              path: "/master/employee",
              query: {
                hrd_file_category_id: clickedCategory.category_id,
                file_status: isMissing ? "missing" : "uploaded",
              },
            });
          }
        },
      },
    },
    colors: ["#f43f5e", "#10b981"], // Merah untuk Belum, Hijau untuk Sudah
    plotOptions: {
      bar: {
        horizontal: true, // Horizontal agar nama dokumen panjang tidak terpotong
        borderRadius: 4,
        dataLabels: {
          total: {
            enabled: false, // Matikan total default
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => (val > 0 ? val : ""), // Sembunyikan angka 0 agar rapi
      style: {
        fontSize: "12px",
        colors: ["#fff"],
      },
    },
    stroke: {
      width: 1,
      colors: ["transparent"],
    },
    xaxis: {
      categories: categories,
      labels: {
        style: { colors: "#64748b", fontSize: "12px" },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#334155",
          fontSize: "13px",
          fontWeight: 500,
        },
      },
    },
    grid: {
      strokeDashArray: 4,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (val: number) => `${val} Pegawai`,
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Inter, sans-serif",
      itemMargin: { horizontal: 10, vertical: 5 },
    },
  };
});

onMounted(() => {
  highlightStore.fetchStatisticFileCompleteness();
});
</script>
