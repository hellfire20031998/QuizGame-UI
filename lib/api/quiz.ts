import { apiClient } from "./client";

export interface QuizSummary {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
  questions?: { id: number }[];
  createdBy?: { username?: string; email?: string };
  published?: boolean;
  totalTimeInSeconds?: number;
}

export interface PagedResponse<T> {
  success: boolean;
  message?: string;
  data?: {
    content: T[];
    totalElements?: number;
    totalPages?: number;
  };
}

export async function fetchAllQuizzes() {
  const { data } = await apiClient.get<PagedResponse<QuizSummary>>(
    "/quiz/get-all"
  );
  return data;
}

export async function fetchMyQuizzes() {
  const { data } = await apiClient.get<PagedResponse<QuizSummary>>(
    "/quiz/get-all-my"
  );
  return data;
}

export async function searchQuizzes(term: string) {
  const { data } = await apiClient.get<PagedResponse<QuizSummary>>(
    "/quiz/search",
    { params: { term } }
  );
  return data;
}

export interface QuizDetailOption {
  id: number;
  text: string;
}

export interface QuizDetailQuestion {
  id: number;
  text: string;
  options: QuizDetailOption[];
}

export interface QuizDetail {
  id: number;
  title: string;
  description?: string;
  totalTimeInSeconds: number;
  createdBy?: { username?: string; email?: string };
  questions: QuizDetailQuestion[];
}

export interface QuizDetailResponse {
  success: boolean;
  message?: string;
  data?: QuizDetail;
}

export async function fetchQuizById(id: number | string) {
  const { data } = await apiClient.get<QuizDetailResponse>(`/quiz/${id}`);
  return data;
}

export interface CreateQuizPayload {
  title: string;
  description: string;
  totalTimeInSeconds: number;
  domains: number[];
  questionRequests: {
    text: string;
    optionRequests: { text: string; correct: boolean }[];
  }[];
}

export async function createQuiz(payload: CreateQuizPayload) {
  const { data } = await apiClient.post("/quiz/create", payload);
  return data;
}

export async function toggleQuizPublish(id: number | string) {
  const { data } = await apiClient.patch(`/quiz/${id}/toggle-publish`);
  return data;
}

