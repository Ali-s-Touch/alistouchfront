"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ProfilePage() {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/main" className="p-2 hover:bg-slate-50 rounded-full">
            <Image src="/arrow-left.svg" alt="뒤로" width={20} height={20} />
          </Link>
          <h1 className="font-medium text-slate-900">프로필 설정</h1>
        </div>
      </nav>

      <main className="pt-14 pb-20">
        <div className="max-w-3xl mx-auto p-4">
          <div className="bg-white rounded-xl shadow-sm">
            {/* 프로필 이미지 섹션 */}
            <div className="p-6 flex flex-col items-center border-b border-slate-200">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100">
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt="프로필"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src="/user.svg"
                      alt="프로필"
                      width={96}
                      height={96}
                      className="p-4"
                    />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-800 transition-colors">
                  <Image
                    src="/camera.svg"
                    alt="이미지 업로드"
                    width={16}
                    height={16}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>

            {/* 프로필 정보 폼 */}
            <form className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    이름
                  </label>
                  <input
                    type="text"
                    id="name"
                    defaultValue="김OO"
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      text-slate-900 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    이메일
                  </label>
                  <input
                    type="email"
                    id="email"
                    defaultValue="worker@email.com"
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      text-slate-900 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label
                    htmlFor="nationality"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    국적
                  </label>
                  <select
                    id="nationality"
                    defaultValue="VN"
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      text-slate-900 bg-white"
                  >
                    <option value="VN">베트남</option>
                    <option value="PH">필리핀</option>
                    <option value="TH">태국</option>
                    <option value="ID">인도네시아</option>
                    <option value="MM">미얀마</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 transition-colors"
                >
                  저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
