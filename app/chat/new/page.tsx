"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function NewChatPage() {
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: inputText }]);
    setInputText("");
  };

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
            />
            <button
              type="submit"
              className="px-6 bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition-colors"
            >
              전송
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
