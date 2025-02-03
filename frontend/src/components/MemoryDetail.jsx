import "../styles/MemoryDetail.css"
const MemoryDetail = ({ memory }) => {
    if (!memory) {
      return <p>No memory selected.</p>;
    }
  
    return (
      <div className="memory-detail">
        <h2>{memory.title}</h2>
        {memory.imageUrl && <img src={memory.imageUrl} alt={memory.title} className="memory-image" />}
        <p className="memory-meta">
          📅 {memory.visitedDate ? new Date(memory.visitedDate).toLocaleDateString() : "Not specified"}
        </p>
        <p>
          <strong>📍 Location:</strong> {Array.isArray(memory.visitedLocation) ? memory.visitedLocation.join(", ") : "Unknown"}
        </p>
        <p>{memory.memorie}</p>
      </div>
    );
  };
  
  export default MemoryDetail;
  