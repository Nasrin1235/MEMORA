import { useState, useContext } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { MemoryContext } from "../context/MemoryContext";
import "../styles/AddMemoryForm.css";

const AddMemoryForm = ({ onClose }) => {
  const { addMemory, uploadImage } = useContext(MemoryContext);
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [memorie, setMemorie] = useState("");
  const [visitedLocation, setVisitedLocation] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [visitedDate, setVisitedDate] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const fetchCoordinates = async (location) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          location
        )}`
      );
      const data = await response.json();
      if (data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectURL = URL.createObjectURL(file);
      setImage(objectURL);
      setImageUrl(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !memorie || !visitedLocation || !visitedDate) {
      setError("All fields are required.");
      return;
    }

    const coordinates = await fetchCoordinates(visitedLocation);
    if (!coordinates) {
      setError("Could not find coordinates for this location.");
      return;
    }
    setCoordinates(coordinates);

    try {
      let uploadedImageUrl = "";
      if (imageUrl) {
        const formData = new FormData();
        formData.append("image", imageUrl);
        const response = await uploadImage.mutateAsync(formData);
        uploadedImageUrl = response.imageUrl;
      }
      await addMemory.mutateAsync({
        title,
        memorie,
        cityName: visitedLocation,
        visitedLocation: coordinates, 
        visitedDate,
        imageUrl: uploadedImageUrl,
      });

      queryClient.invalidateQueries(["memories"]);
      onClose();
    } catch (error) {
      console.error("Error adding memory:", error);
      setError("Failed to add memory.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <p>Adding memory</p>
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
            placeholder="Enter City (e.g. Paris, France)"
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

          {image && (
            <img src={image} alt="Preview" className="uploaded-image" />
          )}
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
