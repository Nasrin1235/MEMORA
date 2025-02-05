import { useContext, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MemoryContext } from "../context/MemoryContext";
import "../styles/MemoryList.css";

const MemoryList = ({ onMemorySelect }) => {
  const memoryContext = useContext(MemoryContext);
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("filter") || ""; // ✅ Получаем значение поиска из URL
  const [filteredMemories, setFilteredMemories] = useState([]);

  if (!memoryContext) {
    return <p>Error: MemoryContext is not available</p>;
  }

  const { memories, error, isLoading } = memoryContext;

  useEffect(() => {
    if (memories) {
      const filtered = memories.filter((memory) =>
        memory.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMemories(filtered);
    }
  }, [memories, searchTerm]);

  if (isLoading) return <p>Loading memories...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!filteredMemories || filteredMemories.length === 0) return <p>No memories found.</p>;

  return (
    <div className="memory-list">
      <h2>📖 My Memories</h2>
      <ul>
        {filteredMemories.map((memory) => (
          <li
            key={memory._id}
            className="memory-item"
            onClick={() => {
              console.log("Clicked Memory ID:", memory._id);
              onMemorySelect(memory);
            }}
            style={{ cursor: "pointer" }}
          >
            {memory.imageUrl && (
              <img
                src={memory.imageUrl}
                alt={memory.title}
                className="memory-image"
              />
            )}
            <div className="memory-content">
              <h3>📌 {memory.title}</h3>
              <p className="memory-meta">
                📅{" "}
                {memory.visitedDate
                  ? new Date(memory.visitedDate).toLocaleDateString()
                  : "Not specified"}
              </p>
              <p>
                <strong>📍 Location:</strong>{" "}
                {memory.visitedLocation || "Unknown"}
              </p>
              <p className="memory-text">{memory.memorie?.slice(0, 150)}...</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemoryList;

