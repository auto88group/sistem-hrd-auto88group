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
        prepend-icon="mdi-close"
        variant="flat"
        @click="emit('cancel')"
      >
        Batal
      </v-btn>
      <v-btn
        color="indigo"
        prepend-icon="mdi-content-save"
        variant="flat"
        :loading="isSaving"
        @click="handleSubmit"
      >
        Simpan
      </v-btn>
    </div>

    <v-snackbar
      v-model="showErrorSnackbar"
      color="text-red-500"
      timeout="4000"
      location="top"
    >
      {{ snackbarMessage }}
    </v-snackbar>

    <v-form ref="formRef" validate-on="submit lazy">
      <div class="flex flex-col gap-5">
        <!-- Data Diri -->
        <v-card elevation="0">
          <v-card-title
            class="text-indigo-600 dark:text-indigo-400 font-bold px-0 text-base"
          >
            Data Diri
          </v-card-title>
          <v-divider class="mb-6"></v-divider>
          <v-row gap="15">
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.nik"
                label="NIK"
                type="number"
                variant="outlined"
                density="compact"
                hide-details="auto"
                :rules="[rules.nik]"
                :error-messages="serverErrors.nik"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                id="field-name"
                v-model="form.name"
                variant="outlined"
                density="compact"
                hide-details="auto"
                :rules="[rules.required]"
                :error-messages="serverErrors.name"
              >
                <template v-slot:label>
                  Nickname <span class="text-red-500">*</span>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                id="field-full_name"
                v-model="form.full_name"
                variant="outlined"
                density="compact"
                hide-details="auto"
                :rules="[rules.required]"
                :error-messages="serverErrors.full_name"
              >
                <template v-slot:label>
                  Nama Lengkap <span class="text-red-500">*</span>
                </template>
              </v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="form.hrd_master_education_id"
                label="Pendidikan Terakhir"
                :items="listEducation"
                :loading="educationStore.isLoadingData"
                item-title="title"
                item-value="value"
                placeholder="Pilih pendidikan"
                variant="outlined"
                density="compact"
                color="primary"
                hide-details="auto"
                clearable
                no-filter
                @update:search="onSearchEducation"
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" md="6"></v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.front_title"
                label="Gelar Depan"
                variant="outlined"
                density="compact"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.back_title"
                label="Gelar Belakang"
                variant="outlined"
                density="compact"
                hide-details="auto"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.phone_number"
                label="Nomor HP"
                variant="outlined"
                density="compact"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                id="field-email"
                v-model="form.email"
                variant="outlined"
                density="compact"
                hide-details="auto"
                :rules="[rules.required, rules.email]"
                :error-messages="serverErrors.email"
              >
                <template v-slot:label>
                  Email <span class="text-red-500">*</span>
                </template></v-text-field
              >
            </v-col>

            <v-col cols="12" md="6">
              <v-autocomplete
                id="field-gender"
                v-model="form.gender"
                :items="listGender"
                label="Jenis Kelamin"
                placeholder="Pilih jenis kelamin"
                variant="outlined"
                density="compact"
                color="primary"
                item-title="label"
                item-value="value"
                hide-details="auto"
                :rules="[rules.required]"
                clearable
              >
                <template v-slot:label>
                  Jenis Kelamin <span class="text-red-500">*</span>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="form.hrd_master_marital_status_id"
                label="Status Pernikahan"
                :items="listMaritalStatus"
                :loading="maritalStatusStore.isLoadingData"
                item-title="title"
                item-value="value"
                placeholder="Pilih status pernikahan"
                variant="outlined"
                density="compact"
                color="primary"
                hide-details="auto"
                clearable
                no-filter
                @update:search="onSearchMaritalStatus"
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="form.hrd_master_blood_type_id"
                label="Golongan Darah"
                :items="listBloodType"
                :loading="bloodTypeStore.isLoadingData"
                item-title="title"
                item-value="value"
                placeholder="Pilih golongan darah"
                variant="outlined"
                density="compact"
                color="primary"
                hide-details="auto"
                clearable
                no-filter
                @update:search="onSearchBloodType"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.birth_place"
                label="Tempat Lahir"
                variant="outlined"
                density="compact"
                hide-details="auto"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <app-date-picker
                v-model="form.birth_date"
                label="Tanggal Lahir"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="form.hrd_master_religion_id"
                label="Agama"
                :items="listReligion"
                :loading="religionStore.isLoadingData"
                item-title="title"
                item-value="value"
                placeholder="Pilih agama"
                variant="outlined"
                density="compact"
                color="primary"
                hide-details="auto"
                clearable
                no-filter
                @update:search="onSearchReligion"
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.bpjs_health_number"
                label="Nomor BPJS Kesehatan"
                variant="outlined"
                density="compact"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.bpjs_employment_number"
                label="Nomor BPJS Ketenagakerjaan"
                variant="outlined"
                density="compact"
                hide-details="auto"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="form.number_of_children"
                label="Jumlah Anak"
                variant="outlined"
                density="compact"
                type="number"
                min="0"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.emergency_phone_number"
                label="Nomor HP Darurat"
                variant="outlined"
                density="compact"
                hide-details="auto"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.emergency_contact_name"
                label="Nama Kontak Darurat"
                variant="outlined"
                density="compact"
                hide-details="auto"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card>

        <!-- Foto Profil -->
        <v-card elevation="0">
          <v-card-title
            class="text-indigo-600 dark:text-indigo-400 font-bold px-0 text-base"
          >
            Foto Profil
          </v-card-title>
          <v-divider class="mb-4"></v-divider>
          <div class="flex flex-col gap-3">
            <div v-if="imagePreview || userStore.usersSelected?.image">
              <v-img
                :src="
                  imagePreview ??
                  apiUrl +
                    '/image/user-profile/' +
                    userStore.usersSelected?.id +
                    '/' +
                    userStore.usersSelected?.image
                "
                max-width="200"
                aspect-ratio="1/1"
                class="rounded-lg bg-grey-lighten-2 mb-3"
              ></v-img>
            </div>
            <v-file-input
              id="field-image"
              v-model="form.imageFile"
              label="Upload Foto Profil"
              variant="outlined"
              density="compact"
              accept="image/*"
              prepend-icon="mdi-camera"
              hide-details="auto"
              :rules="[rules.imageSize]"
              @update:model-value="onImageChange"
              :error-messages="serverErrors.image"
            ></v-file-input>
            <div class="text-gray-400 text-xs">
              Format: JPG, PNG. Maks. 2MB.
            </div>
          </div>
        </v-card>

        <!-- Alamat KTP -->
        <v-card elevation="0">
          <v-card-title
            class="text-indigo-600 dark:text-indigo-400 font-bold px-0 text-base"
          >
            Data Alamat (Sesuai KTP)
          </v-card-title>
          <v-divider class="mb-4"></v-divider>
          <v-textarea
            v-model="form.address_id_card"
            label="Alamat KTP"
            variant="outlined"
            density="compact"
            rows="3"
            auto-grow
            hide-details="auto"
          ></v-textarea>
        </v-card>

        <!-- Alamat Domisili -->
        <v-card elevation="0">
          <v-card-title
            class="text-indigo-600 dark:text-indigo-400 font-bold px-0 text-base"
          >
            Data Alamat (Domisili)
          </v-card-title>
          <v-divider class="mb-6"></v-divider>
          <v-row gap="15">
            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="form.master_area_province_id"
                label="Provinsi"
                :items="listProvince"
                :loading="provinceStore.isLoading"
                item-title="title"
                item-value="value"
                placeholder="Pilih provinsi"
                variant="outlined"
                density="compact"
                color="primary"
                hide-details="auto"
                clearable
                no-filter
                @update:search="onSearchProvince"
                @update:model-value="onProvinceChange"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="form.master_area_regency_id"
                label="Kabupaten"
                :items="listRegency"
                :loading="regencyStore.isLoading"
                item-title="title"
                item-value="value"
                placeholder="Pilih Kabupaten"
                variant="outlined"
                density="compact"
                color="primary"
                hide-details="auto"
                clearable
                no-filter
                @update:search="onSearchRegency"
                @update:model-value="onRegencyChange"
                :disabled="!form.master_area_province_id"
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="form.master_area_district_id"
                label="Kecamatan"
                :items="listDistrict"
                :loading="districtStore.isLoading"
                item-title="title"
                item-value="value"
                placeholder="Pilih Kecamatan"
                variant="outlined"
                density="compact"
                color="primary"
                hide-details="auto"
                clearable
                no-filter
                @update:search="onSearchDistrict"
                @update:model-value="onDistrictChange"
                :disabled="!form.master_area_regency_id"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="form.master_area_village_id"
                label="Kelurahan/Desa"
                :items="listVillage"
                :loading="villageStore.isLoading"
                item-title="title"
                item-value="value"
                placeholder="Pilih kelurahan"
                variant="outlined"
                density="compact"
                color="primary"
                hide-details="auto"
                clearable
                no-filter
                @update:search="onSearchVillage"
                :disabled="!form.master_area_district_id"
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.neighborhood_unit"
                label="RT"
                variant="outlined"
                density="compact"
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.community_unit"
                label="RW"
                variant="outlined"
                density="compact"
                hide-details="auto"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="12">
              <v-textarea
                v-model="form.current_address"
                label="Alamat"
                variant="outlined"
                density="compact"
                rows="3"
                hide-details="auto"
                auto-grow
              ></v-textarea>
            </v-col>
            <v-col cols="12" md="12">
              <v-text-field
                v-model="form.zip_code"
                label="Kode Pos"
                variant="outlined"
                density="compact"
                hide-details="auto"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card>

        <!-- Data Kepegawaian -->
        <v-card elevation="0">
          <v-card-title
            class="text-indigo-600 dark:text-indigo-400 font-bold px-0 text-base"
          >
            Data Kepegawaian
          </v-card-title>
          <v-divider class="mb-6"></v-divider>
          <v-row gap="15">
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="form.employee_id"
                variant="outlined"
                density="compact"
                type="number"
                min="0"
                hide-details="auto"
                :rules="[rules.required]"
              >
                <template v-slot:label>
                  ID Karyawan <span class="text-red-500">*</span>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="form.primary_approver_id"
                :items="listPrimaryApprover"
                :loading="userStore.isLoadingData"
                item-title="name"
                item-value="value"
                prepend-inner-icon="mdi-account"
                placeholder="Cari nama..."
                variant="outlined"
                density="compact"
                color="primary"
                class="custom-input"
                hide-details="auto"
                clearable
                no-filter
                @update:search="onSearchPrimaryApprover"
                @click:clear="onClearPrimaryApprover"
                :error-messages="serverErrors.primary_approver_id"
              >
                <template v-slot:label>
                  Atasan 1<span class="text-red-500">*</span>
                </template>
                <template v-slot:item="{ props, item }">
                  <v-list-item
                    v-bind="props"
                    :title="formatName(item)"
                    :subtitle="item.email"
                  />
                </template>
                <template v-slot:selection="{ item }">
                  {{ formatName(item) }}
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                label="Atasan 2"
                v-model="form.secondary_approver_id"
                :items="listSecondaryApprover"
                :loading="userStore.isLoadingData"
                item-title="name"
                item-value="value"
                prepend-inner-icon="mdi-account"
                placeholder="Cari nama..."
                variant="outlined"
                density="compact"
                color="primary"
                class="custom-input"
                hide-details="auto"
                clearable
                no-filter
                @update:search="onSearchSecondaryApprover"
                @click:clear="onClearSecondaryApprover"
                :error-messages="serverErrors.secondary_approver_id"
              >
                <template v-slot:item="{ props, item }">
                  <v-list-item
                    v-bind="props"
                    :title="formatName(item)"
                    :subtitle="item.email"
                  />
                </template>
                <template v-slot:selection="{ item }">
                  {{ formatName(item) }}
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="12" md="6" v-if="form.level === 'telemarketing'">
              <v-text-field
                v-model.number="form.initial"
                variant="outlined"
                density="compact"
                min="0"
                hide-details="auto"
                :rules="[rules.required]"
              >
                <template v-slot:label>
                  Inisial <span class="text-red-500">*</span>
                </template>
                <template v-slot:append-inner>
                  <v-tooltip text="Generate Inisial" location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        variant="text"
                        icon="mdi-reload"
                        density="compact"
                        @click="generateInitial"
                      ></v-btn>
                    </template>
                  </v-tooltip>
                </template>
              </v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="form.master_position_id"
                :items="listPosition"
                :loading="positionStore.isLoadingData"
                item-title="title"
                item-value="value"
                placeholder="Pilih jabatan"
                variant="outlined"
                density="compact"
                color="primary"
                hide-details="auto"
                clearable
                no-filter
                @update:search="onSearchPosition"
                @update:model-value="onPositionChange"
                :rules="[rules.required]"
                :error-messages="serverErrors.master_position_id"
              >
                <template v-slot:label>
                  Jabatan <span class="text-red-500">*</span>
                </template>
              </v-autocomplete>
            </v-col>

            <v-col
              cols="12"
              md="6"
              v-if="
                form.level === 'telemarketing' ||
                form.level === 'admin_telemarketing'
              "
            >
              <v-text-field
                v-model.number="form.sequence"
                variant="outlined"
                density="compact"
                type="number"
                min="0"
                hide-details="auto"
                :rules="[rules.required]"
              >
                <template v-slot:label>
                  Urutan <span class="text-red-500">*</span>
                </template>
                <template v-slot:append-inner>
                  <v-tooltip text="New Sequence" location="top">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        variant="text"
                        icon="mdi-reload"
                        density="compact"
                        @click="generateSequence"
                        :loading="salesOfficialStore.isLoadingLastSequenceSales"
                        :disabled="
                          salesOfficialStore.isLoadingLastSequenceSales
                        "
                      ></v-btn>
                    </template>
                  </v-tooltip>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="form.branch_id"
                :items="listBranch"
                :loading="branchStore.isLoadingData"
                prepend-inner-icon="mdi-map-marker-outline"
                item-title="alias"
                item-value="value"
                placeholder="Pilih cabang"
                variant="outlined"
                density="compact"
                color="primary"
                class="custom-input"
                hide-details="auto"
                clearable
                no-filter
                @update:search="onSearchBranch"
                :rules="[rules.required]"
                :error-messages="serverErrors.branch_id"
              >
                <template v-slot:label>
                  Cabang <span class="text-red-500">*</span>
                </template>
                <template v-slot:item="{ props, item }">
                  <v-list-item
                    v-bind="props"
                    :title="item.alias"
                    :subtitle="item.title"
                  >
                  </v-list-item>
                </template>
              </v-autocomplete>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                disabled
                v-model.number="form.remaining_leave"
                variant="outlined"
                density="compact"
                type="number"
                min="0"
                hide-details="auto"
                :rules="[rules.required]"
              >
                <template v-slot:label>
                  Jatah Cuti <span class="text-red-500">*</span>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.status_id"
                variant="outlined"
                density="compact"
                :items="employeeStatusOptions"
                item-title="label"
                item-value="value"
                hide-details="auto"
                :rules="[rules.required]"
                @update:model-value="onStatusChange"
              >
                <template v-slot:label>
                  Status <span class="text-red-500">*</span>
                </template>
              </v-select>
            </v-col>

            <!-- Status 1: Kontrak -->
            <template v-if="form.status_id === 1">
              <v-col cols="12" md="6">
                <app-date-picker
                  v-model="form.effective_start_date"
                  variant="outlined"
                  density="compact"
                  :rules="[rules.required]"
                  clearable
                >
                  <template v-slot:label>
                    Tanggal Mulai Kontrak <span class="text-red-500">*</span>
                  </template>
                </app-date-picker>
              </v-col>
              <v-col cols="12" md="6">
                <app-date-picker
                  v-model="form.effective_end_date"
                  variant="outlined"
                  density="compact"
                  :rules="[rules.required]"
                  :disabled="!form.effective_start_date"
                  :min="form.effective_start_date"
                  clearable
                >
                  <template v-slot:label>
                    Tanggal Selesai Kontrak <span class="text-red-500">*</span>
                  </template>
                </app-date-picker>
              </v-col>
            </template>

            <!-- Status 2: Tetap -->
            <template v-else-if="form.status_id === 2">
              <v-col cols="12" md="6">
                <app-date-picker
                  v-model="form.effective_start_date"
                  variant="outlined"
                  density="compact"
                  :rules="[rules.required]"
                >
                  <template v-slot:label>
                    Tanggal Ditetapkan<span class="text-red-500">*</span>
                  </template>
                </app-date-picker>
              </v-col>
            </template>

            <!-- Status 3 atau 4: Resign / Dikeluarkan -->
            <template v-else-if="[3, 4].includes(form.status_id ?? 0)">
              <v-col cols="12" md="6">
                <app-date-picker
                  v-model="form.effective_end_date"
                  variant="outlined"
                  density="compact"
                  :rules="[rules.required]"
                  :disabled="!form.effective_start_date"
                  :min="form.effective_start_date"
                  clearable
                >
                  <template v-slot:label>
                    Tanggal Keluar <span class="text-red-500">*</span>
                  </template>
                </app-date-picker>
              </v-col>
            </template>

            <!-- Status 5: Pensiun -->
            <template v-else-if="form.status_id === 5">
              <v-col cols="12" md="6">
                <app-date-picker
                  v-model="form.effective_end_date"
                  variant="outlined"
                  density="compact"
                  :rules="[rules.required]"
                  :disabled="!form.effective_start_date"
                  :min="form.effective_start_date"
                  clearable
                >
                  <template v-slot:label>
                    Tanggal Pensiun <span class="text-red-500">*</span>
                  </template>
                </app-date-picker>
              </v-col>
            </template>

            <v-col cols="12" md="6">
              <app-date-picker
                v-model="form.join_date"
                variant="outlined"
                density="compact"
                :rules="[rules.required]"
              >
                <template v-slot:label>
                  Join Date<span class="text-red-500">*</span>
                </template>
              </app-date-picker>
            </v-col>
          </v-row>
        </v-card>
      </div>
    </v-form>

    <!-- Bottom action bar -->
    <div class="flex justify-end w-full gap-2 mt-6">
      <v-btn
        color="bg-gray-300 dark:bg-gray-600 text-indigo-900 dark:text-indigo-100 text-sm"
        prepend-icon="mdi-close"
        variant="flat"
        @click="emit('cancel')"
      >
        Batal
      </v-btn>
      <v-btn
        color="indigo"
        prepend-icon="mdi-content-save"
        variant="flat"
        :loading="isSaving"
        @click="handleSubmit"
      >
        Simpan
      </v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user.store";
import { onMounted, ref, reactive, computed, nextTick } from "vue";
import { useEducationStore } from "@/stores/education.store";
import { useDebounceFn } from "@/composables/UseDebounce";
import { useMaritalStatusStore } from "@/stores/maritall-status.store";
import { useBloodTypeStore } from "@/stores/blood-type.store";
import AppDatePicker from "@/components/AppDatePicker.vue";
import { useReligionStore } from "@/stores/religion.store";
import { useProvinceStore } from "@/stores/province.store";
import { useRegencyStore } from "@/stores/regency.store";
import { useDistrictStore } from "@/stores/district.store";
import { useVillageStore } from "@/stores/village.store";
import { usePositionStore } from "@/stores/position.store";
import { useBranchStore } from "@/stores/branch.store";
import { useSalesOfficialStore } from "@/stores/sales-official.store";
import { useFormatName } from "@/composables/useFormatName";

const { formatName } = useFormatName();
const serverErrors = reactive<Record<string, string>>({});
const educationStore = useEducationStore();
const maritalStatusStore = useMaritalStatusStore();
const bloodTypeStore = useBloodTypeStore();
const religionStore = useReligionStore();
const provinceStore = useProvinceStore();
const regencyStore = useRegencyStore();
const districtStore = useDistrictStore();
const villageStore = useVillageStore();
const positionStore = usePositionStore();
const branchStore = useBranchStore();
const salesOfficialStore = useSalesOfficialStore();
const userStore = useUserStore();
const primaryApproverResults = ref<typeof userStore.usersData>([]);
const secondaryApproverResults = ref<typeof userStore.usersData>([]);

const showErrorSnackbar = ref(false);
const snackbarMessage = ref("");
const apiUrl = import.meta.env.VITE_API_URL;
const formRef = ref();
const isSaving = ref(false);
const imagePreview = ref<string | null>(null);

userStore.userDataParams.not_user_id = userStore.usersSelected?.id;
const isSelectingPrimaryApprover = ref(false);
const selectedPrimaryApproverText = ref<string>("");
const isSelectingSecondaryApprover = ref(false);
const selectedSecondaryApproverText = ref<string>("");

const searchEducation = ref("");
const searchMaritalStatus = ref("");
const searchPosition = ref("");
const searchBranch = ref("");
const searchBloodType = ref("");
const searchReligion = ref("");
const searchProvince = ref("");
const searchRegency = ref("");
const searchDistrict = ref("");
const searchVillage = ref("");

const listPrimaryApprover = computed(() => {
  const users = primaryApproverResults.value.map((u) => ({
    value: u.id,
    name: u.name,
    full_name: u.full_name,
    email: u.email,
  }));

  if (
    form.primary_approver_id &&
    userStore.usersSelected?.primary_approver?.name
  ) {
    const exists = users.some((u) => u.value === form.primary_approver_id);
    if (!exists) {
      users.unshift({
        value: form.primary_approver_id,
        name: userStore.usersSelected?.primary_approver?.name ?? "",
        full_name: userStore.usersSelected?.primary_approver?.full_name ?? "",
        email: userStore.usersSelected?.primary_approver?.email ?? "",
      });
    }
  }
  return users;
});

// Update listSecondaryApprover computed
const listSecondaryApprover = computed(() => {
  const users = secondaryApproverResults.value.map((u) => ({
    value: u.id,
    name: u.name,
    full_name: u.full_name,
    email: u.email,
  }));

  if (
    form.secondary_approver_id &&
    userStore.usersSelected?.secondary_approver?.name
  ) {
    const exists = users.some((u) => u.value === form.secondary_approver_id);
    if (!exists) {
      users.unshift({
        value: form.secondary_approver_id,
        name: userStore.usersSelected?.secondary_approver?.name ?? "",
        full_name: userStore.usersSelected?.secondary_approver?.full_name ?? "",
        email: userStore.usersSelected?.secondary_approver?.email ?? "",
      });
    }
  }
  return users;
});

const onClearPrimaryApprover = async () => {
  selectedPrimaryApproverText.value = "";
  isSelectingPrimaryApprover.value = false;
  // Reset list ke data awal
  userStore.usersData = await userStore.fetchUsersDataWithParams({
    search: "",
  });
};

const onClearSecondaryApprover = async () => {
  selectedSecondaryApproverText.value = "";
  isSelectingSecondaryApprover.value = false;
  // Reset list ke data awal
  userStore.usersData = await userStore.fetchUsersDataWithParams({
    search: "",
  });
};

const listEducation = computed(() => {
  const keyword = searchEducation.value.toLowerCase();

  return educationStore.educationData
    .filter((education) =>
      keyword ? education.name.toLowerCase().includes(keyword) : true,
    )
    .map((education) => ({
      title: education.name,
      value: education.id,
    }));
});
const listMaritalStatus = computed(() => {
  const keyword = searchMaritalStatus.value.toLowerCase();

  return maritalStatusStore.maritalStatusData
    .filter((maritalStatus) =>
      keyword ? maritalStatus.name.toLowerCase().includes(keyword) : true,
    )
    .map((maritalStatus) => ({
      title: maritalStatus.name,
      value: maritalStatus.id,
    }));
});
const listPosition = computed(() => {
  const keyword = searchPosition.value.toLowerCase();

  return positionStore.positionData
    .filter((position) =>
      keyword ? position.name.toLowerCase().includes(keyword) : true,
    )
    .map((position) => ({
      title: position.name,
      value: position.id,
      level_name: position.level_name,
    }));
});
const listBranch = computed(() => {
  const keyword = searchBranch.value.toLowerCase();
  return branchStore.branchData
    .filter((branch) => {
      if (!keyword) return true;

      return (
        branch.name.toLowerCase().includes(keyword) ||
        branch.alias.toLowerCase().includes(keyword)
      );
    })
    .map((branch) => ({
      title: branch.name,
      alias: branch.alias,
      value: branch.id,
    }));
});
const listBloodType = computed(() => {
  const keyword = searchBloodType.value.toLowerCase();
  return bloodTypeStore.bloodTypeData
    .filter((bloodType) => {
      if (!keyword) return true;
      return bloodType.name.toLowerCase().includes(keyword);
    })
    .map((bloodType) => ({
      title: bloodType.name,
      value: bloodType.id,
    }));
});
const listReligion = computed(() => {
  const keyword = searchReligion.value.toLowerCase();
  return religionStore.religionData
    .filter((religion) => {
      if (!keyword) return true;
      return religion.name.toLowerCase().includes(keyword);
    })
    .map((religion) => ({
      title: religion.name,
      value: religion.id,
    }));
});
const listProvince = computed(() => {
  const keyword = searchProvince.value.toLowerCase();
  return provinceStore.province
    .filter((province) => {
      if (!keyword) return true;
      return province.name.toLowerCase().includes(keyword);
    })
    .map((province) => ({
      title: province.name,
      value: province.id,
    }));
});
const listRegency = computed(() => {
  const keyword = searchRegency.value.toLowerCase();
  return regencyStore.regency
    .filter((regency) => {
      if (!keyword) return true;
      return regency.name.toLowerCase().includes(keyword);
    })
    .map((regency) => ({
      title: regency.name,
      value: regency.id,
    }));
});
const listDistrict = computed(() => {
  const keyword = searchDistrict.value.toLowerCase();
  return districtStore.district
    .filter((district) => {
      if (!keyword) return true;
      return district.name.toLowerCase().includes(keyword);
    })
    .map((district) => ({
      title: district.name,
      value: district.id,
    }));
});
const listVillage = computed(() => {
  const keyword = searchVillage.value.toLowerCase();
  return villageStore.village
    .filter((village) => {
      if (!keyword) return true;
      return village.name.toLowerCase().includes(keyword);
    })
    .map((village) => ({
      title: village.name,
      value: village.id,
    }));
});
const listGender = [
  { label: "Laki-Laki", value: "M" },
  { label: "Perempuan", value: "F" },
];

const onSearchPrimaryApprover = useDebounceFn(async (val: string) => {
  if (isSelectingPrimaryApprover.value) return;
  if (val === selectedPrimaryApproverText.value) return;
  primaryApproverResults.value = await userStore.fetchUsersDataWithParams({
    search: val ?? "",
  });
}, 400);

const onSearchSecondaryApprover = useDebounceFn(async (val: string) => {
  if (isSelectingSecondaryApprover.value) return;
  if (val === selectedSecondaryApproverText.value) return;
  secondaryApproverResults.value = await userStore.fetchUsersDataWithParams({
    search: val ?? "",
  });
}, 400);

const onSearchEducation = (val: any) => {
  searchEducation.value = val ?? "";
};
const onSearchMaritalStatus = (val: any) => {
  searchEducation.value = val ?? "";
};
const onSearchPosition = (val: any) => {
  searchPosition.value = val ?? "";
};
const onSearchBranch = (val: any) => {
  searchBranch.value = val ?? "";
};
const onSearchBloodType = (val: any) => {
  searchBloodType.value = val ?? "";
};
const onSearchReligion = (val: any) => {
  searchReligion.value = val ?? "";
};
const onSearchProvince = (val: any) => {
  searchProvince.value = val ?? "";
};
const onSearchRegency = (val: any) => {
  searchRegency.value = val ?? "";
};
const onSearchDistrict = (val: any) => {
  searchDistrict.value = val ?? "";
};
const onSearchVillage = (val: any) => {
  searchVillage.value = val ?? "";
};
// ── Form state ──────────────────────────────────────────────────────────────
const form = reactive({
  nik: "",
  name: "",
  full_name: "",
  hrd_master_education_id: null as number | null,
  employee_id: 0 as number,
  front_title: "",
  back_title: "",
  phone_number: "",
  email: "",
  gender: "",
  primary_approver_id: null as number | null,
  secondary_approver_id: null as number | null,
  hrd_master_marital_status_id: null as number | null,
  hrd_master_blood_type_id: null as number | null,
  birth_place: "",
  birth_date: "",
  hrd_master_religion_id: null as number | null,
  bpjs_health_number: "",
  bpjs_employment_number: "",
  number_of_children: null as number | null,
  emergency_phone_number: "",
  emergency_contact_name: "",
  imageFile: null as File | File[] | null,
  address_id_card: "",
  master_area_province_id: null as string | null,
  master_area_regency_id: null as string | null,
  master_area_district_id: null as string | null,
  master_area_village_id: null as string | null,
  initial: null as string | null,
  level: null as string | null,
  sequence: null as number | null,
  neighborhood_unit: "",
  community_unit: "",
  current_address: "",
  zip_code: "",
  master_position_id: null as number | null,
  position: "",
  branch_id: null as number | null,
  remaining_leave: null as number | null,
  status_id: null as number | null,
  effective_start_date: "",
  effective_end_date: "",
  join_date: "",
});

// ── Validation rules ─────────────────────────────────────────────────────────
const rules = {
  nik: (v: string) => {
    if (!v) return true;
    const isNumeric = /^\d+$/.test(v);
    const is16Digits = v.length === 16;

    if (!isNumeric) return "NIK harus berupa angka";
    if (!is16Digits) return "NIK harus berjumlah 16 karakter";
    return true;
  },
  required: (v: any) =>
    (v !== null && v !== undefined && v !== "") || "Wajib diisi",
  email: (v: string) => /.+@.+\..+/.test(v) || "Format email tidak valid",
  imageSize: (v: File | File[]) => {
    if (!v) return true;
    const file = Array.isArray(v) ? v[0] : v;
    if (!file) return true;
    return file.size <= 2 * 1024 * 1024 || "Ukuran file maksimal 2MB";
  },
};

const employeeStatusOptions = [
  { label: "Kontrak", value: 1 },
  { label: "Tetap", value: 2 },
  { label: "Resign", value: 3 },
  { label: "Dikeluarkan", value: 4 },
  { label: "Pensiun", value: 5 },
];

// ── Cascading address handlers ────────────────────────────────────────────────
function onProvinceChange() {
  form.master_area_regency_id = null;
  form.master_area_district_id = null;
  form.master_area_village_id = null;
  regencyStore.regency = [];
  regencyStore.regencyParams.province_id = form.master_area_province_id ?? "";
  districtStore.district = [];
  villageStore.village = [];
  regencyStore.fetchRegency();
}

function onRegencyChange() {
  form.master_area_district_id = null;
  form.master_area_village_id = null;
  districtStore.district = [];
  districtStore.districtParams.regency_id = form.master_area_regency_id ?? "";
  districtStore.district = [];
  villageStore.village = [];
  districtStore.fetchDistrict();
}

function onDistrictChange() {
  form.master_area_village_id = null;
  villageStore.villageParams.district_id = form.master_area_district_id ?? "";
  villageStore.fetchVillage();
}

function onPositionChange(value: number | null) {
  const selectedItem = listPosition.value.find((item) => item.value === value);
  const title = selectedItem?.title;
  const oldValue = form.position;
  form.position = title ?? oldValue;
  form.level = selectedItem?.level_name ?? "";
  console.log(selectedItem?.level_name);
  form.sequence = null;
}

function onStatusChange(value: number | null) {
  if (value == 2) {
    form.effective_end_date = "";
  }
}

// ── Image preview ────────────────────────────────────────────────────────────
function onImageChange(files: File | File[]) {
  const file = Array.isArray(files) ? files[0] : files;
  if (file) {
    imagePreview.value = URL.createObjectURL(file);
  } else {
    imagePreview.value = null;
  }
}

function loadFirstTimeMaserArea() {
  if (form.master_area_province_id) {
    regencyStore.regencyParams.province_id = form.master_area_province_id;
    regencyStore.fetchRegency();
  }

  if (form.master_area_regency_id) {
    districtStore.districtParams.regency_id = form.master_area_regency_id;
    districtStore.fetchDistrict();
  }

  if (form.master_area_district_id) {
    villageStore.villageParams.district_id = form.master_area_district_id;
    villageStore.fetchVillage();
  }
}

function generateInitial() {
  const name = form.full_name || form.name || "";
  const words = name.trim().split(/\s+/).filter(Boolean);

  let initial;

  if (words.length === 1) {
    // 1 kata → ambil 2 huruf pertama
    initial = words[0].substring(0, 2).toUpperCase();
  } else if (words.length >= 4) {
    // 4 kata ke atas → ambil 3 (awal, tengah, akhir)
    const taken = [
      words[0],
      words[Math.floor(words.length / 2)],
      words[words.length - 1],
    ];
    initial = taken.map((w) => w[0].toUpperCase()).join("");
  } else {
    // 2-3 kata → ambil huruf pertama tiap kata
    initial = words.map((w) => w[0].toUpperCase()).join("");
  }

  form.initial = initial;
}

async function generateSequence() {
  // Set level dari user yang sedang diedit
  salesOfficialStore.lastSequenceSalesParams.level = form.level ?? "";

  await salesOfficialStore.fetchLastSequence();

  // Assign hasil ke form.sequence
  form.sequence = salesOfficialStore.lastSequenceSales;
}

// ── Populate form from store ─────────────────────────────────────────────────
function populateForm() {
  const u = userStore.usersSelected;
  if (!u) return;
  form.nik = u.nik ?? "";
  form.name = u.name ?? "";
  form.full_name = u.full_name ?? "";
  form.hrd_master_education_id = u.education?.id ?? null;
  form.front_title = u.front_title ?? "";
  form.back_title = u.back_title ?? "";
  form.phone_number = u.phone_number ?? "";
  form.employee_id = u.employee_id ?? null;
  form.email = u.email ?? "";
  form.gender = u.gender;
  form.primary_approver_id = u.primary_approver_id ?? null;
  form.secondary_approver_id = u.secondary_approver_id ?? null;
  form.hrd_master_marital_status_id = u.marital_status?.id ?? null;
  form.hrd_master_blood_type_id = u.blood_type?.id ?? null;
  form.birth_place = u.birth_place ?? "";
  form.birth_date = u.birth_date ?? "";
  form.hrd_master_religion_id = u.religion?.id ?? null;
  form.bpjs_health_number = u.bpjs_health_number ?? "";
  form.bpjs_employment_number = u.bpjs_employment_number ?? "";
  form.number_of_children = u.number_of_children ?? null;
  form.emergency_phone_number = u.emergency_phone_number ?? "";
  form.emergency_contact_name = u.emergency_contact_name ?? "";
  form.address_id_card = u.address_id_card ? String(u.address_id_card) : "";
  form.master_area_province_id = u.province?.id.toString() ?? null;
  form.master_area_regency_id = u.regency?.id.toString() ?? null;
  form.master_area_district_id = u.disctrict?.id.toString() ?? null; // note: typo in original "disctrict"
  form.master_area_village_id = u.village?.id.toString() ?? null;
  form.level = u.level ?? null;
  form.initial = u.telemarketing?.inisial ?? null;
  form.sequence = u.telemarketing?.urutan ?? null;
  form.neighborhood_unit = u.neighborhood_unit ?? "";
  form.community_unit = u.community_unit ?? "";
  form.current_address = u.current_address ?? "";
  form.zip_code = u.zip_code ?? "";
  form.master_position_id = u.master_position_id ?? null;
  form.position = u.position ?? "";
  form.branch_id = u.branch?.id ?? null;
  form.remaining_leave = u.remaining_leave ?? 0;
  form.status_id = u.status_id ?? null;
  form.effective_start_date = u.effective_start_date ?? "";
  form.effective_end_date = u.effective_end_date ?? "";
  form.join_date = u.join_date ?? "";

  console.log(form.primary_approver_id);
}
const emit = defineEmits<{
  cancel: [];
  saved: [];
}>();

function scrollToFirstError(serverErr?: Record<string, string>) {
  const priorityFields = ["name", "full_name", "gender", "gender", "image"];

  // Cek apakah ada server error di salah satu field prioritas
  if (serverErr) {
    for (const field of priorityFields) {
      if (serverErr[field]) {
        const el = document.getElementById(`field-${field}`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
    }
  }

  // Cek apakah ada error validasi front-end di salah satu field prioritas
  for (const field of priorityFields) {
    const el = document.getElementById(`field-${field}`);
    if (el) {
      // Vuetify meletakkan class 'v-field--error' pada wrapper terdekat
      const wrapper = el.closest(".v-input");
      if (wrapper?.classList.contains("v-input--error")) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
    }
  }
}

// ── Submit ────────────────────────────────────────────────────────────────────
async function handleSubmit() {
  const { valid } = await formRef.value.validate();
  if (!valid) {
    scrollToFirstError(); // ← frontend validation error
    return;
  }

  // reset server errors sebelum submit
  Object.keys(serverErrors).forEach((key) => delete serverErrors[key]);

  isSaving.value = true;
  try {
    const userId = userStore.usersSelected!.id;
    const imageFile = Array.isArray(form.imageFile)
      ? form.imageFile[0]
      : form.imageFile;

    await userStore.updateUser(userId, {
      // required
      employee_id: form.employee_id,
      full_name: form.full_name,
      name: form.name,
      email: form.email,
      branch_id: form.branch_id!,
      master_position_id: form.master_position_id!,
      position: form.position,
      level: userStore.usersSelected!.level,

      // personal
      nik: form.nik || undefined,
      phone_number: form.phone_number || undefined,
      gender: form.gender as "M" | "F",
      front_title: form.front_title || undefined,
      back_title: form.back_title || undefined,
      birth_place: form.birth_place || undefined,
      birth_date: form.birth_date || undefined,

      // HRD
      hrd_master_education_id: form.hrd_master_education_id ?? undefined,
      hrd_master_religion_id: form.hrd_master_religion_id ?? undefined,
      hrd_master_blood_type_id: form.hrd_master_blood_type_id ?? undefined,
      hrd_master_marital_status_id:
        form.hrd_master_marital_status_id ?? undefined,
      bpjs_health_number: form.bpjs_health_number || undefined,
      bpjs_employment_number: form.bpjs_employment_number || undefined,
      number_of_children: form.number_of_children ?? undefined,

      // emergency
      emergency_contact_name: form.emergency_contact_name || undefined,
      emergency_phone_number: form.emergency_phone_number || undefined,

      // image
      image: imageFile ?? undefined,

      // address KTP
      address_id_card: form.address_id_card || undefined,

      // address domisili
      master_area_province_id: form.master_area_province_id
        ? Number(form.master_area_province_id)
        : undefined,
      master_area_regency_id: form.master_area_regency_id
        ? Number(form.master_area_regency_id)
        : undefined,
      master_area_district_id: form.master_area_district_id
        ? Number(form.master_area_district_id)
        : undefined,
      master_area_village_id: form.master_area_village_id
        ? Number(form.master_area_village_id)
        : undefined,
      neighborhood_unit: form.neighborhood_unit || undefined,
      community_unit: form.community_unit || undefined,
      current_address: form.current_address || undefined,
      zip_code: form.zip_code || undefined,

      // employment
      primary_approver_id: form.primary_approver_id
        ? Number(form.primary_approver_id)
        : undefined,
      secondary_approver_id: form.secondary_approver_id
        ? Number(form.secondary_approver_id)
        : undefined,
      status_id: form.status_id ?? undefined,
      initial: form.initial ?? undefined,
      sequence: form.sequence ?? undefined,
      join_date: form.join_date || undefined,
      effective_start_date: form.effective_start_date || undefined,
      effective_end_date: form.effective_end_date || undefined,
      remaining_leave: form.remaining_leave ?? undefined,
    });

    emit("saved");
  } catch (err: any) {
    if (err?.status === 422) {
      const errors = err.errors as Record<string, string[]>;
      if (errors) {
        Object.entries(errors).forEach(([field, messages]) => {
          serverErrors[field] = messages[0];
        });
        // Tunggu DOM update dulu sebelum scroll
        await nextTick();
        scrollToFirstError(serverErrors);
      }
    } else {
      snackbarMessage.value = err?.message ?? "Terjadi kesalahan, coba lagi.";
      showErrorSnackbar.value = true;
    }
  } finally {
    isSaving.value = false;
  }
}

// ── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(async () => {
  populateForm();
  provinceStore.fetchProvince();
  loadFirstTimeMaserArea();
  educationStore.fetchEducationData();
  branchStore.fetchBranchData();
  maritalStatusStore.fetchMaritalStatusData();
  bloodTypeStore.fetchBloodTypeData();
  religionStore.fetchReligionData();
  positionStore.fetchPositionData();

  const initialUsers = await userStore.fetchUsersDataWithParams({ search: "" });
  primaryApproverResults.value = initialUsers;
  secondaryApproverResults.value = initialUsers;
});
</script>
