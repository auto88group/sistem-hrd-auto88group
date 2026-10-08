import {
  userDataApprovalApi,
  type UserDataApprovalRequest,
} from "@/api/modules/user-data-approval.api";
import { defineStore } from "pinia";
import { ref } from "vue";

type Decision = "approved" | "rejected";

export const useUserDataApprovalDetailStore = defineStore(
  "userDataApprovalDetail",
  () => {
    const request = ref<UserDataApprovalRequest | null>(null);
    const isLoading = ref(false);
    const isSubmitting = ref(false);
    const error = ref<string | null>(null);
    const submitError = ref<string | null>(null);

    // Satu pengajuan dicari dari daftar milik user itu (sesuai status),
    // karena endpoint detail per id belum diketahui.
    async function fetchDetail(
      id: number,
      userId: string | number,
      status: "pending" | "approved" | "rejected",
    ) {
      isLoading.value = true;
      error.value = null;
      request.value = null;
      try {
        const res = await userDataApprovalApi.getList({
          user_id: userId,
          status,
          skip: 0,
          per_page: 100,
        });

        const found = res.data.find((r) => r.id === id) ?? null;
        if (!found) error.value = "Pengajuan tidak ditemukan.";
        request.value = found;
      } catch (err: any) {
        error.value =
          err?.response?.data?.message ?? "Gagal memuat detail pengajuan";
      } finally {
        isLoading.value = false;
      }
    }

    async function review(id: number, status: Decision, note: string) {
      isSubmitting.value = true;
      submitError.value = null;
      try {
        const res = await userDataApprovalApi.reviewRequest(id, {
          status,
          note: note || undefined,
        });

        // Perbarui tampilan tanpa memuat ulang
        if (request.value && request.value.id === id) {
          request.value = {
            ...request.value,
            status,
            review_note: note || null,
          };
        }
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
      request,
      isLoading,
      isSubmitting,
      error,
      submitError,
      fetchDetail,
      review,
    };
  },
);
