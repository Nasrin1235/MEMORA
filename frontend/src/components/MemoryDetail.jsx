import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MemoryDetail.css";
import { Star, Edit, Trash2, Calendar } from "lucide-react";
import { MemoryContext } from "../context/MemoryContext.jsx";

const MemoryDetail = ({ memory }) => {
  const { updateMemory, deleteMemory, deleteImage, uploadImage, fetchMemories } = useContext(MemoryContext);
  const [favorites, setFavorites] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMemory, setEditedMemory] = useState(memory || {});
  const [newImage, setNewImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  const handleEdit = () => {
    console.log("Edit button clicked!"); // 🔥 Debugging log
    if (!memory) {
      console.error("Memory is undefined");
      return;
    }
    setEditedMemory({ ...memory }); // Ensure memory is copied before editing
    setIsEditing(true);
  };

  const handleSave = async () => {
    console.log("Saving memory:", editedMemory); // Debugging log

    let imageUrl = editedMemory.imageUrl;

    if (newImage) {
      try {
        imageUrl = await uploadImage(newImage);
      } catch (error) {
        console.error("Failed to upload image:", error);
        return;
      }
    }

    await updateMemory(memory._id, { ...editedMemory, imageUrl });
    fetchMemories();
    setIsEditing(false);
  };

  return (
    <div className="memory-detail">
      <h2 className="memory-title">{memory.title}</h2>

      {memory.imageUrl ? (
        <div className="memory-image-container">
          <img src={memory.imageUrl} alt={memory.title} className="memory-image" />
        </div>
      ) : (
        <p className="no-image-text">No image uploaded.</p>
      )}

      <p className="memory-meta">📅 {memory.visitedDate ? new Date(memory.visitedDate).toLocaleDateString() : "Not specified"}</p>
      <p><strong>📍 Location:</strong> {memory.visitedLocation || "Unknown"}</p>
      <p className="memory-text">{memory.memorie}</p>

      {/* 🔥 FIX: Changed <Link> to <button> to ensure click works */}
      <nav className="memory-bottom-nav">
        <button className="nav-btn">
          <Star /> Favorite
        </button>
        <button onClick={handleEdit} className="nav-btn"> {/* 🔥 FIX: Now button */}
          <Edit /> Edit
        </button>
        <button className="nav-btn delete">
          <Trash2 /> Delete
        </button>
        <button onClick={() => navigate("/calendar")} className="nav-btn">
          <Calendar /> Calendar
        </button>
      </nav>

      {/* 🔥 FIX: Edit Modal */}
      {isEditing && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Memory</h3>
            <input type="text" name="title" value={editedMemory.title} onChange={(e) => setEditedMemory({ ...editedMemory, title: e.target.value })} placeholder="Title" />
            <textarea name="memorie" value={editedMemory.memorie} onChange={(e) => setEditedMemory({ ...editedMemory, memorie: e.target.value })} placeholder="Memory description" />
            <input type="text" name="visitedLocation" value={editedMemory.visitedLocation} onChange={(e) => setEditedMemory({ ...editedMemory, visitedLocation: e.target.value })} placeholder="Visited Location" />
            <input type="date" name="visitedDate" value={editedMemory.visitedDate} onChange={(e) => setEditedMemory({ ...editedMemory, visitedDate: e.target.value })} />
            <input type="file" accept="image/*" onChange={(e) => setNewImage(e.target.files[0])} />
            <button onClick={handleSave}>Save Changes</button>
            <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryDetail;













  