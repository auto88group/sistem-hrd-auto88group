import api from "../axios";
export interface UserDatatablesParams {
  draw?: number;
  start?: number;
  length?: number;
  user_id?: number;
  master_position_id?: number;
  branch_id?: number;
  hrd_master_education_id?: number;
  status_id?: number;
  gender?: string;
  show_deleted?: boolean;
}
export interface UserDataParams {
  search?: string;
  branch_id?: number;
  not_user_id?: number | number[];
}

export interface UserCreateUpdateParams {
  // required
  employee_id: number;
  full_name: string;
  name: string;
  email: string;
  branch_id: number;
  master_position_id: number;
  position: string;
  level: string;

  // optional
  nik?: string;
  password?: string;
  password_confirmation?: string;
  image?: File;
  phone_number?: string;
  initial?: string;
  sequence?: number;

  // personal
  gender?: "M" | "F";
  birth_place?: string;
  birth_date?: string; // format: dd-mm-yyyy
  front_title?: string;
  back_title?: string;

  // address
  current_address?: string;
  address_id_card?: string;
  zip_code?: string;
  neighborhood_unit?: string;
  community_unit?: string;
  master_area_province_id?: number;
  master_area_regency_id?: number;
  master_area_district_id?: number;
  master_area_village_id?: number;

  // HRD
  hrd_master_religion_id?: number;
  hrd_master_education_id?: number;
  hrd_master_blood_type_id?: number;
  hrd_master_marital_status_id?: number;
  bpjs_health_number?: string;
  bpjs_employment_number?: string;
  number_of_children?: number;

  // emergency
  emergency_contact_name?: string;
  emergency_phone_number?: string;

  // employment
  primary_approver_id?: number;
  secondary_approver_id?: number;
  status_id?: number;
  join_date?: string; // format: dd-mm-yyyy
  effective_start_date?: string; // format: dd-mm-yyyy
  effective_end_date?: string; // format: dd-mm-yyyy
  remaining_leave?: number;
}
export interface UserSelectedParams {
  id?: string;
}

export interface UserProspectParams {
  action: string;
}

export interface UserDatatablesResponse {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: User[];
}

export interface UserDataResponse {
  success: boolean;
  data: User[];
}

export interface UserSelectedResponse {
  success: boolean;
  data: User; // single object, bukan array
}

export interface UserUpdateResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface UserDefaultResponse {
  success: boolean;
  message: string;
}

export interface User {
  DT_RowIndex: number;
  address_id_card: number;
  back_title: string;
  birth_date: string;
  birth_place: string;
  blood_type: {
    id: number;
    name: string;
  };
  bpjs_employment_number: string;
  bpjs_health_number: string;
  branch: {
    alias: string;
    code: string;
    id: number;
    name: string;
  };
  community_unit: string;
  current_address: string;
  device_id: string;
  disabled: number;
  disctrict: {
    id: number;
    name: string;
  };
  education: {
    id: number;
    name: string;
  };
  effective_end_date: string;
  effective_start_date: string;
  email: string;
  emergency_contact_name: string;
  emergency_phone_number: string;
  employee_id: number;
  face_id: string;
  front_title: string;
  full_name: string;
  gender: "M" | "F";
  hrd_master_blood_type_id: string;
  hrd_master_education_id: string;
  hrd_master_religion_id: string;
  primary_approver_id: number;
  secondary_approver_id: number;
  primary_approver: {
    id: number;
    name: string;
    full_name: string;
    email: string;
  };
  secondary_approver: {
    id: number;
    name: string;
    full_name: string;
    email: string;
  };
  id: number;
  image: string;
  join_date: string;
  level: string;
  location_presensi: {
    accuracy: number;
    attendance: number;
    id: number;
    latitude: number;
    limitation: number;
    longitude: number;
    name: string;
    stock: number;
  };
  location_presensi_id: number;
  lock_device_attendance: number;
  lock_face_attendance: number;
  marital_status: {
    id: number;
    name: string;
  };
  master_area_district_id: number;
  master_area_province_id: number;
  master_area_regency_id: number;
  master_area_village_id: number;
  hrd_master_marital_status_id: number;
  master_position_id: number;
  position: string;
  name: string;
  neighborhood_unit: string;
  nik: string;
  number_of_children: number;
  phone_number: string;
  province: {
    id: number;
    name: string;
  };
  remaining_leave: number;
  religion: {
    id: number;
    name: string;
  };
  regency: {
    id: number;
    name: string;
  };
  status_id: number;
  telemarketing: {
    branch_id: number;
    disabled: number;
    id: number;
    inisial: string;
    nama: string;
    urutan: number;
    user_id: number;
  };
  village: {
    id: number;
    name: string;
  };
  zip_code: string;
}

export const userApi = {
  getDatatables(params: UserDatatablesParams): Promise<UserDatatablesResponse> {
    return api.get("/hrd/users", { params }).then((res) => res.data);
  },

  getData(params: URLSearchParams | UserDataParams) {
    return api.get("/hrd/users/data", { params }).then((res) => res.data);
  },

  getSelected(params: UserSelectedParams): Promise<UserSelectedResponse> {
    return api.get(`/hrd/users/${params.id}`).then((res) => res.data);
  },

  createUser(params: UserCreateUpdateParams): Promise<UserUpdateResponse> {
    const formData = new FormData();

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    });

    return api
      .post(`/hrd/users`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data);
  },

  updateUser(
    id: number,
    params: UserCreateUpdateParams,
  ): Promise<UserUpdateResponse> {
    const formData = new FormData();

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    });

    return api
      .post(`/hrd/users/${id}?_method=POST`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data);
  },

  destroyUser(id: number): Promise<UserDefaultResponse> {
    return api.delete(`/hrd/users/${id}`).then((res) => res.data);
  },

  updateUserProspect(
    id: number,
    params: UserProspectParams,
  ): Promise<UserDefaultResponse> {
    return api
      .put(`/hrd/users/status-prospect/${id}`, params)
      .then((res) => res.data);
  },
};
