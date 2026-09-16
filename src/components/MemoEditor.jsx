import { useState } from "react";
import CATEGORY_STYLES, { CATEGORIES } from "../constants/categoryStyles.js";

const getToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
};

function MemoEditor({ initialMemo = null, onCancel, onSubmit }) {
  const [title, setTitle] = useState(initialMemo?.title ?? "");
  const [content, setContent] = useState(initialMemo?.content ?? "");
  const [category, setCategory] = useState(initialMemo?.category ?? "");

  const selectableCategories = CATEGORIES.filter((item) => item !== "All");
  const isComplete = title.trim() && content.trim() && category;
  const editorStyle = category
    ? CATEGORY_STYLES[category]
    : { card: "bg-blue-01", text: "text-blue-03" };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isComplete) {
      return;
    }

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      category,
      date: initialMemo?.date ?? getToday(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-blue-01 px-6 py-16">
      <form
        className="mx-auto flex w-full max-w-150 flex-col gap-8"
        onSubmit={handleSubmit}
      >
        <section
          className={`flex min-h-150 flex-col gap-8 rounded-3xl px-10 py-11 shadow-md ${editorStyle.card}`}
        >
          <input
            className={`w-full bg-transparent text-heading-large font-bold outline-none placeholder:text-current ${category ? "text-white-00" : "text-blue-03"}`}
            type="text"
            value={title}
            maxLength={40}
            placeholder="제목을 입력하세요..."
            aria-label="메모 제목"
            autoFocus
            onChange={(event) => setTitle(event.target.value)}
          />

          <div className="flex flex-wrap items-center gap-4">
            {selectableCategories.map((item) => {
              const style = CATEGORY_STYLES[item];
              const isSelected = category === item;

              return (
                <button
                  className={`flex h-9 items-center gap-2 rounded-[28px] px-3 text-action-medium font-extrabold transition-opacity ${
                    isSelected
                      ? "bg-blue-01 opacity-100"
                      : "bg-white-00/70 opacity-70"
                  } ${style.text}`}
                  type="button"
                  key={item}
                  aria-pressed={isSelected}
                  onClick={() => setCategory(item)}
                >
                  <span
                    className={`h-5 w-5 rounded-full ${style.accent}`}
                    aria-hidden="true"
                  />
                  {item}
                </button>
              );
            })}

            <span
              className={`h-13 border-l-3 ${category ? "border-white-00" : "border-blue-03"}`}
              aria-hidden="true"
            />
            <time
              className={`text-heading-small font-bold ${category ? "text-white-00" : "text-blue-03"}`}
            >
              {initialMemo?.date ?? getToday()}
            </time>
          </div>

          <textarea
            className={`min-h-95 w-full flex-1 resize-none bg-transparent text-body-large font-medium outline-none placeholder:text-current ${category ? "text-white-00" : "text-blue-03"}`}
            value={content}
            maxLength={1000}
            placeholder="본문을 입력하세요..."
            aria-label="메모 본문"
            onChange={(event) => setContent(event.target.value)}
          />
        </section>

        <div className="flex gap-4">
          <button
            className="h-14 flex-1 rounded-[18px] bg-gray-01 text-action-medium font-extrabold text-gray-03 hover:bg-gray-02"
            type="button"
            onClick={onCancel}
          >
            작성 취소
          </button>
          <button
            className="h-14 flex-1 rounded-[18px] bg-blue-05 text-action-medium font-extrabold text-white-00 disabled:cursor-not-allowed disabled:bg-blue-03"
            type="submit"
            disabled={!isComplete}
          >
            작성 완료
          </button>
        </div>
      </form>
    </div>
  );
}

export default MemoEditor;
