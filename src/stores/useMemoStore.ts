import { create } from "zustand";
import { persist } from "zustand/middleware";

import { isMemoCategory } from "../constants/categoryStyles";
import type { Memo, MemoDraft } from "../types/memo";

const LEGACY_MEMOS_STORAGE_KEY = "memos";
const MEMO_STORE_STORAGE_KEY = "memo-store";

interface MemoStore {
  memos: Memo[];
  addMemo: (memoDraft: MemoDraft) => void;
  updateMemo: (memoId: number, memoDraft: MemoDraft) => void;
  deleteMemo: (memoId: number) => void;
  togglePin: (memoId: number) => void;
}

const isMemo = (value: unknown): value is Memo => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const memo = value as Record<string, unknown>;

  return (
    typeof memo.id === "number" &&
    typeof memo.title === "string" &&
    typeof memo.content === "string" &&
    isMemoCategory(memo.category) &&
    typeof memo.date === "string" &&
    typeof memo.isPinned === "boolean"
  );
};

const loadLegacyMemos = (): Memo[] => {
  try {
    const savedMemos = localStorage.getItem(LEGACY_MEMOS_STORAGE_KEY);

    if (!savedMemos) {
      return [];
    }

    const parsedMemos: unknown = JSON.parse(savedMemos);

    return Array.isArray(parsedMemos) ? parsedMemos.filter(isMemo) : [];
  } catch {
    return [];
  }
};

export const useMemoStore = create<MemoStore>()(
  persist(
    (set) => ({
      memos: loadLegacyMemos(),

      addMemo: (memoDraft) =>
        set((state) => {
          const nextId =
            state.memos.reduce(
              (largestId, memo) => Math.max(largestId, memo.id),
              0,
            ) + 1;

          return {
            memos: [
              { ...memoDraft, id: nextId, isPinned: false },
              ...state.memos,
            ],
          };
        }),

      updateMemo: (memoId, memoDraft) =>
        set((state) => ({
          memos: state.memos.map((memo) =>
            memo.id === memoId ? { ...memo, ...memoDraft } : memo,
          ),
        })),

      deleteMemo: (memoId) =>
        set((state) => ({
          memos: state.memos.filter((memo) => memo.id !== memoId),
        })),

      togglePin: (memoId) =>
        set((state) => ({
          memos: state.memos.map((memo) =>
            memo.id === memoId
              ? { ...memo, isPinned: !memo.isPinned }
              : memo,
          ),
        })),
    }),
    {
      name: MEMO_STORE_STORAGE_KEY,
      partialize: (state) => ({ memos: state.memos }),
      merge: (persistedState, currentState) => {
        const storedState = persistedState as Partial<MemoStore>;
        const storedMemos = Array.isArray(storedState.memos)
          ? storedState.memos.filter(isMemo)
          : currentState.memos;

        return { ...currentState, memos: storedMemos };
      },
    },
  ),
);
