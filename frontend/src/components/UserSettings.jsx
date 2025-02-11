import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // Добавлен useNavigate
import "../styles/UserSettings.css";

const UserSettings = ({ onClose }) => {
  const { username, setUsername, imageUrl, setImageUrl, updateProfile, logout } =
    useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Состояние для модального окна
  const navigate = useNavigate(); // Для редиректа

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/profile", {
          credentials: "include",
        });
        const data = await response.json();
        setEmail(data.email);
        setImageUrl(data.imageUrl || "/default-avatar.png");
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, [setImageUrl]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    let uploadedImageUrl = imageUrl;

    if (newImage) {
      const formData = new FormData();
      formData.append("image", newImage);

      try {
        const response = await fetch("http://localhost:3001/api/upload-image", {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const data = await response.json();
        uploadedImageUrl = data.imageUrl;
      } catch (error) {
        console.error("Upload error:", error);
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch("http://localhost:3001/api/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, imageUrl: uploadedImageUrl }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      setUsername(data.user.username);
      setImageUrl(data.user.imageUrl);
      updateProfile(data.user.username, data.user.imageUrl);

      setLoading(false);
      onClose && onClose();
    } catch (error) {
      console.error("Error updating user profile:", error);
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/delete-account", {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      logout(); // Выход из системы
      navigate("/register"); // Перенаправляем на страницу входа
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="user-settings-modal" onClick={(e) => e.stopPropagation()}>
        <h2>User Settings</h2>

        <label className="file-label">
          Profile Picture:
          <input type="file" accept="image/*" onChange={handleImageChange} className="file-input" />
        </label>

        {image ? (
          <img src={image} alt="Profile Preview" className="profile-preview" />
        ) : (
          <img src={imageUrl} alt="Current Avatar" className="profile-preview" />
        )}

        <label className="user-input-label">
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="user-text-input" />
        </label>

        <label className="user-input-label">
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="user-text-input" />
        </label>

        <button onClick={handleSave} disabled={loading} className="save-btn">
          {loading ? "Saving..." : "Save"}
        </button>

        <button onClick={onClose} className="close-btn">
          Close
        </button>

        {/* 🔥 Кнопка удаления аккаунта */}
        <button onClick={() => setShowDeleteModal(true)} className="delete-btn">
          Delete Account
        </button>

        {/* 🔥 Модальное окно подтверждения */}
        {showDeleteModal && (
          <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
            <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Are you sure you want to delete your account?</h3>
              <p>This action is irreversible.</p>
              <button onClick={handleDeleteAccount} className="confirm-delete-btn">
                Yes, delete my account
              </button>
              <button onClick={() => setShowDeleteModal(false)} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSettings;

