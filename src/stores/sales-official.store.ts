import {
  salesOfficialApi,
  type LastSequenceSalesParams,
} from "@/api/modules/sales-official.api";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useSalesOfficialStore = defineStore("sales-official", () => {
  const lastSequenceSales = ref(0);
  const isLoadingLastSequenceSales = ref(false);

  const lastSequenceSalesParams = reactive<LastSequenceSalesParams>({
    level: "",
  });

  async function fetchLastSequence() {
    isLoadingLastSequenceSales.value = true;
    try {
      const res = await salesOfficialApi.getLastSequenceSales({
        ...lastSequenceSalesParams,
      });
      lastSequenceSales.value = res.data;
    } finally {
      isLoadingLastSequenceSales.value = false;
    }
  }

  return {
    lastSequenceSales,
    isLoadingLastSequenceSales,
    lastSequenceSalesParams,
    fetchLastSequence,
  };
});
