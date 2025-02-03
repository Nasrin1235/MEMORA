import { useState, useEffect } from "react";

const SearchMemory = ({ memories, setFilteredMemories }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isInputVisible, setIsInputVisible] = useState(false); 

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredMemories(null);
      return;
    }

    if (!memories) return;

    const filtered = memories.filter((memory) =>
      memory.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredMemories(filtered);
  }, [searchTerm, memories, setFilteredMemories]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

    return (
    <div className="search-memory">
      {!isInputVisible ? (
        <span className="search-icon" onClick={() => setIsInputVisible(true)} style={{ cursor: "pointer" }}>
        🔍
      </span>
      ) : (
        <input
          type="text"
          className="search-input"
          placeholder="Search memories..."
          value={searchTerm}
          onChange={handleSearchChange}
          onBlur={() => {
            if (!searchTerm.trim()) setIsInputVisible(false);
          }}
          autoFocus
        />
      )}
    </div>
  );
};

export default SearchMemory;