<template>
  <div class="space-y-4 md:space-y-0 md:grid grid-cols-2 md:gap-6">
    <div class="col-span-2">
      <gender-statistics-card />
    </div>
    <div class="col-span-2">
      <religion-statistics-card />
    </div>
    <total-employees-card />
    <expiring-contracts-card />
    <join-termination-card />
  </div>
</template>

<script setup lang="ts">
import ExpiringContractsCard from "@/components/ExpiringContractsCard.vue";
import GenderStatisticsCard from "@/components/GenderStatisticsCard.vue";
import JoinTerminationCard from "@/components/JoinTerminationCard.vue";
import ReligionStatisticsCard from "@/components/ReligionStatisticsCard.vue";
import TotalEmployeesCard from "@/components/TotalEmployeesCard.vue";
</script>
