import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import type {
  Branch,
  Coordinate,
  Position,
  MasterEducation,
  BloodType,
  Religion,
  MaritalStatus,
} from "@/api/modules/import-user.api";

// ==================== TYPES ====================

export interface TemplateUserData {
  branch: Branch[];
  coordinate: Coordinate[];
  position: Position[];
  masterEducation: MasterEducation[];
  bloodType: BloodType[];
  religion: Religion[];
  maritalStatus: MaritalStatus[];
}

// ==================== FILL STYLES ====================

const FILL_YELLOW_HEADER: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFFFFF00" },
};

const FILL_RED: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFFF0000" },
};

const FILL_GRAY_SOFT: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFD9D9D9" },
};

const FILL_LIGHT_YELLOW: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFFFF2CC" },
};

const THIN_BORDER: Partial<ExcelJS.Borders> = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" },
};

// ==================== CONSTANTS ====================

const INPUT_HEADERS: string[] = [
  "HEADER",
  "NO",
  "NIK",
  "ID KARYAWAN",
  "NICKNAME",
  "NAMA LENGKAP",
  "EMAIL",
  "PASSWORD",
  "JENIS KELAMIN",
  "JABATAN",
  "DEPARTEMEN/TEAM",
  "LOKASI ABSEN",
  "STATUS KERJA",
  "TGL AWAL STATUS KERJA",
  "TANGGAL AKHIR STATUS KERJA",
  "TANGGAL BERGABUNG",
  "ID ATASAN 1",
  "ID ATASAN 2",
  "PENDIDIKAN TERAKHIR",
  "GELAR DEPAN",
  "GELAR BELAKANG",
  "STATUS PERNIKAHAN",
  "GOL. DARAH",
  "TEMPAT LAHIR",
  "TGL LAHIR",
  "AGAMA",
  "BPJS KETENAGAKERJAAN",
  "BPJS KESEHATAN",
  "JUMLAH ANAK",
  "NOMOR HP DARURAT",
  "NAMA KONTAK DARURAT",
  "ALAMAT KTP",
  "ALAMAT DOMISILI",
];

const EXAMPLE_ROW: (string | number)[] = [
  "CONTOH ISIAN",
  "#",
  "1111111111111111",
  "101123",
  "Budi",
  "Budi Utomo",
  "budiutomo@gmail.com",
  "12345678",
  "Input ID (Cth. M atau F)",
  "Input ID (Cth. 1)",
  "Input Code (Cth. HO)",
  "Input ID (Cth. 1)",
  "Input ID (Cth. 1)",
  "1/2/2026",
  "1/5/2026",
  "1/2/2026",
  "101120",
  "-",
  "Input ID (Cth. 1)",
  "-",
  "-",
  "Input ID (Cth. 1)",
  "Input ID (Cth. 1)",
  "-",
  "25/12/2026",
  "Input ID (Cth. 1)",
  "",
  "",
  "0",
  "",
  "",
  "",
  "",
];

// Lebar kolom INPUT sheet (urut sesuai INPUT_HEADERS)
const INPUT_COL_WIDTHS: number[] = [
  20, // HEADER
  6, // NO
  22, // NIK
  16, // ID KARYAWAN
  16, // NICKNAME
  26, // NAMA LENGKAP
  30, // EMAIL
  16, // PASSWORD
  20, // JENIS KELAMIN
  16, // JABATAN
  22, // DEPARTEMEN/TEAM
  16, // LOKASI ABSEN
  16, // STATUS KERJA
  24, // TGL AWAL STATUS KERJA
  28, // TANGGAL AKHIR STATUS KERJA
  22, // TANGGAL BERGABUNG
  16, // ID ATASAN 1
  16, // ID ATASAN 2
  24, // PENDIDIKAN TERAKHIR
  16, // GELAR DEPAN
  18, // GELAR BELAKANG
  22, // STATUS PERNIKAHAN
  14, // GOL. DARAH
  20, // TEMPAT LAHIR
  16, // TGL LAHIR
  12, // AGAMA
  26, // BPJS KETENAGAKERJAAN
  22, // BPJS KESEHATAN
  16, // JUMLAH ANAK
  22, // NOMOR HP DARURAT
  26, // NAMA KONTAK DARURAT
  30, // ALAMAT KTP
  30, // ALAMAT DOMISILI
];

// ==================== HELPERS ====================

/**
 * Buat sheet data referensi dengan header kuning bold (ID/CODE + NAME)
 */
function createDataSheet(
  workbook: ExcelJS.Workbook,
  sheetName: string,
  headers: string[],
  rows: (string | number)[][],
): void {
  const sheet = workbook.addWorksheet(sheetName);

  sheet.columns = headers.map(() => ({ width: 20 }));

  const headerRow = sheet.addRow(headers);
  headerRow.height = 25;
  headerRow.eachCell({ includeEmpty: true }, (cell) => {
    cell.fill = FILL_YELLOW_HEADER;
    cell.font = { bold: true };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = THIN_BORDER;
  });

  rows.forEach((rowData) => {
    const row = sheet.addRow(rowData);
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.alignment = { vertical: "middle", horizontal: "left" };
      cell.border = THIN_BORDER;
    });
  });
}

// ==================== MAIN FUNCTION ====================

export async function generateTemplateUser(
  data: TemplateUserData,
): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "System";
  workbook.created = new Date();

  // ==================== SHEET INPUT ====================

  const inputSheet = workbook.addWorksheet("INPUT");

  inputSheet.columns = INPUT_HEADERS.map((_, i) => ({
    width: INPUT_COL_WIDTHS[i] ?? 15,
    style: { numFmt: "@" }, // <--- Tambahkan baris ini
  }));

  // --- Row 1: Headers ---
  const row1 = inputSheet.addRow(INPUT_HEADERS);
  row1.height = 35;

  row1.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    cell.border = THIN_BORDER;

    if (colNumber === 1) {
      // Kolom A: abu soft
      cell.fill = FILL_GRAY_SOFT;
      cell.font = { bold: true };
    } else if (colNumber >= 4 && colNumber <= 17) {
      // D1:Q1 — merah, putih, bold
      cell.fill = FILL_RED;
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    }
  });

  // --- Row 2: Contoh isian ---
  const row2 = inputSheet.addRow(EXAMPLE_ROW);
  row2.height = 25;

  row2.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };

    if (colNumber === 1) {
      // Kolom A tetap abu soft
      cell.fill = FILL_GRAY_SOFT;
      cell.font = { bold: true };
    } else {
      cell.fill = FILL_LIGHT_YELLOW;
    }
  });

  // --- Row 3: Instruksi ---
  const row3 = inputSheet.addRow(["LANJUT ISI DARI BARIS INI"]);
  row3.height = 22;

  const cellA3 = inputSheet.getCell("A3");
  cellA3.fill = FILL_GRAY_SOFT;
  cellA3.font = { bold: true };
  cellA3.alignment = { vertical: "middle", horizontal: "center" };

  // Freeze row 1 agar header tetap terlihat saat scroll
  inputSheet.views = [{ state: "frozen", xSplit: 0, ySplit: 1 }];

  // ==================== SHEET DEPARTEMEN - TEAM ====================

  createDataSheet(
    workbook,
    "DEPARTEMEN - TEAM",
    ["CODE", "NAME"],
    data.branch.map((item) => [item.code, item.name]),
  );

  // ==================== SHEET LOKASI ABSEN ====================

  createDataSheet(
    workbook,
    "LOKASI ABSEN",
    ["ID", "NAME"],
    data.coordinate.map((item) => [item.id, item.name]),
  );

  // ==================== SHEET JABATAN ====================

  createDataSheet(
    workbook,
    "JABATAN",
    ["ID", "NAME"],
    data.position.map((item) => [item.id, item.name]),
  );

  // ==================== SHEET STATUS KERJA ====================

  createDataSheet(
    workbook,
    "STATUS KERJA",
    ["ID", "NAME"],
    [
      [1, "Kontrak"],
      [2, "Tetap"],
      [3, "Resign"],
      [4, "Dikeluarkan"],
      [5, "Pensiun"],
    ],
  );

  // ==================== SHEET PENDIDIKAN TERAKHIR ====================

  createDataSheet(
    workbook,
    "PENDIDIKAN TERAKHIR",
    ["ID", "NAME"],
    data.masterEducation.map((item) => [item.id, item.name]),
  );

  // ==================== SHEET GOLONGAN DARAH ====================

  createDataSheet(
    workbook,
    "GOLONGAN DARAH",
    ["ID", "NAME"],
    data.bloodType.map((item) => [item.id, item.name]),
  );

  // ==================== SHEET AGAMA ====================

  createDataSheet(
    workbook,
    "AGAMA",
    ["ID", "NAME"],
    data.religion.map((item) => [item.id, item.name]),
  );

  // ==================== SHEET STATUS PERNIKAHAN ====================

  createDataSheet(
    workbook,
    "STATUS PERNIKAHAN",
    ["ID", "NAME"],
    data.maritalStatus.map((item) => [item.id, item.name]),
  );

  // ==================== DOWNLOAD ====================

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, "template-import-user.xlsx");
}
