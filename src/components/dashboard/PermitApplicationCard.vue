<template>
  <v-card
    class="w-full !rounded-[24px] !p-3 border border-slate-100 dark:border-slate-900 transition-all duration-300 hover:shadow-xl shadow-md"
    variant="flat"
  >
    <div class="flex items-center justify-between">
      <h2
        class="text-md font-bold text-slate-800 dark:text-slate-200 tracking-tight"
      >
        Daftar Pengajuan
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
          label="Cabang"
          class="custom-input"
          hide-details="auto"
          clearable
          no-filter
          @update:search="onSearchBranch"
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

        <v-autocomplete
          v-model="form.hrd_leave_type_id"
          :items="listLeaveType"
          :loading="leaveTypeStore.isLoadingData"
          prepend-inner-icon="mdi-map-marker-outline"
          item-title="title"
          item-value="value"
          placeholder="Pilih jenis izin"
          variant="outlined"
          density="compact"
          color="primary"
          label="Jenis Izin"
          class="custom-input"
          hide-details="auto"
          clearable
          no-filter
          @update:search="onSearchLeaveType"
        >
        </v-autocomplete>
      </div>
    </v-expand-transition>
    <div
      class="overflow-scroll h-[400px] md:h-[400px] custom-scrollbar space-y-3 pb-20"
    >
      <template v-if="higlightStore.isLoadingLeaveRequest">
        <div
          v-for="i in 3"
          :key="i"
          class="p-4 rounded-[20px] border border-slate-200 dark:border-slate-800 animate-pulse"
        >
          <div class="flex justify-between mb-4">
            <div class="flex gap-3">
              <div
                class="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl"
              ></div>
              <div class="space-y-2">
                <div
                  class="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded"
                ></div>
                <div
                  class="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded"
                ></div>
              </div>
            </div>
            <div
              class="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded-full"
            ></div>
          </div>
          <div
            class="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded mb-2"
          ></div>
          <div class="h-3 w-1/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
      </template>

      <template v-else-if="!higlightStore.leaveRequest?.length">
        <div
          class="flex flex-col items-center justify-center py-10 text-center"
        >
          <v-icon size="64" color="slate-300" class="mb-2"
            >mdi-clipboard-text-search-outline</v-icon
          >
          <p class="text-slate-500 font-medium">Tidak ada data pengajuan</p>
          <p class="text-xs text-slate-400">
            Coba ubah filter atau cari kata kunci lain
          </p>
        </div>
      </template>

      <template v-else>
        <div
          v-for="leaveRequest in higlightStore.leaveRequest"
          :key="leaveRequest.id"
          class="p-4 shadow-md rounded-[20px] border border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 transition-colors group"
        >
          <div class="flex items-start justify-between mb-2">
            <div class="flex gap-3">
              <div
                class="bg-white dark:bg-slate-700 p-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-600"
              >
                <v-icon color="indigo">mdi-clock-time-eight-outline</v-icon>
              </div>
              <div>
                <div class="text-xs text-slate-500">Pengajuan</div>
                <div
                  class="font-bold text-slate-800 dark:text-white leading-tight"
                >
                  {{ toFullDateWithDay(leaveRequest.created_at) }}
                  <v-chip
                    size="small"
                    :color="getPermitColor(leaveRequest.leave_type)"
                    variant="flat"
                    class="font-bold text-uppercase"
                    style="font-size: 10px; height: 18px"
                  >
                    {{ leaveRequest.leave_type_name }}
                  </v-chip>
                </div>
              </div>
            </div>
            <v-btn
              :to="`/manage-attendance/leave-request?userId=${leaveRequest.user_id}&id=${leaveRequest.id}`"
              target="_blank"
              variant="tonal"
              size="small"
              rounded="pill"
              class="text-none"
              color="indigo"
            >
              Detail
            </v-btn>
          </div>

          <div class="space-y-3">
            <p
              class="text-[15px] font-bold text-slate-800 dark:text-slate-100 truncate leading-none"
            >
              {{
                formatName({
                  name: leaveRequest.user_name,
                  full_name: leaveRequest.user_full_name,
                })
              }}
            </p>
            <div class="flex items-center gap-4 text-xs">
              <div class="flex items-center gap-1">
                <span class="text-green-600 font-medium">Mulai:</span>
                <span class="text-slate-900 dark:text-slate-300">{{
                  toDayMonthYear(leaveRequest.start_date)
                }}</span>
              </div>
              <div class="flex items-center gap-1">
                <span class="text-red-500 font-medium">Berakhir:</span>
                <span class="text-slate-900 dark:text-slate-300">{{
                  toDayMonthYear(leaveRequest.end_date)
                }}</span>
              </div>
            </div>

            <div class="mb-3">
              <span
                class="px-3 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[11px] font-bold rounded-full border border-red-100 dark:border-red-800"
              >
                Belum Disetujui Oleh:
                {{
                  [
                    leaveRequest.status === "pending"
                      ? formatName({
                          name: leaveRequest.primary_approver_name,
                          full_name: leaveRequest.primary_approver_full_name,
                        })
                      : null,
                    leaveRequest.status_2 === "pending"
                      ? formatName({
                          name: leaveRequest.secondary_approver_name,
                          full_name: leaveRequest.secondary_approver_full_name,
                        })
                      : null,
                    leaveRequest.status_hrd === "pending" ? "HRD" : null,
                  ]
                    .filter(Boolean)
                    .join(", ")
                }}
              </span>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div
      class="border-t border-slate-100 dark:border-slate-800 backdrop-blur-md rounded-b-[24px]"
    >
      <v-btn
        target="_blank"
        to="/manage-attendance/leave-request"
        block
        color="#6962e9"
        variant="flat"
        rounded="xl"
        size="large"
        class="text-none cursor-pointer !text-white font-bold"
      >
        Lihat Semua
        <v-icon end>mdi-arrow-right</v-icon>
      </v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import type { LeaveRequestParams } from "@/api/modules/highlight.api";
import { useDateFormatter } from "@/composables/UseDateFormatter";
import { useFormatName } from "@/composables/useFormatName";
import { useBranchStore } from "@/stores/branch.store";
import { useHighlightStore } from "@/stores/highlight.store";
import { useLeaveTypeStore } from "@/stores/leave_type.store";
import { computed, onMounted, reactive, ref, watch } from "vue";
const showFilter = ref(false);

const higlightStore = useHighlightStore();
const branchStore = useBranchStore();
const leaveTypeStore = useLeaveTypeStore();
const { formatName } = useFormatName();
const { toFullDateWithDay, toDayMonthYear } = useDateFormatter();

const searchBranch = ref("");
const searchLeaveType = ref("");

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

const listLeaveType = computed(() => {
  const keyword = searchLeaveType.value.toLowerCase();
  return leaveTypeStore.leaveTypeData
    .filter((leaveType) => {
      if (!keyword) return true;

      return (
        leaveType.name.toLowerCase().includes(keyword) ||
        leaveType.code.toLowerCase().includes(keyword)
      );
    })
    .map((leaveType) => ({
      title: leaveType.name,
      value: leaveType.id,
    }));
});

const onSearchBranch = (val: any) => {
  searchBranch.value = val ?? "";
};

const onSearchLeaveType = (val: any) => {
  searchLeaveType.value = val ?? "";
};

const form = reactive<Partial<LeaveRequestParams>>({
  branch_id: undefined,
  hrd_leave_type_id: undefined,
});

watch(
  () => form.hrd_leave_type_id,
  (val) => {
    higlightStore.leaveRequestParams.hrd_leave_type_id = val;
    higlightStore.fetchLeaveRequest?.();
  },
);

watch(
  () => form.branch_id,
  (val) => {
    higlightStore.leaveRequestParams.branch_id = val;
    higlightStore.fetchLeaveRequest?.();
  },
);

onMounted(() => {
  higlightStore.fetchLeaveRequest();
  branchStore.fetchBranchData();
  leaveTypeStore.fetchLeaveTypeData();
});

const getPermitColor = (permit: string) => {
  if (!permit) return "grey";

  const status = permit.toLowerCase();
  if (status.includes("sakit")) return "warning"; // Kuning
  if (status.includes("izin")) return "info"; // Biru
  if (status.includes("cuti")) return "bg-red-700 text-white";

  return "primary"; // Default Biru Vuetify
};
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
