import api from "../axios";
import type { LoginPayload, LoginResponse } from "@/types/auth.type";

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>("/login", payload);
  return res.data;
};
