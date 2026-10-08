import {
  familyDataChangeApi,
  type ReviewStatus,
} from "@/api/modules/family-data-change.api";
import { defineStore } from "pinia";
import { ref } from "vue";

// Tipe satu request, diturunkan dari response API
type PendingResponse = Awaited<
  ReturnType<typeof familyDataChangeApi.getPending>
>;
type PendingRequest = PendingResponse["data"][number];

export const useFamilyDataChange = defineStore("familyPending", () => {
  const pendingRequests = ref<PendingRequest[]>([]);
  const isLoading = ref(false);
  const isSubmitting = ref(false);
  const error = ref<string | null>(null);
  const submitError = ref<string | null>(null);

  async function fetchPending(userId: string | number) {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await familyDataChangeApi.getPending({ user_id: userId });

      // Satu request bisa berisi beberapa jenis perubahan.
      // Simpan per request, tapi hanya item hrd_families.
      pendingRequests.value = res.data
        .map((req) => ({
          ...req,
          item: (req.item ?? []).filter(
            (i) => i.entity_type === "hrd_families",
          ),
        }))
        .filter((req) => req.item.length > 0);
    } catch (err: any) {
      error.value =
        err?.response?.data?.message ??
        "Gagal memuat perubahan data keluarga yang pending";
      pendingRequests.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  async function reviewRequest(id: number, status: ReviewStatus, note: string) {
    isSubmitting.value = true;
    submitError.value = null;
    try {
      const res = await familyDataChangeApi.reviewRequest(id, {
        status,
        note: note || undefined,
      });
      // Sudah diproses, tidak pending lagi
      pendingRequests.value = pendingRequests.value.filter((r) => r.id !== id);
      return res;
    } catch (err: any) {
      submitError.value =
        err?.response?.data?.message ??
        err?.message ??
        "Gagal memproses pengajuan";
      throw err;
    } finally {
      isSubmitting.value = false;
    }
  }

  return {
    pendingRequests,
    isLoading,
    isSubmitting,
    error,
    submitError,
    fetchPending,
    reviewRequest,
  };
});
