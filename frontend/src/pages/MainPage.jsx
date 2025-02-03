import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import MemoryList from "../components/MemoryList";
import MemoryDetail from "../components/MemoryDetail";
import "../styles/MainPage.css";

const MainPage = () => {
  const [memories, setMemories] = useState([]); // All memories
  const [filteredMemories, setFilteredMemories] = useState(null);
  const [selectedMemory, setSelectedMemory] = useState(null);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/memory/get", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();

        if (response.ok) {
          setMemories(data);
        }
      } catch (error) {
        console.error("Error loading memories:", error);
      }
    };

    fetchMemories();
  }, []);

  return (
    <div className="main-page">
      {/* Passing memories to Sidebar */}
      <Sidebar memories={memories} setFilteredMemories={setFilteredMemories} />
     <div className="memory-list-container">
          <MemoryList memories={memories} filteredMemories={filteredMemories} onMemorySelect={setSelectedMemory} />
        </div>
        <div className="memory-detail-container">
          {selectedMemory ? <MemoryDetail memory={selectedMemory} /> : <p>Choose a memory to view.</p>}
        </div>
      
    </div>
  );
};

export default MainPage;



