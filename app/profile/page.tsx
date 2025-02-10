"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { setUser } from "@/store/authSlice";
import type { RootState } from "@/store";

interface ProfileUpdateRequest {
  name: string;
  nationality: string;
}

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // user 정보가 있으면 그 값을 초기값으로 사용
  const [formData, setFormData] = useState<ProfileUpdateRequest>({
    name: user?.name || "",
    nationality: user?.nationality || "VIETNAMESE",
  });

  // 프로필 정보 조회
  useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await api.get(
        `/v1/user/member/profile?email=${user?.email}`
      );
      const data = response.data;

      // Redux store와 form 데이터 모두 업데이트
      dispatch(
        setUser({
          name: data.name,
          nationality: data.memberNationality,
        })
      );

      setFormData({
        name: data.name,
        nationality: data.memberNationality,
      });

      return data;
    },
    enabled: !user && !!localStorage.getItem("accessToken"),
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileUpdateRequest) => {
      console.log(data);
      const response = await api.put("/v1/user/member/profile", data);
      return response.data;
    },
    onSuccess: () => {
      alert("프로필이 업데이트되었습니다.");
    },
    onError: (error: any) => {
      console.error("프로필 업데이트 실패:", error);
      alert(error.response?.data?.message || "프로필 업데이트에 실패했습니다.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("프로필 업데이트 요청:", formData);
    updateProfileMutation.mutate(formData);
  };

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
            <form className="p-6 space-y-6" onSubmit={handleSubmit}>
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
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
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
                    value={formData.memberNationality}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        memberNationality: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      text-slate-900 bg-white"
                  >
                    <option value="VIETNAMESE">베트남</option>
                    <option value="FILIPINO">필리핀</option>
                    <option value="THAI">태국</option>
                    <option value="INDONESIAN">인도네시아</option>
                    <option value="MYANMAR">미얀마</option>
                    <option value="KOREA">한국</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50"
                >
                  {updateProfileMutation.isPending ? "저장 중..." : "저장하기"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
