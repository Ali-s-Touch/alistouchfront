import Link from "next/link";
import Image from "next/image";

const faqData = {
  salary: {
    title: "임금 체불 관련 자주 묻는 질문",
    faqs: [
      {
        q: "임금을 3개월째 받지 못하고 있습니다. 어떻게 해야 하나요?",
        a: `1. 먼저 임금체불 사실을 증명할 수 있는 자료를 모으세요:
- 근로계약서
- 출근 기록
- 임금명세서
- 업무 관련 대화 내용

2. 고용노동부에 진정을 제기할 수 있습니다:
- 관할 지방노동청에 임금체불 진정서 제출
- 온라인으로도 신청 가능 (홈페이지: www.moel.go.kr)

3. 법적 대응도 가능합니다:
- 무료 법률 상담 이용
- 법률 구조공단 지원 요청

※ 외국인 근로자도 동일한 권리를 가집니다.`,
      },
      {
        q: "체불된 임금은 언제까지 청구할 수 있나요?",
        a: "임금 청구권의 소멸시효는 3년입니다. 퇴직금의 경우는 3년, 재직 중에는 시효가 진행되지 않습니다.",
      },
      // ... 더 많은 FAQ 항목
    ],
  },
  worktime: {
    title: "근로 시간 관련 자주 묻는 질문",
    faqs: [
      {
        q: "야간 근무 수당은 어떻게 계산하나요?",
        a: "야간근로(오후 10시부터 다음 날 오전 6시 사이의 근로)에 대해서는 통상임금의 50%를 가산하여 지급받을 수 있습니다.",
      },
      {
        q: "주말 근무 수당은 어떻게 되나요?",
        a: "휴일근로에 대해서는 통상임금의 50%를 가산하여 지급받을 수 있습니다. 8시간을 초과하는 휴일근로는 통상임금의 100%를 가산합니다.",
      },
    ],
  },
  accident: {
    title: "산업 재해 관련 자주 묻는 질문",
    faqs: [
      {
        q: "일하다가 다쳤을 때 어떻게 해야 하나요?",
        a: "1. 즉시 사업주나 관리자에게 보고하세요\n2. 병원 진료를 받으세요\n3. 산재보험 신청이 가능합니다",
      },
    ],
  },
  contract: {
    title: "근로 계약 관련 자주 묻는 질문",
    faqs: [
      {
        q: "근로계약서는 꼭 작성해야 하나요?",
        a: "네, 근로계약서 작성은 법적 의무사항입니다. 반드시 서면으로 작성하고 사본을 보관하세요.",
      },
    ],
  },
  severance: {
    title: "퇴직금 관련 자주 묻는 질문",
    faqs: [
      {
        q: "퇴직금은 언제 받을 수 있나요?",
        a: "1년 이상 근무 후 퇴사 시 퇴직금을 받을 수 있으며, 퇴사일로부터 14일 이내에 지급되어야 합니다.",
      },
    ],
  },
  unfair: {
    title: "부당 대우 관련 자주 묻는 질문",
    faqs: [
      {
        q: "차별이나 폭행을 당했을 때 어떻게 해야 하나요?",
        a: "1. 증거(사진, 녹음, 목격자 진술 등)를 확보하세요\n2. 노동청이나 경찰에 신고할 수 있습니다\n3. 인권위원회에도 진정을 제기할 수 있습니다",
      },
    ],
  },
  visa: {
    title: "체류 자격 관련 자주 묻는 질문",
    faqs: [
      {
        q: "비자 연장은 어떻게 하나요?",
        a: "체류기간 만료일 4개월 전부터 신청 가능합니다. 출입국관리사무소를 방문하거나 하이코리아 웹사이트에서 신청할 수 있습니다.",
      },
    ],
  },
  other: {
    title: "기타 자주 묻는 질문",
    faqs: [
      {
        q: "상담이 필요할 때 어디로 연락하면 되나요?",
        a: "1350(외국인종합안내센터)로 전화하시면 모국어로 상담받으실 수 있습니다.",
      },
    ],
  },
};

export default function FaqPage({ params }: { params: { category: string } }) {
  const { category } = params;
  const data = faqData[category as keyof typeof faqData];

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
            <Link href="/main" className="p-2 hover:bg-slate-50 rounded-full">
              <Image src="/arrow-left.svg" alt="뒤로" width={20} height={20} />
            </Link>
            <h1 className="font-medium text-slate-900">FAQ</h1>
          </div>
        </nav>
        <main className="pt-14 max-w-3xl mx-auto p-4">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-slate-600">존재하지 않는 카테고리입니다.</p>
            <Link
              href="/main"
              className="text-blue-900 hover:underline text-sm font-medium mt-4 inline-block"
            >
              메인으로 돌아가기 →
            </Link>
          </div>
        </main>
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
          <h1 className="font-medium text-slate-900">{data.title}</h1>
        </div>
      </nav>

      {/* 메인 컨텐츠 */}
      <main className="pt-14 max-w-3xl mx-auto p-4">
        <div className="space-y-6">
          {data.faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm space-y-4"
            >
              <h2 className="text-lg font-medium text-slate-900">{faq.q}</h2>
              <div className="text-slate-600 whitespace-pre-line">{faq.a}</div>
              <div className="pt-4 border-t border-slate-100">
                <Link
                  href={`/chat/${category}/new`}
                  className="text-blue-900 hover:underline text-sm font-medium"
                >
                  이 주제로 상담하기 →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
