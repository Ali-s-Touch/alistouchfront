export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  nationality:
    | "KOREAN"
    | "VIETNAMESE"
    | "FILIPINO"
    | "THAI"
    | "INDONESIAN"
    | "MYANMAR";
  language: "KOREAN" | "VIETNAMESE" | "ENGLISH" | "THAI" | "INDONESIAN";
  telephone: string;
}

export interface SignupResponse {
  success: boolean;
  message?: string;
  token?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface UserProfile {
  name: string;
  email: string;
  memberNationality:
    | "KOREAN"
    | "VIETNAMESE"
    | "FILIPINO"
    | "THAI"
    | "INDONESIAN"
    | "MYANMAR";
}
