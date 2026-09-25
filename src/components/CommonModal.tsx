import { useEffect, useRef } from "react";
import type { MouseEvent, SyntheticEvent } from "react";

interface CommonModalProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

function CommonModal({
  title,
  message,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
}: CommonModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return undefined;
    }

    dialog.showModal();

    return () => {
      if (dialog.open) {
        dialog.close();
      }
    };
  }, []);

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();

    if (onCancel) {
      onCancel();
    }
  };

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget && onCancel) {
      onCancel();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="m-auto w-[calc(100%-3rem)] max-w-120 bg-transparent p-0 backdrop:bg-blue-07/50"
      aria-labelledby="common-modal-title"
      aria-describedby="common-modal-message"
      onCancel={handleCancel}
      onClick={handleBackdropClick}
    >
      <section className="flex h-60 w-full flex-col items-center justify-between rounded-3xl bg-white-00 px-8 pt-12 pb-6 shadow-md">
        <div className="flex flex-col items-center gap-5 text-center">
          <h2
            id="common-modal-title"
            className="text-heading-medium font-semibold text-blue-07"
          >
            {title}
          </h2>

          <p
            id="common-modal-message"
            className="text-body-small font-normal text-gray-04"
          >
            {message}
          </p>
        </div>

        <div className="flex h-14 w-full gap-3">
          {onCancel && (
            <button
              type="button"
              className="h-14 flex-1 rounded-xl bg-gray-01 px-6 text-action-medium font-extrabold text-gray-03"
              onClick={onCancel}
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            className="h-14 flex-1 rounded-xl bg-blue-05 px-6 text-action-medium font-extrabold text-white-00"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </section>
    </dialog>
  );
}

export default CommonModal;
