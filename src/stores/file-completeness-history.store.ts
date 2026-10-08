import {
  fileCompletenessDataChangeApi,
  FILE_COMPLETENESS_ENTITY_TYPE,
  type ChangeRequest,
  type ReviewStatus,
} from "@/api/modules/file-completeness-data-change.api";
import { defineStore } from "pinia";
import { ref } from "vue";

const PER_PAGE = 10;

export const useFileCompletenessHistoryStore = defineStore(
  "fileCompletenessHistory",
  () => {
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
        const res = await fileCompletenessDataChangeApi.getHistory({
          user_id: userId,
          status,
          skip: append ? historyRequests.value.length : 0,
          per_page: PER_PAGE,
        });

        const rows = res.data
          .map((req) => ({
            ...req,
            item: (req.item ?? []).filter(
              (i) => i.entity_type === FILE_COMPLETENESS_ENTITY_TYPE,
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
          "Gagal memuat riwayat perubahan kelengkapan berkas";
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
  },
);
