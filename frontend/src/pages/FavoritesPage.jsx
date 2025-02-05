import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/FavoritesPage.css";

const fetchMemories = async () => {
  const response = await fetch("http://localhost:3001/api/memory/get", {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch memories");
  return response.json();
};

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const loadMemories = async () => {
      try {
        const memoriesFromServer = await fetchMemories();

        const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
        const validFavorites = savedFavorites.filter(fav => 
          memoriesFromServer.some(mem => mem._id === fav._id)
        );

        if (validFavorites.length !== savedFavorites.length) {
          localStorage.setItem("favorites", JSON.stringify(validFavorites));
        }

        setFavorites(validFavorites);
      } catch (error) {
        console.error("Error loading memories:", error);
      }
    };

    loadMemories();
  }, []);

  const searchTerm = searchParams.get("filter") || "";

  const filteredFavorites = searchTerm
    ? favorites.filter((memory) =>
        memory.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : favorites;

  return (
    <div className="favorites-page">
      <Sidebar setSearchParams={setSearchParams} />
      <div className="favorites-container">
        <h2>⭐ My Favorite Memories</h2>
        {filteredFavorites.length === 0 ? (
          <p>No favorite memories found.</p>
        ) : (
          <div className="favorites-grid">
            {filteredFavorites.map((memory) => (
              <div key={memory._id} className="favorite-card">
                {memory.imageUrl && <img src={memory.imageUrl} alt={memory.title} className="favorite-image" />}
                <div className="favorite-content">
                  <h3>📌 {memory.title}</h3>
                  <p className="memory-meta">📅 {memory.visitedDate ? new Date(memory.visitedDate).toLocaleDateString() : "Not specified"}</p>
                  <p><strong>📍 Location:</strong> {memory.visitedLocation || "Unknown"}</p>
                  <p>{memory.memorie?.slice(0, 150)}...</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
