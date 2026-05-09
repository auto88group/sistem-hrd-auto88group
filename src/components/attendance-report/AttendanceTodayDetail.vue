<template>
  <v-card class="p-3 rounded-lg space-y-3 shadow-md w-full">
    <v-row>
      <v-col cols="12" md="6">
        <p class="text-center">Peta Lokasi</p>
        <iframe
          width="100%"
          height="500"
          style="border: 0"
          loading="lazy"
          :src="mapSrc"
        ></iframe>
      </v-col>
      <v-col cols="12" md="6">
        <p class="text-center">Gambar</p>
        <a :href="imageUrl" target="_blank" class="text-decoration-none">
          <v-img
            :src="imageUrl"
            alt="Gambar"
            class="mx-auto cursor-pointer"
            height="500"
            aspect-ratio="16/9"
            contain
          >
            <template v-slot:placeholder>
              <div class="w-full h-[500px] flex items-center justify-center">
                <v-progress-circular
                  indeterminate
                  color="grey-lighten-5"
                ></v-progress-circular>
              </div>
            </template>
          </v-img>
        </a>
      </v-col>
    </v-row>
  </v-card>
</template>
<script setup lang="ts">
import { useEmployeeAttendanceRequestStore } from "@/stores/employee-attendance.store";
import { storeToRefs } from "pinia";
import { computed } from "vue";

const baseUrl = import.meta.env.VITE_API_URL;
const store = useEmployeeAttendanceRequestStore();
const { employeeAttendanceDetail: data, detailParams: params } =
  storeToRefs(store);

const mapSrc = computed(() => {
  const lat = store.getInOutLabelAttendanceDetail({
    in: data.value?.latitude_in?.toString(),
    out: data.value?.latitude_out?.toString() ?? "",
    default: "0",
  });

  const lng = store.getInOutLabelAttendanceDetail({
    in: data.value?.longitude_in?.toString(),
    out: data.value?.longitude_out?.toString() ?? "",
    default: "0",
  });

  return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
});
const imageUrl = computed(() => {
  const imageFile =
    params.value.in_out === "in" ? data.value?.image_in : data.value?.image_out;
  const userId = data.value?.user_id;

  return `${baseUrl}/image/employee-attendance/${userId}/${imageFile}`;
});
</script>
