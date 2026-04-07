import { ref } from "vue";

interface DialogOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  color?: string;
}

const isVisible = ref(false);
const options = ref<DialogOptions>({
  title: "Konfirmasi Hapus",
  message: "Apakah Anda yakin ingin menghapus data ini?",
  confirmText: "Hapus",
  cancelText: "Batal",
  color: "error",
});

let resolvePromise: (value: boolean) => void;

export function useConfirmDialog() {
  const ask = (newOptions?: DialogOptions): Promise<boolean> => {
    if (newOptions) {
      options.value = { ...options.value, ...newOptions };
    }
    isVisible.value = true;

    return new Promise((resolve) => {
      resolvePromise = resolve;
    });
  };

  const confirm = () => {
    isVisible.value = false;
    resolvePromise(true);
  };

  const cancel = () => {
    isVisible.value = false;
    resolvePromise(false);
  };

  return {
    isVisible,
    options,
    ask,
    confirm,
    cancel,
  };
}
