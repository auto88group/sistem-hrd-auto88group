import {
  trainingCertificateDataChangeApi,
  TRAINING_CERTIFICATE_ENTITY_TYPE,
  type ChangeRequest,
  type ReviewStatus,
} from "@/api/modules/training-certificate-data-change.api";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useTrainingCertificatePendingStore = defineStore(
  "trainingCertificatePending",
  () => {
    const pendingRequests = ref<ChangeRequest[]>([]);
    const isLoading = ref(false);
    const isSubmitting = ref(false);
    const error = ref<string | null>(null);
    const submitError = ref<string | null>(null);

    async function fetchPending(userId: string | number) {
      isLoading.value = true;
      error.value = null;
      try {
        const res = await trainingCertificateDataChangeApi.getPending({
          user_id: userId,
        });

        // Satu request bisa berisi beberapa jenis perubahan.
        // Simpan per request, tapi hanya item sertifikat pelatihan.
        pendingRequests.value = res.data
          .map((req) => ({
            ...req,
            item: (req.item ?? []).filter(
              (i) => i.entity_type === TRAINING_CERTIFICATE_ENTITY_TYPE,
            ),
          }))
          .filter((req) => req.item.length > 0);
      } catch (err: any) {
        error.value =
          err?.response?.data?.message ??
          "Gagal memuat perubahan data sertifikat pelatihan yang pending";
        pendingRequests.value = [];
      } finally {
        isLoading.value = false;
      }
    }

    async function reviewRequest(
      id: number,
      status: ReviewStatus,
      note: string,
    ) {
      isSubmitting.value = true;
      submitError.value = null;
      try {
        const res = await trainingCertificateDataChangeApi.reviewRequest(id, {
          status,
          note: note || undefined,
        });
        // Sudah diproses, tidak pending lagi
        pendingRequests.value = pendingRequests.value.filter(
          (r) => r.id !== id,
        );
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
  },
);
