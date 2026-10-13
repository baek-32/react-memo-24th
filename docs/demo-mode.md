# 데모 모드 작업 보고서

## 기존 프로젝트 분석

- 시작 브랜치: `baek-32`. 작업 트리에 기존 변경사항이 없음을 확인하고 `feat/demo-mode`를 생성했다. 로컬 기본 브랜치 이름은 `master`이며 `main`은 없었다. 기존 브랜치의 커밋은 변경하지 않았다.
- 로그인: `src/api/auth.ts`의 `login` → 공용 `request` → `POST /api/auth/login`. 성공 시 `useAuthStore.setAuth`로 토큰과 이메일을 저장한다.
- 회원가입: 같은 API 모듈의 `signup` → `POST /api/auth/signup`. 기존 이메일·비밀번호 검증 및 서버 오류 처리를 유지한다.
- API 클라이언트: `VITE_API_BASE_URL`, JSON 요청/응답, 선택적 Bearer 토큰, `ApiError` 처리를 제공한다.
- 메모: 현재 체크아웃된 코드에는 메모 CRUD API가 없다. `useMemoStore`의 동기 CRUD와 고정 변경이 localStorage `memo-store`에 저장된다. 레거시 `memos`도 읽는다. 따라서 메모 API 구현을 새로 추측하여 추가하지 않았다.
- 상태: 인증·메모는 Zustand, 검색·필터·선택한 메모·편집 및 모달은 `App`의 React 상태다.
- 라우팅: `/login`, `/signup`은 `PublicRoute`, `/memos`는 `ProtectedRoute`를 사용한다. 기존 가드는 실제 `accessToken`만 검사하며 그대로 보존했다.
- 기존 저장소: localStorage의 `auth-storage`, `memo-store`, `memos`. 기존 코드에 sessionStorage 사용은 없었다.

## 변경 파일

| 파일                                | 변경 내용                                                         |
| ----------------------------------- | ----------------------------------------------------------------- |
| `src/demo/memoStorage.ts`           | 데모 저장 키, 예시 6개, 데이터 검증, 읽기·쓰기 오류 처리          |
| `src/stores/useDemoMemoStore.ts`    | 기존 MemoStore 계약을 따르는 데모 CRUD·고정 상태                  |
| `src/stores/useDemoSessionStore.ts` | 실제 인증과 독립적인 탭의 데모 진입 상태                          |
| `src/pages/DemoPage.tsx`            | 데모 경로 접근 검사, 데이터 로딩, 종료 처리                       |
| `src/pages/LoginPage.tsx`           | 일반 submit과 분리된 데모 버튼 및 시작 오류 표시                  |
| `src/routes/AppRouter.tsx`          | `/demo` 경로 추가                                                 |
| `src/App.tsx`                       | 사용할 메모 store를 주입받고 DEMO MODE·종료 버튼·저장 오류 표시   |
| `src/stores/useMemoStore.ts`        | 기존 store 인터페이스를 재사용할 수 있도록 export                 |
| `tests/demo-mode.test.mjs`          | Node 테스트 러너와 Vite를 통한 저장소·렌더링·라우팅·API 회귀 검사 |
| `package.json`                      | `test:demo` 명령 추가, 의존성 변경 없음                           |
| `README.md`                         | 사용법, 저장 범위, Preview 배포 방법                              |
| `docs/demo-mode.md`                 | 구조 분석과 검증 보고서                                           |

## 분리 방식과 재사용

일반 `/memos`는 기존 `useMemoStore`를 그대로 사용한다. 데모 `/demo`는 같은 `App`에 `useDemoMemoStore`를 주입한다. `Memo`, `MemoDraft`, 카테고리 정의, 목록·상세·작성·수정·삭제 확인 모달, 검색·필터·고정 정렬·빈 화면을 재사용한다.

데모 메모의 localStorage 키는 `react-memo-demo-memos-v1`, 데모 세션의 sessionStorage 키는 `react-memo-demo-session-v1`이다. 실제 토큰을 만들거나 실제 인증 저장소를 변경하지 않는다. 데모 세션만으로 `/memos`에 접근할 수 없다. 데모 모듈에는 API 호출이 없다.

예시는 저장 키가 없을 때만 생성한다. 기존 빈 목록은 보존한다. 손상된 저장 데이터는 자동 덮어쓰기하지 않고 오류를 표시한다. 쓰기에 실패하면 화면의 메모 상태와 편집 내용을 보존하고 성공 모달을 띄우지 않는다. 데모 종료는 세션만 종료하며 저장된 메모는 유지한다.

## 검증 결과

- `npm run typecheck`: 통과.
- `npm run lint`: 통과.
- `npm run build`: 통과.
- `npm run test:demo`: 예시 생성, CRUD·고정·해제 및 재로드, 전부 삭제한 빈 상태, 종료·재진입, 세션 복원, 실제 데이터와의 분리, 저장 오류와 손상 데이터 보존, 목록·상세 서버 렌더링, 데모의 일반 보호 경로 접근 차단, 일반 인증의 API 호출 계약을 자동 검증한다.
- 데모 자동 테스트의 `fetch`는 호출되면 실패하도록 설정하며, 주요 시나리오에서 호출 수가 0임을 검증한다. 일반 인증 테스트에만 모의 성공 응답을 사용한다. 이 결과는 실제 서버의 정상 응답을 의미하지 않는다.
- `src/api/*`, 인증 타입·스토어, 회원가입 화면, 기존 PublicRoute/ProtectedRoute는 변경하지 않았음을 diff로 확인한다.

제어 가능한 브라우저가 연결되어 있지 않아 실제 클릭, 화면 모양, 브라우저 Network 패널, 검색·필터 입력 및 모달 키보드 동작은 직접 검증하지 못했다. 자동 렌더링은 실제 브라우저 E2E 검증을 대신하지 않는다. 실제 API 통신 성공 및 Vercel Preview 배포도 검증하지 않았다.

## 브라우저 수동 확인 절차

1. `npm run dev` 실행 후 `/login`을 연다. Network 패널에서 Fetch/XHR를 확인하며 빈 입력 상태에서도 데모 버튼으로 진입 가능한지 확인한다.
2. `/demo`에 예시 6개, 3개 카테고리, 고정/일반 메모, DEMO MODE 및 종료 버튼이 표시되는지 확인한다. `/api/` 요청은 없어야 한다.
3. 새 메모를 작성하고 완료 팝업을 닫은 뒤 상세보기에서 내용을 수정한다. 고정/해제를 각각 수행한다.
4. 제목과 본문의 단어, 대소문자가 다른 영문으로 검색한다. Daily/Work/Others/All 필터와 검색을 조합하고 결과 없음 화면도 확인한다.
5. 상세 모달의 ESC·바깥 영역 닫기, 작성 취소, 삭제 취소 및 삭제 확정을 확인한다.
6. 새로고침 후 작성·수정·삭제·고정 결과가 유지되는지 확인한다. 모든 메모를 지운 경우 새로고침해도 빈 상태여야 한다.
7. 데모 종료 후 로그인 화면으로 돌아오는지, 뒤로가기나 `/demo` 직접 입력으로 세션 없이 진입할 수 없는지 확인한다. 다시 데모 버튼을 누르면 저장된 데이터가 복원되어야 한다.
8. 데모 중 실제 토큰 없이 `/memos`를 열면 로그인 화면으로 돌아와야 한다. Application 패널에서 실제 인증·메모 키가 바뀌지 않았는지 확인한다.
9. 일반 로그인·회원가입은 기존 API 주소로 요청해야 한다. 백엔드가 복구되지 않았다면 성공을 기대하지 않는다.

Preview 배포 절차는 README를 참고한다. 데모 브랜치의 로컬 커밋을 보존하면 `git switch baek-32`로 원래 코드, `git switch feat/demo-mode`로 데모 코드로 전환할 수 있다. 로컬 브랜치 전환은 Vercel 배포를 바꾸지 않는다.
