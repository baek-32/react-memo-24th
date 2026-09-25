import searchEmptyIcon from "../assets/search-empty.svg";

function NoResultsState() {
  return (
    <section className="flex h-177.5 w-full flex-col items-center justify-center gap-5 rounded-3xl border-2 border-dashed border-blue-07">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-07">
        <img className="h-9.75 w-9.75" src={searchEmptyIcon} alt="" />
      </div>

      <div className="flex w-80 flex-col items-center gap-2 text-center">
        <p className="text-body-small font-regular text-blue-07">
          검색 결과가 없습니다
        </p>
        <p className="text-body-small font-regular text-gray-03">
          다른 검색어나 카테고리로 다시 시도해보세요
        </p>
      </div>
    </section>
  );
}

export default NoResultsState;
