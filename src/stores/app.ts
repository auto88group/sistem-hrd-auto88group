import { defineStore } from "pinia";
import { ref } from "vue";
export const useAppStore = defineStore("app", () => {
  const errorMessage = ref("");
  const showErrorSnackbar = ref(false);

  const showSuccessSnackbar = ref(false);
  const successMessage = ref("");

  const dialog = ref(false);

  return {
    errorMessage,
    showErrorSnackbar,
    showSuccessSnackbar,
    successMessage,
    dialog,
  };
});
