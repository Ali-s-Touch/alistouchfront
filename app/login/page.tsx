"use client";

import Link from "next/link";
import AuthCard from "../components/auth/AuthCard";
import Image from "next/image";

export default function LoginPage() {
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
        <form className="space-y-5">
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-gray-900 placeholder:text-gray-400"
              placeholder="your@email.com"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-gray-900 placeholder:text-gray-400"
              placeholder="••••••••"
            />
          </div>

          <button className="w-full py-3 px-4 bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            로그인
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
