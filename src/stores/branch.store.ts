import {
  branchApi,
  type BranchDataParams,
  type Branch,
} from "@/api/modules/branch.api";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useBranchStore = defineStore("branch", () => {
  const branchData = ref<Branch[]>([]);
  const isLoadingData = ref(false);

  const branchDataParams = reactive<BranchDataParams>({
    search: "",
  });

  async function fetchBranchData() {
    // kalau data sudah ada, jangan fetch lagi
    if (branchData.value?.length) return;

    isLoadingData.value = true;

    try {
      const res = await branchApi.getData({ ...branchDataParams });
      branchData.value = res.data;
    } finally {
      isLoadingData.value = false;
    }
  }

  return {
    branchData,
    isLoadingData,
    branchDataParams,
    fetchBranchData,
  };
});
