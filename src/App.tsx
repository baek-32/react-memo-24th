import { useState } from "react";

import CommonModal from "./components/CommonModal";
import EmptyState from "./components/EmptyState";
import Header from "./components/Header";
import MemoDetail from "./components/MemoDetail";
import MemoEditor from "./components/MemoEditor";
import MemoList from "./components/MemoList";
import NoResultsState from "./components/NoResultsState";
import {
  type FilterCategory,
} from "./constants/categoryStyles";
import { useMemoStore } from "./stores/useMemoStore";
import type { Memo, MemoDraft } from "./types/memo";

function App() {
  const memos = useMemoStore((state) => state.memos);
  const addMemo = useMemoStore((state) => state.addMemo);
  const updateMemo = useMemoStore((state) => state.updateMemo);
  const deleteMemo = useMemoStore((state) => state.deleteMemo);
  const togglePin = useMemoStore((state) => state.togglePin);
  const [selectedCategory, setSelectedCategory] =
    useState<FilterCategory>("All");
  const [searchText, setSearchText] = useState("");
  const [selectedMemo, setSelectedMemo] = useState<Memo | null>(null);
  const [isAddingMemo, setIsAddingMemo] = useState(false);
  const [editingMemo, setEditingMemo] = useState<Memo | null>(null);
  const [isAddCompleteModalOpen, setIsAddCompleteModalOpen] = useState(false);

  const hasMemos = memos.length > 0;
  const keyword = searchText.trim().toLowerCase();

  const visibleMemos = memos.filter((memo) => {
    const matchesCategory =
      selectedCategory === "All" || memo.category === selectedCategory;

    const matchesSearch =
      memo.title.toLowerCase().includes(keyword) ||
      memo.content.toLowerCase().includes(keyword);

    return matchesCategory && matchesSearch;
  });

  const hasVisibleMemos = visibleMemos.length > 0;

  const handleTogglePin = (memoId: number) => {
    togglePin(memoId);
  };

  const handleSelectCategory = (category: FilterCategory) => {
    setSelectedCategory(category);
  };

  const handleSearchTextChange = (value: string) => {
    setSearchText(value);
  };

  const handleSelectMemo = (memo: Memo) => {
    setSelectedMemo(memo);
  };

  const handleCloseMemo = () => {
    setSelectedMemo(null);
  };

  const handleAddMemo = (memoDraft: MemoDraft) => {
    addMemo(memoDraft);
    setIsAddingMemo(false);
    setIsAddCompleteModalOpen(true);
  };

  const handleCloseAddCompleteModal = () => {
    setIsAddCompleteModalOpen(false);
  };

  const handleStartEdit = (memo: Memo) => {
    setSelectedMemo(null);
    setEditingMemo(memo);
  };

  const handleUpdateMemo = (memoDraft: MemoDraft) => {
    if (!editingMemo) {
      return;
    }

    updateMemo(editingMemo.id, memoDraft);
    setEditingMemo(null);
  };

  const handleDeleteMemo = (memoId: number) => {
    deleteMemo(memoId);
    setSelectedMemo(null);
  };

  return (
    <>
      <main className="min-h-screen bg-blue-01 px-6 py-18 font-sans">
        <div
          className={`mx-auto flex w-full max-w-300 flex-col ${
            hasMemos ? "gap-13" : "gap-19"
          }`}
        >
          <Header
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            searchText={searchText}
            onSearchTextChange={handleSearchTextChange}
            onAddMemo={() => setIsAddingMemo(true)}
          />

          {!hasMemos ? (
            <EmptyState onAddMemo={() => setIsAddingMemo(true)} />
          ) : hasVisibleMemos ? (
            <MemoList
              memos={visibleMemos}
              onTogglePin={handleTogglePin}
              onSelectMemo={handleSelectMemo}
            />
          ) : (
            <NoResultsState />
          )}
        </div>
      </main>

      {selectedMemo && (
        <MemoDetail
          memo={selectedMemo}
          onClose={handleCloseMemo}
          onEdit={handleStartEdit}
          onDelete={handleDeleteMemo}
        />
      )}

      {isAddingMemo && (
        <MemoEditor
          onCancel={() => setIsAddingMemo(false)}
          onSubmit={handleAddMemo}
        />
      )}

      {editingMemo && (
        <MemoEditor
          initialMemo={editingMemo}
          onCancel={() => setEditingMemo(null)}
          onSubmit={handleUpdateMemo}
        />
      )}

      {isAddCompleteModalOpen && (
        <CommonModal
          title="작성이 완료되었습니다"
          message="메인 화면에서 작성한 메모를 확인할 수 있어요."
          onConfirm={handleCloseAddCompleteModal}
        />
      )}
    </>
  );
}

export default App;
