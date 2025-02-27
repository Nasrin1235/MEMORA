import { useContext, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MemoryContext } from "../context/MemoryContext";
import "../styles/MemoryList.css";

const MemoryList = ({ onMemorySelect }) => {
  const memoryContext = useContext(MemoryContext);
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("filter") || "";
  const [filteredMemories, setFilteredMemories] = useState([]);

  const { memories, error, isLoading } = memoryContext || {};

  useEffect(() => {
    if (!Array.isArray(memories)) {
      setFilteredMemories([]);
      return;
    }

    setFilteredMemories(
      memories
        .filter((memory) =>
          memory.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => new Date(b.visitedDate || 0) - new Date(a.visitedDate || 0))
    );
  }, [memories, searchTerm]);

  if (isLoading) return <p>Loading memories...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!filteredMemories.length) return <p>No memories found.</p>;

  return (
    <div className="memorylist">
      <ul>
        {filteredMemories.map((memory) => (
          <li
            key={memory._id}
            className="memorylist-item"
            onClick={() => onMemorySelect(memory)}
            style={{ cursor: "pointer" }}
          >
            {memory.imageUrl && (
              <img
                src={memory.imageUrl}
                alt={memory.title}
                className="memorylist-image"
              />
            )}
            <div className="memorylist-content">
              <h3> {memory.title}</h3>
              <p className="memorylist-meta">
                {" "}
                {memory.visitedDate
                  ? new Date(memory.visitedDate).toLocaleDateString()
                  : "Not specified"}
              </p>
              <p><strong>Location:</strong> {memory.cityName || "Unknown"}</p>
              <p className="memorylist-text">{memory.memorie?.slice(0, 150)}...</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemoryList;
