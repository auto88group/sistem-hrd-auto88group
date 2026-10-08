import {
  userDataApprovalApi,
  type UserDataApprovalParams,
  type UserDataApprovalRequest,
} from "@/api/modules/user-data-approval.api";

import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { buildLabels } from "./user-data-approvals.labels";

export type UserDataApprovalView = UserDataApprovalRequest & {
  label: string[];
};

export const useUserDataApprovalStore = defineStore("userDataApproval", () => {
  const requests = ref<UserDataApprovalView[]>([]);
  const total = ref(0);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const params = reactive<UserDataApprovalParams>({
    branch_id: undefined,
    skip: 0,
    per_page: 10,
  });

  async function fetchPending() {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await userDataApprovalApi.getPending({ ...params });

      requests.value = res.data.map((req) => ({
        ...req,
        label: buildLabels(req.item),
      }));
      total.value = res.total;
    } catch (err: any) {
      error.value =
        err?.response?.data?.message ?? "Gagal memuat approval data karyawan";
      requests.value = [];
      total.value = 0;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    requests,
    total,
    isLoading,
    error,
    params,
    fetchPending,
  };
});
