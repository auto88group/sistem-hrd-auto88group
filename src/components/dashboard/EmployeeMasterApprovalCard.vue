<template>
  <v-card
    class="w-full !rounded-[24px] !p-3 border border-slate-100 dark:border-slate-900 transition-all duration-300 hover:shadow-xl shadow-md"
    variant="flat"
  >
    <div class="flex items-center justify-between">
      <h2 class="text-md tracking-tight">
        <span class="font-bold text-slate-800 dark:text-slate-200"
          >Approval Data Karyawan</span
        >
        <v-chip class="ms-3 bg-blue-50 dark:bg-blue-900 font-bold">
          {{ data.length }}
        </v-chip>
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
    <div
      class="overflow-scroll h-[400px] md:h-[400px] custom-scrollbar space-y-3 pb-20"
    >
      <template v-if="isLoading">
        <div
          v-for="n in 3"
          :key="n"
          class="p-4 shadow-md rounded-[20px] border border-slate-200 dark:border-slate-800 animate-pulse"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex gap-3">
              <div
                class="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl"
              ></div>
              <div class="space-y-2">
                <div
                  class="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded"
                ></div>
                <div
                  class="h-3 w-20 bg-slate-100 dark:bg-slate-800 rounded"
                ></div>
              </div>
            </div>
            <div
              class="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded-full"
            ></div>
          </div>
          <div
            class="h-6 w-32 bg-slate-100 dark:bg-slate-800 rounded-full mb-4"
          ></div>
          <div class="flex gap-4">
            <div class="h-3 w-24 bg-slate-100 dark:bg-slate-800 rounded"></div>
            <div class="h-3 w-24 bg-slate-100 dark:bg-slate-800 rounded"></div>
          </div>
        </div>
      </template>
      <div
        v-for="item in data"
        :key="item.id"
        class="p-4 shadow-md rounded-[20px] border border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 transition-colors group"
      >
        <div class="flex items-start justify-between mb-2">
          <div class="flex gap-3">
            <div
              class="bg-white dark:bg-slate-700 p-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-600"
            >
              <v-icon color="indigo">mdi-account-clock-outline</v-icon>
            </div>
            <div>
              <div
                class="font-bold text-slate-800 dark:text-white leading-tight"
              >
                {{
                  formatName({
                    name: item.user_name,
                    full_name: item.user_full_name,
                  })
                }}
              </div>
              <div class="text-xs text-slate-500">
                {{ item.user_employee_id ?? item.user_email }}
              </div>
            </div>
          </div>
          <v-btn
            variant="tonal"
            size="small"
            rounded="pill"
            class="text-none"
            color="indigo"
          >
            Detail
          </v-btn>
        </div>

        <div class="mb-3 flex flex-wrap gap-1.5">
          <span
            v-for="(lbl, i) in item.label"
            :key="i"
            class="px-3 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[11px] font-bold rounded-full border border-red-100 dark:border-red-800"
          >
            {{ lbl }}
          </span>
        </div>

        <div class="flex items-center gap-4 text-xs">
          <div class="flex items-center gap-1">
            <span class="text-green-600 font-medium">Diajukan Pada:</span>
            <span class="text-slate-900 dark:text-slate-300">{{
              toFullDateWithDay(item.created_at)
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <div
      class="border-t border-slate-100 dark:border-slate-800 backdrop-blur-md rounded-b-[24px]"
    >
      <v-btn
        block
        color="#6962e9"
        variant="flat"
        rounded="xl"
        size="large"
        class="text-none cursor-pointer !text-white font-bold"
      >
        Lihat Semua Detail
        <v-icon end>mdi-arrow-right</v-icon>
      </v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { useDateFormatter } from "@/composables/UseDateFormatter";
import { useDebounceFn } from "@/composables/UseDebounce";
import { useFormatName } from "@/composables/useFormatName";
import { useBranchStore } from "@/stores/branch.store";
import { useHighlightStore } from "@/stores/highlight.store";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";

const branchStore = useBranchStore();
const highlightStore = useHighlightStore();
const { formatName } = useFormatName();
const { toFullDateWithDay } = useDateFormatter();

const { branchData, isLoadingData: isLoadingBranch } = storeToRefs(branchStore);
const {
  userDataApprovalParams: form,
  userDataApproval: data,
  isLoadingUserDataApproval: isLoading,
} = storeToRefs(highlightStore);

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
  highlightStore.fetchUserDataApproval();
}, 400);

onMounted(async () => {
  branchStore.fetchBranchData();
  highlightStore.fetchUserDataApproval();
});
</script>

<style scoped>
/* Opsional: Membuat scrollbar lebih rapi */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1e293b;
}
</style>
