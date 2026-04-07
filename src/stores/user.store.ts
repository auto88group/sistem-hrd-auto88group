import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import {
  userApi,
  type User,
  type UserDataParams,
  type UserDatatablesParams,
  type UserProspectParams,
  type UserSelectedParams,
  type UserCreateUpdateParams,
} from "@/api/modules/user.api";

export const useUserStore = defineStore("user", () => {
  const users = ref<User[]>([]);
  const usersData = ref<User[]>([]);
  const usersSelected = ref<User | null>(null);
  const isLoading = ref(false);
  const isLoadingData = ref(false);
  const isLoadingSelected = ref(false);
  const isLoadingUpdate = ref(false);
  const isLoadingDestroy = ref(false);
  const isLoadingCreate = ref(false);
  const isLoadingProspect = ref(false);
  const totalRecords = ref(0);
  const updateError = ref<string | null>(null);
  const createError = ref<string | null>(null);
  const deleteError = ref<string | null>(null);

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
    branch_id: undefined,
    not_user_id: undefined, // tambahkan ini
  });
  const userSelectedParams = reactive<UserSelectedParams>({
    id: "",
  });
  const userProspectParams = reactive<UserProspectParams>({
    action: "",
  });

  const buildUserDataParams = (params: UserDataParams): URLSearchParams => {
    const urlParams = new URLSearchParams();

    if (params.search) urlParams.append("search", params.search);
    if (params.branch_id)
      urlParams.append("branch_id", params.branch_id.toString());

    if (params.not_user_id !== undefined) {
      if (Array.isArray(params.not_user_id)) {
        params.not_user_id.forEach((id) =>
          urlParams.append("not_user_id[]", id.toString()),
        );
      } else {
        urlParams.append("not_user_id", params.not_user_id.toString());
      }
    }

    return urlParams;
  };

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
      const res = await userApi.getData(buildUserDataParams(userDataParams));
      usersData.value = res.data;
    } finally {
      isLoadingData.value = false;
    }
  }
  async function fetchUsersDataWithParams(
    overrideParams: Partial<UserDataParams>,
  ): Promise<User[]> {
    const merged = { ...userDataParams, ...overrideParams };
    const res = await userApi.getData(buildUserDataParams(merged));
    return res.data;
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
  async function createUser(params: UserCreateUpdateParams) {
    isLoadingCreate.value = true;
    createError.value = null;
    try {
      const res = await userApi.createUser(params);
      return res;
    } catch (err: any) {
      createError.value = err?.response?.data?.message ?? "Gagal menambah user";
      throw err;
    } finally {
      isLoadingCreate.value = false;
    }
  }
  async function updateUser(id: number, params: UserCreateUpdateParams) {
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

  async function destroyUser(id: number) {
    isLoadingDestroy.value = true;
    deleteError.value = null;
    try {
      const res = await userApi.destroyUser(id);
      users.value = users.value.filter((f) => f.id !== id);
      return res;
    } catch (err: any) {
      deleteError.value =
        err?.response?.data?.message ?? "Gagal menghapus user";
      throw err;
    } finally {
      isLoadingDestroy.value = false;
    }
  }

  async function updateUserProspect(id: number) {
    isLoadingProspect.value = true;
    try {
      const res = await userApi.updateUserProspect(id, {
        ...userProspectParams,
      });
      return res;
    } finally {
      isLoadingProspect.value = false;
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
    isLoadingDestroy,
    isLoadingCreate,
    isLoadingProspect,
    totalRecords,
    params,
    userDataParams,
    userSelectedParams,
    userProspectParams,
    updateError,
    createError,
    deleteError,
    fetchUsers,
    fetchUsersData,
    toggleShowDeleted,
    fetchUsersSelected,
    createUser,
    updateUser,
    destroyUser,
    updateUserProspect,
    fetchUsersDataWithParams,
  };
});
