import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "../components/Sidebar";
import MemoryList from "../components/MemoryList";
import MemoryDetail from "../components/MemoryDetail";
import "../styles/MainPage.css";

const fetchMemories = async () => {
  const response = await fetch("http://localhost:3001/api/memory/get", {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch memories");
  return response.json();
};

const MainPage = () => {
  const [selectedMemoryId, setSelectedMemoryId] = useState(null);
  const [showForm, setShowForm] = useState(false); 
  const [searchParams, setSearchParams] = useSearchParams();
  const [ isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1700);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1700);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const {
    data: memories,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["memories"],
    queryFn: fetchMemories,
    staleTime: 5 * 60 * 1000,
  });

  const filteredMemories = searchParams.get("filter")
    ? memories?.filter((memory) =>
        memory.title.toLowerCase().includes(searchParams.get("filter").toLowerCase())
      )
    : memories;

    return (
      <div className="main-page">
        <Sidebar
          setFilteredMemories={(filter) => setSearchParams(filter ? { filter } : {})}
          setSelectedMemoryId={setSelectedMemoryId}
          setShowForm={setShowForm}
        />
  
        <div className={`memory-list-container ${isSmallScreen && selectedMemoryId ? "hidden" : ""}`}>
          {isLoading && <p>Loading memories...</p>}
          {error && <p>{error.message}</p>}
          {filteredMemories ? (
            <MemoryList
              memories={filteredMemories}
              onMemorySelect={(memory) => {
                if (!showForm) {
                  setSelectedMemoryId(memory._id);
                }
              }}
            />
          ) : (
            <p>No memories available.</p>
          )}
        </div>
  
        {selectedMemoryId && (
          <div className="memory-detail-container">
            <MemoryDetail 
              memoryId={selectedMemoryId}
              onClose={() => setSelectedMemoryId(null)}
            />
          </div>
        )}
      </div>
    );
  };

export default MainPage;
