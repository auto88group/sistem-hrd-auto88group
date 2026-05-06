import {
  userContractEndApi,
  type UserContractEnd,
  type UserContractEndDatatablesParams,
  type UserContractEndHighlight,
  type UserContractEndHightlightParams,
} from "@/api/modules/user-contract-end.api";

import { defineStore } from "pinia";
import { ref, reactive } from "vue";

export const useUserContractEndStore = defineStore("user-contract-end", () => {
  const userContractEnd = ref<UserContractEnd[]>([]);
  const userContractEndHighlight = ref<UserContractEndHighlight[]>([]);
  const isLoading = ref(false);
  const isHighlightLoading = ref(false);
  const totalRecords = ref(0);

  const params = reactive<UserContractEndDatatablesParams>({
    draw: 1,
    start: 0,
    length: 10,
    user_id: undefined,
    branch_id: undefined,
  });

  const highlightParams = reactive<UserContractEndHightlightParams>({
    branch_id: undefined,
  });

  async function fetchUsers() {
    isLoading.value = true;
    try {
      const res = await userContractEndApi.getDatatables({ ...params });
      userContractEnd.value = res.data;
      totalRecords.value = res.recordsTotal;
      params.draw = res.draw + 1;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchHighlight() {
    isHighlightLoading.value = true;
    try {
      const res = await userContractEndApi.getHighlight({ ...highlightParams });
      userContractEndHighlight.value = res.data;
    } finally {
      isHighlightLoading.value = false;
    }
  }

  return {
    userContractEnd,
    userContractEndHighlight,
    isLoading,
    isHighlightLoading,
    totalRecords,
    params,
    highlightParams,
    fetchUsers,
    fetchHighlight,
  };
});
