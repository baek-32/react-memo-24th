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