import * as authApi from "@/api/modules/auth.api";
import type { LoginPayload, LoginResponse } from "@/types/auth.type";

export const loginService = async (
  payload: LoginPayload,
): Promise<LoginResponse> => {
  return await authApi.login(payload);
};
export const logoutService = async (): Promise<void> => {
  return await authApi.logout();
};
