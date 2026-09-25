import type { MouseEvent } from "react";

import pinActiveIcon from "../assets/pin-active.svg";
import pinIcon from "../assets/pin.svg";
import CATEGORY_STYLES from "../constants/categoryStyles";
import type { Memo } from "../types/memo";
import IconButton from "./IconButton";

interface MemoItemProps {
  memo: Memo;
  onTogglePin: (memoId: number) => void;
  onSelectMemo: (memo: Memo) => void;
}

function MemoItem({ memo, onTogglePin, onSelectMemo }: MemoItemProps) {
  const { title, content, category, date, isPinned } = memo;
  const categoryStyle = CATEGORY_STYLES[category];

  const handleCardClick = () => {
    onSelectMemo(memo);
  };

  const handlePinClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onTogglePin(memo.id);
  };

  return (
    <article
      className={`relative flex h-71.25 w-71.25 flex-col gap-2.5 rounded-[20px] p-5 py-8 ${categoryStyle.card}`}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="min-w-0 flex-1 truncate text-heading-small font-bold text-white-00">
          {title}
        </h2>

        <IconButton
          icon={isPinned ? pinActiveIcon : pinIcon}
          label={isPinned ? "메모 고정 해제" : "메모 고정"}
          className="relative z-10 h-7 w-7 shrink-0 focus-visible:outline-white-00 [&_img]:h-5.5 [&_img]:w-5.75"
          onClick={handlePinClick}
        />
      </div>

      <p className="line-clamp-7 text-body-small font-regular text-white-00">
        {content}
      </p>

      <div className="mt-auto flex items-center justify-between">
        <span className="text-body-small font-semibold text-blue-01">
          {category}
        </span>
        <span className="text-body-small font-semibold text-blue-01">
          {date}
        </span>
      </div>

      <button
        type="button"
        className="absolute inset-0 z-0 cursor-pointer rounded-[20px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-05"
        aria-label={`${title} 상세 보기`}
        onClick={handleCardClick}
      />
    </article>
  );
}

export default MemoItem;
