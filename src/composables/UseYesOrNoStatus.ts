// src/composables/useEmployeeStatus.ts

const STATUS_MAP: Record<number, { label: string; container: string }> = {
  1: {
    label: "Ya",
    container:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  0: {
    label: "Tidak",
    container:
      "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  },
};

export function useYesOrNoStatus() {
  function statusYesOrNoLabel(id: number): string {
    return STATUS_MAP[id]?.label ?? "-";
  }

  function statusYesOrNoColor(id: number): string {
    return (
      STATUS_MAP[id]?.container ??
      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
    );
  }

  return { statusYesOrNoLabel, statusYesOrNoColor };
}
