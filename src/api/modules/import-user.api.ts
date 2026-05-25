import api from "../axios";

// ==================== TYPES ====================

export interface Branch {
  code: string;
  name: string;
}

export interface Coordinate {
  id: number;
  name: string;
}

export interface Position {
  id: number;
  name: string;
}

export interface MasterEducation {
  id: number;
  name: string;
}

export interface BloodType {
  id: number;
  name: string;
}

export interface Religion {
  id: number;
  name: string;
}

export interface MaritalStatus {
  id: number;
  name: string;
}

export interface DataForTemplateUser {
  branch: Branch[];
  coordinate: Coordinate[];
  position: Position[];
  master_education: MasterEducation[];
  blood_type: BloodType[];
  religion: Religion[];
  marital_status: MaritalStatus[];
}

export interface DataForTemplateUserResponse {
  success: boolean;
  message: string;
  data: DataForTemplateUser;
}

export interface UploadImportResponse {
  success: boolean;
  message: string;
  total_imported?: number;
  errors?: string[];
  error_detail?: string;
}

// ==================== API ====================

export const importUserApi = async (): Promise<DataForTemplateUserResponse> => {
  const response = await api.get<DataForTemplateUserResponse>(
    "/hrd/users/get-data-for-template-user",
  );
  return response.data;
};

export const uploadImportUserApi = async (
  file: File,
): Promise<UploadImportResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  // Sesuaikan URL '/hrd/users/import' dengan definisi route Anda
  const response = await api.post<UploadImportResponse>(
    "/hrd/users/import",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

export const exportUserApi = async (): Promise<Blob> => {
  const response = await api.get<Blob>("/hrd/users/export", {
    // PENTING: responseType wajib 'blob' agar Axios tidak merusak file biner Excel
    responseType: "blob",
  });

  return response.data;
};
