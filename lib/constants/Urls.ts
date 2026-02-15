export const URLS = {
  // Auth Routes
  LOGIN: '/login',
  SIGNUP: '/signup',
  OAUTH_SUCCESS: '/oauth-success',

  // Dashboard & Main Features
  DASHBOARD: '/dashboard',
  CREATE_QUIZ: '/dashboard/create-quiz',
  QUIZZES: '/dashboard/quizzes',
  SETTINGS: '/dashboard/settings',

  // Dynamic Quiz Routes
  PLAY_QUIZ: (id: string | number) => `/dashboard/quizzes/${id}/play`,
  QUIZ_RESULT: (id: string | number) => `/dashboard/quizzes/${id}/result`,
  QUIZ_DETAILS: (id: string | number) => `/dashboard/quizzes/${id}`,
};