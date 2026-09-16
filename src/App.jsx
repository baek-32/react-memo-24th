import { useState } from "react";
import CommonModal from "./components/CommonModal.jsx";
import EmptyState from "./components/EmptyState.jsx";
import Header from "./components/Header.jsx";
import MemoDetail from "./components/MemoDetail.jsx";
import MemoEditor from "./components/MemoEditor.jsx";
import MemoList from "./components/MemoList.jsx";
import NoResultsState from "./components/NoResultsState.jsx";
import initialMemos from "./data/initialMemos.js";

function App() {
  const [memos, setMemos] = useState(initialMemos);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [selectedMemo, setSelectedMemo] = useState(null);
  const [isAddingMemo, setIsAddingMemo] = useState(false);
  const [editingMemo, setEditingMemo] = useState(null);
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

  const handleTogglePin = (memoId) => {
    setMemos((currentMemos) =>
      currentMemos.map((memo) =>
        memo.id === memoId ? { ...memo, isPinned: !memo.isPinned } : memo,
      ),
    );
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
  };

  const handleSearchTextChange = (value) => {
    setSearchText(value);
  };

  const handleSelectMemo = (memo) => {
    setSelectedMemo(memo);
  };

  const handleCloseMemo = () => {
    setSelectedMemo(null);
  };

  const handleAddMemo = (memoDraft) => {
    const nextId =
      memos.reduce(
        (largestId, memo) => Math.max(largestId, Number(memo.id)),
        0,
      ) + 1;

    setMemos((currentMemos) => [
      { ...memoDraft, id: nextId, isPinned: false },
      ...currentMemos,
    ]);

    setIsAddCompleteModalOpen(true);
  };

  const handleCloseAddCompleteModal = () => {
    setIsAddCompleteModalOpen(false);
    setIsAddingMemo(false);
  };

  const handleStartEdit = (memo) => {
    setSelectedMemo(null);
    setEditingMemo(memo);
  };

  const handleUpdateMemo = (memoDraft) => {
    setMemos((currentMemos) =>
      currentMemos.map((memo) =>
        memo.id === editingMemo.id ? { ...memo, ...memoDraft } : memo,
      ),
    );

    setEditingMemo(null);
  };

  const handleDeleteMemo = (memoId) => {
    setMemos((currentMemos) =>
      currentMemos.filter((memo) => memo.id !== memoId),
    );

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
            <EmptyState />
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