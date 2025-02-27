import { useContext, useState, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useSearchParams } from "react-router-dom";
import AddMemoryForm from "../components/AddMemoryForm";
import SearchMemory from "../components/SearchMemory";
import { NavLink } from "react-router-dom";
import { Calendar, Camera, Map, Star, Home, Settings } from "lucide-react";
import UserSettings from "../components/UserSettings";
import MobileHeader from "../components/MobileHeader";
import "../styles/Sidebar.css";

const Sidebar = ({ setFilteredMemories, setSelectedMemoryId }) => {
  const { isLoggedIn, username, logout, imageUrl } = useContext(AuthContext);
  const dialogRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showSettings, setShowSettings] = useState(false);

  const handleSearch = (filter) => {
    setSearchParams(filter ? { filter } : {});
    setFilteredMemories(filter);
  };

  const handleOpenForm = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  return (
    <>
      {window.innerWidth <= 768 && <MobileHeader onSearch={handleSearch} />}

      <div className="sidebar">
        <div className="search-section">
          <SearchMemory onSearch={handleSearch} />
        </div>
        <nav className="sidebar-menu">
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
              <button onClick={() => setShowSettings(true)} className="menu-item">
                <Settings size={20} /><span>Settings</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="story-section">
          <button className="sidebar-add-story-btn" onClick={handleOpenForm}>
            Add Story
          </button>
        </div>

 
        <AddMemoryForm dialogRef={dialogRef} onClose={() => dialogRef.current?.close()} />

        {showSettings && <UserSettings onClose={() => setShowSettings(false)} />}

        <div className="sidebar-user-info">
          {isLoggedIn ? (
            <>
              <div className="sidebar-user-details">
                <img
                  src={imageUrl || "/default-avatar.png"}
                  alt="User Avatar"
                  className="sidebar-user-avatar"
                />
                <p className="sidebar-username">{username}</p>
              </div>
              
              <button className="sidebar-logout-btn" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <div className="sidebar-user-details">
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
    </>
  );
};

export default Sidebar;

