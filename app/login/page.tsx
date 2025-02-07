"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import AuthCard from "../components/auth/AuthCard";
import Image from "next/image";
import { authApi, userApi, api } from "@/lib/api";
import { setToken, setUser } from "@/store/authSlice";
import type { LoginRequest } from "@/types/auth";
import type { RootState } from "@/store";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // 이미 로그인된 사용자는 메인 페이지로 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/main");
    }
  }, [isAuthenticated, router]);

  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      console.log("로그인 응답:", data);
      if (!data.accessToken) {
        console.error("로그인 응답에 액세스 토큰이 없습니다.");
        alert("로그인에 실패했습니다.");
        return;
      }

      try {
        // 토큰 저장 및 API 헤더 설정
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("userEmail", formData.email);
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.accessToken}`;

        // 프로필 정보 가져오기 (이메일 전달)
        const profile = await userApi.getProfile(formData.email);

        // 프로필 정보가 정상적으로 조회된 경우에만 로그인 처리
        dispatch(setToken(data.accessToken));
        dispatch(
          setUser({
            email: profile.email,
            name: profile.name,
            nationality: profile.memberNationality,
          })
        );

        router.push("/main");
      } catch (error) {
        console.error("프로필 조회 실패:", error);
        // 프로필 조회 실패 시 저장했던 토큰 제거
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userEmail");
        delete api.defaults.headers.common["Authorization"];
        alert("로그인에 실패했습니다. 다시 시도해주세요.");
      }
    },
    onError: (error: any) => {
      console.error("로그인 에러:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });

      const errorMessage =
        error.response?.data?.message || "로그인에 실패했습니다.";
      console.error("에러 메시지:", errorMessage);

      alert(errorMessage);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("로그인 요청 데이터:", formData);
    loginMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-1/2 h-screen bg-gradient-to-b from-blue-900/5 to-transparent" />
        <div className="absolute top-20 left-10 w-32 h-32 bg-rose-200 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-20" />
      </div>

      <AuthCard
        title="로그인"
        description="근로자들과 함께 이야기를 나눠보세요"
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              이메일
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-gray-900 placeholder:text-gray-400"
              placeholder="your@email.com"
              required
            />
          </div>
          <div className="space-y-1">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-gray-900 placeholder:text-gray-400"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full py-3 px-4 bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loginMutation.isPending ? "로그인 중..." : "로그인"}
          </button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">또는</span>
            </div>
          </div>

          <button className="w-full py-3 px-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-3">
            <Image
              src="/google.svg"
              alt="Google"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            <span className="text-gray-600">Google로 계속하기</span>
          </button>

          <p className="text-center text-gray-600 mt-8">
            계정이 없으신가요?{" "}
            <Link
              href="/signup"
              className="text-blue-900 hover:underline font-medium"
            >
              회원가입
            </Link>
          </p>
        </form>
      </AuthCard>
    </div>
  );
}
