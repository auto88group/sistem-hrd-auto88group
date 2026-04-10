<template>
  <v-menu v-model="menuDate" :close-on-content-click="false">
    <template v-slot:activator="{ props: menuProps }">
      <v-text-field
        v-model="dateRangeText"
        label="Rentang Tanggal"
        prepend-inner-icon="mdi-calendar"
        readonly
        v-bind="menuProps"
        variant="outlined"
        density="compact"
        hide-details
        class="flex-1"
        clearable
        @click:clear="clearDate"
      ></v-text-field>
    </template>

    <v-date-picker
      v-model="internalDates"
      multiple="range"
      @update:model-value="onPickerChange"
    ></v-date-picker>
  </v-menu>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue?: Date[];
  }>(),
  {
    modelValue: () => [],
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: Date[]): void;
}>();

const menuDate = ref(false);
// Gunakan tipe Date[] agar sesuai dengan output default v-date-picker
const internalDates = ref<Date[]>([]);

// Sync props ke internal state dengan deep watch
watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal || newVal.length === 0) {
      internalDates.value = [];
      return;
    }
    // Hanya update jika referensi berbeda atau panjang berbeda
    if (JSON.stringify(newVal) !== JSON.stringify(internalDates.value)) {
      internalDates.value = [...newVal];
    }
  },
  { immediate: true, deep: true },
);

function onPickerChange(val: any) {
  // Vuetify terkadang mengirim single date atau array
  const selection = Array.isArray(val) ? val : [val];

  // Jika sudah memilih 2 tanggal (range lengkap), tutup menu
  if (selection.length >= 2) {
    menuDate.value = false;
  }

  emit("update:modelValue", selection);
}

function clearDate() {
  internalDates.value = [];
  emit("update:modelValue", []);
}

const dateRangeText = computed(() => {
  if (!props.modelValue || props.modelValue.length === 0) return "";

  const sorted = [...props.modelValue].sort(
    (a, b) => a.getTime() - b.getTime(),
  );

  const format = (d: Date) =>
    d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  if (sorted.length === 1) return format(sorted[0]);

  return `${format(sorted[0])} - ${format(sorted[sorted.length - 1])}`;
});
</script>

<style scoped>
/* Menghilangkan efek transparan/pudar pada text field readonly */
:deep(.v-date-picker-month__day--selected button) {
  background: indigo;
  color: white;
}
</style>
