import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import MemoryList from "../components/MemoryList.jsx";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    console.log("Loaded favorites on page:", savedFavorites); 
    setFavorites(savedFavorites);
  }, []);
  return (
    <div>
      <Sidebar setFilteredMemories={() => {}} />
      <div className="memory-list-container">
        <h2>:stern: Favorites</h2>
        {favorites.length === 0 ? (
          <p>No favorite memories yet.</p>
        ) : (
          <MemoryList
            memories={favorites}
            filteredMemories={null}
            onMemorySelect={() => {}}
          />
        )}
      </div>
    </div>
  );
};
export default FavoritesPage;
