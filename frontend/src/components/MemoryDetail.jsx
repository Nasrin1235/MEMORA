import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/MemoryDetail.css";
import { Star } from "lucide-react";

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
        📅 {memory.visitedDate ? new Date(memory.visitedDate).toLocaleDateString() : "Not specified"}
      </p>
      <p>
        <strong>📍 Location:</strong> {Array.isArray(memory.visitedLocation) ? memory.visitedLocation.join(", ") : "Unknown"}
      </p>
      <p>{memory.memorie}</p>
      
      <nav className="memory-nav">
        <Link to="#" onClick={toggleFavorite} className="favorite-link">
          {favorites.some(fav => fav._id === memory._id) ? <Star color="gold" /> : <Star/>} 
          {favorites.some(fav => fav._id === memory._id) ? " Remove from Favorites" : " Add to Favorites"}
        </Link>
      </nav>
    </div>
  );
};

export default MemoryDetail;
  