export type MemoCategory = "Daily" | "Work" | "Others";

export interface Memo {
  id: number;
  title: string;
  content: string;
  category: MemoCategory;
  date: string;
  isPinned: boolean;
}

export type MemoDraft = Omit<Memo, "id" | "isPinned">;
