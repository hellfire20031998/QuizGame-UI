import { apiClient } from "./client";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  username: string;
  email: string;
  password: string;
  role: string;
  provider?: string;
}

export async function login(payload: LoginPayload) {
  const { data } = await apiClient.post("/auth/login", payload);
  return data;
}

export async function signup(payload: SignupPayload) {
  const { data } = await apiClient.post("/auth/signup", payload);
  return data;
}

