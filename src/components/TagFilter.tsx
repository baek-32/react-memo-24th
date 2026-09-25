import { useEffect, useRef, useState } from "react";

import tagArrowIcon from "../assets/tag-arrow.svg";
import CATEGORY_STYLES, {
  CATEGORIES,
  type FilterCategory,
} from "../constants/categoryStyles";

interface TagFilterProps {
  selectedCategory: FilterCategory;
  onSelectCategory: (category: FilterCategory) => void;
}

function TagFilter({ selectedCategory, onSelectCategory }: TagFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const selectedStyle = CATEGORY_STYLES[selectedCategory];

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        event.target instanceof Node &&
        filterRef.current &&
        !filterRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen]);

  const handleSelect = (category: FilterCategory) => {
    onSelectCategory(category);
    setIsOpen(false);
  };

  return (
    <div ref={filterRef} className="relative shrink-0">
      <button
        type="button"
        className={`flex h-9 w-29 items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-blue-01 px-4 text-action-small font-extrabold hover:bg-blue-02 focus-visible:outline-2 focus-visible:outline-blue-05 ${selectedStyle.text}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((currentIsOpen) => !currentIsOpen)}
      >
        <span
          className={`h-3 w-3 shrink-0 rounded-full ${selectedStyle.accent}`}
          aria-hidden="true"
        />
        <span>{selectedCategory}</span>
        <img
          className={`h-3.25 w-4 ${isOpen ? "rotate-90" : "rotate-0"}`}
          src={tagArrowIcon}
          alt=""
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-17 left-1 z-10 flex h-41 w-35 flex-col justify-between rounded-[28px] bg-white-00 px-6 py-4 shadow-md"
          role="listbox"
          aria-label="메모 카테고리"
        >
          {CATEGORIES.map((category) => {
            const categoryStyle = CATEGORY_STYLES[category];

            return (
              <button
                key={category}
                type="button"
                role="option"
                aria-selected={selectedCategory === category}
                className={`flex items-center gap-3 bg-transparent text-action-medium font-extrabold ${categoryStyle.text}`}
                onClick={() => handleSelect(category)}
              >
                <span
                  className={`h-5 w-5 shrink-0 rounded-full ${categoryStyle.accent}`}
                  aria-hidden="true"
                />
                <span>{category}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TagFilter;
