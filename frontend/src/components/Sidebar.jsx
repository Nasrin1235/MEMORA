import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import AddMemoryForm from "../components/AddMemoryForm";
import Calendar from "../components/Calendar";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const { isLoggedIn, username, logout } = useContext(AuthContext);
  const [searchVisible, setSearchVisible] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

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
          <li>📅 Calendar</li>
          <li>📷 Media</li>
          <li>🗺️ Atlas</li>
          <li>🏖️ Wetter</li>
          <li>⭐ Favorites</li>
        </ul>
      </nav>
      <div className="calendar-section">
        <button
          className="calendar-btn"
          onClick={() => setShowCalendar(!showCalendar)}
        >
          📅 {showCalendar ? "Hide Calendar" : "Show Calendar"}
        </button>
        {showCalendar && (
          <div className="calendar-container">
            <Calendar />
          </div>
        )}
      </div>

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
