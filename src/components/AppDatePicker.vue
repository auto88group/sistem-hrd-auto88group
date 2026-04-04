<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    min-width="auto"
    :disabled="disabled"
  >
    <template v-slot:activator="{ props: menuProps }">
      <v-text-field
        v-bind="{ ...menuProps, ...$attrs }"
        :model-value="formattedDate"
        :rules="rules"
        :disabled="disabled"
        readonly
        hide-details="auto"
        append-inner-icon="mdi-calendar"
        @click:clear="clearDate"
      >
        <template v-if="$slots.label" #label>
          <slot name="label"></slot>
        </template>
      </v-text-field>
    </template>

    <v-date-picker
      v-model="selectedDate"
      :min="min"
      @update:model-value="onDateSelected"
    ></v-date-picker>
  </v-menu>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

// 1. Tambahkan rules ke dalam Interface Props
interface Props {
  modelValue?: string | Date | null;
  rules?: any[];
  disabled?: boolean;
  min?: string | Date;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string | null): void;
}>();

const menu = ref(false);

const selectedDate = ref<Date | null>(
  props.modelValue ? new Date(props.modelValue) : null,
);

watch(
  () => props.modelValue,
  (newVal) => {
    selectedDate.value = newVal ? new Date(newVal) : null;
  },
);

const formattedDate = computed(() => {
  if (!selectedDate.value) return "";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(selectedDate.value);
});

const formatToYMD = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const onDateSelected = (val: unknown) => {
  const dateVal = val as Date;
  menu.value = false;

  const formatted = formatToYMD(dateVal);
  emit("update:modelValue", formatted);
};

const clearDate = () => {
  selectedDate.value = null;
  emit("update:modelValue", null);
};
</script>
<style scoped>
/* Menghilangkan efek transparan/pudar pada text field readonly */
:deep(.v-date-picker-month__day--selected button) {
  background: indigo;
  color: white;
}
</style>
