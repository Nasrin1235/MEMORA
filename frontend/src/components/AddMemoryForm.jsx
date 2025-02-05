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
  const [visitedDate, setVisitedDate] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(""); // URL загруженного фото
  const [error, setError] = useState("");

  
  // Показываем превью изображения перед загрузкой
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectURL = URL.createObjectURL(file);
      setImage(objectURL); // Показываем превью
      setImageUrl(file); // Сохраняем файл для загрузки
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !memorie || !visitedLocation || !visitedDate) {
      setError("All fields are required.");
      return;
    }

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
        visitedLocation,
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
          {/* Поле для загрузки фото */}
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {/* Превью фото перед загрузкой (уменьшенное) */}
          {image && <img src={image} alt="Preview" className="uploaded-image" />}
          <button type="submit">Add Memory</button>
          <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddMemoryForm;
