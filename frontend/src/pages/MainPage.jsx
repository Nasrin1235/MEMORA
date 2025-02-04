import { useContext, useState } from "react";
import { MemoryContext } from "../context/MemoryContext";
import Sidebar from "../components/Sidebar";
import MemoryList from "../components/MemoryList";
import MemoryDetail from "../components/MemoryDetail";
import "../styles/MainPage.css";

const MainPage = () => {
  const { memories, loading, error } = useContext(MemoryContext); // ✅ Используем глобальное состояние
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [filteredMemories, setFilteredMemories] = useState(null); // ✅ Добавляем состояние

  return (
    <div className="main-page">
      <Sidebar setFilteredMemories={setFilteredMemories} />
      <div className="memory-list-container">
        {loading && <p>Loading memories...</p>}
        {error && <p>{error}</p>}
        {memories ? (
          <MemoryList memories={filteredMemories ?? memories} onMemorySelect={setSelectedMemory} />
        ) : (
          <p>No memories available.</p>
        )}
      </div>
      <div className="memory-detail-container">
        {selectedMemory ? (
          <MemoryDetail memory={selectedMemory} />
        ) : (
          <p>Select a memory to view.</p>
        )}
      </div>
    </div>
  );
};

export default MainPage;

