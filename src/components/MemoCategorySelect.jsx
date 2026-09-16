import { useEffect, useRef, useState } from "react";
import tagArrowIcon from "../assets/tag-arrow.svg";
import CATEGORY_STYLES, { CATEGORIES } from "../constants/categoryStyles.js";

function MemoCategorySelect({ category, onSelectCategory }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const selectableCategories = CATEGORIES.filter((item) => item !== "All");
  const selectedStyle = category ? CATEGORY_STYLES[category] : null;

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleOutsideClick = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
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

  const handleSelect = (selectedCategory) => {
    onSelectCategory(selectedCategory);
    setIsOpen(false);
  };

  return (
    <div ref={selectRef} className="relative shrink-0">
      <button
        className={`flex h-9 w-29 items-center justify-between rounded-full px-4 font-extrabold ${
          category
            ? `bg-blue-01 text-action-medium ${selectedStyle.text}`
            : "bg-blue-02 text-action-small text-blue-07"
        }`}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((currentIsOpen) => !currentIsOpen)}
      >
        {category ? (
          <>
            <span
              className={`h-5 w-5 shrink-0 rounded-full ${selectedStyle.accent}`}
              aria-hidden="true"
            />
            <span>{category}</span>
          </>
        ) : (
          <>
            <span>태그 선택</span>
            <img
              className={`h-3.25 w-4 ${
                isOpen ? "rotate-90" : "rotate-0"
              }`}
              src={tagArrowIcon}
              alt=""
            />
          </>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute top-12 left-0 z-20 flex h-41 w-35 flex-col justify-between rounded-[28px] bg-blue-01 px-6 py-4 shadow-md"
          role="listbox"
          aria-label="메모 카테고리 선택"
        >
          {selectableCategories.map((item) => {
            const style = CATEGORY_STYLES[item];

            return (
              <button
                className={`flex items-center gap-3 bg-transparent text-action-medium font-extrabold ${style.text}`}
                type="button"
                role="option"
                aria-selected={category === item}
                key={item}
                onClick={() => handleSelect(item)}
              >
                <span
                  className={`h-5 w-5 shrink-0 rounded-full ${style.accent}`}
                  aria-hidden="true"
                />
                <span>{item}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MemoCategorySelect;