import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Импорт AuthContext
import "../styles/Sidebar.css";

const Sidebar = () => {
  const { isLoggedIn, username,logout} = useContext(AuthContext); // Деструктуризация username и isLoggedIn

  

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
        <button className="add-story-btn">Add Story</button>
      </div>

      {/* Отображение информации о пользователе */}
      <div className="user-info">
        {isLoggedIn ? (
          <>
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} // Генерация аватара
              alt="User Avatar"
              className="user-avatar"
            />
            <p>{username}</p> {/* Показываем имя пользователя */}
            <button className="logout-btn" onClick={logout}>Logout</button> {/* Кнопка выхода */}
          </>
        ) : (
          <>
            <img src="/default-avatar.png" alt="Default Avatar" className="user-avatar" />
            <p>Guest</p> {/* Отображение, если пользователь не залогинен */}
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;