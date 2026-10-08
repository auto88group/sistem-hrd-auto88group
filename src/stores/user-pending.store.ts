import {
  userDataChangeApi,
  USER_ENTITY_TYPE,
  type UserChangeRequest,
  type UserReviewStatus,
} from "@/api/modules/user-data-change.api";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserPendingStore = defineStore("userDataPending", () => {
  const pendingRequests = ref<UserChangeRequest[]>([]);
  const isLoading = ref(false);
  const isSubmitting = ref(false);
  const error = ref<string | null>(null);
  const submitError = ref<string | null>(null);

  async function fetchPending(userId: string | number) {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await userDataChangeApi.getPending({ user_id: userId });

      // Satu request bisa berisi beberapa jenis perubahan.
      // Simpan per request, tapi hanya item data karyawan (users).
      pendingRequests.value = res.data
        .map((req) => ({
          ...req,
          item: (req.item ?? []).filter(
            (i) => i.entity_type === USER_ENTITY_TYPE,
          ),
        }))
        .filter((req) => req.item.length > 0);
    } catch (err: any) {
      error.value =
        err?.response?.data?.message ??
        "Gagal memuat perubahan data karyawan yang pending";
      pendingRequests.value = [];
    } finally {
      isLoading.value = false;
    }
  }

  async function reviewRequest(
    id: number,
    status: UserReviewStatus,
    note: string,
  ) {
    isSubmitting.value = true;
    submitError.value = null;
    try {
      const res = await userDataChangeApi.reviewRequest(id, {
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
