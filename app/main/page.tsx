"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import type { RootState } from "@/store";
import { logout, setUser } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const BOARD_TYPES = {
  EMPLOYMENT_PROCESS: "취업 절차",
  LABOR_LAW_RIGHTS: "노동법/권리",
  EMPLOYER_OBLIGATIONS: "사업주 의무",
  IMMIGRATION_RESIDENCY: "체류/비자",
  EMPLOYMENT_COMPLIANCE: "고용 규정",
  DAILY_LIFE: "일상생활",
} as const;

const CATEGORY_MAPPING = {
  salary: "LABOR_LAW_RIGHTS",
  worktime: "LABOR_LAW_RIGHTS",
  accident: "EMPLOYER_OBLIGATIONS",
  contract: "EMPLOYMENT_COMPLIANCE",
  visa: "IMMIGRATION_RESIDENCY",
  info: "EMPLOYMENT_PROCESS",
  daily: "DAILY_LIFE",
} as const;

export default function MainPage() {
  const dispatch = useDispatch();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();

  // 프로필 정보 조회
  useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await api.get(
        `/v1/user/member/profile?email=${user?.email}`
      );
      dispatch(
        setUser({
          email: response.data.email,
          name: response.data.name,
          nationality: response.data.memberNationality,
        })
      );
      return response.data;
    },
    enabled: !user && !!localStorage.getItem("accessToken"), // 유저 정보가 없고 토큰이 있을 때만 실행
  });

  const notifications = [
    {
      id: 1,
      title: "새로운 답변이 달렸습니다",
      desc: "임금 체불 관련 상담에 새로운 답변이 있습니다.",
      time: "방금 전",
      isNew: true,
    },
    {
      id: 2,
      title: "상담이 완료되었습니다",
      desc: "근로시간 관련 상담이 완료되었습니다.",
      time: "1시간 전",
      isNew: true,
    },
    {
      id: 3,
      title: "환영합니다!",
      desc: "AliStory에 가입하신 것을 환영합니다.",
      time: "1일 전",
      isNew: false,
    },
  ];

  const handleLogout = () => {
    // 로컬 스토리지에서 토큰 제거
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // API 헤더에서 토큰 제거
    delete api.defaults.headers.common["Authorization"];

    // Redux store에서 인증 정보 제거
    dispatch(logout());

    // 로그인 페이지로 리다이렉트
    router.push("/login");
  };

  const categories = [
    {
      id: "1",
      category: "salary",
      title: "임금 체불 상담",
      desc: "3개월째 월급이 밀리고 있습니다",
      isNew: true,
      boardType: CATEGORY_MAPPING.salary,
    },
    {
      id: "2",
      category: "worktime",
      title: "근무 환경",
      desc: "야간 근무 수당 문의드립니다",
      isNew: true,
      boardType: CATEGORY_MAPPING.worktime,
    },
    {
      id: "3",
      category: "accident",
      title: "산업 재해",
      desc: "일하다 다쳤는데 보상을 못 받고 있어요",
      isNew: true,
      boardType: CATEGORY_MAPPING.accident,
    },
    {
      id: "4",
      category: "contract",
      title: "계약 관련",
      desc: "근로계약서 작성시 주의할 점",
      isNew: true,
      boardType: CATEGORY_MAPPING.contract,
    },
    {
      id: "5",
      category: "visa",
      title: "체류 자격",
      desc: "비자 연장 관련 질문있습니다",
      isNew: true,
      boardType: CATEGORY_MAPPING.visa,
    },
    {
      id: "6",
      category: "info",
      title: "정보 공유",
      desc: "📌 무료 한국어 교육 정보",
      isNew: true,
      boardType: CATEGORY_MAPPING.info,
    },
    {
      id: "7",
      category: "daily",
      title: "일상 이야기",
      desc: "한국에서 처음으로 설날을 보내며",
      isNew: true,
      boardType: CATEGORY_MAPPING.daily,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm fixed w-full top-0 z-50 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="로고" width={32} height={32} />
            <Link href="/main" className="text-xl font-bold text-slate-900">
              AliStory
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                className="w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center transition-colors relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                {notifications.some((n) => n.isNew) && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></div>
                )}
                <Image src="/bell.svg" alt="알림" width={24} height={24} />
              </button>

              {/* 알림 리스트 */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-fade-in">
                  <div className="p-4 border-b border-slate-100">
                    <h3 className="font-medium text-slate-900">알림</h3>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-medium text-slate-900 mb-1">
                              {notification.title}
                            </h4>
                            <p className="text-sm text-slate-600">
                              {notification.desc}
                            </p>
                          </div>
                          {notification.isNew && (
                            <span className="flex-shrink-0 w-2 h-2 mt-2 bg-rose-500 rounded-full"></span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 mt-2 block">
                          {notification.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* 프로필 메뉴 */}
            <div className="relative">
              <button
                className="w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center transition-colors"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <Image src="/user.svg" alt="프로필" width={24} height={24} />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-fade-in">
                  <div className="p-4 border-b border-slate-100">
                    <p className="font-medium text-slate-900">{user?.name}님</p>
                    <p className="text-sm text-slate-500">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Image src="/user.svg" alt="" width={16} height={16} />
                      프로필 설정
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Image
                        src="/settings.svg"
                        alt=""
                        width={16}
                        height={16}
                      />
                      계정 설정
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-slate-50 transition-colors"
                    >
                      <Image src="/logout.svg" alt="" width={16} height={16} />
                      로그아웃
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 메인 컨텐츠 */}
      <main className="pt-14">
        {/* 상단 배너 섹션 */}
        <section className="bg-white p-4 shadow-sm animate-fade-in-up opacity-0">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-slate-800 rounded-2xl p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">AI 상담 서비스 오픈!</h2>
              <p className="text-slate-200">
                근로 관련 법률 상담을 무료로 받아보세요
              </p>
              <Link
                href="/chat/new"
                className="inline-block mt-4 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors font-medium"
              >
                상담하기 →
              </Link>
            </div>
          </div>
        </section>

        {/* 자주 묻는 상담 주제 */}
        <section className="bg-white mt-2 p-4 shadow-sm animate-fade-in-up-delay-1 opacity-0">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-lg font-medium text-slate-900 mb-4">
              자주 묻는 상담 주제
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[
                {
                  icon: "💰",
                  label: "임금 체불",
                  desc: "밀린 월급 받기",
                  href: "/chat/salary/faq",
                },
                {
                  icon: "⏰",
                  label: "근로 시간",
                  desc: "초과근무 & 휴일근로",
                  href: "/chat/worktime/faq",
                },
                {
                  icon: "🏥",
                  label: "산업 재해",
                  desc: "치료비 & 보상금",
                  href: "/chat/accident/faq",
                },
                {
                  icon: "📝",
                  label: "근로 계약",
                  desc: "부당한 계약 해지",
                  href: "/chat/contract/faq",
                },
                {
                  icon: "🏢",
                  label: "퇴직금",
                  desc: "퇴직금 계산",
                  href: "/chat/severance/faq",
                },
                {
                  icon: "✋",
                  label: "부당 대우",
                  desc: "차별 & 폭행",
                  href: "/chat/unfair/faq",
                },
                {
                  icon: "🌍",
                  label: "체류 자격",
                  desc: "비자 & 연장",
                  href: "/chat/visa/faq",
                },
                {
                  icon: "📱",
                  label: "기타 상담",
                  desc: "다른 문제 상담",
                  href: "/chat/other/faq",
                },
              ].map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="flex flex-col p-4 hover:bg-slate-50 rounded-xl transition-colors border border-slate-200 group
                    animate-fade-in-up opacity-0"
                  style={{ animationDelay: `${index * 0.05 + 0.2}s` }}
                >
                  <span className="text-2xl mb-2">{item.icon}</span>
                  <h3 className="font-medium text-slate-900 mb-1 group-hover:text-blue-900">
                    {item.label}
                  </h3>
                  <p className="text-sm text-slate-600">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 게시판 목록 */}
        <section className="bg-white mt-2 p-4 shadow-sm animate-fade-in-up-delay-2 opacity-0">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-slate-900">
                인기 게시판
              </h2>
              <Link
                href="/community"
                className="text-sm text-slate-600 hover:text-blue-900"
              >
                전체보기 →
              </Link>
            </div>
            <div className="space-y-4">
              {categories.map((item, index) => (
                <Link
                  key={index}
                  href={`/board/${item.boardType.toLowerCase()}?category=${
                    item.category
                  }`}
                  className="flex items-center justify-between py-2 hover:bg-slate-50 rounded-lg transition-colors px-2
                    animate-fade-in-up opacity-0"
                  style={{ animationDelay: `${index * 0.05 + 0.3}s` }}
                >
                  <div>
                    <h3 className="font-medium text-slate-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600">{item.desc}</p>
                  </div>
                  {item.isNew && (
                    <span className="text-rose-500 text-sm font-medium">N</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
