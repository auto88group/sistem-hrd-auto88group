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
  type UserAccountAccessParams,
  type UserDestroyParams,
  type UserWarningResetResponse, // Pastikan interface ini di-export di user.api.ts
} from "@/api/modules/user.api";
import { id } from "vuetify/locale";

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
  const isLoadingUpdateAccountAccess = ref(false);
  const isLoadingFaceId = ref(false);
  const isLoadingDeviceId = ref(false);

  // State Baru untuk Warning Reset
  const isLoadingWarningReset = ref(false);

  const totalRecords = ref(0);
  const updateError = ref<string | null>(null);
  const createError = ref<string | null>(null);
  const deleteError = ref<string | null>(null);
  const accountAccessError = ref<string | null>(null);

  // Error state Baru untuk Warning Reset
  const resetWarningError = ref<string | null>(null);

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
    only_deleted: false,
    sortBy: "id",
    sortDirection: "desc",
    only_active: true,
    hrd_file_category_id: undefined,
    file_status: undefined,
  });
  const userDataParams = reactive<UserDataParams>({
    search: "",
    branch_id: undefined,
    not_user_id: undefined,
    is_less_than_one_year: undefined,
  });
  const userSelectedParams = reactive<UserSelectedParams>({
    id: "",
  });
  const userProspectParams = reactive<UserProspectParams>({
    action: "",
  });
  const userDestoryParams = reactive<UserDestroyParams>({
    id: undefined,
    is_resign: 0,
    resign_date: undefined,
    action: undefined,
  });

  const buildUserDataParams = (params: UserDataParams): URLSearchParams => {
    const urlParams = new URLSearchParams();

    if (params.is_less_than_one_year !== undefined) {
      urlParams.append(
        "is_less_than_one_year",
        params.is_less_than_one_year ? "1" : "0",
      );
    }
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
      const index = users.value.findIndex((u) => u.id === id);
      if (index !== -1) users.value[index] = res.data;
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

  async function updateAccountAccess(
    id: number,
    params: UserAccountAccessParams,
  ) {
    isLoadingUpdateAccountAccess.value = true;
    accountAccessError.value = null;
    try {
      const res = await userApi.updateAccountAccess(id, params);
      usersSelected.value = res.data;
      console.log(usersSelected.value);
      return res;
    } catch (err: any) {
      accountAccessError.value =
        err?.response?.data?.message ?? "Gagal mengupdate user";
      throw err;
    } finally {
      isLoadingUpdateAccountAccess.value = false;
    }
  }

  async function destroyUser() {
    isLoadingDestroy.value = true;
    deleteError.value = null;
    try {
      const res = await userApi.destroyUser(userDestoryParams);
      if (userDestoryParams.id != null) {
        users.value = users.value.filter(
          (f) => f.id !== Number(userDestoryParams.id),
        );
      }
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
    params.only_deleted = !params.only_deleted;
    params.start = 0;
    fetchUsers();
  }

  async function resetFaceId(id: number) {
    isLoadingFaceId.value = true;
    try {
      const res = await userApi.resetFaceId(id);
      if (res.success) {
        if (usersSelected.value) {
          usersSelected.value.face_id = "";
        }
      }
      return res;
    } catch (err: any) {
      throw err;
    } finally {
      isLoadingFaceId.value = false;
    }
  }

  async function resetDeviceId(id: number) {
    isLoadingDeviceId.value = true;
    try {
      const res = await userApi.resetDeviceId(id);
      if (res.success) {
        if (usersSelected.value) {
          usersSelected.value.device_id = "";
        }
      }
      return res;
    } catch (err: any) {
      throw err;
    } finally {
      isLoadingDeviceId.value = false;
    }
  }

  // ───── FUNCTION ACTION BARU: AUTO RESET WARNING ─────
  async function autoResetUserWarning(): Promise<UserWarningResetResponse> {
    isLoadingWarningReset.value = true;
    resetWarningError.value = null;
    try {
      const res = await userApi.autoResetUserWarning();
      return res;
    } catch (err: any) {
      resetWarningError.value =
        err?.response?.data?.message ??
        "Gagal memproses otomatis reset warning user";
      throw err;
    } finally {
      isLoadingWarningReset.value = false;
    }
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
    isLoadingUpdateAccountAccess,
    isLoadingFaceId,
    isLoadingDeviceId,
    isLoadingWarningReset, // Export state loading baru
    totalRecords,
    params,
    userDataParams,
    userSelectedParams,
    userProspectParams,
    userDestoryParams,
    updateError,
    createError,
    deleteError,
    accountAccessError,
    resetWarningError, // Export state error baru
    fetchUsers,
    fetchUsersData,
    toggleShowDeleted,
    fetchUsersSelected,
    createUser,
    updateUser,
    destroyUser,
    resetFaceId,
    resetDeviceId,
    updateUserProspect,
    fetchUsersDataWithParams,
    updateAccountAccess,
    autoResetUserWarning, // Export fungsi baru
  };
});
