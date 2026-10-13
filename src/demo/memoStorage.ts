import { isMemoCategory } from "../constants/categoryStyles";
import type { Memo } from "../types/memo";

export const DEMO_MEMOS_STORAGE_KEY = "react-memo-demo-memos-v1";

function createExampleMemos(): Memo[] {
  const today = new Date();
  const date = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;

  return [
    {
      id: 1,
      title: "React Memo에 오신 것을 환영해요",
      content:
        "나만의 메모를 작성하고 수정해 보세요.\n데모에서 만든 메모는 이 브라우저에 저장돼요.\n카드 오른쪽 핀을 누르면 중요한 메모를 위에 고정할 수 있어요.",
      category: "Daily",
      date,
      isPinned: true,
    },
    {
      id: 2,
      title: "Pre-SKALA 포트폴리오",
      content:
        "React와 TypeScript로 만든 메모 서비스입니다.\n검색, 카테고리 필터, 메모 상세보기와 CRUD를 직접 체험해 보세요.",
      category: "Work",
      date,
      isPinned: true,
    },
    {
      id: 3,
      title: "오늘의 작은 목표",
      content:
        "책 20쪽 읽기\n점심 먹고 산책하기\n하루를 마무리하며 배운 점 기록하기",
      category: "Daily",
      date,
      isPinned: false,
    },
    {
      id: 4,
      title: "프로젝트 체크리스트",
      content:
        "컴포넌트 재사용 확인\nTypeScript 타입 검사\n키보드로 모달 닫기 체험\n배포 화면 확인",
      category: "Work",
      date,
      isPinned: false,
    },
    {
      id: 5,
      title: "떠오른 아이디어",
      content:
        "생각이 떠오를 때 짧게 적어 두기.\n제목뿐 아니라 본문 속 단어로도 검색할 수 있어요.\n예를 들어 ‘산책’을 검색해 보세요.",
      category: "Others",
      date,
      isPinned: false,
    },
    {
      id: 6,
      title: "주말에 해 보고 싶은 것",
      content:
        "새로운 카페에서 독서하기\n좋아하는 음악으로 플레이리스트 만들기\n친구와 전시회 구경하기",
      category: "Others",
      date,
      isPinned: false,
    },
  ];
}

function isDemoMemo(value: unknown): value is Memo {
  if (typeof value !== "object" || value === null) return false;
  const memo = value as Record<string, unknown>;
  return (
    Number.isSafeInteger(memo.id) &&
    Number(memo.id) > 0 &&
    typeof memo.title === "string" &&
    typeof memo.content === "string" &&
    isMemoCategory(memo.category) &&
    typeof memo.date === "string" &&
    typeof memo.isPinned === "boolean"
  );
}

export function saveDemoMemos(memos: Memo[]): void {
  try {
    localStorage.setItem(
      DEMO_MEMOS_STORAGE_KEY,
      JSON.stringify({ version: 1, memos }),
    );
  } catch {
    throw new Error(
      "데모 메모를 저장하지 못했습니다. 브라우저 저장 공간과 저장소 사용 설정을 확인해주세요.",
    );
  }
}

export function loadDemoMemos(): Memo[] {
  let saved: string | null;
  try {
    saved = localStorage.getItem(DEMO_MEMOS_STORAGE_KEY);
  } catch {
    throw new Error(
      "데모 저장소에 접근할 수 없습니다. 브라우저의 저장소 사용 설정을 확인해주세요.",
    );
  }

  // An existing empty array means the visitor deleted every memo. Do not reseed it.
  if (saved === null) {
    const memos = createExampleMemos();
    saveDemoMemos(memos);
    return memos;
  }

  try {
    const payload = JSON.parse(saved);
    if (
      payload?.version !== 1 ||
      !Array.isArray(payload.memos) ||
      !payload.memos.every(isDemoMemo) ||
      new Set(payload.memos.map((memo: Memo) => memo.id)).size !==
        payload.memos.length
    ) {
      throw new Error("Invalid demo data");
    }
    return payload.memos;
  } catch {
    // Preserve damaged data instead of silently overwriting the visitor's work.
    throw new Error(
      "저장된 데모 메모를 읽지 못했습니다. 브라우저의 데모 저장 데이터를 확인해주세요.",
    );
  }
}
