import { apiClient } from "./client";

export interface SubmissionAnswerPayload {
  questionId: number;
  selectedOptionId: number;
}

export interface SubmissionPayload {
  quizId: number;
  totalTimeInSeconds: number;
  answers: SubmissionAnswerPayload[];
}

export async function submitQuiz(payload: SubmissionPayload) {
  const { data } = await apiClient.post("/submission", payload);
  return data;
}

