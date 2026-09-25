import type { Memo } from "../types/memo";
import MemoItem from "./MemoItem";

interface MemoListProps {
  memos: Memo[];
  onTogglePin: (memoId: number) => void;
  onSelectMemo: (memo: Memo) => void;
}

function MemoList({ memos, onTogglePin, onSelectMemo }: MemoListProps) {
  const pinnedMemos = memos.filter((memo) => memo.isPinned);
  const unpinnedMemos = memos.filter((memo) => !memo.isPinned);

  return (
    <section className="flex w-full flex-col gap-5">
      {pinnedMemos.length > 0 && (
        <div className="grid grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pinnedMemos.map((memo) => (
            <MemoItem
              key={memo.id}
              memo={memo}
              onTogglePin={onTogglePin}
              onSelectMemo={onSelectMemo}
            />
          ))}
        </div>
      )}

      {unpinnedMemos.length > 0 && (
        <div className="grid grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {unpinnedMemos.map((memo) => (
            <MemoItem
              key={memo.id}
              memo={memo}
              onTogglePin={onTogglePin}
              onSelectMemo={onSelectMemo}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default MemoList;
