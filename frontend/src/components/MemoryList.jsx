import { useContext } from "react";
import { MemoryContext } from "../context/MemoryContext";
import "../styles/MemoryList.css";

const MemoryList = ({ onMemorySelect }) => {
  const { memories, loading, error } = useContext(MemoryContext);

  if (loading) return <p>Loading memories...</p>;
  if (error) return <p>{error}</p>;
  if (!memories || memories.length === 0)
    return <p>No memories found. Add a new one!</p>;

  return (
    <div className="memory-list">
      <h2>📖 My Memories</h2>
      <ul>
        {memories.map((memory) => (
          <li
            key={memory._id}
            className="memory-item"
            onClick={() => onMemorySelect(memory)}
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
