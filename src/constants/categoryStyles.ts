import type { MemoCategory } from "../types/memo";

export const CATEGORIES = ["All", "Daily", "Work", "Others"] as const;

export type FilterCategory = (typeof CATEGORIES)[number];

interface CategoryStyle {
  card?: string;
  accent: string;
  text: string;
}

const CATEGORY_STYLES: Record<FilterCategory, CategoryStyle> = {
  All: {
    accent:
      "bg-[conic-gradient(var(--color-blue-04)_0deg_120deg,var(--color-blue-06)_120deg_240deg,var(--color-gray-02)_240deg_360deg)]",
    text: "text-blue-07",
  },
  Daily: {
    card: "bg-blue-03",
    accent: "bg-blue-04",
    text: "text-blue-04",
  },
  Work: {
    card: "bg-blue-06",
    accent: "bg-blue-06",
    text: "text-blue-06",
  },
  Others: {
    card: "bg-gray-02",
    accent: "bg-gray-02",
    text: "text-gray-02",
  },
};

export function isMemoCategory(category: unknown): category is MemoCategory {
  return category === "Daily" || category === "Work" || category === "Others";
}

export default CATEGORY_STYLES;
