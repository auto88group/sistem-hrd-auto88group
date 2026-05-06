<template>
  <v-card
    class="w-full !rounded-[24px] !p-3 border border-slate-100 dark:border-slate-900 transition-all duration-300 hover:shadow-xl shadow-md"
    variant="flat"
  >
    <div class="flex items-center justify-between">
      <h2 class="text-md tracking-tight">
        <span class="font-bold text-slate-800 dark:text-slate-200"
          >Kontrak yang Akan Berakhir</span
        >
        <v-chip class="ms-3 bg-blue-50 dark:bg-blue-900 font-bold">
          {{ highlighData.length }}
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
          v-model="form.branch_id"
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
            >
            </v-list-item>
          </template>
        </v-autocomplete>
      </div>
    </v-expand-transition>
    <div
      class="overflow-scroll h-[400px] md:h-[400px] custom-scrollbar space-y-3 pb-20"
    >
      <!-- STATE LOADING: Menampilkan Skeleton Loader -->
      <template v-if="isHighlightLoading">
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

      <!-- STATE DATA: Menampilkan List Data Sebenarnya -->
      <template v-else>
        <div
          v-for="data in highlighData"
          :key="data.id"
          class="p-4 shadow-md rounded-[20px] border border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 transition-colors group"
        >
          <!-- Konten Card (Tetap Seperti Kode Asli Anda) -->
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
                  {{ formatName(data) }}
                </div>
                <div class="text-xs text-slate-500">
                  {{ data.employee_id ?? "-" }}
                </div>
              </div>
            </div>
            <v-btn
              target="_blank"
              :to="`/master/employee/detail/${data.id}`"
              variant="tonal"
              size="small"
              rounded="pill"
              class="text-none"
              color="indigo"
            >
              Detail
            </v-btn>
          </div>

          <div class="mb-3">
            <span
              class="px-3 py-1 bg-red-50 dark:bg-red-900/30 text-[11px] font-bold rounded-full border"
              :class="
                getDateDiffInfo(data.effective_end_date).isPassed
                  ? 'text-red-600 dark:text-red-400 border-red-100 dark:border-red-800'
                  : 'text-amber-800 dark:text-amber-400 border-amber-100 dark:border-amber-800'
              "
            >
              Kontrak {{ getDateDiffInfo(data.effective_end_date).text }}
            </span>
          </div>

          <div class="flex items-center gap-4 text-xs">
            <div class="flex items-center gap-1">
              <span class="text-green-600 font-medium">Mulai:</span>
              <span class="text-slate-900 dark:text-slate-300">{{
                data.effective_start_date
              }}</span>
            </div>
            <div class="flex items-center gap-1">
              <span class="text-red-500 font-medium">Berakhir:</span>
              <span class="text-slate-900 dark:text-slate-300">{{
                data.effective_end_date
              }}</span>
            </div>
          </div>
        </div>

        <!-- Empty State (Opsional) -->
        <template v-if="highlighData.length === 0">
          <div
            class="flex flex-col items-center justify-center py-10 text-center"
          >
            <v-icon size="64" color="slate-300" class="mb-2"
              >mdi-clipboard-text-search-outline</v-icon
            >
            <p class="text-slate-500 font-medium">Tidak ada data kontrak</p>
            <p class="text-xs text-slate-400">
              Coba ubah filter atau cari kata kunci lain
            </p>
          </div>
        </template>
      </template>
    </div>
    <div
      class="border-t border-slate-100 dark:border-slate-800 backdrop-blur-md rounded-b-[24px]"
    >
      <v-btn
        block
        to="/dashboard/personnel/contract-end"
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
import { useUserContractEndStore } from "@/stores/user-contract-end.store";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
const branchStore = useBranchStore();
const { formatName } = useFormatName();
const userContractEndStore = useUserContractEndStore();
const { getDateDiffInfo } = useDateFormatter();
const {
  highlightParams: form,
  userContractEndHighlight: highlighData,
  isHighlightLoading,
} = storeToRefs(userContractEndStore);

const showFilter = ref(false);

const searchBranch = ref("");
const listBranch = computed(() => {
  const keyword = searchBranch.value.toLowerCase();
  return branchStore.branchData
    .filter((branch) => {
      if (!keyword) return true;

      return (
        branch.name.toLowerCase().includes(keyword) ||
        branch.alias.toLowerCase().includes(keyword)
      );
    })
    .map((branch) => ({
      title: branch.name,
      alias: branch.alias,
      value: branch.id,
    }));
});

const onSearchBranch = (val: any) => {
  searchBranch.value = val ?? "";
};

const onChangeBranch = useDebounceFn((val: number) => {
  userContractEndStore.fetchHighlight();
}, 400);

onMounted(async () => {
  branchStore.fetchBranchData();
  userContractEndStore.fetchHighlight();
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
