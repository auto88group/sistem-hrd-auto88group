// src/composables/useEmployeeStatus.ts

const STATUS_MAP: Record<number, { label: string; container: string }> = {
  6: {
    label: "Training",
    container:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  1: {
    label: "Kontrak",
    container:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  2: {
    label: "Tetap",
    container:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  3: {
    label: "Resign",
    container:
      "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  },
  4: {
    label: "Dikeluarkan",
    container: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  5: {
    label: "Pensiun",
    container:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
  },
};

export function useEmployeeStatus() {
  function statusLabel(id: number): string {
    return STATUS_MAP[id]?.label ?? "-";
  }

  function statusColor(id: number): string {
    return (
      STATUS_MAP[id]?.container ??
      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
    );
  }

  return { statusLabel, statusColor };
}
