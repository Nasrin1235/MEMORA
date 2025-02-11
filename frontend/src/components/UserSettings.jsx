import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/UserSettings.css";

const UserSettings = ({ onClose }) => {
  const { username, setUsername } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/profile", {
          credentials: "include",
        });
        const data = await response.json();
        setEmail(data.email);
        setImageUrl(data.imageUrl || "default-avatar.png");
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectURL = URL.createObjectURL(file);
      setImage(objectURL);
      setImageUrl(file);
    }
  };

  const handleSave = async () => {
    console.log("Before sending request:", { username, email, imageUrl });
  
    setLoading(true);
    let uploadedImageUrl = imageUrl;
  
    if (imageUrl instanceof File) {
      const formData = new FormData();
      formData.append("image", imageUrl);
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
          imageUrl: uploadedImageUrl || ""  
        }),
        credentials: "include",
      });
  
      const data = await response.json();
      console.log("Response from server:", data);
  
      setUsername(data.user.username);
      setLoading(false);
      onClose && onClose();
    } catch (error) {
      console.error("Error updating user profile:", error);
      setLoading(false);
    }
  };

  return (
    <div className="user-settings-modal">
      <h2>User Settings</h2>
      <label className="file-label">
        Profile Picture:
        <input type="file" accept="image/*" onChange={handleImageChange} className="file-input" />
      </label>
      {image && <img src={image} alt="Profile Preview" className="profile-preview" />}
      <label className="input-label">
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="text-input" />
      </label>
      <label className="input-label">
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="text-input" />
      </label>
      <button onClick={handleSave} disabled={loading} className="save-btn">{loading ? "Saving..." : "Save"}</button>
      <button onClick={onClose} className="close-btn">Close</button>
    </div>
  );
};

export default UserSettings;




