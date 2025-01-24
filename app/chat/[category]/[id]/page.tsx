import Link from "next/link";
import Image from "next/image";

// 실제로는 API에서 가져올 데이터
const mockChatData = {
  id: "1",
  category: "salary",
  title: "3개월째 월급을 받지 못하고 있습니다",
  createdAt: "2024-01-25T12:00:00",
  user: {
    name: "김OO",
    nationality: "VN",
  },
  chat: [
    {
      role: "user",
      content:
        "안녕하세요, 3개월째 월급을 받지 못하고 있는데 어떻게 해야 할까요?",
    },
    {
      role: "assistant",
      content:
        "임금 체불 상황이시군요. 먼저 몇 가지 확인이 필요합니다. 근로계약서는 작성하셨나요?",
    },
    {
      role: "user",
      content: "네, 근로계약서는 있습니다.",
    },
    {
      role: "assistant",
      content: `좋습니다. 임금 체불에 대한 대응 방법을 안내해드리겠습니다:

1. 증거자료 준비
- 근로계약서
- 출근기록
- 임금명세서
- 업무 관련 대화내용 등을 모으세요

2. 고용노동부 진정 제기
- 관할 지방노동청에 방문하여 진정서를 제출하세요
- 온라인으로도 신청 가능합니다 (www.moel.go.kr)

3. 법률구조공단 상담
- 무료 법률상담을 받을 수 있습니다
- 필요시 법적 대응을 위한 지원을 받을 수 있습니다

외국인 근로자도 동일한 권리를 가지고 있으니 걱정하지 마세요.
제가 진정서 작성을 도와드릴까요?`,
    },
    {
      role: "user",
      content: "네, 진정서 작성 방법을 알려주시면 감사하겠습니다.",
    },
    {
      role: "assistant",
      content:
        "진정서 작성을 도와드리겠습니다. 다음 내용을 순서대로 작성하시면 됩니다...",
    },
  ],
  comments: [
    {
      id: 1,
      user: "이OO",
      content:
        "저도 비슷한 경험이 있었는데, 노동청에 신고하니까 바로 해결됐어요. 증거자료만 잘 준비하시면 됩니다!",
      createdAt: "2024-01-25T13:00:00",
    },
    {
      id: 2,
      user: "박OO",
      content:
        "노동청 신고 전에 사업주님과 한 번 더 대화를 시도해보는 것도 좋을 것 같아요.",
      createdAt: "2024-01-25T14:30:00",
    },
    {
      id: 3,
      user: "최OO",
      content:
        "외국인 노동자 지원센터에서도 도움받을 수 있어요. 통역 서비스도 제공합니다.",
      createdAt: "2024-01-25T15:45:00",
    },
  ],
};

export default function ChatDetailPage({
  params,
}: {
  params: { category: string; id: string };
}) {
  const { category, id } = params;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 네비게이션 */}
      <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/main" className="p-2 hover:bg-slate-50 rounded-full">
            <Image src="/arrow-left.svg" alt="뒤로" width={20} height={20} />
          </Link>
          <h1 className="font-medium text-slate-900">상담 내역</h1>
        </div>
      </nav>

      {/* 메인 컨텐츠 */}
      <main className="pt-14 max-w-3xl mx-auto p-4">
        {/* 게시글 헤더 */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-slate-900">
              {mockChatData.title}
            </h1>
            <span className="text-sm text-slate-500">
              {new Date(mockChatData.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>{mockChatData.user.name}</span>
            <span>·</span>
            <span>{mockChatData.user.nationality}</span>
          </div>
        </div>

        {/* 채팅 내용 */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-4 space-y-4">
          {mockChatData.chat.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
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
        </div>

        {/* 댓글 섹션 */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-medium text-slate-900 mb-4">
            댓글 {mockChatData.comments.length}개
          </h2>

          {/* 댓글 입력 */}
          <div className="mb-6">
            <textarea
              className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="댓글을 입력하세요"
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <button className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors">
                댓글 작성
              </button>
            </div>
          </div>

          {/* 댓글 목록 */}
          <div className="space-y-4">
            {mockChatData.comments.map((comment) => (
              <div key={comment.id} className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-900">
                    {comment.user}
                  </span>
                  <span className="text-sm text-slate-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-600">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
