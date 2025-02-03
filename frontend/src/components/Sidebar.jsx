import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import AddMemoryForm from "../components/AddMemoryForm";
import { NavLink } from "react-router-dom";
import { Calendar, Camera, Map, Sun, Star, Home } from "lucide-react";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const { isLoggedIn, username, logout } = useContext(AuthContext);
  const [searchVisible, setSearchVisible] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleAddStoryClick = () => {
    setShowForm(true);
  };

  return (
    <div className="sidebar">
      <div className="search-box">
        {searchVisible ? (
          <input
            type="text"
            placeholder="Search"
            className="search-input"
            onBlur={() => setSearchVisible(false)}
            autoFocus
          />
        ) : (
          <div className="search-icon" onClick={() => setSearchVisible(true)}>
            🔍
          </div>
        )}
      </div>

      <nav className="menu">
        <ul>
          <li>
            <NavLink to="/calendar" className="menu-item">
              <Calendar size={20} /> <span>Calendar</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/media" className="menu-item">
              <Camera size={20} /> <span>Media</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/atlas" className="menu-item">
              <Map size={20} /> <span>Atlas</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/weather" className="menu-item">
              <Sun size={20} /> <span>Weather</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/favorites" className="menu-item">
              <Star size={20} /> <span>Favorites</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/main" className="menu-item">
              <Home size={20} /> <span>All Memories</span>
            </NavLink>
          </li>
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
            <div className="user-details">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}
                alt="User Avatar"
                className="user-avatar"
              />
              <p className="username">{username}</p>
            </div>
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <div className="user-details">
              <img
                src="/default-avatar.png"
                alt="Default Avatar"
                className="user-avatar"
              />
              <p className="username">Guest</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
