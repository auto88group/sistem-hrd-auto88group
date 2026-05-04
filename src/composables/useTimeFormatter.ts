export function useTimeFormatter() {
  const toReadableTime = (timeString: string | null | undefined): string => {
    if (!timeString) return "-";

    const parts = timeString.split(":");
    if (parts.length !== 3) return timeString;

    let [hours, minutes, seconds] = parts.map((p) => parseInt(p, 10));

    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
      return timeString;
    }

    const result: string[] = [];

    if (hours > 0) {
      result.push(`${hours} Jam`);
    }

    if (minutes > 0) {
      result.push(`${minutes} Menit`);
    }

    if (seconds > 0) {
      result.push(`${seconds} Detik`);
    }

    // kalau semuanya 0
    if (result.length === 0) {
      return "0 Detik";
    }

    return result.join(" ");
  };

  return {
    toReadableTime,
  };
}
