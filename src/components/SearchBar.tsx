import type { ChangeEvent, FormEvent } from "react";

import searchIcon from "../assets/search.svg";
import type { FilterCategory } from "../constants/categoryStyles";
import IconButton from "./IconButton";
import TagFilter from "./TagFilter";

interface SearchBarProps {
  selectedCategory: FilterCategory;
  onSelectCategory: (category: FilterCategory) => void;
  searchText: string;
  onSearchTextChange: (searchText: string) => void;
}

function SearchBar({
  selectedCategory,
  onSelectCategory,
  searchText,
  onSearchTextChange,
}: SearchBarProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchTextChange(event.target.value);
  };

  return (
    <form
      className="flex h-20 min-w-0 flex-1 items-center gap-2.5 rounded-[28px] bg-white-00 p-4"
      onSubmit={handleSubmit}
    >
      <TagFilter
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />

      <input
        className="min-w-0 flex-1 bg-transparent text-field-medium font-regular text-black-00 outline-none placeholder:text-gray-02"
        type="search"
        placeholder="원하는 메모를 검색하세요"
        aria-label="메모 검색어"
        value={searchText}
        onChange={handleInputChange}
      />

      <IconButton
        icon={searchIcon}
        label="메모 검색"
        type="submit"
        className="h-12 w-12 shrink-0 hover:bg-blue-01 [&_img]:h-9.75 [&_img]:w-9.75"
      />
    </form>
  );
}

export default SearchBar;
