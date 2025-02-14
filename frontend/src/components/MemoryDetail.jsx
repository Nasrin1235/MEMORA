import { useState, useContext, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import "../styles/MemoryDetail.css";
import { Star, Edit, Trash2, Calendar, X } from "lucide-react";
import { MemoryContext } from "../context/MemoryContext.jsx";

const MemoryDetail = ({ memoryId, onClose }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { updateMemory, uploadImage } = useContext(MemoryContext);

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editedMemory, setEditedMemory] = useState({});
  const [newImage, setNewImage] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  useEffect(() => {
    queryClient.invalidateQueries(["memory", memoryId]);
  }, [memoryId, queryClient]);

  const {
    data: memory,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["memory", memoryId],
    queryFn: async () => {
      if (!memoryId) throw new Error("No memoryId provided");
      const response = await fetch(
        `http://localhost:3001/api/memory/${memoryId}`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to load memory");
      return response.json();
    },
    enabled: !!memoryId,
    staleTime: 5 * 60 * 1000,
  });

  const deleteMemoryMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(
        `http://localhost:3001/api/memory/delete/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to delete memory");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["memories"]);
      navigate("/main");
    },
  });

  if (isLoading) return <p>Loading memory...</p>;
  if (error) return <p>Error loading memory: {error.message}</p>;
  if (!memory) return <p>Memory not found.</p>;

  const isFavorite = favorites.some((fav) => fav._id === memory._id);

  const toggleFavorite = () => {
    let updatedFavorites = isFavorite
      ? favorites.filter((fav) => fav._id !== memory._id)
      : [...favorites, memory];

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const handleEdit = () => {
    setEditedMemory({
      title: memory.title,
      memorie: memory.memorie,
      visitedLocation: memory.visitedLocation,
      visitedDate: memory.visitedDate,
      imageUrl: memory.imageUrl,
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    let imageUrl = editedMemory.imageUrl;

    if (newImage) {
      const formData = new FormData();
      formData.append("image", newImage);

      try {
        const response = await uploadImage.mutateAsync(formData);
        imageUrl = response.imageUrl;
      } catch (error) {
        console.error("Error uploading image:", error);
        return;
      }
    }

    await updateMemory.mutateAsync({
      id: memory._id,
      updatedMemory: { ...editedMemory, imageUrl },
    });

    await queryClient.invalidateQueries(["memory", memoryId]);
    await queryClient.invalidateQueries(["memories"]);

    setIsEditing(false);
  };

  const confirmDelete = () => {
    setIsDeleting(true);
  };

  const handleDelete = () => {
    deleteMemoryMutation.mutate(memory._id);
    setIsDeleting(false);
  };

  return (
    <div className="memoryDetail">

       {/* Close Button */}
       <button className="memoryDetail-close-btn" onClick={onClose}>
        <X size={24} />
      </button>
      <h2 className="memoryDetail-title">{memory.title}</h2>

      {memory.imageUrl ? (
        <div className="memoryDetail-image-container">
          <img
            src={memory.imageUrl}
            alt={memory.title}
            className="memoryDetail-image-detail"
          />
        </div>
      ) : (
        <p className="no-image-text">No image uploaded.</p>
      )}

      <p className="memoryDetail-meta">
        📅{" "}
        {memory.visitedDate
          ? new Date(memory.visitedDate).toLocaleDateString()
          : "Not specified"}
      </p>
      <p><strong>📍 Location:</strong> {memory.cityName || "Unknown"}</p>
      <p className="memoryDetail-text">{memory.memorie}</p>

      <nav className="memoryDetail-bottom-nav">
        <button onClick={toggleFavorite} className="nav-btn">
          {isFavorite ? <Star color="gold" /> : <Star />}
          {isFavorite ?  <span>Remove from Favorites</span>: <span>Add to Favorites</span> }
          
          

        </button>

        <button onClick={handleEdit} className="nav-btn">
          <Edit /><span>Edit</span>
        </button>
        <button onClick={confirmDelete} className="nav-btn delete">
          <Trash2 /> <span>Delete </span>
        </button>
        <button onClick={() => navigate("/calendar")} className="nav-btn">
          <Calendar /><span>Calendar </span>
        </button>
      </nav>

      {isEditing && (
        <div className="memoryDetail-modal-overlay">
          <div className="memoryDetail-modal">
            <h3>Edit Memory</h3>
            <input
              type="text"
              name="title"
              value={editedMemory.title}
              onChange={(e) =>
                setEditedMemory({ ...editedMemory, title: e.target.value })
              }
              placeholder="Title"
            />
            <textarea
              name="memory"
              value={editedMemory.memorie}
              onChange={(e) =>
                setEditedMemory({ ...editedMemory, memorie: e.target.value })
              }
              placeholder="Memory description"
            />
            <input
              type="text"
              name="visitedLocation"
              value={editedMemory.visitedLocation}
              onChange={(e) =>
                setEditedMemory({
                  ...editedMemory,
                  visitedLocation: e.target.value,
                })
              }
              placeholder="Visited Location"
            />
            <input
              type="date"
              name="visitedDate"
              value={editedMemory.visitedDate}
              onChange={(e) =>
                setEditedMemory({
                  ...editedMemory,
                  visitedDate: e.target.value,
                })
              }
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewImage(e.target.files[0])}
            />
            <button onClick={handleSave}>Save Changes</button>
            <button onClick={() => setIsEditing(false)} className="cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      )}

      {isDeleting && (
        <div className="memoryDetail-modal-overlay">
          <div className="memoryDetail-modal">
            <h3>Are you sure you want to delete this memory?</h3>
            <p>This action cannot be undone.</p>
            <button onClick={handleDelete} className="delete-btn">
              Yes, Delete
            </button>
            <button onClick={() => setIsDeleting(false)} className="cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryDetail;
