import { create } from "zustand";

import { loadDemoMemos, saveDemoMemos } from "../demo/memoStorage";
import type { Memo } from "../types/memo";
import type { MemoStore } from "./useMemoStore";

interface DemoMemoStore extends MemoStore {
  isReady: boolean;
  error: string | null;
  initialize: () => void;
}

export const useDemoMemoStore = create<DemoMemoStore>((set) => {
  const commit = (change: (memos: Memo[]) => Memo[]) => {
    // Read the latest saved data and only update the UI after persistence succeeds.
    const memos = change(loadDemoMemos());
    saveDemoMemos(memos);
    set({ memos });
  };

  return {
    memos: [],
    isReady: false,
    error: null,
    initialize: () => {
      try {
        set({ memos: loadDemoMemos(), isReady: true, error: null });
      } catch (error) {
        set({
          isReady: false,
          error:
            error instanceof Error
              ? error.message
              : "데모 메모를 불러오지 못했습니다.",
        });
      }
    },
    addMemo: (draft) =>
      commit((memos) => [
        {
          ...draft,
          id: memos.reduce((max, memo) => Math.max(max, memo.id), 0) + 1,
          isPinned: false,
        },
        ...memos,
      ]),
    updateMemo: (id, draft) =>
      commit((memos) =>
        memos.map((memo) => (memo.id === id ? { ...memo, ...draft } : memo)),
      ),
    deleteMemo: (id) =>
      commit((memos) => memos.filter((memo) => memo.id !== id)),
    togglePin: (id) =>
      commit((memos) =>
        memos.map((memo) =>
          memo.id === id ? { ...memo, isPinned: !memo.isPinned } : memo,
        ),
      ),
  };
});
