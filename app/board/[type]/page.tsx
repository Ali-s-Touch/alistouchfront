"use client";

import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { use, useEffect } from "react";
import { useInView } from "react-intersection-observer";

const BOARD_TYPES = {
  EMPLOYMENT_PROCESS: "취업 절차",
  LABOR_LAW_RIGHTS: "노동법/권리",
  EMPLOYER_OBLIGATIONS: "사업주 의무",
  IMMIGRATION_RESIDENCY: "체류/비자",
  EMPLOYMENT_COMPLIANCE: "고용 규정",
  DAILY_LIFE: "일상생활",
} as const;

interface ChatItem {
  sequenceId: number;
  question: string;
  answer: string;
  createdAt: string;
}

interface Post {
  title: string;
  content: string;
  chatItems: ChatItem[];
  writerId: number;
  writerName: string;
  writerNationality: string;
  writeDate: string;
  boardType: string;
  viewCount: number;
  likeCount: number;
  id: number;
}

export default function BoardPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const { ref, inView } = useInView();

  const {
    data: postsPages,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["posts", resolvedParams.type],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await api.get("/v1/post/list", {
        params: {
          boardType: resolvedParams.type.toUpperCase(),
          page: pageParam,
          size: 10,
          sort: "createdDate",
        },
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.number + 1;
    },
    initialPageParam: 0,
  });

  // 무한 스크롤 감지
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-slate-600 animate-pulse">
          게시글 불러오는 중...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link
            href="/main"
            className="p-2 hover:bg-slate-50 rounded-full transition-colors"
          >
            <Image src="/arrow-left.svg" alt="뒤로" width={20} height={20} />
          </Link>
          <div>
            <h1 className="font-bold text-slate-900 text-lg">
              {
                BOARD_TYPES[
                  resolvedParams.type.toUpperCase() as keyof typeof BOARD_TYPES
                ]
              }
            </h1>
            <p className="text-sm text-slate-500">
              총 {postsPages?.pages[0]?.totalElements || 0}개의 게시글
            </p>
          </div>
        </div>
      </nav>

      <main className="pt-20 pb-20 max-w-3xl mx-auto px-4">
        {postsPages?.pages[0]?.content.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 mb-8 bg-white rounded-full flex items-center justify-center shadow-md">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-slate-400"
              >
                <path
                  d="M21 11.5V17.5C21 20 19.5 22 17 22H7C4.5 22 3 20 3 17.5V6.5C3 4 4.5 2 7 2H8.5C10 2 10.33 2.44 10.9 3.2L12.4 5.2C12.78 5.7 13 6 14 6H17C19.5 6 21 7.5 21 10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              아직 게시글이 없습니다
            </h2>
            <p className="text-slate-500 mb-10 max-w-sm">
              첫 번째 게시글의 주인공이 되어보세요! 지금 바로 상담을
              시작해보세요.
            </p>
            <Link
              href="/chat/new"
              className="px-8 py-4 bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition-all duration-200 hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2.5 21.5L7 20.6622C8.47087 21.513 10.1786 22 12 22Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              상담하러 가기
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {postsPages?.pages.map((page, pageIndex) =>
              page.content.map((post: Post, index) => (
                <Link
                  key={`${post.writerId}-${post.writeDate}`}
                  href={`/post/${post.id}`}
                  className="block bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 border border-slate-100
                    animate-fade-in-up opacity-0"
                  style={{
                    animationDelay: `${
                      (pageIndex * page.content.length + index) * 0.05
                    }s`,
                    animationFillMode: "forwards",
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-900 font-medium">
                      {post.writerName?.[0] || "익"}
                    </div>
                    <div>
                      <span className="font-medium text-slate-900">
                        {post.writerName || "익명"}
                      </span>
                      <div className="text-sm text-slate-400">
                        {new Date(post.writeDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <h2 className="font-bold text-slate-900 mb-2 text-lg">
                    {post.title}
                  </h2>
                  <p className="text-slate-600 mb-4 line-clamp-2">
                    {post.content}
                  </p>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                        </svg>
                        {post.viewCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 21C17.5228 21 22 16.5228 22 12C22 7.47715 17.5228 3 12 3C6.47715 3 2 7.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2.5 21.5L7 20.6622C8.47087 21.513 10.1786 22 12 22"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                        </svg>
                        {post.likeCount}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 6V12L16 14"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {new Date(post.writeDate).toLocaleTimeString()}
                    </div>
                  </div>
                </Link>
              ))
            )}

            {/* 로딩 인디케이터 */}
            <div ref={ref} className="py-4 text-center">
              {hasNextPage && (
                <div className="text-slate-500 text-sm animate-pulse">
                  게시글 더 불러오는 중...
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
