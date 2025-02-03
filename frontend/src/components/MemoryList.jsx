
import "../styles/MemoryList.css";

import "../styles/MemoryList.css";

const MemoryList = ({ memories, filteredMemories, onMemorySelect }) => {
  const displayedMemories = filteredMemories !== null ? filteredMemories : memories;

  return (
    <div className="memory-list">
      <h2>📖 My Memories</h2>

      {displayedMemories.length === 0 ? (
        <p>No memories found. Add a new one!</p>
      ) : (
        <ul>
          {displayedMemories.map((memory) => (
            <li 
              key={memory._id} 
              className="memory-item" 
              onClick={() => onMemorySelect(memory)} // Pass the selected memory
              style={{ cursor: "pointer" }} // Add pointer cursor for better UX
            >
              {memory.imageUrl && (
                <img src={memory.imageUrl} alt={memory.title} className="memory-image" />
              )}
              <div className="memory-content">
                <h3>📌 {memory.title}</h3>
                <p className="memory-meta">
                  📅 {memory.visitedDate ? new Date(memory.visitedDate).toLocaleDateString() : "Not specified"}
                </p>
                <p>
                  <strong>📍 Location:</strong>{" "}
                  {Array.isArray(memory.visitedLocation) ? memory.visitedLocation.join(", ") : "Unknown"}
                </p>
                {/* Show only 150 characters */}
                <p className="memory-text">{memory.memorie.slice(0, 150)}...</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MemoryList;
