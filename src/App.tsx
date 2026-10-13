import { useState } from "react";
import { useStore, type StoreApi } from "zustand";

import CommonModal from "./components/CommonModal";
import EmptyState from "./components/EmptyState";
import Header from "./components/Header";
import MemoDetail from "./components/MemoDetail";
import MemoEditor from "./components/MemoEditor";
import MemoList from "./components/MemoList";
import NoResultsState from "./components/NoResultsState";
import { type FilterCategory } from "./constants/categoryStyles";
import { useMemoStore, type MemoStore } from "./stores/useMemoStore";
import type { Memo, MemoDraft } from "./types/memo";

interface AppProps {
  memoStore?: StoreApi<MemoStore>;
  onExitDemo?: () => void;
}

function App({ memoStore = useMemoStore, onExitDemo }: AppProps) {
  const memos = useStore(memoStore, (state) => state.memos);
  const addMemo = useStore(memoStore, (state) => state.addMemo);
  const updateMemo = useStore(memoStore, (state) => state.updateMemo);
  const deleteMemo = useStore(memoStore, (state) => state.deleteMemo);
  const togglePin = useStore(memoStore, (state) => state.togglePin);
  const [storageError, setStorageError] = useState<string | null>(null);
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

  const saveChange = (change: () => void) => {
    try {
      change();
    } catch (error) {
      setStorageError(
        error instanceof Error ? error.message : "메모를 저장하지 못했습니다.",
      );
    }
  };

  const handleTogglePin = (memoId: number) => {
    saveChange(() => togglePin(memoId));
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
    saveChange(() => {
      addMemo(memoDraft);
      setIsAddingMemo(false);
      setIsAddCompleteModalOpen(true);
    });
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

    saveChange(() => {
      updateMemo(editingMemo.id, memoDraft);
      setEditingMemo(null);
    });
  };

  const handleDeleteMemo = (memoId: number) => {
    saveChange(() => {
      deleteMemo(memoId);
      setSelectedMemo(null);
    });
  };

  return (
    <>
      <main className="relative min-h-screen bg-blue-01 px-6 py-18 font-sans">
        {onExitDemo && (
          <div className="absolute inset-x-6 top-6 mx-auto flex max-w-300 items-center justify-between gap-3 text-body-small">
            <span
              className="rounded-full bg-white-00 px-3 py-1 font-bold text-blue-05"
              title="데모 메모는 이 브라우저에만 저장됩니다"
            >
              DEMO MODE
            </span>
            <button
              type="button"
              onClick={onExitDemo}
              className="rounded-lg px-3 py-1 font-semibold text-blue-06 hover:bg-blue-02 focus-visible:outline-2 focus-visible:outline-blue-05"
            >
              데모 종료
            </button>
          </div>
        )}
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
      {storageError && (
        <CommonModal
          title="변경사항을 저장하지 못했습니다"
          message={storageError}
          onConfirm={() => setStorageError(null)}
        />
      )}
    </>
  );
}

export default App;
