import apiClient from "@/lib/api/axios";
import { ApiResponse, LoginResponse } from "@/types/auth";


export const login = async (email: string): Promise<LoginResponse> => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>(
    "/auth/login",
    null, // Body는 비움
    { params: { email } } // Query String으로 보냄
  );
  return response.data.data;
};
