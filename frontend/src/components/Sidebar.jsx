import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useSearchParams } from "react-router-dom";
import AddMemoryForm from "../components/AddMemoryForm";
import SearchMemory from "../components/SearchMemory";
import { NavLink } from "react-router-dom";
import { Calendar, Camera, Map, Star, Home, Settings } from "lucide-react";
import "../styles/Sidebar.css";

const Sidebar = ({ setFilteredMemories }) => {
  const { isLoggedIn, username, logout, imageUrl } = useContext(AuthContext);
  const [showForm, setShowForm] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearch = (filter) => {
    setSearchParams(filter ? { filter } : {});
    setFilteredMemories(filter);
  };

  return (
    <div className="sidebar">
      <div className="search-section">
        <SearchMemory onSearch={handleSearch} />
      </div>
      <nav className="menu">
        <ul>
          <li>
            <NavLink to="/main" className="menu-item">
              <Home size={20} /> <span>All Memories</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/favorites" className="menu-item">
              <Star size={20} /> <span>Favorites</span>
            </NavLink>
          </li>
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
            <NavLink to="/settings" className="menu-item">
              <Settings size={20} /> <span>Settings</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="story-section">
        <button className="add-story-btn" onClick={() => setShowForm(true)}>
          Add Story
        </button>
      </div>
      {showForm && <AddMemoryForm onClose={() => setShowForm(false)} />}
      <div className="user-info">
        {isLoggedIn ? (
          <>
            <div className="user-details">
              <img
                src={imageUrl || "/default-avatar.png"}
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
