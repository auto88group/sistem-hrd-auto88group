<template>
  <v-dialog v-model="dialog" max-width="400" persistent>
    <v-card>
      <v-card-title>Pilih Range Bulan</v-card-title>

      <v-card-text>
        <v-date-picker v-model="monthRange" type="month" multiple />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn @click="handleCancel">Batal</v-btn>
        <v-btn color="primary" @click="handleGenerate">Generate</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";

export interface GeneratedSunday {
  tanggal: string;
  note: string;
}

const emit = defineEmits<{
  generated: [items: GeneratedSunday[]];
}>();

const dialog = ref(false);
const monthRange = ref<[string, string] | null>(null);

const monthNames = [
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

function open() {
  monthRange.value = null;
  dialog.value = true;
}

function handleCancel() {
  monthRange.value = null;
  dialog.value = false;
}

function handleGenerate() {
  if (!monthRange.value || monthRange.value.length < 2) return;

  const [start, end] = monthRange.value;
  const startDate = new Date(start + "-01");
  const endDate = new Date(end + "-01");
  const result: GeneratedSunday[] = [];

  while (startDate <= endDate) {
    const year = startDate.getFullYear();
    const month = startDate.getMonth();
    let sundayCount = 0;

    const date = new Date(year, month, 1);
    while (date.getMonth() === month) {
      if (date.getDay() === 0) {
        sundayCount++;
        result.push({
          tanggal: formatDateLocal(date),
          note: `Minggu ke ${sundayCount} ${monthNames[month]}`,
        });
      }
      date.setDate(date.getDate() + 1);
    }

    startDate.setMonth(startDate.getMonth() + 1);
  }

  function formatDateLocal(date: Date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  emit("generated", result);
  dialog.value = false;
}

defineExpose({ open });
</script>
