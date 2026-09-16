# React Memo

Vanilla JavaScript로 구현했던 메모 서비스를 React의 컴포넌트, Props, State 기반 구조로 리팩터링한 프로젝트입니다.

## 배포 링크

https://react-memo-24th-three.vercel.app

## 주요 기능

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
- JavaScript
- Vite
- Tailwind CSS
- ESLint
- Prettier

## 프로젝트 구조

```text
src
├── assets
├── components
│   ├── CommonModal.jsx
│   ├── EmptyState.jsx
│   ├── Header.jsx
│   ├── IconButton.jsx
│   ├── MemoCategorySelect.jsx
│   ├── MemoDetail.jsx
│   ├── MemoEditor.jsx
│   ├── MemoItem.jsx
│   ├── MemoList.jsx
│   ├── NoResultsState.jsx
│   ├── SearchBar.jsx
│   └── TagFilter.jsx
├── constants
│   └── categoryStyles.js
├── App.jsx
├── index.css
└── main.jsx
```

## 실행 방법

```bash
npm install
npm run dev
```