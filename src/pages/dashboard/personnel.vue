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
    <employee-master-approval-card />
    <employee-status-card />
    <education-statistics-card />
    <statistic-file-completeness-card />
  </div>
</template>

<script setup lang="ts">
import EducationStatisticsCard from "@/components/dashboard/EducationStatisticsCard.vue";
import EmployeeMasterApprovalCard from "@/components/dashboard/EmployeeMasterApprovalCard.vue";
import EmployeeStatusCard from "@/components/dashboard/EmployeeStatusCard.vue";
import ExpiringContractsCard from "@/components/dashboard/ExpiringContractsCard.vue";
import GenderStatisticsCard from "@/components/dashboard/GenderStatisticsCard.vue";
import JoinTerminationCard from "@/components/dashboard/JoinTerminationCard.vue";
import ReligionStatisticsCard from "@/components/dashboard/ReligionStatisticsCard.vue";
import StatisticFileCompletenessCard from "@/components/dashboard/StatisticFileCompletenessCard.vue";
import TotalEmployeesCard from "@/components/dashboard/TotalEmployeesCard.vue";
</script>
