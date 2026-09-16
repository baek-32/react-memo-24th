import addMemoIcon from "../assets/add-memo.svg";
import IconButton from "./IconButton.jsx";

function EmptyState({ onAddMemo }) {
  return (
    <section className="flex h-177.5 w-full flex-col items-center justify-center gap-2.5 rounded-3xl border-2 border-dashed border-blue-02">
      <IconButton
        icon={addMemoIcon}
        label="메모 추가"
        className="h-30 w-30 bg-blue-02 hover:bg-blue-03 [&_img]:h-9.75 [&_img]:w-9.75"
        onClick={onAddMemo}
      />

      <p className="text-heading-medium font-semibold text-blue-02">
        새로운 메모를 작성해보세요!
      </p>
    </section>
  );
}

export default EmptyState;