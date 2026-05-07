<template>
  <v-card
    class="w-full !rounded-[24px] !p-5 border border-slate-100 dark:border-slate-900 transition-all duration-300 hover:shadow-xl shadow-md"
    variant="flat"
  >
    <div class="flex items-center justify-between">
      <div class="flex flex-col">
        <h2
          class="text-md m-0 font-bold text-slate-800 dark:text-slate-200 tracking-tight"
        >
          Agama
        </h2>
      </div>
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
      v-if="highlightStore.isLoadingReligion"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div v-for="i in 6" :key="i" class="flex gap-4 animate-pulse">
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
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="(item, index) in dataAgama"
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
              <span class="ml-2 text-sm font-semibold">{{ item.label }}</span>
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
                class="flex items-center text-xs text-slate-500 mb-1"
              >
                <span
                  :class="`w-1.5 h-1.5 rounded-full mr-2 ${item.dotColor}`"
                ></span>
                <span class="font-bold text-slate-700 dark:text-slate-300 mr-1">
                  {{ detail.split(" ")[0] }}
                </span>
                <span class="truncate">
                  {{ detail.substring(detail.indexOf(" ")) }}
                </span>
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
import type { ReligionItem } from "@/api/modules/highlight.api";
import { storeToRefs } from "pinia";
import { useBranchStore } from "@/stores/branch.store";
import { useDebounceFn } from "@/composables/UseDebounce";

const highlightStore = useHighlightStore();
const branchStore = useBranchStore();
const { religionParams: form, religion } = storeToRefs(highlightStore);
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

const palette: Record<
  string,
  {
    icon: string;
    iconColor: string;
    bgColor: string;
    barColor: string;
    dotColor: string;
  }
> = {
  ISLAM: {
    icon: "mdi-star-crescent",
    iconColor: "text-green-900",
    bgColor: "bg-green-50",
    barColor: "bg-green-500",
    dotColor: "bg-green-400",
  },
  KRISTEN: {
    icon: "mdi-cross",
    iconColor: "text-blue-900",
    bgColor: "bg-blue-50",
    barColor: "bg-blue-500",
    dotColor: "bg-blue-400",
  },
  KATOLIK: {
    icon: "mdi-church",
    iconColor: "text-purple-900",
    bgColor: "bg-purple-50",
    barColor: "bg-purple-500",
    dotColor: "bg-purple-400",
  },
  BUDDHA: {
    icon: "mdi-dharmachakra",
    iconColor: "text-amber-900",
    bgColor: "bg-amber-50",
    barColor: "bg-amber-500",
    dotColor: "bg-amber-400",
  },
  HINDU: {
    icon: "mdi-om",
    iconColor: "text-orange-900",
    bgColor: "bg-orange-50",
    barColor: "bg-orange-500",
    dotColor: "bg-orange-400",
  },
  KONGHUCU: {
    icon: "mdi-hands-pray",
    iconColor: "text-rose-900",
    bgColor: "bg-rose-50",
    barColor: "bg-rose-500",
    dotColor: "bg-rose-400",
  },
};

const fallbackVisual = {
  icon: "mdi-dots-horizontal-circle",
  iconColor: "text-teal-900",
  bgColor: "bg-teal-50",
  barColor: "bg-teal-500",
  dotColor: "bg-teal-400",
};

const unsetVisual = {
  icon: "mdi-account-question-outline",
  iconColor: "text-slate-600",
  bgColor: "bg-slate-100",
  barColor: "bg-slate-400",
  dotColor: "bg-slate-400",
};

const totalVisual = {
  icon: "mdi-account-group",
  iconColor: "text-slate-900",
  bgColor: "bg-slate-100",
  barColor: "bg-slate-500",
  dotColor: "bg-slate-400",
};

const dataAgama = computed(() =>
  religion.value.map((item: ReligionItem) => {
    if (item.type === "total") {
      return {
        label: "Total Karyawan",
        value: item.value,
        type: item.type,
        details: item.details,
        ...totalVisual,
      };
    }
    if (item.id === "UNSET") {
      return {
        label: "Belum Diatur",
        value: item.value,
        type: item.type,
        details: item.details,
        ...unsetVisual,
      };
    }
    // Cocokkan pakai uppercase agar case-insensitive (islam → ISLAM, Islam → ISLAM)
    const key = item.id.toUpperCase();
    const visual = palette[key] ?? fallbackVisual;
    return {
      label: item.id,
      value: item.value,
      type: item.type,
      details: item.details,
      ...visual,
    };
  }),
);

const onSearchBranch = (val: any) => {
  searchBranch.value = val ?? "";
};

const onChangeBranch = useDebounceFn((val: string) => {
  highlightStore.fetchReligion();
}, 400);

const toggleDetail = (index: number) => {
  // Jika index yang diklik sudah terbuka, maka tutup (set null)
  // Jika belum, maka buka index tersebut
  expandedIndex.value = expandedIndex.value === index ? null : index;
};

onMounted(() => {
  highlightStore.fetchReligion();
});
</script>
