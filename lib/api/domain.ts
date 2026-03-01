import { apiClient } from "./client";

export interface Domain {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  version: number;
}

export interface DomainResponse {
  success: boolean;
  message: string;
  data: Domain[];
  errorCode: string | null;
  timestamp: string;
}

export async function fetchLatestDomains() {
  const { data } = await apiClient.get<DomainResponse>("/domains/latest");
  return data;
}

export async function searchDomains(query: string) {
  const { data } = await apiClient.get<DomainResponse>("/domains/search", {
    params: { query },
  });
  return data;
}

