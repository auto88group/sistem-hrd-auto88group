// src/types/auth.type.ts
export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  name: string;
  email: string;
  level: string;
  image: string;
  id: string;
}
