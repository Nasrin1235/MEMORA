import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { MemoryContext } from "../context/MemoryContext";
import "../styles/AddMemoryForm.css";

const AddMemoryForm = ({ onClose }) => {
  const { username } = useContext(AuthContext);
  const { addMemory, fetchMemories } = useContext(MemoryContext);
  const [title, setTitle] = useState("");
  const [memorie, setMemorie] = useState("");
  const [visitedLocation, setVisitedLocation] = useState("");
  const [visitedDate, setVisitedDate] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !memorie || !visitedLocation || !visitedDate) {
      setError("Title, Memory description, Location, and Date are required.");
      return;
    }

    let uploadedImageUrl = "";

    if (image) {
      const formData = new FormData();
      formData.append("image", image);

      try {
        const imageResponse = await fetch(
          "http://localhost:3001/api/memory/upload-image",
          {
            method: "POST",
            body: formData,
          }
        );

        const imageData = await imageResponse.json();

        if (imageResponse.ok) {
          uploadedImageUrl = imageData.imageUrl;
        } else {
          setError(imageData.error || "Failed to upload image.");
          return;
        }
      } catch {
        setError("An error occurred while uploading the image.");
        return;
      }
    }

    const newMemory = {
      title,
      memorie,
      visitedLocation,
      visitedDate,
      imageUrl: uploadedImageUrl,
    };

    try {
      await addMemory(newMemory);
      fetchMemories();
      onClose();
    } catch {
      setError("Error adding memory.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <p>
            Adding memory as: <strong>{username}</strong>
          </p>
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
          <input type="file" accept="image/*" onChange={handleImageChange} />
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
