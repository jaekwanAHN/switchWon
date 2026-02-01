export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

export interface LoginRequest {
  email: string;
}

export interface LoginResponse {
  memberId: number;
  token: string;
}
