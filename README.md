# 🌟 AliStory

외국인 근로자를 위한 AI 기반 법률 상담 플랫폼

## 🚀 주요 기능

### 1. AI 법률 상담

- 실시간 AI 챗봇을 통한 법률 상담
- 다국어 지원으로 언어 장벽 해소
- 근로 관련 법률 문제 해결 지원

### 2. 커뮤니티

- 카테고리별 게시판 운영
  - 취업 절차
  - 노동법/권리
  - 사업주 의무
  - 체류/비자
  - 고용 규정
  - 일상생활
- 실시간 알림 시스템
- 댓글과 좋아요 기능

### 3. 사용자 경험

- 직관적인 UI/UX
- 반응형 디자인
- 무한 스크롤
- 실시간 업데이트

## 🛠 기술 스택

### Frontend

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Tanstack Query
- Redux Toolkit

### 주요 라이브러리

- `@tanstack/react-query`
- `@reduxjs/toolkit`
- `axios`
- `next/navigation`
- `react-intersection-observer`

## 🔧 설치 및 실행

```bash

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 🌈 프로젝트 구조

```
app/
├── board/          # 게시판 관련 페이지
├── chat/           # AI 상담 관련 페이지
├── login/          # 로그인/회원가입
├── post/           # 게시글 상세
├── profile/        # 프로필 관리
├── search/         # 검색 기능
└── main/           # 메인 페이지

components/         # 재사용 가능한 컴포넌트
hooks/              # 커스텀 훅
lib/                # 유틸리티 함수
store/              # Redux 스토어
```

## 📝 라이선스

MIT License
