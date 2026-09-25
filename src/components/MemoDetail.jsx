import { useEffect, useState } from "react";
import closeIcon from "../assets/close.svg";
import deleteIcon from "../assets/delete.svg";
import editIcon from "../assets/edit.svg";
import CATEGORY_STYLES from "../constants/categoryStyles.js";
import CommonModal from "./CommonModal.jsx";
import IconButton from "./IconButton.jsx";

function MemoDetail({ memo, onClose, onEdit, onDelete }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const categoryStyle =
    CATEGORY_STYLES[memo.category] ?? CATEGORY_STYLES.Others;

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key !== "Escape") {
        return;
      }

      if (isDeleteModalOpen) {
        setIsDeleteModalOpen(false);
        return;
      }

      onClose();
    };

    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isDeleteModalOpen, onClose]);

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleDeleteMemo = () => {
    onDelete(memo.id);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-blue-07/50 p-4"
        onClick={handleOverlayClick}
      >
        <article
          className={`flex h-139 w-full max-w-139 flex-col justify-between overflow-y-auto rounded-3xl px-11 py-10 shadow-md ${categoryStyle.card}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="memo-detail-title"
        >
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              <header className="flex h-10 items-center justify-between gap-4">
                <h2
                  id="memo-detail-title"
                  className="min-w-0 flex-1 truncate text-heading-large font-bold text-white-00"
                >
                  {memo.title}
                </h2>

                <IconButton
                  icon={closeIcon}
                  label="상세 보기 닫기"
                  className="h-8 w-8 shrink-0 focus-visible:outline-white-00 [&_img]:h-8 [&_img]:w-8"
                  onClick={onClose}
                />
              </header>

              <div className="flex h-13 items-center gap-6">
                <div className="flex h-9 w-29 items-center justify-between rounded-[28px] bg-blue-01 py-1 pr-6 pl-3">
                  <span
                    className={`h-5 w-5 shrink-0 rounded-full ${categoryStyle.accent}`}
                    aria-hidden="true"
                  />

                  <span
                    className={`text-action-medium font-extrabold ${categoryStyle.text}`}
                  >
                    {memo.category}
                  </span>
                </div>

                <span
                  className="h-13 border-l-3 border-white-00"
                  aria-hidden="true"
                />

                <time className="text-heading-small font-bold text-white-00">
                  {memo.date}
                </time>
              </div>
            </div>

            <p className="whitespace-pre-wrap text-body-large font-medium text-white-00">
              {memo.content}
            </p>
          </div>

          <footer className="flex justify-end gap-3">
            <IconButton
              icon={editIcon}
              onClick={() => onEdit(memo)}
              label="메모 수정"
              className="h-8 w-8 focus-visible:outline-white-00 [&_img]:h-6 [&_img]:w-6"
            />

            <IconButton
              icon={deleteIcon}
              label="메모 삭제"
              className="h-8 w-8 focus-visible:outline-white-00 [&_img]:h-6 [&_img]:w-6"
              onClick={() => setIsDeleteModalOpen(true)}
            />
          </footer>
        </article>
      </div>

      {isDeleteModalOpen && (
        <CommonModal
          title="메모를 삭제 하시겠습니까?"
          message="삭제한 메모는 복구할 수 없습니다."
          confirmText="삭제"
          cancelText="취소"
          onConfirm={handleDeleteMemo}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </>
  );
}

export default MemoDetail;