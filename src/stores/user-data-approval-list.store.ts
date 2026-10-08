import {
  userDataApprovalApi,
  type UserDataApprovalRequest,
} from "@/api/modules/user-data-approval.api";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { buildLabels } from "./user-data-approvals.labels";

export type UserDataApprovalListRow = UserDataApprovalRequest & {
  label: string[];
};

export type ApprovalStatusFilter = "pending" | "approved" | "rejected";

export const useUserDataApprovalListStore = defineStore(
  "userDataApprovalList",
  () => {
    const rows = ref<UserDataApprovalListRow[]>([]);
    const total = ref(0);
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const params = reactive({
      branch_id: undefined as number | undefined,
      status: "pending" as ApprovalStatusFilter,
      page: 1,
      itemsPerPage: 10,
    });

    async function fetchList() {
      isLoading.value = true;
      error.value = null;
      try {
        const res = await userDataApprovalApi.getList({
          branch_id: params.branch_id,
          status: params.status,
          skip: (params.page - 1) * params.itemsPerPage,
          per_page: params.itemsPerPage,
        });

        rows.value = res.data.map((req) => ({
          ...req,
          label: buildLabels(req.item),
        }));
        total.value = res.total;
      } catch (err: any) {
        error.value =
          err?.response?.data?.message ?? "Gagal memuat data approval";
        rows.value = [];
        total.value = 0;
      } finally {
        isLoading.value = false;
      }
    }

    return { rows, total, isLoading, error, params, fetchList };
  },
);
