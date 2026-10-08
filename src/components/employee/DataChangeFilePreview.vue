<template>
  <a
    :href="url"
    target="_blank"
    rel="noopener noreferrer"
    :title="`Buka ${fileName}`"
    class="inline-flex w-40 flex-col overflow-hidden rounded-md border hover:shadow-md transition-shadow"
  >
    <div
      class="flex h-28 items-center justify-center bg-gray-100 dark:bg-gray-700"
    >
      <img
        v-if="isImage && !imgFailed"
        :src="url"
        :alt="fileName"
        loading="lazy"
        class="h-full w-full object-cover"
        @error="imgFailed = true"
      />
      <v-icon
        v-else
        :icon="isPdf ? 'mdi-file-pdf-box' : 'mdi-file-outline'"
        :color="isPdf ? 'red-500' : undefined"
        size="48"
      ></v-icon>
    </div>
    <div
      class="flex min-w-0 items-center gap-1 px-2 py-1 text-xs text-gray-600 dark:text-gray-300"
    >
      <v-icon icon="mdi-open-in-new" size="x-small"></v-icon>
      <span class="truncate">{{ fileName }}</span>
    </div>
  </a>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

// Pratinjau file pengajuan perubahan data (gambar / PDF), mis. certificate,
// transcripts, attachment.
//   folder   : folder di server, mis. "hrd-education" atau "work-experience"
//   userId   : id user pemilik file
//   fileName : nilai new_value / old_value dari field file
// URL: VITE_API_URL/image/{folder}/{userId}/{fileName}
const props = defineProps<{
  folder: string;
  userId: string | number;
  fileName: string;
}>();

const imgFailed = ref(false);

const IMAGE_EXTS = ["jpg", "jpeg", "png", "gif", "webp", "bmp"];

const ext = computed(
  () => props.fileName.split(".").pop()?.toLowerCase() ?? "",
);
const isImage = computed(() => IMAGE_EXTS.includes(ext.value));
const isPdf = computed(() => ext.value === "pdf");

const url = computed(() => {
  const base = String(import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");
  const folder = props.folder.replace(/^\/+|\/+$/g, "");
  return `${base}/image/${folder}/${encodeURIComponent(
    String(props.userId),
  )}/${encodeURIComponent(props.fileName)}`;
});
</script>
