import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/UserSettings.css";

const UserSettings = ({ onClose }) => {
  const { username, setUsername, imageUrl, setImageUrl, updateProfile } =
    useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);

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
      setNewImage(file); // Сохраняем новый файл
      setImage(URL.createObjectURL(file)); // Показываем превью
    }
  };

  const handleSave = async () => {
    console.log("Before sending request:", { username, email, imageUrl });

    setLoading(true);
    let uploadedImageUrl = imageUrl; // Используем текущий аватар по умолчанию

    if (newImage) {
      const formData = new FormData();
      formData.append("image", newImage);
      console.log("Uploading avatar...");

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
        console.log("Uploaded image URL:", uploadedImageUrl);
      } catch (error) {
        console.error("Upload error:", error);
        setLoading(false);
        return;
      }
    }

    console.log("Final imageUrl:", uploadedImageUrl);

    try {
      const response = await fetch("http://localhost:3001/api/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          imageUrl: uploadedImageUrl || "/default-avatar.png",
        }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      console.log("Response from server:", data);

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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="user-settings-modal" onClick={(e) => e.stopPropagation()}>
        <h2>User Settings</h2>

        <label className="file-label">
          Profile Picture:
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input"
          />
        </label>

        {image ? (
          <img src={image} alt="Profile Preview" className="profile-preview" />
        ) : (
          <img src={imageUrl} alt="Current Avatar" className="profile-preview" />
        )}

        <label className="user-input-label">
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="user-text-input"
          />
        </label>

        <label className="user-input-label">
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="user-text-input"
          />
        </label>

        <button onClick={handleSave} disabled={loading} className="save-btn">
          {loading ? "Saving..." : "Save"}
        </button>

        <button onClick={onClose} className="close-btn">
          Close
        </button>
      </div>
    </div>
  );
};

export default UserSettings;
