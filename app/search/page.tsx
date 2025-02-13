"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useDebounce } from "@/hooks/useDebounce";

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

export default function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 500);
  const { ref, inView } = useInView();

  const {
    data: searchResults,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["search", debouncedKeyword],
    queryFn: async ({ pageParam = 0 }) => {
      if (!debouncedKeyword.trim()) return { content: [], last: true };
      const response = await api.get("/v1/post/search", {
        params: {
          keyword: debouncedKeyword,
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
    enabled: debouncedKeyword.trim().length > 0,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);
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
          <div className="flex-1">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="검색어를 입력하세요"
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500 
                text-slate-900 placeholder:text-slate-400"
            />
          </div>
        </div>
      </nav>

      <main className="pt-20 pb-20 max-w-3xl mx-auto px-4">
        {!debouncedKeyword.trim() ? (
          <div className="text-center text-slate-500 py-20">
            검색어를 입력해주세요
          </div>
        ) : isLoading ? (
          <div className="text-center text-slate-500 py-20 animate-pulse">
            검색 중...
          </div>
        ) : searchResults?.pages[0]?.content.length === 0 ? (
          <div className="text-center text-slate-500 py-20">
            검색 결과가 없습니다
          </div>
        ) : (
          <div className="grid gap-4">
            {searchResults?.pages.map((page) =>
              page.content.map((post: Post) => (
                <Link
                  key={`${post.writerId}-${post.writeDate}`}
                  href={`/post/${post.id}`}
                  className="block bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 border border-slate-100"
                >
                  {/* 게시글 카드 내용 - board/[type]/page.tsx와 동일 */}
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
                  </div>
                </Link>
              ))
            )}

            {/* 로딩 인디케이터 */}
            <div ref={ref} className="py-4 text-center">
              {hasNextPage && (
                <div className="text-slate-500 text-sm animate-pulse">
                  검색 결과 더 불러오는 중...
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
