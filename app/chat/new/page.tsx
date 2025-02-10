"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

interface Message {
  role: "user" | "assistant";
  content: string;
  sequenceId?: number;
}

interface ChatRoom {
  id: string;
  messages: Message[];
}

export default function NewChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 채팅방 생성 함수를 useCallback으로 메모이제이션
  const createNewChatRoom = useCallback(async () => {
    try {
      console.log("채팅방 생성 요청");
      const response = await api.post("/v1/chat-room/create");
      console.log("채팅방 생성 응답:", response.data);
      setChatRoomId(response.data);
    } catch (error) {
      console.error("채팅방 생성 실패:", error);
    }
  }, []);

  // 컴포넌트 마운트 시 한 번만 실행
  useEffect(() => {
    createNewChatRoom();
  }, [createNewChatRoom]);

  // 메시지 전송
  const sendMessage = useMutation({
    mutationFn: async (message: string) => {
      if (!chatRoomId) throw new Error("채팅방이 없습니다");
      console.log("메시지 전송:", message);
      const response = await api.post(`/v1/chat/${chatRoomId}`, {
        message: message,
      });
      console.log("메시지 전송 응답:", response.data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("메시지 전송 성공:", data);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer,
          sequenceId: messages.length + 2,
        },
      ]);
    },
    onError: (error) => {
      console.error("메시지 전송 실패:", error);
      alert("메시지 전송에 실패했습니다.");
    },
  });

  // 게시글 작성 API 호출
  const createPost = useMutation({
    mutationFn: async () => {
      if (!chatRoomId) throw new Error("채팅방이 없습니다");

      // 메시지들의 sequenceId 배열 생성
      const sequenceIds = messages
        .filter((msg) => msg.sequenceId) // sequenceId가 있는 메시지만 필터링
        .map((msg) => msg.sequenceId!); // sequenceId 배열로 변환

      console.log("sequenceIds", sequenceIds);
      const response = await api.post(`/v1/chat-room/${chatRoomId}/post`, {
        sequenceIds: sequenceIds,
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log("게시글 생성 성공:", data);
      router.push(`/post/${data.postId}`); // 생성된 게시글로 이동
    },
    onError: (error) => {
      console.error("게시글 생성 실패:", error);
      alert("게시글 생성에 실패했습니다.");
    },
  });

  // 채팅방 메시지 조회
  useQuery({
    queryKey: ["chatRoom", chatRoomId],
    queryFn: async () => {
      if (!chatRoomId) return null;
      console.log("채팅방 메시지 조회 요청:", chatRoomId);
      const response = await api.get(`/v1/chat/${chatRoomId}`);
      console.log("채팅방 메시지 조회 응답:", response.data);
      return response.data;
    },
    enabled: !!chatRoomId,
    onSuccess: (data) => {
      console.log("채팅방 메시지 조회 성공:", data);
      if (data?.messages) {
        setMessages(data.messages);
      }
    },
  });

  // chatRoomId가 변경될 때마다 로그 출력
  useEffect(() => {
    console.log("chatRoomId 변경됨:", chatRoomId);
  }, [chatRoomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // 사용자 메시지를 먼저 화면에 표시
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: inputText,
        sequenceId: messages.length + 1, // 사용자 메시지의 sequenceId 추가
      },
    ]);

    // 메시지 전송
    sendMessage.mutate(inputText);

    // 입력창 초기화
    setInputText("");
  };

  // 게시글 작성 버튼 표시 여부
  const shouldShowPostButton = messages.length >= 2; // 사용자 메시지와 AI 응답이 있을 때

  const renderContent = () => {
    if (createNewChatRoom.isPending) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-slate-600">채팅방 생성 중...</div>
        </div>
      );
    }

    if (createNewChatRoom.isError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-red-600">
            채팅방 생성에 실패했습니다. 다시 시도해주세요.
            <button
              onClick={() => createNewChatRoom()}
              className="mt-4 px-4 py-2 bg-blue-900 text-white rounded-lg"
            >
              다시 시도
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        {/* 상단 네비게이션 */}
        <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
            <Link href="/main" className="p-2 hover:bg-slate-50 rounded-full">
              <Image src="/arrow-left.svg" alt="뒤로" width={20} height={20} />
            </Link>
            <h1 className="font-medium text-slate-900">새 상담</h1>
          </div>
        </nav>

        {/* 메인 컨텐츠 */}
        <main className="pt-14 pb-20">
          <div className="max-w-3xl mx-auto p-4">
            {/* 게시글 작성 버튼 */}
            {shouldShowPostButton && (
              <div className="fixed right-4 bottom-24 z-50 animate-fade-in">
                <button
                  onClick={() => createPost.mutate()}
                  disabled={createPost.isPending}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-full shadow-lg hover:bg-blue-800 transition-all duration-200 hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="animate-pulse"
                  >
                    <path
                      d="M12 5V19M5 12H19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="font-medium">
                    {createPost.isPending
                      ? "게시글 작성 중..."
                      : "게시글 작성하기"}
                  </span>
                </button>
              </div>
            )}

            {/* 채팅 메시지 */}
            <div className="space-y-4 mb-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  } animate-message-in`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-xl ${
                      message.role === "user"
                        ? "bg-blue-900 text-white"
                        : "bg-slate-100 text-slate-900"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </main>

        {/* 입력 영역 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200">
          <div className="max-w-3xl mx-auto p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="메시지를 입력하세요"
                className="flex-1 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  text-slate-900 placeholder:text-slate-400"
                disabled={!chatRoomId || sendMessage.isPending}
              />
              <button
                type="submit"
                disabled={!chatRoomId || sendMessage.isPending}
                className="px-6 bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-50"
              >
                {sendMessage.isPending ? "전송 중..." : "전송"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return renderContent();
}
