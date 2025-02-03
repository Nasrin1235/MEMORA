import { useState, useEffect } from "react";

const SearchMemory = ({ memories, setFilteredMemories }) => {
  const [searchTerm, setSearchTerm] = useState("");

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

  return (
    <div className="search-memory">
      <input
        type="text"
        placeholder="Search memories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchMemory;
