<template>
  <v-card
    class="w-full !rounded-[24px] !p-5 border border-slate-100 dark:border-slate-900 transition-all duration-300 hover:shadow-xl shadow-md"
    variant="flat"
  >
    <div class="flex items-center justify-between">
      <h2
        class="text-md m-0 font-bold text-slate-800 dark:text-slate-200 tracking-tight"
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

    <!-- Loading State -->
    <div
      v-if="highlightStore.isLoadingGender"
      class="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      <div v-for="i in 4" :key="i" class="flex gap-4 animate-pulse">
        <div
          class="mt-4 flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-100"
        ></div>
        <div class="flex-grow space-y-2 mt-4">
          <div class="h-4 bg-slate-100 rounded w-1/2"></div>
          <div class="h-1.5 bg-slate-100 rounded-full"></div>
          <div class="h-3 bg-slate-100 rounded w-3/4"></div>
          <div class="h-3 bg-slate-100 rounded w-2/3"></div>
        </div>
      </div>
    </div>

    <!-- Data -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        v-for="(item, index) in dataKaryawan"
        :key="index"
        class="flex gap-4"
        @click="toggleDetail(index)"
        title="Klik untuk lihat detail"
      >
        <div
          :class="`mt-4 flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${item.bgColor}`"
        >
          <v-icon :color="item.iconColor" size="24">{{ item.icon }}</v-icon>
        </div>

        <div class="flex-grow" :class="item.type !== 'percent' ? 'mt-2' : ''">
          <div class="flex items-baseline justify-between">
            <h3
              class="text-lg mb-0 font-black text-slate-900 dark:text-slate-200"
            >
              <span v-if="item.type === 'percent'">{{ item.value }}%</span>
              <span v-else>{{ item.value }}</span>
              <span class="ml-1 text-sm font-semibold">{{ item.label }}</span>
            </h3>
          </div>

          <div
            v-if="item.type === 'percent'"
            class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"
          >
            <div
              class="h-full rounded-full transition-all duration-1000"
              :class="item.barColor"
              :style="{ width: `${item.value}%` }"
            ></div>
          </div>

          <v-expand-transition>
            <ul v-show="expandedIndex === index" class="!p-0 !my-2">
              <li
                v-for="(detail, dIndex) in item.details"
                :key="dIndex"
                class="flex items-center text-sm text-slate-500"
              >
                <span
                  :class="`w-1.5 h-1.5 rounded-full mr-2 ${item.dotColor}`"
                ></span>
                <span class="font-bold text-slate-700 dark:text-slate-300 mr-1">
                  {{ detail.split(" ")[0] }}
                </span>
                <span class="truncate">{{
                  detail.substring(detail.indexOf(" "))
                }}</span>
              </li>
            </ul>
          </v-expand-transition>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useHighlightStore } from "@/stores/highlight.store";
import type { GenderItem } from "@/api/modules/highlight.api";
import { storeToRefs } from "pinia";
import { useBranchStore } from "@/stores/branch.store";
import { useDebounceFn } from "@/composables/UseDebounce";

const branchStore = useBranchStore();
const highlightStore = useHighlightStore();

const { genderParams: form, gender } = storeToRefs(highlightStore);
const { branchData } = storeToRefs(branchStore);

const showFilter = ref(false);

const expandedIndex = ref<number | null>(null);

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
  highlightStore.fetchGender();
}, 400);

// Config visual per id
const visualConfig: Record<
  string,
  {
    label: string;
    icon: string;
    iconColor: string;
    bgColor: string;
    barColor: string;
    dotColor: string;
  }
> = {
  M: {
    label: "Laki-Laki",
    icon: "mdi-gender-male",
    iconColor: "text-blue-900",
    bgColor: "bg-blue-50",
    barColor: "bg-blue-500",
    dotColor: "bg-blue-400",
  },
  F: {
    label: "Perempuan",
    icon: "mdi-gender-female",
    iconColor: "text-rose-900",
    bgColor: "bg-pink-50",
    barColor: "bg-pink-500",
    dotColor: "bg-pink-400",
  },
  UNSET: {
    label: "Belum Diatur",
    icon: "mdi-account-question-outline",
    iconColor: "text-amber-900",
    bgColor: "bg-amber-50",
    barColor: "bg-amber-400",
    dotColor: "bg-amber-400",
  },
  TOTAL: {
    label: "Total Karyawan",
    icon: "mdi-account-group",
    iconColor: "text-slate-900",
    bgColor: "bg-slate-100",
    barColor: "bg-slate-500",
    dotColor: "bg-slate-400",
  },
};

const toggleDetail = (index: number) => {
  expandedIndex.value = expandedIndex.value === index ? null : index;
};
const dataKaryawan = computed(() =>
  gender.value.map((item: GenderItem) => ({
    ...visualConfig[item.id],
    value: item.value,
    type: item.type,
    details: item.details,
  })),
);

onMounted(() => {
  highlightStore.fetchGender();
  branchStore.fetchBranchData();

  console.log(branchData);
});
</script>
