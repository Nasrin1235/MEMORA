import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/AddMemoryForm.css";

const AddMemoryForm = ({ onClose }) => {
  const { username } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [memorie, setMemorie] = useState("");
  const [visitedLocation, setVisitedLocation] = useState("");
  const [visitedDate, setVisitedDate] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // Теперь фото не обязательно
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Проверяем только обязательные поля (без imageUrl)
    if (!title || !memorie || !visitedLocation || !visitedDate) {
      setError("Title, Memory description, Location, and Date are required.");
      return;
    }

    const newMemory = {
      title,
      memorie,
      visitedLocation,
      visitedDate,
      imageUrl: imageUrl || "", 
    };

    try {
      const response = await fetch("http://localhost:3001/api/memory/add-memories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMemory),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        onClose();
      } else {
        setError(data.error || "Failed to add memory.");
      }
    } catch  {
      setError("An error occurred while adding the memory.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
        <p>Adding memory as: <strong>{username}</strong></p>
          <input
            type="text"
            placeholder="Title (required)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Memory description (required)"
            value={memorie}
            onChange={(e) => setMemorie(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Visited Location (required)"
            value={visitedLocation}
            onChange={(e) => setVisitedLocation(e.target.value)}
            required
          />
          <input
            type="date"
            value={visitedDate}
            onChange={(e) => setVisitedDate(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Image URL (optional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <button type="submit">Add Memory</button>
          <button type="button" onClick={onClose} className="cancel-btn">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMemoryForm;

