import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "../components/Sidebar";
import "../styles/MediaPage.css";

const fetchMemories = async () => {
  const response = await fetch("http://localhost:3001/api/memory/get", {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch memories");
  return response.json();
};

const MediaPage = () => {
  const { data: memories, isLoading, error } = useQuery({
    queryKey: ["memories"],
    queryFn: fetchMemories,
  });
  const [selectedMemory, setSelectedMemory] = useState(null);

  if (isLoading) return <p>Loading images...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="media-layout">
      <Sidebar />
      <div className="media-container">
        <h2>Media Gallery</h2>
        <div className="media-grid">
          {memories && memories.map((memory) => (
            memory.imageUrl && (
              <img
                key={memory._id}
                src={memory.imageUrl}
                alt={memory.title}
                className="media-thumbnail"
                onClick={() => setSelectedMemory(memory)}
              />
            )
          ))}
        </div>
      </div>

      {selectedMemory && (
        <div className="modal-overlay" onClick={() => setSelectedMemory(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedMemory.title}</h2>
            <img
              src={selectedMemory.imageUrl}
              alt={selectedMemory.title}
              className="modal-image"
            />
            <p>
              <strong>📅 Date:</strong> {new Date(selectedMemory.visitedDate).toLocaleDateString()}
            </p>
            <p>
              <strong>📍 Location:</strong> {selectedMemory.visitedLocation || "Unknown"}
            </p>
            <p className="modal-description">{selectedMemory.memorie}</p>
            <button onClick={() => setSelectedMemory(null)} className="cancel-btn">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaPage;
