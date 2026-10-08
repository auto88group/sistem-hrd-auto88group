import {
  familyDataChangeApi,
  type ChangeRequest,
  type ReviewStatus,
} from "@/api/modules/family-data-change.api";
import { defineStore } from "pinia";
import { ref } from "vue";

const PER_PAGE = 10;

export const useFamilyHistoryStore = defineStore("familyHistory", () => {
  const historyRequests = ref<ChangeRequest[]>([]);
  const isLoading = ref(false);
  const isLoadingMore = ref(false);
  const error = ref<string | null>(null);
  const hasMore = ref(false);
  const total = ref(0);

  async function fetchHistory(
    userId: string | number,
    status?: ReviewStatus,
    append = false,
  ) {
    if (append) isLoadingMore.value = true;
    else {
      isLoading.value = true;
      historyRequests.value = [];
    }
    error.value = null;

    try {
      const res = await familyDataChangeApi.getHistory({
        user_id: userId,
        status,
        skip: append ? historyRequests.value.length : 0,
        per_page: PER_PAGE,
      });

      const rows = res.data
        .map((req) => ({
          ...req,
          item: (req.item ?? []).filter(
            (i) => i.entity_type === "hrd_families",
          ),
        }))
        .filter((req) => req.item.length > 0);

      historyRequests.value = append
        ? [...historyRequests.value, ...rows]
        : rows;
      hasMore.value = res.has_more;
      total.value = res.total;
    } catch (err: any) {
      error.value =
        err?.response?.data?.message ??
        "Gagal memuat riwayat perubahan data keluarga";
      if (!append) historyRequests.value = [];
    } finally {
      isLoading.value = false;
      isLoadingMore.value = false;
    }
  }

  return {
    historyRequests,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    total,
    fetchHistory,
  };
});
