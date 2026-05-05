import {
  userContractEndApi,
  type UserContractEnd,
  type UserContractEndDatatablesParams,
} from "@/api/modules/user-contract-end.api";

import { defineStore } from "pinia";
import { ref, reactive } from "vue";

export const useUserContractEndStore = defineStore("user-contract-end", () => {
  const userContractEnd = ref<UserContractEnd[]>([]);
  const isLoading = ref(false);
  const totalRecords = ref(0);

  const params = reactive<UserContractEndDatatablesParams>({
    draw: 1,
    start: 0,
    length: 10,
    user_id: undefined,
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

  return {
    userContractEnd,
    isLoading,
    totalRecords,
    params,
    fetchUsers,
  };
});
