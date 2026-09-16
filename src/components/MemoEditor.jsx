import { useState } from "react";
import backIcon from "../assets/back.svg";
import CommonModal from "./CommonModal.jsx";
import IconButton from "./IconButton.jsx";
import MemoCategorySelect from "./MemoCategorySelect.jsx";

const EDITOR_CARD_STYLES = {
  Daily: "bg-blue-04",
  Work: "bg-blue-06",
  Others: "bg-gray-02",
};

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
  const [exitModalType, setExitModalType] = useState(null);

  const isEditing = initialMemo !== null;
  const isComplete = Boolean(content.trim() && category);
  const isBackModal = exitModalType === "back";

  const editorCardStyle = category
    ? EDITOR_CARD_STYLES[category]
    : "bg-[#dde9ff]";

  const inputTextStyle = category ? "text-white-00" : "text-blue-03";

  const placeholderTextStyle =
    category === "Others"
      ? "placeholder:text-gray-01"
      : "placeholder:text-blue-03";

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

  const handleBackClick = () => {
    if (isEditing) {
      onCancel();
      return;
    }

    setExitModalType("back");
  };

  const handleCancelClick = () => {
    if (isEditing) {
      onCancel();
      return;
    }

    setExitModalType("cancel");
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-white-00 px-6 py-16">
        <IconButton
          icon={backIcon}
          label={isEditing ? "메모 수정 화면 닫기" : "메모 작성 화면 닫기"}
          className="absolute top-23 left-40 h-8 w-8 focus-visible:outline-blue-07 [&_img]:h-8 [&_img]:w-8"
          onClick={handleBackClick}
        />

        <form
          className="mx-auto flex w-full max-w-150 flex-col gap-8"
          onSubmit={handleSubmit}
        >
          <section
            className={`flex min-h-150 flex-col gap-8 rounded-3xl px-10 py-11 shadow-md ${editorCardStyle}`}
          >
            <input
              className={`w-full bg-transparent text-heading-large font-bold outline-none ${inputTextStyle} ${placeholderTextStyle}`}
              type="text"
              value={title}
              maxLength={40}
              placeholder="제목을 입력하세요..."
              aria-label="메모 제목"
              autoFocus
              onChange={(event) => setTitle(event.target.value)}
            />

            <div className="flex items-center gap-6">
              <MemoCategorySelect
                category={category}
                onSelectCategory={setCategory}
              />

              <span
                className="h-13 border-l-3 border-white-00"
                aria-hidden="true"
              />

              <time className="text-heading-small font-bold text-white-00">
                {initialMemo?.date ?? getToday()}
              </time>
            </div>

            <textarea
              className={`min-h-95 w-full flex-1 resize-none bg-transparent text-body-large font-medium outline-none ${inputTextStyle} ${placeholderTextStyle}`}
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
              onClick={handleCancelClick}
            >
              {isEditing ? "수정 취소" : "작성 취소"}
            </button>

            <button
              className="h-14 flex-1 rounded-[18px] bg-blue-05 text-action-medium font-extrabold text-white-00 disabled:cursor-not-allowed disabled:bg-blue-03"
              type="submit"
              disabled={!isComplete}
            >
              {isEditing ? "수정 완료" : "작성 완료"}
            </button>
          </div>
        </form>
      </div>

      {exitModalType && (
        <CommonModal
          title={
            isBackModal
              ? "이전으로 돌아가시겠습니까?"
              : "메모 작성을 그만 두시겠습니까?"
          }
          message="작성중이던 메모는 저장되지 않습니다."
          confirmText={isBackModal ? "돌아가기" : "작성 취소하기"}
          cancelText="계속 작성하기"
          onConfirm={onCancel}
          onCancel={() => setExitModalType(null)}
        />
      )}
    </>
  );
}

export default MemoEditor;