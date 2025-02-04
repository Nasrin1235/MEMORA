import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "../styles/MemoryDetail.css";
import { Star, Edit } from "lucide-react";
import { MemoryContext } from "../context/MemoryContext.jsx";

const MemoryDetail = ({ memory }) => {
  const { updateMemory } = useContext(MemoryContext);
  const [favorites, setFavorites] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMemory, setEditedMemory] = useState({ ...memory });

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  const toggleFavorite = () => {
    let updatedFavorites = [];
    if (favorites.some(fav => fav._id === memory._id)) {
      updatedFavorites = favorites.filter(fav => fav._id !== memory._id);
    } else {
      updatedFavorites = [...favorites, memory];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setEditedMemory({ ...editedMemory, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await updateMemory(memory._id, editedMemory);
    setIsEditing(false);
  };

  if (!memory) {
    return <p>No memory selected.</p>;
  }

  return (
    <div className="memory-detail">
      <h2>{memory.title}</h2>
      {memory.imageUrl && <img src={memory.imageUrl} alt={memory.title} className="memory-image" />}
      <p className="memory-meta">📅 {memory.visitedDate ? new Date(memory.visitedDate).toLocaleDateString() : "Not specified"}</p>
      <p><strong>📍 Location:</strong> {Array.isArray(memory.visitedLocation) ? memory.visitedLocation.join(", ") : "Unknown"}</p>
      <p>{memory.memorie}</p>

      <nav className="memory-nav">
        <Link to="#" onClick={toggleFavorite} className="favorite-link">
          {favorites.some(fav => fav._id === memory._id) ? <Star color="gold" /> : <Star />} 
          {favorites.some(fav => fav._id === memory._id) ? " Remove from Favorites" : " Add to Favorites"}
        </Link>
        <Link to="#" onClick={handleEdit} className="edit-link">
          <Edit /> Edit Memory
        </Link>
      </nav>

      {/* Edit Modal */}
      {isEditing && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Memory</h3>
            <input
              type="text"
              name="title"
              value={editedMemory.title}
              onChange={handleChange}
              placeholder="Title"
            />
            <textarea
              name="memorie"
              value={editedMemory.memorie}
              onChange={handleChange}
              placeholder="Memory description"
            />
            <input
              type="text"
              name="visitedLocation"
              value={editedMemory.visitedLocation}
              onChange={handleChange}
              placeholder="Visited Location"
            />
            <input
              type="date"
              name="visitedDate"
              value={editedMemory.visitedDate}
              onChange={handleChange}
            />
            <button onClick={handleSave}>Save Changes</button>
            <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryDetail;


  