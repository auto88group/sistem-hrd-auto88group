<template>
  <div v-if="userStore.isLoadingSelected">
    <v-card v-for="n in 3" :key="n" flat class="p-3">
      <v-skeleton-loader
        type="heading, divider, list-item-two-line@3"
        elevation="0"
      ></v-skeleton-loader>
    </v-card>
  </div>
  <v-card v-else flat class="p-3">
    <div class="flex justify-end w-full gap-2">
      <v-btn
        color="bg-gray-300 dark:bg-gray-600 text-indigo-900 dark:text-indigo-100 text-sm"
        prepend-icon="mdi-cloud-print"
        variant="flat"
        >Cetak Biodata</v-btn
      >
      <v-btn
        color="bg-gray-300 dark:bg-gray-600 text-indigo-900 dark:text-indigo-100 text-sm"
        prepend-icon="mdi-pencil-box"
        variant="flat"
        @click="$emit('edit')"
        >Edit Data</v-btn
      >
    </div>

    <div class="flex flex-col gap-5">
      <v-card elevation="0">
        <v-card-title
          class="text-indigo-600 dark:text-indigo-400 font-bold px-0 text-base"
        >
          Data Diri
        </v-card-title>

        <v-divider class="mb-6"></v-divider>
        <v-row gap="15">
          <v-col cols="12" md="6">
            <div class="text-gray-500 text-sm">NIK</div>
            <div class="font-bold text-sm">
              {{ userStore.usersSelected?.nik ?? "-" }}
            </div>
          </v-col>
          <v-col cols="12" md="3">
            <div class="text-gray-500 text-sm">Nickname</div>
            <div class="font-bold text-sm">
              {{ userStore.usersSelected?.name ?? "-" }}
            </div>
          </v-col>
          <v-col cols="12" md="3">
            <div class="text-gray-500 text-sm">Nama Lengkap</div>
            <div class="font-bold text-sm">
              {{ userStore.usersSelected?.full_name ?? "-" }}
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <div class="text-gray-500 text-sm">Pendidikan Terakhir</div>
            <div class="font-bold text-sm">
              {{ userStore.usersSelected?.education?.name ?? "-" }}
            </div>
          </v-col>
          <v-col cols="12" md="6"> </v-col>
          <v-col cols="12" md="6">
            <div class="text-gray-500 text-sm">Gelar Depan</div>
            <div class="font-bold text-sm">
              {{ userStore.usersSelected?.front_title ?? "-" }}
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="text-gray-500 text-sm">Gelar Belakang</div>
            <div class="font-bold text-sm">
              {{ userStore.usersSelected?.back_title ?? "-" }}
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <div class="text-gray-500 text-sm">Nomor HP</div>
            <div class="font-bold text-sm">
              {{ userStore.usersSelected?.phone_number ?? "-" }}
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="text-gray-500 text-sm">Email</div>
            <div class="font-bold text-sm">
              {{ userStore.usersSelected?.email ?? "-" }}
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="text-gray-500 text-sm">Jenis Kelamin</div>
            <div class="font-bold text-sm">
              {{
                userStore.usersSelected?.gender == null
                  ? "-"
                  : userStore.usersSelected.gender == "M"
                    ? "Laki-Laki"
                    : "Perempuan"
              }}
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="text-gray-500 text-sm">Status Pernikahan</div>
            <div class="font-bold text-sm">
              {{ userStore.usersSelected?.marital_status?.name ?? "-" }}
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="text-gray-500 text-sm">Golongan Darah</div>
            <div class="font-bold text-sm">
              {{ userStore.usersSelected?.blood_type?.name ?? "-" }}
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <div class="text-gray-500 text-sm">Tempat Lahir</div>
            <div class="font-bold text-sm">
              {{ userStore.usersSelected?.birth_place ?? "-" }}
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="text-gray-500 text-sm">Tanggal Lahir</div>
            <div class="font-bold text-sm">
              {{ toDayMonthYear(userStore.usersSelected?.birth_date) }}
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="text-gray-500 text-sm">Agama</div>
            <div class="font-bold text-sm">
              {{ userStore.usersSelected?.religion?.name ?? "-" }}
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="text-gray-500 text-sm">Nomor BPJS Kesehatan</div>
            <div class="font-bold text-sm">
              {{ userStore.usersSelected?.bpjs_health_number ?? "-" }}
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="text-gray-500 text-sm">Nomor BPJS Ketenagakerjaan</div>
            <div class="font-bold text-sm">
              {{ userStore.usersSelected?.bpjs_employment_number ?? "-" }}
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="text-gray-500 text-sm">Jumlah Anak</div>
            <div class="font-bold text-sm">
              {{ userStore.usersSelected?.number_of_children ?? "-" }}
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="text-gray-500 text-sm">Nomor HP Darurat</div>
            <div class="font-bold text-sm">
              {{ userStore.usersSelected?.emergency_phone_number ?? "-" }}
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="text-gray-500 text-sm">Nama Kontak Darurat</div>
            <div class="font-bold text-sm">
              {{ userStore.usersSelected?.emergency_contact_name ?? "-" }}
            </div>
          </v-col>
        </v-row>
      </v-card>

      <v-card elevation="0">
        <v-card-title
          class="text-indigo-600 dark:text-indigo-400 font-bold px-0 text-base"
        >
          Foto Profil
        </v-card-title>
        <v-divider class="mb-4"></v-divider>
        <div v-if="userStore.usersSelected?.image">
          <v-img
            :src="
              apiUrl +
              '/image/user-profile/' +
              userStore.usersSelected.id +
              '/' +
              userStore.usersSelected.image
            "
            max-width="200"
            aspect-ratio="1/1"
            class="rounded-lg bg-grey-lighten-2"
          ></v-img>
        </div>

        <div v-else class="font-bold text-sm">-</div>
      </v-card>

      <v-card elevation="0">
        <v-card-title
          class="text-indigo-600 dark:text-indigo-400 font-bold px-0 text-base"
        >
          Data Alamat(Sesuai KTP)
        </v-card-title>
        <v-divider class="mb-4"></v-divider>
        <div class="font-bold text-sm">
          {{ userStore.usersSelected?.address_id_card ?? "-" }}
        </div>
      </v-card>

      <v-card elevation="0">
        <v-card-title
          class="text-indigo-600 dark:text-indigo-400 font-bold px-0 text-base"
        >
          Data Alamat(Domisili)
        </v-card-title>

        <v-divider class="mb-6"></v-divider>
        <v-row gap="15">
          <v-col cols="12" md="6">
            <div class="text-gray-500 text-sm">Provinsi</div>
            <div class="font-bold text-sm">
              {{ userStore.usersSelected?.province?.name ?? "-" }}
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="text-gray-500 text-sm">Kabupaten</div>
            <div class="font-bold text-sm">
              {{ userStore.usersSelected?.regency?.name ?? "-" }}
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <div class="text-gray-500 text-sm">Kecamatan</div>
            <div class="font-bold text-sm">
              {{ userStore.usersSelected?.disctrict?.name ?? "-" }}
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="text-gray-500 text-sm">Kelurahan</div>
            <div class="font-bold text-sm">
              {{ userStore.usersSelected?.village?.name ?? "-" }}
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="text-gray-500 text-sm">RT</div>
            <div class="font-bold text-sm">
              {{ userStore.usersSelected?.neighborhood_unit ?? "-" }}
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <div class="text-gray-500 text-sm">RW</div>
            <div class="font-bold text-sm">
              {{ userStore.usersSelected?.community_unit ?? "-" }}
            </div>
          </v-col>
          <v-col cols="12" md="12">
            <div class="text-gray-500 text-sm">Alamat</div>
            <div class="font-bold text-sm">
              {{ userStore.usersSelected?.current_address ?? "-" }}
            </div>
          </v-col>
          <v-col cols="12" md="12">
            <div class="text-gray-500 text-sm">Kode Pos</div>
            <div class="font-bold text-sm">
              {{ userStore.usersSelected?.zip_code ?? "-" }}
            </div>
          </v-col>
        </v-row>
      </v-card>

      <v-card elevation="0">
        <v-card-title
          class="text-indigo-600 dark:text-indigo-400 font-bold px-0 text-base"
        >
          Data Kepegawaian
        </v-card-title>
        <v-divider class="mb-6"></v-divider>
        <v-row gap="15">
          <v-col cols="12" md="12">
            <div class="text-gray-500 text-sm">ID Karyawan</div>
            <div class="font-bold text-sm">
              {{ userStore.usersSelected?.employee_id ?? "-" }}
            </div>
          </v-col>
          <v-col
            cols="12"
            md="6"
            v-if="
              userStore.usersSelected?.telemarketing &&
              userStore.usersSelected.level === 'telemarketing'
            "
          >
            <div class="text-gray-500 text-sm">Inisial</div>
            <div class="font-bold text-sm">
              {{ userStore.usersSelected?.telemarketing?.inisial ?? "-" }}
            </div>
          </v-col>

          <v-col
            cols="12"
            md="6"
            v-if="
              userStore.usersSelected?.telemarketing &&
              (userStore.usersSelected.level === 'telemarketing' ||
                userStore.usersSelected.level === 'admin_telemarketing')
            "
          >
            <div class="text-gray-500 text-sm">Urutan</div>
            <div class="font-bold text-sm">
              {{ userStore.usersSelected?.telemarketing?.urutan ?? "-" }}
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="text-gray-500 text-sm">Jabatan</div>
            <div class="font-bold text-sm">
              {{ userStore.usersSelected?.position ?? "-" }}
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="text-gray-500 text-sm">Cabang</div>
            <div class="font-bold text-sm">
              {{ userStore.usersSelected?.branch?.name ?? "-" }}
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <div class="text-gray-500 text-sm">Jatah Cuti</div>
            <div class="font-bold text-sm">
              {{ userStore.usersSelected?.remaining_leave ?? "-" }}
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="text-gray-500 text-sm">Status</div>
            <div
              class="font-bold text-sm inline-block px-2 py-0.5 rounded"
              :class="statusColor(userStore.usersSelected?.status_id ?? 0)"
            >
              {{ statusLabel(userStore.usersSelected?.status_id ?? 0) }}
            </div>
          </v-col>

          <!-- Status 1: Kontrak → Tanggal Mulai + Tanggal Selesai -->
          <template v-if="userStore.usersSelected?.status_id === 1">
            <v-col cols="12" md="6">
              <div class="text-gray-500 text-sm">Tanggal Mulai Kontrak</div>
              <div class="font-bold text-sm">
                {{
                  toDayMonthYear(
                    userStore.usersSelected?.effective_start_date,
                  ) ?? "-"
                }}
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="text-gray-500 text-sm">Tanggal Selesai Kontrak</div>
              <div class="font-bold text-sm">
                {{
                  toDayMonthYear(userStore.usersSelected?.effective_end_date) ??
                  "-"
                }}
              </div>
            </v-col>
          </template>

          <!-- Status 2: Tetap → Tanggal Ditetapkan -->
          <template v-else-if="userStore.usersSelected?.status_id === 2">
            <v-col cols="12" md="6">
              <div class="text-gray-500 text-sm">Tanggal Ditetapkan</div>
              <div class="font-bold text-sm">
                {{
                  toDayMonthYear(
                    userStore.usersSelected?.effective_start_date,
                  ) ?? "-"
                }}
              </div>
            </v-col>
          </template>

          <!-- Status 3 atau 4: Resign / Dikeluarkan → Tanggal Keluar -->
          <template
            v-else-if="[3, 4].includes(userStore.usersSelected?.status_id ?? 0)"
          >
            <v-col cols="12" md="6">
              <div class="text-gray-500 text-sm">Tanggal Keluar</div>
              <div class="font-bold text-sm">
                {{
                  toDayMonthYear(userStore.usersSelected?.effective_end_date) ??
                  "-"
                }}
              </div>
            </v-col>
          </template>

          <!-- Status 5: Pensiun → Tanggal Pensiun -->
          <template v-else-if="(userStore.usersSelected?.status_id ?? 0) === 5">
            <v-col cols="12" md="6">
              <div class="text-gray-500 text-sm">Tanggal Pensiun</div>
              <div class="font-bold text-sm">
                {{
                  toDayMonthYear(userStore.usersSelected?.effective_end_date) ??
                  "-"
                }}
              </div>
            </v-col>
          </template>

          <v-col cols="12" md="6">
            <div class="text-gray-500 text-sm">Join Date</div>
            <div class="font-bold text-sm">
              {{ toDayMonthYear(userStore.usersSelected?.join_date) ?? "-" }}
            </div>
          </v-col>
        </v-row>
      </v-card>
    </div>
  </v-card>
</template>
<script setup lang="ts">
import { useUserStore } from "@/stores/user.store";
import { useDateFormatter } from "@/composables/UseDateFormatter";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useEmployeeStatus } from "@/composables/UseEmployeeStatus";

const { toDayMonthYear } = useDateFormatter();
const { statusLabel, statusColor } = useEmployeeStatus();
const userStore = useUserStore();
const route = useRoute();
const employeeId = route.params.id;
const apiUrl = import.meta.env.VITE_API_URL;

defineEmits(["edit"]);
onMounted(async () => {
  if (!userStore.usersSelected) {
    userStore.userSelectedParams.id = employeeId as string;
    await userStore.fetchUsersSelected();
  }
});
</script>
