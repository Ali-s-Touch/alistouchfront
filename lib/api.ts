import axios from "axios";
import type {
  SignupRequest,
  SignupResponse,
  LoginRequest,
  LoginResponse,
  UserProfile,
} from "@/types/auth";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 추가
api.interceptors.request.use((config) => {
  // 로그인, 회원가입 요청에는 토큰을 포함하지 않음
  const isAuthRequest = config.url?.includes("/auth/");
  if (!isAuthRequest) {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }
  return config;
});

export const authApi = {
  signup: async (data: SignupRequest) => {
    console.log("회원가입 요청 데이터:", data);
    const response = await api.post<SignupResponse>("/v1/auth/signup", data);
    console.log("회원가입 응답:", response.data);
    return response.data;
  },
  login: async (data: LoginRequest) => {
    console.log("로그인 요청 데이터:", {
      url: "/v1/auth/login",
      data,
      headers: api.defaults.headers,
    });
    const response = await api.post<LoginResponse>("/v1/auth/login", data);
    console.log("로그인 응답:", response.data);
    return response.data;
  },
};

export const userApi = {
  getProfile: async (email: string) => {
    const response = await api.get<UserProfile>("/v1/user/member/profile", {
      params: { email },
    });
    console.log("프로필 응답:", response.data);
    return response.data;
  },
};
