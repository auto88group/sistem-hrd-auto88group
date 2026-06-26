<template>
  <v-dialog
    v-model="shiftScheduleStore.isImportDialogOpen"
    max-width="600"
    scrollable
    persistent
  >
    <v-card rounded="lg">
      <v-card-title class="flex items-center gap-2 px-6 pt-5 pb-3">
        <v-icon icon="mdi-upload" color="primary" size="small"></v-icon>
        <span class="text-base font-bold">Import Data Shift</span>
        <v-spacer></v-spacer>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="closeDialog"
        ></v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="p-4">
        <v-form ref="formRef">
          <v-row class="gy-4">
            <v-col cols="12">
              <date-range-picker
                v-model="form.period"
                :rules="[rules.required]"
              >
                <template v-slot:label>
                  Periode<span class="text-red-500">*</span>
                </template>
              </date-range-picker>
            </v-col>

            <v-col cols="12">
              <v-autocomplete
                v-model="form.branch_id"
                :items="listBranch"
                :loading="branchStore.isLoadingData"
                prepend-inner-icon="mdi-map-marker-outline"
                item-title="alias"
                item-value="value"
                placeholder="Pilih cabang (Opsional)"
                variant="outlined"
                density="compact"
                color="primary"
                class="custom-input"
                hide-details="auto"
                clearable
                no-filter
                @update:search="onSearchBranch"
              >
                <template v-slot:label>
                  Cabang
                  <span class="text-xs text-gray-500 font-normal"
                    >(Opsional)</span
                  >
                </template>

                <template v-slot:item="{ props, item }">
                  <v-list-item
                    v-bind="props"
                    :title="item.alias"
                    :subtitle="item.title"
                  />
                </template>
              </v-autocomplete>
            </v-col>

            <v-col cols="12" class="flex justify-end pt-0">
              <v-btn
                color="text-green-600"
                variant="tonal"
                prepend-icon="mdi-download"
                class="text-sm"
                :loading="shiftScheduleStore.isLoadingDownloadTemplate"
                :disabled="!form.period || form.period.length === 0"
                @click="handleDownloadTemplate"
              >
                Download Template Data
              </v-btn>
            </v-col>
          </v-row>

          <v-divider class="my-6"></v-divider>

          <v-row class="gy-4">
            <v-col cols="12">
              <div class="text-sm font-bold mb-2">Upload File Excel</div>
              <v-file-input
                v-model="form.file"
                placeholder="Pilih file excel (.xlsx, .xls)"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-file-excel"
                prepend-icon=""
                accept=".xlsx, .xls"
                show-size
                class="custom-input"
                hide-details="auto"
                :rules="[rules.requiredFile]"
              ></v-file-input>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="px-6 py-4 gap-2 justify-end">
        <v-btn variant="outlined" @click="closeDialog">Batal</v-btn>

        <v-btn
          color="bg-green-500 dark:bg-green-500"
          variant="flat"
          prepend-icon="mdi-upload"
          class="text-white"
          :loading="shiftScheduleStore.isLoadingImport"
          @click="submitImport"
        >
          Import Excel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
/* =========================
 * IMPORTS
 * ========================= */
import { ref, reactive, computed, onMounted } from "vue";
import { useBranchStore } from "@/stores/branch.store";
import { useShiftScheduleStore } from "@/stores/shift-schedule.store";
import DateRangePicker from "../DateRangePicker.vue";
import ExcelJS from "exceljs";
import { useAppStore } from "@/stores/app.ts";

const appStore = useAppStore();
/* =========================
 * REFS & STORES
 * ========================= */
const formRef = ref();
const searchBranch = ref("");

const branchStore = useBranchStore();
const shiftScheduleStore = useShiftScheduleStore();

/* =========================
 * FORM STATE
 * ========================= */
const defaultForm = () => ({
  period: [] as string[],
  branch_id: null as number | null,
  file: [] as File[], // ganti dari null ke []
});

const form = reactive(defaultForm());

/* =========================
 * COMPUTED
 * ========================= */
const listBranch = computed(() => {
  const keyword = searchBranch.value.toLowerCase();

  return branchStore.branchData
    .filter((b) => {
      if (!keyword) return true;
      return (
        b.name.toLowerCase().includes(keyword) ||
        b.alias.toLowerCase().includes(keyword)
      );
    })
    .map((b) => ({
      title: b.name,
      alias: b.alias,
      value: b.id,
    }));
});

/* =========================
 * METHODS
 * ========================= */
const onSearchBranch = (val: any) => {
  searchBranch.value = val ?? "";
};

/* =========================
 * RULES
 * ========================= */
const rules = {
  required: (v: any) =>
    (v !== null && v !== undefined && v !== "" && v.length !== 0) ||
    "Wajib diisi",
  requiredFile: (v: any) => {
    if (!v) return "File excel wajib diupload";
    const files = Array.isArray(v) ? v : [v];
    return files.length > 0 || "File excel wajib diupload";
  },
};

/* =========================
 * FORM ACTIONS
 * ========================= */
function closeDialog() {
  shiftScheduleStore.isImportDialogOpen = false;
  Object.assign(form, defaultForm());
  formRef.value?.resetValidation();
}

function formatDateID(dateString: string) {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
}

async function handleDownloadTemplate() {
  if (!form.period || form.period.length === 0) {
    showError("Silakan pilih periode terlebih dahulu.");
    return;
  }

  shiftScheduleStore.isLoadingDownloadTemplate = true;

  try {
    const formattedPeriod = form.period.join(" - ");

    // 1. Fetch data dari Backend
    const res = await shiftScheduleStore.downloadTemplate({
      period_date: formattedPeriod,
      branch_id: form.branch_id,
    });

    // 2. Inisialisasi Workbook dan Worksheet ExcelJS
    const workbook = new ExcelJS.Workbook();
    // Setting views untuk Freeze Panes (Kolom A,B,C dan Baris 1-6 agar header ikut fix saat di-scroll ke bawah)
    const worksheet = workbook.addWorksheet("Worksheet", {
      views: [{ state: "frozen", xSplit: 3, ySplit: 6 }],
    });

    // Hitung total kolom (6 kolom fix + jumlah hari)
    const totalCols = 6 + res.dates.length;

    // --- ROW 1: JUDUL ---
    worksheet.mergeCells(1, 1, 1, totalCols);
    const titleCell = worksheet.getCell(1, 1);
    titleCell.value = `TEMPLATE IMPORT SHIFT - ${res.branch}`;
    titleCell.font = { bold: true };
    // Tambahkan baris ini untuk rata tengah
    titleCell.alignment = { vertical: "middle", horizontal: "center" };

    // --- ROW 2: PERIODE ---
    worksheet.mergeCells(2, 1, 2, totalCols);
    const periodCell = worksheet.getCell(2, 1);
    periodCell.value = `PERIODE : ${formatDateID(res.start_date)} s/d ${formatDateID(res.end_date)}`;
    periodCell.font = { bold: true };
    // Tambahkan baris ini untuk rata tengah
    periodCell.alignment = { vertical: "middle", horizontal: "center" };

    // --- ROW 4: INSTRUKSI ---
    worksheet.mergeCells(4, 1, 4, totalCols);
    const instructCell = worksheet.getCell(4, 1);
    instructCell.value = "* Masukkan kode shift pada kolom tanggal";
    instructCell.font = { bold: true };
    // Tambahkan baris ini untuk rata tengah
    instructCell.alignment = { vertical: "middle", horizontal: "center" };

    // --- ROW 5 & 6: HEADER KOLOM A - E ---
    const staticHeaders = [
      { col: 1, text: "NO" },
      { col: 2, text: "ID KARYAWAN" },
      { col: 3, text: "EMAIL" }, // col 3
      { col: 4, text: "NAMA KARYAWAN" }, // col 4
      { col: 5, text: "TEAM/DEPARTEMEN" }, // col 5
      { col: 6, text: "JABATAN" }, // col 6
    ];

    staticHeaders.forEach((h) => {
      worksheet.mergeCells(5, h.col, 6, h.col);
      const cell = worksheet.getCell(5, h.col);
      cell.value = h.text;
      cell.font = { bold: true };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
    });

    // --- ROW 5: HEADER PERIODE (MERGE) ---
    worksheet.mergeCells(5, 7, 5, totalCols);
    const headPeriodCell = worksheet.getCell(5, 7);
    headPeriodCell.value = "PERIODE";
    headPeriodCell.font = { bold: true };
    headPeriodCell.alignment = { vertical: "middle", horizontal: "center" };

    // --- ROW 6: TANGGAL & HOLIDAY CHECK ---
    const holidayCols: number[] = []; // Array untuk mencatat index kolom mana saja yang libur
    res.dates.forEach((d: any, index: number) => {
      const colNum = 7 + index;
      const cell = worksheet.getCell(6, colNum);
      const formattedDate = formatDateID(d.date);

      if (d.holiday) {
        // Jika libur: date - holiday
        cell.value = `${formattedDate} - ${d.holiday}`;
        holidayCols.push(colNum); // Catat kolom ini sebagai hari libur
      } else {
        cell.value = formattedDate;
      }

      cell.font = { bold: true };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
    });

    // --- ROW 7 DST: DATA KARYAWAN ---
    let currentRow = 7;
    res.users.forEach((user: any, index: number) => {
      worksheet.getCell(currentRow, 1).value = index + 1; // NO

      const idKaryawanCell = worksheet.getCell(currentRow, 2);
      idKaryawanCell.value = user.employee_id ? String(user.employee_id) : "";
      idKaryawanCell.numFmt = "@";

      worksheet.getCell(currentRow, 3).value = user.email; // EMAIL
      worksheet.getCell(currentRow, 4).value = user.name; // NAMA
      worksheet.getCell(currentRow, 5).value = user.branch; // DEPARTEMEN
      worksheet.getCell(currentRow, 6).value = user.position; // JABATAN

      currentRow++;
    });

    // --- MEWARNAI KOLOM LIBUR JADI MERAH ---
    // Looping dari baris 6 (header tanggal) sampai baris terakhir data (currentRow - 1)
    holidayCols.forEach((colIndex) => {
      for (let r = 6; r < currentRow; r++) {
        const cell = worksheet.getCell(r, colIndex);
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFC7CE" }, // Background merah muda
        };
        cell.font = { ...cell.font, color: { argb: "FF9C0006" } }; // Tulisan merah tua
      }
    });

    // --- OPSIONAL: ATUR LEBAR KOLOM AGAR RAPI ---
    worksheet.getColumn(1).width = 5; // NO
    worksheet.getColumn(2).width = 20; // ID KARYAWAN
    worksheet.getColumn(3).width = 30; // EMAIL
    worksheet.getColumn(4).width = 30; // NAMA
    worksheet.getColumn(5).width = 35; // DEPARTEMEN
    worksheet.getColumn(6).width = 20; // JABATAN
    for (let c = 7; c <= totalCols; c++) {
      worksheet.getColumn(c).width = 15;
    }

    // --- WORKSHEET 2: DATA SHIFT ---
    const worksheetShift = workbook.addWorksheet("Data Shift");

    // Header
    const shiftHeaders = ["CODE", "NAME", "JAM MASUK", "JAM KELUAR"];
    shiftHeaders.forEach((text, index) => {
      const cell = worksheetShift.getCell(1, index + 1);
      cell.value = text;
      cell.font = { bold: true };
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    // Data shifts
    res.shifts.forEach((shift: any, index: number) => {
      const row = index + 2;
      worksheetShift.getCell(row, 1).value = shift.code;
      worksheetShift.getCell(row, 2).value = shift.name;
      worksheetShift.getCell(row, 3).value = shift.time_in;
      worksheetShift.getCell(row, 4).value = shift.time_out;
    });

    // Lebar kolom
    worksheetShift.getColumn(1).width = 15; // CODE
    worksheetShift.getColumn(2).width = 30; // NAME
    worksheetShift.getColumn(3).width = 15; // TIME IN
    worksheetShift.getColumn(4).width = 15; // TIME OUT

    // 4. Generate file dalam bentuk Buffer -> Blob
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // 5. Trigger Download di Browser
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `TEMPLATE_IMPORT_SHIFT_${res.start_date}.xlsx`;

    document.body.appendChild(link);
    link.click();

    // Bersihkan DOM dan Object URL
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    showSuccess("Template berhasil diunduh.");
  } catch (err: any) {
    showError(err?.message ?? "Gagal mengunduh template.");
  } finally {
    shiftScheduleStore.isLoadingDownloadTemplate = false;
  }
}

function showError(message: string) {
  appStore.errorMessage = message;
  appStore.showErrorSnackbar = true;
}

function showSuccess(message: string) {
  appStore.successMessage = message;
  appStore.showSuccessSnackbar = true;
}
async function submitImport() {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  try {
    const file = Array.isArray(form.file) ? form.file[0] : form.file;
    if (!file) {
      showError("File excel wajib diupload.");
      return;
    }

    const res = await shiftScheduleStore.importExcel({
      file: file,
      branch_id: form.branch_id,
    });

    if (res.success) {
      showSuccess(res.message ?? "Import berhasil.");
      closeDialog();
      shiftScheduleStore.fetchShiftSchedule(); // refresh tabel
    } else {
      showError(res.message ?? "Import gagal.");
    }
  } catch (err: any) {
    // Tampilkan pesan error dari backend (termasuk daftar baris yang error)
    const message =
      err?.response?.data?.message ?? err?.message ?? "Gagal import data.";
    showError(message);
  }
}
/* =========================
 * LIFECYCLE
 * ========================= */
onMounted(() => {
  // Pastikan data branch tersedia saat komponen di render
  if (branchStore.branchData.length === 0) {
    // Asumsi function fetchBranchData tersedia di branchStore-mu
    // branchStore.fetchBranchData();
  }
});
</script>
