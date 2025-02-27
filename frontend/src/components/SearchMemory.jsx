import { useSearchParams } from "react-router-dom";

const SearchMemory = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("filter") || "";

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchParams(value ? { filter: value } : {});
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className="search-memory">
      <input
        type="text"
        name="text"
        className="search-input"
        placeholder="Search memories..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default SearchMemory;
