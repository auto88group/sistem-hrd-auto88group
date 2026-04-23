<template>
  <v-menu v-model="menuDate" :close-on-content-click="false">
    <template v-slot:activator="{ props: menuProps }">
      <v-text-field
        v-model="dateRangeText"
        prepend-inner-icon="mdi-calendar"
        readonly
        v-bind="menuProps"
        :rules="props.rules"
        variant="outlined"
        density="compact"
        hide-details="auto"
        class="flex-1"
        clearable
        @click:clear="clearDate"
      >
        <template #label>
          <slot name="label">Rentang Tanggal</slot>
        </template>
      </v-text-field>
    </template>

    <v-date-picker
      v-model="internalDates"
      multiple="range"
      :max="maxDate"
      @update:model-value="onPickerChange"
    ></v-date-picker>
  </v-menu>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue?: string[];
    rules?: any[];
    maxDate?: string;
  }>(),
  {
    modelValue: () => [],
    rules: () => [],
    maxDate: undefined,
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string[]): void; // ✅
}>();

const menuDate = ref(false);
const internalDates = ref<Date[]>([]);

// ✅ Track apakah ini klik pertama (pilih start) atau kedua (pilih end)
const isPickingStart = ref(true);

// Sync props → internal
watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal || newVal.length === 0) {
      internalDates.value = [];
      return;
    }
    const normalized = newVal.map(normalizeToLocalDate);
    if (JSON.stringify(normalized) !== JSON.stringify(internalDates.value)) {
      internalDates.value = normalized;
    }
  },
  { immediate: true, deep: true },
);

// Reset state saat menu dibuka
watch(menuDate, (isOpen) => {
  if (isOpen) {
    isPickingStart.value = true;
  }
});

function normalizeToLocalDate(val: any): Date {
  if (typeof val === "string") {
    const [year, month, day] = val.split("-").map(Number);
    return new Date(year, month - 1, day);
  }
  if (val instanceof Date) {
    return new Date(val.getFullYear(), val.getMonth(), val.getDate());
  }
  return val;
}

function toDateString(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // "2026-04-15"
}

function onPickerChange(val: any) {
  const selection = Array.isArray(val) ? val : [val];
  if (selection.length === 0) return;

  const normalized = [...selection]
    .map(normalizeToLocalDate)
    .sort((a, b) => a.getTime() - b.getTime());

  internalDates.value = normalized;

  if (isPickingStart.value) {
    const start = normalized[0];
    // ✅ Emit string, bukan Date object
    emit("update:modelValue", [toDateString(start), toDateString(start)]);
    isPickingStart.value = false;
  } else {
    const start = normalized[0];
    const end = normalized[normalized.length - 1];
    // ✅ Emit string, bukan Date object
    emit("update:modelValue", [toDateString(start), toDateString(end)]);
    menuDate.value = false;
    isPickingStart.value = true;
  }
}

function clearDate() {
  internalDates.value = [];
  isPickingStart.value = true;
  emit("update:modelValue", []);
}

const dateRangeText = computed(() => {
  if (!props.modelValue || props.modelValue.length === 0) return "";

  const format = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const [start, end] = props.modelValue;

  if (!end || start === end) return format(start);
  return `${format(start)} - ${format(end)}`;
});
</script>

<style scoped>
:deep(.v-date-picker-month__day--selected button) {
  background: indigo;
  color: white;
}
</style>
