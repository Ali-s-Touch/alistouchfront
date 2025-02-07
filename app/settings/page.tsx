"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface PasswordUpdateRequest {
  currentPassword: string;
  newPassword: string;
}

export default function SettingsPage() {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    marketing: false,
  });

  const [language, setLanguage] = useState("ko");

  const updatePasswordMutation = useMutation({
    mutationFn: async (data: PasswordUpdateRequest) => {
      const response = await api.put("/v1/user/member/setting", data);
      return response.data;
    },
    onSuccess: () => {
      alert("비밀번호가 변경되었습니다.");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    },
    onError: (error: any) => {
      console.error("비밀번호 변경 실패:", error);
      alert(error.response?.data?.message || "비밀번호 변경에 실패했습니다.");
    },
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    console.log("비밀번호 변경 요청:", {
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });

    updatePasswordMutation.mutate({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/main" className="p-2 hover:bg-slate-50 rounded-full">
            <Image src="/arrow-left.svg" alt="뒤로" width={20} height={20} />
          </Link>
          <h1 className="font-medium text-slate-900">계정 설정</h1>
        </div>
      </nav>

      <main className="pt-14 pb-20">
        <div className="max-w-3xl mx-auto p-4">
          {/* 비밀번호 변경 */}
          <div className="bg-white rounded-xl shadow-sm mb-4">
            <div className="p-6">
              <h2 className="text-lg font-medium text-slate-900 mb-4">
                비밀번호 변경
              </h2>
              <form className="space-y-4" onSubmit={handlePasswordSubmit}>
                <div>
                  <label
                    htmlFor="current-password"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    현재 비밀번호
                  </label>
                  <input
                    type="password"
                    id="current-password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      text-slate-900 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label
                    htmlFor="new-password"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    새 비밀번호
                  </label>
                  <input
                    type="password"
                    id="new-password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      text-slate-900 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    새 비밀번호 확인
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      text-slate-900 placeholder:text-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 transition-colors"
                >
                  비밀번호 변경
                </button>
              </form>
            </div>
          </div>

          {/* 알림 설정 */}
          <div className="bg-white rounded-xl shadow-sm mb-4">
            <div className="p-6">
              <h2 className="text-lg font-medium text-slate-900 mb-4">
                알림 설정
              </h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-slate-700">이메일 알림</span>
                  <button
                    type="button"
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      ${notifications.email ? "bg-blue-900" : "bg-slate-200"}`}
                    onClick={() =>
                      setNotifications((prev) => ({
                        ...prev,
                        email: !prev.email,
                      }))
                    }
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${
                          notifications.email
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                    />
                  </button>
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-slate-700">푸시 알림</span>
                  <button
                    type="button"
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      ${notifications.push ? "bg-blue-900" : "bg-slate-200"}`}
                    onClick={() =>
                      setNotifications((prev) => ({
                        ...prev,
                        push: !prev.push,
                      }))
                    }
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${
                          notifications.push ? "translate-x-6" : "translate-x-1"
                        }`}
                    />
                  </button>
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-slate-700">마케팅 알림</span>
                  <button
                    type="button"
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      ${
                        notifications.marketing ? "bg-blue-900" : "bg-slate-200"
                      }`}
                    onClick={() =>
                      setNotifications((prev) => ({
                        ...prev,
                        marketing: !prev.marketing,
                      }))
                    }
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${
                          notifications.marketing
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                    />
                  </button>
                </label>
              </div>
            </div>
          </div>

          {/* 언어 설정 */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6">
              <h2 className="text-lg font-medium text-slate-900 mb-4">
                언어 설정
              </h2>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  text-slate-900 bg-white"
              >
                <option value="ko">한국어</option>
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
                <option value="th">ภาษาไทย</option>
                <option value="id">Bahasa Indonesia</option>
              </select>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
