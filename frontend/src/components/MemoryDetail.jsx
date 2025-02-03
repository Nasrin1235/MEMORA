import { useState, useEffect } from "react";
import "../styles/MemoryDetail.css";
const MemoryDetail = ({ memory }) => {
  const [favorites, setFavorites] = useState([]);
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
  if (!memory) {
    return <p>No memory selected.</p>;
  }
  return (
    <div className="memory-detail">
      <h2>{memory.title}</h2>
      {memory.imageUrl && <img src={memory.imageUrl} alt={memory.title} className="memory-image" />}
      <p className="memory-meta">
        :datum: {memory.visitedDate ? new Date(memory.visitedDate).toLocaleDateString() : "Not specified"}
      </p>
      <p>
        <strong>:runde_reißzwecke: Location:</strong> {Array.isArray(memory.visitedLocation) ? memory.visitedLocation.join(", ") : "Unknown"}
      </p>
      <p>{memory.memorie}</p>
      <button className="favorite-btn" onClick={toggleFavorite}>
        {favorites.some(fav => fav._id === memory._id) ? ":stern: Remove from Favorites" : "☆ Add to Favorites"}
      </button>
    </div>
  );
};
export default MemoryDetail;
  