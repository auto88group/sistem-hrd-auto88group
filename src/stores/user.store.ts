import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import {
  userApi,
  type User,
  type UserDataParams,
  type UserDatatablesParams,
  type UserSelectedParams,
  type UserUpdateParams,
} from "@/api/modules/user.api";

export const useUserStore = defineStore("user", () => {
  const users = ref<User[]>([]);
  const usersData = ref<User[]>([]);
  const usersSelected = ref<User | null>(null);
  const isLoading = ref(false);
  const isLoadingData = ref(false);
  const isLoadingSelected = ref(false);
  const isLoadingUpdate = ref(false);
  const totalRecords = ref(0);
  const updateError = ref<string | null>(null);

  const params = reactive<UserDatatablesParams>({
    draw: 1,
    start: 0,
    length: 10,
    user_id: undefined,
    master_position_id: undefined,
    branch_id: undefined,
    hrd_master_education_id: undefined,
    status_id: undefined,
    gender: undefined,
    show_deleted: false,
  });
  const userDataParams = reactive<UserDataParams>({
    search: "",
  });
  const userSelectedParams = reactive<UserSelectedParams>({
    id: "",
  });

  async function fetchUsers() {
    isLoading.value = true;
    try {
      const res = await userApi.getDatatables({ ...params });
      users.value = res.data;
      totalRecords.value = res.recordsTotal;
      params.draw = res.draw + 1;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchUsersData() {
    isLoadingData.value = true;
    try {
      const res = await userApi.getData({ ...userDataParams });
      usersData.value = res.data;
    } finally {
      isLoadingData.value = false;
    }
  }
  async function fetchUsersSelected() {
    isLoadingSelected.value = true;
    try {
      const res = await userApi.getSelected({ ...userSelectedParams });
      console.log(res);
      usersSelected.value = res.data;
    } finally {
      isLoadingSelected.value = false;
    }
  }
  async function updateUser(id: number, params: UserUpdateParams) {
    isLoadingUpdate.value = true;
    updateError.value = null;
    try {
      const res = await userApi.updateUser(id, params);
      // update data di list jika ada
      const index = users.value.findIndex((u) => u.id === id);
      if (index !== -1) users.value[index] = res.data;
      // update selected jika sedang dibuka
      if (usersSelected.value?.id === id) usersSelected.value = res.data;
      return res;
    } catch (err: any) {
      updateError.value =
        err?.response?.data?.message ?? "Gagal mengupdate user";
      throw err;
    } finally {
      isLoadingUpdate.value = false;
    }
  }

  function toggleShowDeleted() {
    params.show_deleted = !params.show_deleted;
    params.start = 0;
    fetchUsers();
  }

  return {
    users,
    usersData,
    usersSelected,
    isLoading,
    isLoadingData,
    isLoadingSelected,
    isLoadingUpdate,
    totalRecords,
    params,
    userDataParams,
    userSelectedParams,
    updateError,
    fetchUsers,
    fetchUsersData,
    toggleShowDeleted,
    fetchUsersSelected,
    updateUser,
  };
});
