# FESTAI 프론트엔드

방문객 QR 모바일 웹, 운영자 콘솔, 참여업체(상인) 콘솔을 한 앱으로 제공하는 Next.js 프론트엔드입니다. 화면에 보이는 값은 FastAPI 백엔드(`../backend`)에서 옵니다. 프로젝트 소개·기능 전반·기술 스택·아키텍처는 [FESTAI 프로젝트 개요](https://github.com/FEST-ON)를 참고하세요.

## 폴더 구조 (FSD 기반)

```
src/
├── app/                     # Next.js App Router, 전역 레이아웃·스타일·프로바이더
│   ├── (public)/visitor/    # 방문객 화면 — QR 모바일 웹 / 키오스크
│   ├── (public)/merchant-invite/  # 초대 링크로 상인 계정 개설
│   ├── (protected)/admin/   # 축제 담당 주무관 화면 — 통합 운영 콘솔
│   ├── (protected)/merchant/# 참여업체(상인) 콘솔
│   └── api/                 # 서버 전용 프록시 — i18n/translate, voice/synthesize, liveavatar/session
├── shared/                  # 공용 UI(shadcn), api 클라이언트, i18n, 훅·유틸
├── entities/                # 비즈니스 엔티티: festival, program, ticket, esg, visitor, coupon,
│                            #   announcement, audit-log
├── features/                # 유저 상호작용 기능 — ai-guide/, kiosk-age-assist/,
│                            #   map/, crowd/, esg/, privacy/, complaint-insight/, accessibility/,
│                            #   reservation.ts, rewards.ts, plogging.ts, reusable-containers.ts …
└── widgets/                 # 화면 조합 — landing-hero, visitor-nav/layout, admin-sidebar, dashboard-stats
```

엔티티는 타입·규칙과 조회를 한 파일에 둡니다. 기능은 파일이 여러 개일 때만 폴더를 씁니다
(`features/reservation.ts` vs `features/ai-guide/{lib,model,ui}`).

## 화면 구성

| 스펙 | 화면 경로 |
| --- | --- |
| 6.1 AI 축제 안내 | `/visitor/ai-guide`, `/visitor/course`, `/visitor/map`(혼잡도 탭), 우측 상단 접근성(♿) 버튼 |
| 6.2 통합 운영관리 | `/admin`, `/admin/programs`, `/admin/content`, `/admin/tickets`, `/admin/announcements`, `/admin/bookings`, `/admin/field`, `/admin/staff`, `/admin/ai-insights`, `/admin/documents` |
| 6.3 방문객 QR 모바일 웹 | `/visitor`, `/visitor/map`, `/visitor/schedule`, `/visitor/reservation`, `/visitor/stamp-tour`, `/visitor/coupons`, `/visitor/nearby`, `/visitor/survey` |
| 6.4 ESG 성과관리 | `/admin/esg`, `/admin/rewards`, `/admin/plogging`, `/admin/reusable-containers`, `/visitor/coupons/{wallet,points,status,plogging,reusable,rent,return}` |
| 운영 기준정보·권한 | `/admin/festival`, `/admin/map-locations`, `/admin/businesses`, `/admin/coupons`, `/admin/surveys`, `/admin/members`, `/admin/audit-logs`, `/admin/privacy` |
| 참여업체(상인) 콘솔 | `/merchant`, 초대 수락은 `/merchant-invite` |
| 고지 화면 | `/visitor/privacy`(개인정보 동의·열람/삭제 요구), `/visitor/licenses`(오픈소스 고지) |

랜딩 페이지(`/`)에서 방문객·운영자 두 시나리오로 진입할 수 있습니다.

## 실행 방법

요구 사항은 Node.js 20 이상과 실행 중인 백엔드입니다.

```bash
npm install
cp .env.example .env.local
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

- 방문객 플로우: `/visitor`
- 운영자 플로우: `/admin` (백엔드 데모 계정으로 로그인)
- 상인 플로우: `/merchant`

로컬 백엔드를 쓸 때는 마이그레이션·시드·서버를 먼저 실행해야 합니다(`../backend/README.md`).

프로덕션 빌드와 린트:

```bash
npm run build
npm run start
npm run lint
```

### 다국어 사전 재생성

UI 문구의 원본은 `src/shared/lib/i18n/dictionaries/ko.ts` 하나입니다. `en/zh/ja`는 생성물이라
직접 고치지 말고 ko.ts를 고친 뒤 아래를 실행합니다.

```bash
GOOGLE_TRANSLATE_API_KEY=... npm run i18n
```

`npm test`가 ko.ts 해시를 대조하므로, 재생성을 잊으면 테스트가 먼저 깨집니다.

다국어는 **방문객 화면에만** 적용됩니다. 운영자 콘솔(`/admin`)과 참여업체 콘솔(`/merchant`)은
한국어 문구를 화면에 직접 씁니다 — 언어 전환은 방문객 화면의 표시 언어만 바꿉니다.

## 환경 변수

`.env.example`을 `.env.local`로 복사해 사용합니다. `NEXT_PUBLIC_` 접두사가 없는 값은 Next 서버에서만 읽고 브라우저에 노출되지 않습니다.

| 변수 | 기본값 | 설명 |
| --- | --- | --- |
| `BACKEND_URL` | `http://127.0.0.1:8000` | 백엔드 원점. `/api/v1`은 붙이지 않습니다 |
| `NEXT_PUBLIC_FESTIVAL_CODE` | `EST34-2026` | 화면이 조회할 축제 코드 |
| `NEXT_PUBLIC_VOICE_MODE` | `browser` | `browser`=브라우저 내장 음성, `remote`=CosyVoice 런타임 |
| `VOICE_RUNTIME_URL` | `http://127.0.0.1:8100` | CosyVoice 런타임 주소 (`remote`일 때) |
| `NEXT_PUBLIC_KAKAO_MAP_APP_KEY` | 없음 | Kakao JavaScript 키. 없으면 지도 대신 목록으로 대체 |
| `GOOGLE_TRANSLATE_API_KEY` | 없음 | 운영자 작성 콘텐츠 실시간 번역과 사전 생성에 사용 |
| `LIVEAVATAR_API_KEY` / `LIVEAVATAR_AVATAR_ID` | 없음 | 없으면 AI 안내가 아바타 없이 텍스트·음성으로 동작 |
| `LIVEAVATAR_VOICE_ID` / `LIVEAVATAR_CONTEXT_ID` | 없음 | 아바타 음성·컨텍스트 재정의 |
| `LIVEAVATAR_SANDBOX` | `true` | 테스트 중 크레딧 소모 방지 |
| `LIVEAVATAR_ALLOW_CLIENT_KEY` | `false` | 화면에서 임시 키 입력 허용 여부(기본은 개발 환경에서만) |

## 검증

```bash
npm test
npm run lint
npm run build
```

`tests/core.test.mjs`는 토큰 재발급·세션 복구, 축제 범위 확인, 티켓 상태 전이, 공지·콘텐츠 검수 규칙, 권한·사이드바 구성, 자동 번역과 운영시간 판정을, `tests/dictionaries.test.mjs`는 ko 원본과 생성된 사전의 해시·키 일치를 확인합니다. 두 테스트 모두 TypeScript 소스를 그대로 트랜스파일해 실행하므로 별도 빌드가 필요 없습니다.

## 배포

```bash
npx vercel
```

또는 GitHub 저장소를 Vercel에 연결하면 자동 배포됩니다. Vercel 프로젝트에는 최소한 다음을 설정합니다.

```bash
BACKEND_URL=https://backend-production-8532.up.railway.app
NEXT_PUBLIC_FESTIVAL_CODE=EST34-2026
```

지도·번역·아바타·원격 음성을 쓰려면 위 환경 변수 표의 나머지 키도 함께 넣습니다. 환경변수를 변경한 뒤에는 새로 배포해야 합니다.

## 데이터 & 상태 관리 규칙

- 축제·프로그램·시설·교통·공지·예약·혼잡도·쿠폰·포인트·상권 추천·민원·설문·ESG 실적은 모두 백엔드 API에서 옵니다.
- 백엔드 호출은 `next.config.ts`의 `/api/backend/*` 리라이트를 지납니다. 브라우저는 백엔드 원점을 직접 알지 못합니다.
- 플로깅·다회용기 대여 반납은 현장 시연용이라 브라우저 `localStorage`에만 쌓입니다(백엔드 API 미정). 기기를 바꾸면 기록이 따라가지 않습니다.
- 랜딩 페이지의 축제 정보는 백엔드에서 읽고, 조회에 실패하면 정적 소개 문구로 대체됩니다.
- 접근성 설정(`features/accessibility`)과 방문객 메뉴 노출 설정은 Zustand `persist`로 `localStorage`에 저장됩니다.
  첫 페인트 전에 `app/layout.tsx`의 인라인 스크립트가 같은 값을 읽어 `data-*`로 붙이므로 설정이 깜빡이지 않습니다.
- 다크 모드는 운영체제 설정(`prefers-color-scheme`)을 따라갑니다. 화면 안에 별도 토글은 없습니다. 언어·접근성 선호는 방문 세션에도 함께 반영됩니다.
- 키오스크 연령대 추정은 브라우저 안에서만 돌고 얼굴 이미지는 전송하지 않습니다. 백엔드에는 제안 노출·수동 전환 건수만 익명으로 남습니다.
- ESG 증빙은 파일 저장소가 확정되지 않아 외부 `fileId`와 해시를 연결하는 방식입니다.

## 알려진 한계

- 번역 프록시(`/api/i18n/translate`)의 요청 한도(IP당 분당 30회)는 인스턴스 로컬입니다. 인스턴스를 늘리면 Redis 등 공유 저장소로 옮겨야 합니다.
- Kakao 지도 키가 없으면 지도 화면이 좌표 목록으로 대체됩니다. 로컬 데모에서는 Kakao Developers에 개발 주소를 도메인으로 등록해야 SDK가 뜹니다.
- LiveAvatar 아바타는 크레딧을 소모합니다. `LIVEAVATAR_SANDBOX=true`로 두고 테스트하세요.
- 원격 음성(`NEXT_PUBLIC_VOICE_MODE=remote`)은 `../backend/voice`의 CosyVoice 런타임이 떠 있어야 합니다. 실패하면 브라우저 내장 음성으로 자동 대체됩니다.
- 번역 API 키가 없으면 방문객 화면은 사전에 이미 생성된 문구만 번역하고, 운영자가 새로 쓴 콘텐츠는 원문(한국어)으로 표시합니다.
- `.env.example`에 실제 Google Translate 키가 커밋되어 있습니다. 공개 저장소라면 키를 폐기·교체하고 예시 값으로 되돌리세요.
