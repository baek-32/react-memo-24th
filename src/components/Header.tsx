import addIcon from "../assets/add.svg";
import profileIcon from "../assets/profile.svg";
import type { FilterCategory } from "../constants/categoryStyles";
import IconButton from "./IconButton";
import SearchBar from "./SearchBar";

interface HeaderProps {
  selectedCategory: FilterCategory;
  onSelectCategory: (category: FilterCategory) => void;
  searchText: string;
  onSearchTextChange: (searchText: string) => void;
  onAddMemo: () => void;
}

function Header({
  selectedCategory,
  onSelectCategory,
  searchText,
  onSearchTextChange,
  onAddMemo,
}: HeaderProps) {
  return (
    <header className="flex w-full items-center gap-4">
      <SearchBar
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
        searchText={searchText}
        onSearchTextChange={onSearchTextChange}
      />

      <div className="flex shrink-0 gap-4">
        <IconButton
          icon={addIcon}
          onClick={onAddMemo}
          label="메모 추가"
          className="h-20 w-20 bg-white-00 hover:bg-blue-01 [&_img]:h-6 [&_img]:w-6"
        />

        <IconButton
          icon={profileIcon}
          label="프로필"
          className="h-20 w-20 bg-white-00 hover:bg-blue-01 [&_img]:h-8 [&_img]:w-8"
        />
      </div>
    </header>
  );
}

export default Header;
