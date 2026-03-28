<template>
  <div class="grid grid-cols-1 gap-6">
    <card-statistik-karyawan />
    <card-statistik-agama />
  </div>
</template>

<script setup lang="ts">
import CardStatistikAgama from "@/components/CardStatistikAgama.vue";
import CardStatistikKaryawan from "@/components/CardStatistikKaryawan.vue";
</script>
