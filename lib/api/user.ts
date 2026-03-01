import { apiClient } from "./client";

export interface UserProfile {
  username: string;
  email: string;
  role?: string;
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

export async function fetchCurrentUser() {
  const { data } = await apiClient.get<UserResponse>("/user/me");
  return data;
}

