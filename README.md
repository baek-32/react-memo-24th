# React Memo

Vanilla JavaScript로 구현했던 메모 서비스를 React와 TypeScript 기반으로 리팩터링하고, 로그인·회원가입 API와 Zustand 전역 상태 관리를 적용한 프로젝트입니다.

## 배포 링크

https://react-memo-24th-three.vercel.app

## 주요 기능

### 인증

- 회원가입 API 연동
- 이메일 형식 및 비밀번호 입력값 검증
- 로그인 API 연동
- API 요청의 로딩·성공·실패 상태 처리
- Zustand를 이용한 인증 정보 전역 관리
- 새로고침 후 인증 상태 유지
- 인증 상태에 따른 페이지 접근 제어

### 메모

- 메모 목록 조회
- 메모 작성, 수정 및 삭제
- 메모 작성 완료 팝업
- 메모 작성 취소 및 뒤로가기 확인 팝업
- 삭제 확인 팝업
- 고정 메모와 일반 메모 분리
- 메모 고정 및 고정 해제
- 카테고리별 메모 필터링
- 제목과 내용을 기준으로 메모 검색
- 영문 검색 시 대소문자 구분 없이 검색
- 메모가 없을 때 빈 상태 화면 표시
- 검색 및 필터 결과가 없을 때 결과 없음 화면 표시
- 메모 상세 모달 조회
- 바깥 영역 클릭 및 ESC 키를 통한 메뉴와 모달 닫기

## 기술 스택

- React
- TypeScript
- Zustand
- React Router
- Vite
- Tailwind CSS
- ESLint
- Prettier

## 프로젝트 구조

```text
src
├── api
│   ├── auth.ts
│   └── client.ts
├── assets
├── components
│   ├── auth
│   │   ├── AuthButton.tsx
│   │   └── AuthTextField.tsx
│   ├── CommonModal.tsx
│   ├── EmptyState.tsx
│   ├── Header.tsx
│   ├── IconButton.tsx
│   ├── MemoCategorySelect.tsx
│   ├── MemoDetail.tsx
│   ├── MemoEditor.tsx
│   ├── MemoItem.tsx
│   ├── MemoList.tsx
│   ├── NoResultsState.tsx
│   ├── SearchBar.tsx
│   └── TagFilter.tsx
├── constants
│   └── categoryStyles.ts
├── pages
│   ├── LoginPage.tsx
│   └── SignupPage.tsx
├── routes
│   ├── AppRouter.tsx
│   ├── ProtectedRoute.tsx
│   └── PublicRoute.tsx
├── stores
│   ├── useAuthStore.ts
│   └── useMemoStore.ts
├── types
│   ├── api.ts
│   ├── auth.ts
│   └── memo.ts
├── App.tsx
├── index.css
└── main.tsx
```

## 실행 방법

의존성을 설치합니다.

```bash
npm install
```

프로젝트 최상위 경로에 `.env` 파일을 만들고 API 주소를 설정합니다.

```env
VITE_API_BASE_URL=https://3-37-186-61.nip.io
```

개발 서버를 실행합니다.

```bash
npm run dev
```

## 검사 명령어

```bash
npm run typecheck
npm run lint
npm run build
```

## 백엔드 없이 데모 체험하기

로그인 화면에서 **데모로 체험하기**를 누르면 `/demo`로 이동합니다. 상단의 **DEMO MODE** 표시와 **데모 종료** 버튼으로 현재 모드를 확인하고 로그인 화면으로 돌아갈 수 있습니다.

- Daily, Work, Others 예시 메모 6개가 처음 진입할 때 생성됩니다.
- 작성·수정·삭제·고정·검색·카테고리 필터·상세보기는 기존 메모 UI를 사용합니다.
- 데모 메모는 localStorage의 `react-memo-demo-memos-v1`에 저장됩니다. 새로고침과 데모 종료 후 재진입에도 유지됩니다. 모두 삭제하면 빈 상태가 유지됩니다.
- 데모 진입 상태는 sessionStorage의 `react-memo-demo-session-v1`에 저장됩니다. 새로고침에는 유지되고, 데모 종료 시 제거됩니다. 새 세션에서는 로그인 화면의 버튼으로 다시 진입합니다.
- 실제 인증의 `auth-storage`, 기존 메모의 `memo-store` 및 레거시 `memos` 키는 수정하지 않습니다. 데모 상태는 서버 토큰을 생성하거나 `/memos`의 인증 검사를 통과시키지 않습니다.
- 데모에는 API 서버나 `VITE_API_BASE_URL` 설정이 필요하지 않습니다. 일반 로그인·회원가입은 계속 기존 API를 사용합니다.
- 데모 데이터는 같은 브라우저와 같은 사이트 주소에서만 유지됩니다. 로컬, Preview, Production 주소 사이에서는 공유되지 않습니다.

현재 브랜치의 메모 CRUD는 원래부터 Zustand/localStorage 기반이며, 메모 CRUD API 함수는 존재하지 않습니다. 기존 인증 API와 일반 메모 저장 방식은 보존했습니다.

자동 검증은 기존 Node.js와 Vite만 사용합니다. 추가 라이브러리는 필요하지 않습니다.

```bash
npm run test:demo
```

구조 분석, 변경 파일, 검증 범위와 수동 확인 절차는 [데모 모드 작업 보고서](docs/demo-mode.md)를 참고하세요.

## Vercel Preview 배포

변경사항 검토 후 데모 브랜치만 배포하는 절차입니다. Production 브랜치에 merge하거나 Production으로 승격하지 않으면 기존 서비스와 별도로 Preview를 확인할 수 있습니다.

1. `git diff`와 `git status`로 `feat/demo-mode` 변경사항을 확인하고 커밋합니다.
2. `git push -u origin feat/demo-mode`로 해당 브랜치만 올립니다.
3. Git 저장소가 Vercel 프로젝트에 연결되어 있고 이 브랜치가 Production 브랜치가 아니라면 Preview 배포가 자동 생성됩니다. Vercel Deployments에서 Preview URL을 확인합니다.
4. Preview의 `/login`에서 **데모로 체험하기**를 누릅니다. 일반 인증도 테스트하려면 Preview 환경에 기존 `VITE_API_BASE_URL`을 설정해야 하며, 실제 백엔드 서버가 응답해야 합니다.

기존 `vercel.json`의 SPA rewrite가 `/demo` 새로고침도 처리하므로 배포 설정 변경은 필요하지 않습니다. 포트폴리오 링크를 공유하기 전에는 방문자가 해당 Preview URL에 접근 가능한지도 확인하세요.

참고: [Vercel 배포 환경](https://vercel.com/docs/deployments/environments), [환경 변수](https://vercel.com/docs/environment-variables).
