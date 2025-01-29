import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import AddMemoryForm from "../components/AddMemoryForm";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const { isLoggedIn, username,logout} = useContext(AuthContext);

  const [showForm, setShowForm] = useState(false);

  const handleAddStoryClick = () => {
    setShowForm(true);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="search-box">
          <input type="text" placeholder="Search" className="search-input" />
        </div>
        <h2 className="logo">Journal</h2>
      </div>

      <nav className="menu">
        <ul>
          <li>📅 Calendar</li>
          <li>📷 Media</li>
          <li>🗺️ Atlas</li>
          <li>🏖️ Wetter</li>
          <li>⭐ Favorites</li>
        </ul>
      </nav>

   <div className="story-section">
        <button className="add-story-btn" onClick={handleAddStoryClick}>
          Add Story
        </button>
      </div>
      {showForm && <AddMemoryForm onClose={() => setShowForm(false)} />}
      
      <div className="user-info">
        {isLoggedIn ? (
          <>
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}
              alt="User Avatar"
              className="user-avatar"
            />
            <p>{username}</p>
            <button className="logout-btn" onClick={logout}>Logout</button> 
          </>
        ) : (
          <>
            <img src="/default-avatar.png" alt="Default Avatar" className="user-avatar" />
            <p>Guest</p> 
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;