import { useState, useEffect,useContext } from "react";
import { MemoryContext } from "../context/MemoryContext";

const SearchMemory = ({ setFilteredMemories }) => {
  const { memories } = useContext(MemoryContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [isInputVisible, setIsInputVisible] = useState(false);

  useEffect(() => {
    if (!searchTerm.trim()) {
      if (typeof setFilteredMemories === "function") { 
        setFilteredMemories(null);
      }
      return;
    }

    const filtered = memories?.filter((memory) =>
      memory.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (typeof setFilteredMemories === "function") { 
      setFilteredMemories(filtered);
    }
  }, [searchTerm, setFilteredMemories]);

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
