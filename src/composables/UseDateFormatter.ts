const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

const DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export function useDateFormatter() {
  const toDayMonthYear = (dateString: string | undefined | null): string => {
    if (!dateString) return "-";
    const parts = dateString.split("-");
    if (parts.length !== 3) return dateString;
    const [year, month, day] = parts;
    return `${day}-${month}-${year}`;
  };

  const toFullDate = (dateString: string | undefined | null): string => {
    if (!dateString) return "-";
    const parts = dateString.split("-");
    if (parts.length !== 3) return dateString;
    const [year, month, day] = parts;
    const monthIndex = parseInt(month, 10) - 1;
    if (monthIndex < 0 || monthIndex > 11) return dateString;
    return `${parseInt(day, 10)} ${MONTHS[monthIndex]} ${year}`;
  };

  const toDayShortMonth = (dateString: string | undefined | null): string => {
    if (!dateString) return "-";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const dayName = DAYS[date.getDay()];
    const day = date.getDate();
    const month = SHORT_MONTHS[date.getMonth()];

    return `${dayName}, ${day} ${month}`;
  };

  const toRangeYMD = (dates: Date[] | null | undefined): string | undefined => {
    if (!dates || dates.length !== 2) return undefined;

    const format = (date: Date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };

    const start = format(dates[0]);
    const end = format(dates[1]);

    return `${start} - ${end}`;
  };

  const toFullDateWithDay = (dateString: string | undefined | null): string => {
    if (!dateString) return "-";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const dayName = DAYS[date.getDay()];
    const day = date.getDate();
    const month = MONTHS[date.getMonth()];
    const year = date.getFullYear();

    return `${dayName}, ${day} ${month} ${year}`;
  };

  const getDateDiffInfo = (
    dateStr: string | null,
  ): {
    text: string;
    isPassed: boolean;
  } => {
    if (!dateStr) {
      return { text: "-", isPassed: false };
    }
    const [year, month, day] = dateStr.split("-").map(Number);
    const target = new Date(year, month - 1, day);
    const today = new Date();
    target.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      return { text: `lewat ${Math.abs(diffDays)} hari`, isPassed: true };
    }
    if (diffDays === 0) {
      return { text: "hari ini", isPassed: false };
    }
    return { text: `${diffDays} hari lagi`, isPassed: false };
  };

  return {
    toDayMonthYear,
    toFullDate,
    toDayShortMonth,
    toRangeYMD,
    toFullDateWithDay,
    getDateDiffInfo,
  };
}
