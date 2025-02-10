import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/UserSettings.css";

const UserSettings = () => {
  const { username, setUsername, isLoggedIn } = useContext(AuthContext);
  const [newUsername, setNewUsername] = useState(username || "Guest");
  const [avatar, setAvatar] = useState(localStorage.getItem("userAvatar") || "");

  useEffect(() => {
    localStorage.setItem("userAvatar", avatar);
  }, [avatar]);

  useEffect(() => {
    setUsername(newUsername);
  }, [newUsername, setUsername]);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUsernameChange = () => {
    localStorage.setItem("username", newUsername);
    alert("Имя пользователя обновлено!");
  };

  return (
    <div className="user-settings">
      <h2>Настройки пользователя</h2>
      <div className="avatar-section">
        <label htmlFor="avatar-upload">
          <img
            src={avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}
            alt="User Avatar"
            className="user-avatar"
          />
        </label>
        <input
          type="file"
          id="avatar-upload"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleAvatarChange}
        />
        <p>Нажмите на аватар, чтобы загрузить новое изображение</p>
      </div>

      <div className="username-section">
        <label>Имя пользователя:</label>
        <input
          type="text"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <button onClick={handleUsernameChange}>Сохранить</button>
      </div>

      {!isLoggedIn && <p className="guest-warning">Вы не вошли в аккаунт!</p>}
    </div>
  );
};

export default UserSettings;
