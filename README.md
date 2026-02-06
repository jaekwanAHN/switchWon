## 🔗 링크 (Deployment)

- **Github:** https://github.com/jaekwanAHN/switchWon

---

## 🛠 기술 스택 (Tech Stack)

### Core

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS

### State Management & Data Fetching

- **Server State:** TanStack Query (React Query) v5
  - `prefetchQuery` & `HydrationBoundary`를 활용한 SSR/CSR 하이브리드 데이터 동기화
- **Client State:** Zustand
  - 전역 Toast 알림 및 UI 상태 관리
- **Form Handling:** React Hook Form + Zod
  - `useForm({ mode: 'onChange' })`를 통한 실시간 유효성 검사

### Utilities

- **HTTP Client:** Axios (Client) / Fetch API (Server)
- **Date:** Day.js
- **Debounce:** Custom Hook (`useDebounce`)

---

## ✨ 핵심 기능 (Key Features)

### 1. 실시간 환전 시뮬레이션

- **실시간 견적 (Live Quote):** 사용자가 금액을 입력하는 즉시(Debounce 300ms) 예상 환전 금액을 계산하여 표시합니다.
- **안전 거래 (Safety Lock):** 환율 변동으로 인한 `EXCHANGE_RATE_MISMATCH` 에러 발생 시, 즉시 견적을 무효화하고 버튼을 비활성화하여 **더블 클릭 및 슬리피지(Slippage) 사고를 방지**했습니다.
- **Optimistic UI:** 환전 성공 시 지갑 잔액과 내역을 즉시 갱신하여 쾌적한 사용자 경험을 제공합니다.

### 2. 하이브리드 렌더링 (RSC + CSR)

- **초기 로딩 가속 (FCP 개선):** 메인 대시보드 진입 시 `RSC(React Server Component)`에서 데이터를 `prefetch`하여 스피너 없는 즉각적인 화면 렌더링을 구현했습니다.
- **보안 강화:** 초기 데이터 로딩 시 Access Token을 서버 사이드에서 처리하여 클라이언트 노출을 최소화했습니다.
- **실시간성 유지:** 초기 로딩 이후에는 React Query가 백그라운드에서 주기적으로 데이터를 동기화합니다.

### 3. 사용자 경험(UX) 최적화

- **깜빡임 방지:** `keepPreviousData` 옵션을 사용하여 데이터 갱신 중에도 기존 수치를 유지, 화면 떨림(Layout Shift)을 방지했습니다.
- **전역 알림 시스템:** `window.alert` 대신 Zustand 기반의 커스텀 Toast를 구현하여 비차단적(Non-blocking) 알림을 제공합니다.

---

## 📂 프로젝트 구조 (Directory Structure)

```bash
app/
├── (auth)/login          # 로그인 페이지
├── (main)/               # 메인 대시보드 (RSC)
│   └── history/          # 환전 내역
├── components/           # UI 컴포넌트 (Presentation)
│   ├── dashboard/        # 환율 목록, 지갑 카드
│   ├── exchange/         # 환전 폼
│   └── ui/               # 공통 UI (Toast 등)
├── hooks/                # 비즈니스 로직 (Custom Hooks)
│   ├── useExchangeData.ts
│   ├── useExchangeFormLogic.ts  # 폼 로직 분리
│   └── useDebounce.ts
├── lib/                  # 유틸리티 및 API 설정
│   ├── api/              # API 호출 함수 (Client/Server 분리)
│   └── axios.ts          # Axios Interceptor 설정
├── store/                # 전역 상태 (Zustand)
└── types/                # TypeScript 타입 정의
```
