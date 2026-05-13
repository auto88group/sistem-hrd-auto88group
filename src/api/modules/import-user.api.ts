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

// ==================== API ====================

export const importUserApi = async (): Promise<DataForTemplateUserResponse> => {
  const response = await api.get<DataForTemplateUserResponse>(
    "/hrd/users/get-data-for-template-user",
  );
  return response.data;
};
