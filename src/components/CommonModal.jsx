function CommonModal({
  title,
  message,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
}) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-blue-07/50 px-6">
      <section
        className="flex h-60 w-full max-w-120 flex-col items-center justify-between rounded-3xl bg-white-00 px-8 pt-12 pb-6 shadow-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="common-modal-title"
        aria-describedby="common-modal-message"
      >
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
    </div>
  );
}

export default CommonModal;