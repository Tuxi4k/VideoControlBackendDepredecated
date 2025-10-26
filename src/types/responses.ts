// src/types/responses.ts
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface FormSubmissionResponse {
  telegramSuccess: boolean;
  emailSuccess: boolean;
  userSaved: boolean;
}
