"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { use } from "react";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";

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
  isLiked: boolean;
}

interface Comment {
  commentId: number;
  content: string;
  writerId: number;
  writerName: string;
  writerNationality: string;
  writeDate: string;
  likeCount: number;
  isLiked: boolean;
}

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [commentText, setCommentText] = useState("");
  const queryClient = useQueryClient();
  const { ref, inView } = useInView();

  const { data: post, isLoading: isPostLoading } = useQuery({
    queryKey: ["post", resolvedParams.id],
    queryFn: async () => {
      const response = await api.get(`/v1/post/${resolvedParams.id}`);
      return response.data;
    },
  });

  // 댓글 무한 스크롤 쿼리
  const {
    data: commentsPages,
    fetchNextPage,
    hasNextPage,
    isLoading: isCommentsLoading,
  } = useInfiniteQuery({
    queryKey: ["comments", resolvedParams.id],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await api.get(`/v1/post-comment/list`, {
        params: {
          postId: resolvedParams.id,
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

  // 댓글 작성 mutation
  const createComment = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/v1/post-comment/${resolvedParams.id}`, {
        content: commentText,
      });
      return response.data;
    },
    onSuccess: () => {
      setCommentText("");
      // 첫 페이지만 갱신
      queryClient.invalidateQueries({
        queryKey: ["comments", resolvedParams.id],
        refetchPage: (page, index) => index === 0,
      });
    },
    onError: (error) => {
      console.error("댓글 작성 실패:", error);
      alert("댓글 작성에 실패했습니다.");
    },
  });

  // 좋아요 mutation
  const likeMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/v1/post/${resolvedParams.id}/like`);
      console.log("좋아요 응답:", response.data);
      return response.data;
    },
    onMutate: async () => {
      // 이전 데이터 백업
      const previousPost = queryClient.getQueryData<Post>([
        "post",
        resolvedParams.id,
      ]);

      // Optimistic update
      if (previousPost) {
        queryClient.setQueryData<Post>(["post", resolvedParams.id], {
          ...previousPost,
          likeCount: previousPost.isLiked
            ? previousPost.likeCount - 1 // 좋아요 취소
            : previousPost.likeCount + 1, // 좋아요 추가
          isLiked: !previousPost.isLiked,
        });
      }

      return { previousPost };
    },
    onSuccess: (data) => {
      // 서버 응답으로 상태 업데이트
      queryClient.setQueryData<Post>(["post", resolvedParams.id], (old) => {
        if (!old) return old;
        return {
          ...old,
          likeCount: data.likeCount,
          isLiked: data.isLiked,
        };
      });
    },
    onError: (err, variables, context) => {
      // 에러 시 롤백
      if (context?.previousPost) {
        queryClient.setQueryData(
          ["post", resolvedParams.id],
          context.previousPost
        );
      }
      alert("좋아요 실패");
    },
  });

  // 댓글 좋아요 mutation
  const commentLikeMutation = useMutation({
    mutationFn: async (commentId: number) => {
      const response = await api.post(`/v1/post-comment/${commentId}/like`);
      return response.data;
    },
    onMutate: async (commentId) => {
      // 이전 데이터 백업
      const previousComments = queryClient.getQueryData<{
        pages: Array<{
          content: Comment[];
        }>;
      }>(["comments", resolvedParams.id]);

      // Optimistic update
      if (previousComments?.pages) {
        queryClient.setQueryData(["comments", resolvedParams.id], {
          ...previousComments,
          pages: previousComments.pages.map((page) => ({
            ...page,
            content: page.content.map((comment) =>
              comment.commentId === commentId
                ? {
                    ...comment,
                    likeCount: comment.isLiked
                      ? comment.likeCount - 1
                      : comment.likeCount + 1,
                    isLiked: !comment.isLiked,
                  }
                : comment
            ),
          })),
        });
      }

      return { previousComments };
    },
    onSuccess: (data, commentId) => {
      // 서버 응답으로 상태 업데이트
      queryClient.setQueryData<{
        pages: Array<{
          content: Comment[];
        }>;
      }>(["comments", resolvedParams.id], (old) => {
        if (!old?.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            content: page.content.map((comment) =>
              comment.commentId === commentId
                ? {
                    ...comment,
                    likeCount: data.likeCount,
                    isLiked: data.isLiked,
                  }
                : comment
            ),
          })),
        };
      });
    },
    onError: (err, commentId, context) => {
      // 에러 시 롤백
      if (context?.previousComments) {
        queryClient.setQueryData(
          ["comments", resolvedParams.id],
          context.previousComments
        );
      }
      alert("댓글 좋아요 실패");
    },
  });

  if (isPostLoading) {
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
          <h1 className="font-bold text-slate-900 text-lg">게시글</h1>
        </div>
      </nav>

      <main className="pt-20 pb-20 max-w-3xl mx-auto px-4">
        <div
          className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden
          animate-fade-in-up opacity-0"
          style={{
            animationDelay: "0.1s",
            animationFillMode: "forwards",
          }}
        >
          {/* 게시글 헤더 */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-900 font-medium text-lg">
                {post.writerName?.[0] || "익"}
              </div>
              <div>
                <div className="font-medium text-slate-900">
                  {post.writerName || "익명"}
                </div>
                <div className="text-sm text-slate-500">
                  {new Date(post.writeDate).toLocaleDateString()}
                </div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-slate-500">
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

          {/* 채팅 내용 */}
          <div className="p-6 space-y-4">
            {post.chatItems.map((chat: ChatItem, index) => (
              <div key={chat.sequenceId}>
                {/* 질문 */}
                <div
                  className="flex justify-end items-start mb-4
                  animate-fade-in-up opacity-0"
                  style={{
                    animationDelay: `${index * 2 * 0.05 + 0.2}s`,
                    animationFillMode: "forwards",
                  }}
                >
                  <div className="flex items-start gap-2">
                    <div className="max-w-[80%] p-4 rounded-xl bg-blue-900 text-white rounded-tr-none">
                      {chat.question}
                    </div>
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-900 font-medium">
                      {post.writerName?.[0] || "익"}
                    </div>
                  </div>
                </div>

                {/* 답변 */}
                <div
                  className="flex justify-start items-start
                  animate-fade-in-up opacity-0"
                  style={{
                    animationDelay: `${index * 2 * 0.05 + 0.3}s`,
                    animationFillMode: "forwards",
                  }}
                >
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-900 font-medium">
                      AI
                    </div>
                    <div className="max-w-[80%] p-4 rounded-xl bg-slate-100 text-slate-900 rounded-tl-none whitespace-pre-wrap">
                      {chat.answer}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 하단 버튼 */}
          <div
            className="p-6 border-t border-slate-100 flex justify-between
            animate-fade-in-up opacity-0"
            style={{
              animationDelay: "0.4s",
              animationFillMode: "forwards",
            }}
          >
            <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
              <svg
                width="20"
                height="20"
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
              댓글
            </button>
            <button
              onClick={() => likeMutation.mutate()}
              disabled={likeMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={post.isLiked ? "currentColor" : "none"}
                xmlns="http://www.w3.org/2000/svg"
                className={post.isLiked ? "text-red-500" : "text-slate-600"}
              >
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              {likeMutation.isPending ? "처리 중..." : "좋아요"}
              <span className="ml-1">({post.likeCount})</span>
            </button>
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div
          className="mt-4 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden
          animate-fade-in-up opacity-0"
          style={{
            animationDelay: "0.5s",
            animationFillMode: "forwards",
          }}
        >
          <div className="p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              댓글 {commentsPages?.pages[0]?.totalElements || 0}개
            </h2>

            {/* 댓글 목록 */}
            <div className="space-y-6">
              {commentsPages?.pages.map((page) =>
                page.content.map((comment: Comment, index) => (
                  <div
                    key={comment.commentId}
                    className="group animate-fade-in-up opacity-0"
                    style={{
                      animationDelay: `${index * 0.05 + 0.6}s`,
                      animationFillMode: "forwards",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-900 font-medium">
                        {comment.writerName?.[0] || "익"}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-slate-900">
                            {comment.writerName}
                          </span>
                          <span className="text-sm text-slate-500">
                            {new Date(comment.writeDate).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-600 whitespace-pre-wrap">
                          {comment.content}
                        </p>
                        <div className="mt-2 flex items-center gap-4">
                          <button
                            onClick={() =>
                              commentLikeMutation.mutate(comment.commentId)
                            }
                            disabled={commentLikeMutation.isPending}
                            className="flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 transition-colors
                            disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill={comment.isLiked ? "currentColor" : "none"}
                              xmlns="http://www.w3.org/2000/svg"
                              className={
                                comment.isLiked
                                  ? "text-red-500"
                                  : "text-slate-600"
                              }
                            >
                              <path
                                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              />
                            </svg>
                            {comment.likeCount}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* 로딩 인디케이터 */}
              <div ref={ref} className="py-4 text-center">
                {hasNextPage && (
                  <div className="text-slate-500 text-sm animate-pulse">
                    댓글 더 불러오는 중...
                  </div>
                )}
              </div>
            </div>

            {/* 댓글 작성 */}
            <div className="mt-6">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="댓글을 입력하세요"
                className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none
                  text-slate-900 placeholder:text-slate-400 bg-white"
                rows={3}
                disabled={createComment.isPending}
              />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => {
                    if (!commentText.trim()) {
                      alert("댓글 내용을 입력하세요.");
                      return;
                    }
                    createComment.mutate();
                  }}
                  disabled={createComment.isPending || !commentText.trim()}
                  className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors 
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createComment.isPending ? "작성 중..." : "댓글 작성"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
