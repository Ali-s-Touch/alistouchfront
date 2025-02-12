"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import AuthCard from "../components/auth/AuthCard";
import Image from "next/image";
import { authApi } from "@/lib/api";
import type { SignupRequest } from "@/types/auth";
import { useDispatch } from "react-redux";
import { setToken } from "@/store/authSlice";

const nationalityOptions = [
  { value: "KOREA", label: "대한민국" },
  { value: "CHINA", label: "중국" },
  { value: "VIETNAM", label: "베트남" },
  { value: "THAILAND", label: "태국" },
  { value: "PHILIPPINES", label: "필리핀" },
  { value: "INDONESIA", label: "인도네시아" },
  { value: "UZBEKISTAN", label: "우즈베키스탄" },
  { value: "MONGOLIA", label: "몽골" },
  { value: "CAMBODIA", label: "캄보디아" },
  { value: "MYANMAR", label: "미얀마" },
  { value: "BANGLADESH", label: "방글라데시" },
  { value: "ENGLISH_SPEAKING", label: "영어권 국가" },
] as const;

const languageOptions = [
  { value: "KOREAN", label: "한국어" },
  { value: "CHINESE", label: "中文" },
  { value: "VIETNAMESE", label: "Tiếng Việt" },
  { value: "THAI", label: "ภาษาไทย" },
  { value: "ENGLISH", label: "English" },
  { value: "INDONESIAN", label: "Bahasa Indonesia" },
  { value: "UZBEK", label: "O'zbek" },
  { value: "MONGOLIAN", label: "Монгол" },
  { value: "KHMER", label: "ភាសាខ្មែរ" },
  { value: "BURMESE", label: "မြန်မာစာ" },
  { value: "BENGALI", label: "বাংলা" },
] as const;

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<SignupRequest>({
    email: "",
    password: "",
    name: "",
    nationality: "VIETNAMESE",
    language: "VIETNAMESE",
    telephone: "",
  });

  const signupMutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: (data) => {
      if (data.token) {
        dispatch(setToken(data.token));
        localStorage.setItem("token", data.token);
        authApi.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.token}`;
      }
      alert("회원가입이 완료되었습니다.");
      router.push("/main");
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "회원가입에 실패했습니다.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("회원가입 요청 데이터:", formData);
    signupMutation.mutate(formData);
  };

  const handleNationalityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nationality = e.target.value as SignupRequest["nationality"];
    setFormData({
      ...formData,
      nationality,
      language:
        languageOptions.find((option) => option.value === nationality)?.value ||
        "ENGLISH",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-1/2 h-screen bg-gradient-to-b from-blue-900/5 to-transparent" />
        <div className="absolute top-20 left-10 w-32 h-32 bg-rose-200 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-20" />
      </div>

      <AuthCard title="회원가입" description="알리의 손길과 함께하세요">
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

          <div className="space-y-1">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              이름
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-gray-900 placeholder:text-gray-400"
              placeholder="이름을 입력하세요"
              required
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="nationality"
              className="block text-sm font-medium text-gray-700"
            >
              국적
            </label>
            <select
              id="nationality"
              value={formData.nationality}
              onChange={handleNationalityChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow appearance-none bg-white text-gray-900"
              required
            >
              {nationalityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="language"
              className="block text-sm font-medium text-gray-700"
            >
              선호 언어
            </label>
            <select
              id="language"
              value={formData.language}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  language: e.target.value as SignupRequest["language"],
                })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow appearance-none bg-white text-gray-900"
              required
            >
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="telephone"
              className="block text-sm font-medium text-gray-700"
            >
              전화번호
            </label>
            <input
              type="tel"
              id="telephone"
              value={formData.telephone}
              onChange={(e) =>
                setFormData({ ...formData, telephone: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-gray-900 placeholder:text-gray-400"
              placeholder="010-0000-0000"
              required
            />
          </div>

          <button
            type="submit"
            disabled={signupMutation.isPending}
            className="w-full py-3 px-4 bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {signupMutation.isPending ? "처리중..." : "회원가입"}
          </button>

          <p className="text-center text-gray-600 mt-8">
            이미 계정이 있으신가요?{" "}
            <Link
              href="/login"
              className="text-blue-900 hover:underline font-medium"
            >
              로그인
            </Link>
          </p>
        </form>
      </AuthCard>
    </div>
  );
}
