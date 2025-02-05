// import { useState, useContext ,useEffect } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
// import "../styles/MemoryDetail.css";
// import { Star, Edit, Trash2, Calendar } from "lucide-react";
// import { MemoryContext } from "../context/MemoryContext.jsx";

// const MemoryDetail = ({ memoryId }) => {
//   const queryClient = useQueryClient();
//   const navigate = useNavigate();
//   const { updateMemory, deleteMemory, uploadImage } = useContext(MemoryContext);

//   const [isEditing, setIsEditing] = useState(false);
//   const [editedMemory, setEditedMemory] = useState({});
//   const [newImage, setNewImage] = useState(null);
//   const [favorites, setFavorites] = useState([]);

//   console.log("MemoryDetail received ID:", memoryId); // 🔥 Debug Log

//   const {
//     data: memory,
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: ["memory", memoryId],
//     queryFn: async () => {
//       if (!memoryId) throw new Error("No memoryId provided");
//       const response = await fetch(
//         `http://localhost:3001/api/memory/${memoryId}`,
//         {
//           credentials: "include",
//         }
//       );
//       if (!response.ok) throw new Error("Failed to load memory");
//       return response.json();
//     },
//     enabled: !!memoryId,
//     staleTime: 5 * 60 * 1000,
//   });

//   useEffect(() => {
//     const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
//     setFavorites(savedFavorites);
//   }, []);

//   const updateMemoryMutation = useMutation({
//     mutationFn: async (updatedMemory) => {
//       const response = await fetch(
//         `http://localhost:3001/api/memory/${memoryId}`,
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(updatedMemory),
//           credentials: "include",
//         }
//       );
//       if (!response.ok) throw new Error("Failed to update memory");
//       return response.json();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(["memory", memoryId]);
//       setIsEditing(false);
//     },
//   });

//   const deleteMemoryMutation = useMutation({
//     mutationFn: async () => {
//       const response = await fetch(
//         `http://localhost:3001/api/memory/delete/${memoryId}`,
//         {
//           method: "DELETE",
//           credentials: "include",
//         }
//       );
//       if (!response.ok) throw new Error("Failed to delete memory");
//       return response.json();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(["memories"]);
//       navigate("/main");
//     },
//   });

//   if (isLoading) return <p>Loading memory...</p>;
//   if (error) return <p>Error loading memory: {error.message}</p>;
//   if (!memory) return <p>Memory not found.</p>;

//   const handleEdit = () => {
//     setEditedMemory({ ...memory });
//     setIsEditing(true);
//   };

//   const handleSave = async () => {
//     let imageUrl = editedMemory.imageUrl;

//     if (newImage) {
//       const formData = new FormData();
//       formData.append("image", newImage);
//       const response = await uploadImage.mutateAsync(formData);
//       imageUrl = response.imageUrl;
//     }

//     updateMemoryMutation.mutate({ ...editedMemory, imageUrl });
//   };

//   const handleDelete = () => {
//     if (window.confirm("Are you sure you want to delete this memory?")) {
//       deleteMemoryMutation.mutate();
//     }
//   };

//   const toggleFavorite = () => {
//     let updatedFavorites = favorites.some((fav) => fav._id === memory._id)
//       ? favorites.filter((fav) => fav._id !== memory._id)
//       : [...favorites, memory];

//     setFavorites(updatedFavorites);
//     localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
//   };

//   return (
//     <div className="memory-detail">
//       <h2 className="memory-title">{memory.title}</h2>

//       {memory.imageUrl ? (
//         <div className="memory-image-container">
//           <img
//             src={memory.imageUrl}
//             alt={memory.title}
//             className="memory-image"
//           />
//         </div>
//       ) : (
//         <p className="no-image-text">No image uploaded.</p>
//       )}

//       <p className="memory-meta">
//         📅{" "}
//         {memory.visitedDate
//           ? new Date(memory.visitedDate).toLocaleDateString()
//           : "Not specified"}
//       </p>
//       <p>
//         <strong>📍 Location:</strong> {memory.visitedLocation || "Unknown"}
//       </p>
//       <p className="memory-text">{memory.memorie}</p>

//       <nav className="memory-bottom-nav">
//         <button onClick={toggleFavorite} className="nav-btn">
//           {favorites.some((fav) => fav._id === memory._id) ? (
//             <Star color="gold" />
//           ) : (
//             <Star />
//           )}
//           {favorites.some((fav) => fav._id === memory._id)
//             ? " Remove from Favorites"
//             : " Add to Favorites"}
//         </button>
//         <button onClick={handleEdit} className="nav-btn">
//           <Edit /> Edit
//         </button>
//         <button onClick={handleDelete} className="nav-btn delete">
//           <Trash2 /> Delete
//         </button>
//         <button onClick={() => navigate("/calendar")} className="nav-btn">
//           <Calendar /> Calendar
//         </button>
//       </nav>

//       {isEditing && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <h3>Edit Memory</h3>
//             <input
//               type="text"
//               name="title"
//               value={editedMemory.title}
//               onChange={(e) =>
//                 setEditedMemory({ ...editedMemory, title: e.target.value })
//               }
//               placeholder="Title"
//             />
//             <textarea
//               name="memorie"
//               value={editedMemory.memorie}
//               onChange={(e) =>
//                 setEditedMemory({ ...editedMemory, memorie: e.target.value })
//               }
//               placeholder="Memory description"
//             />
//             <input
//               type="text"
//               name="visitedLocation"
//               value={editedMemory.visitedLocation}
//               onChange={(e) =>
//                 setEditedMemory({
//                   ...editedMemory,
//                   visitedLocation: e.target.value,
//                 })
//               }
//               placeholder="Visited Location"
//             />
//             <input
//               type="date"
//               name="visitedDate"
//               value={editedMemory.visitedDate}
//               onChange={(e) =>
//                 setEditedMemory({
//                   ...editedMemory,
//                   visitedDate: e.target.value,
//                 })
//               }
//             />
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => setNewImage(e.target.files[0])}
//             />
//             <button onClick={handleSave}>Save Changes</button>
//             <button onClick={() => setIsEditing(false)} className="cancel-btn">
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MemoryDetail;
import { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import "../styles/MemoryDetail.css";
import { Star, Edit, Trash2, Calendar } from "lucide-react";
import { MemoryContext } from "../context/MemoryContext.jsx";

const MemoryDetail = ({ memoryId }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { updateMemory, deleteMemory, uploadImage, deleteImage } = useContext(MemoryContext); // ✅ Теперь они используются

  const [isEditing, setIsEditing] = useState(false);
  const [editedMemory, setEditedMemory] = useState({});
  const [newImage, setNewImage] = useState(null);

  const { data: memory, isLoading, error } = useQuery({
    queryKey: ["memory", memoryId],
    queryFn: async () => {
      if (!memoryId) throw new Error("No memoryId provided");
      const response = await fetch(`http://localhost:3001/api/memory/${memoryId}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to load memory");
      return response.json();
    },
    enabled: !!memoryId,
    staleTime: 5 * 60 * 1000,
  });

  const updateMemoryMutation = useMutation({
    mutationFn: async (updatedMemory) => {
      await updateMemory.mutateAsync({ id: memoryId, updatedMemory }); // ✅ Используем `updateMemory`
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["memory", memoryId]);
      setIsEditing(false);
    },
  });

  const deleteMemoryMutation = useMutation({
    mutationFn: async () => {
      await deleteMemory.mutateAsync(memoryId); // ✅ Используем `deleteMemory`
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["memories"]);
      navigate("/main");
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (formData) => {
      return await uploadImage.mutateAsync(formData); // ✅ Используем `uploadImage`
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: async (imageUrl) => {
      return await deleteImage.mutateAsync(imageUrl); // ✅ Используем `deleteImage`
    },
  });

  if (isLoading) return <p>Loading memory...</p>;
  if (error) return <p>Error loading memory: {error.message}</p>;
  if (!memory) return <p>Memory not found.</p>;

  const handleEdit = () => {
    setEditedMemory({ ...memory });
    setIsEditing(true);
  };

  const handleSave = async () => {
    let imageUrl = editedMemory.imageUrl;

    if (newImage) {
      const formData = new FormData();
      formData.append("image", newImage);
      try {
        const response = await uploadImageMutation.mutateAsync(formData);
        imageUrl = response.imageUrl;
      } catch (error) {
        console.error("Error uploading image:", error);
        return;
      }
    }

    updateMemoryMutation.mutate({ ...editedMemory, imageUrl });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this memory?")) {
      deleteMemoryMutation.mutate();
    }
  };

  return (
    <div className="memory-detail">
      <h2 className="memory-title">{memory.title}</h2>

      {memory.imageUrl ? (
        <div className="memory-image-container">
          <img src={memory.imageUrl} alt={memory.title} className="memory-image" />
        </div>
      ) : (
        <p className="no-image-text">No image uploaded.</p>
      )}

      <p className="memory-meta">📅 {memory.visitedDate ? new Date(memory.visitedDate).toLocaleDateString() : "Not specified"}</p>
      <p><strong>📍 Location:</strong> {memory.visitedLocation || "Unknown"}</p>
      <p className="memory-text">{memory.memory}</p>

      <nav className="memory-bottom-nav">
        <button onClick={handleEdit} className="nav-btn">
          <Edit /> Edit
        </button>
        <button onClick={handleDelete} className="nav-btn delete">
          <Trash2 /> Delete
        </button>
        <button onClick={() => navigate("/calendar")} className="nav-btn">
          <Calendar /> Calendar
        </button>
      </nav>

      {isEditing && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Memory</h3>
            <input type="text" name="title" value={editedMemory.title} onChange={(e) => setEditedMemory({ ...editedMemory, title: e.target.value })} placeholder="Title" />
            <textarea name="memory" value={editedMemory.memory} onChange={(e) => setEditedMemory({ ...editedMemory, memory: e.target.value })} placeholder="Memory description" />
            <input type="text" name="visitedLocation" value={editedMemory.visitedLocation} onChange={(e) => setEditedMemory({ ...editedMemory, visitedLocation: e.target.value })} placeholder="Visited Location" />
            <input type="date" name="visitedDate" value={editedMemory.visitedDate} onChange={(e) => setEditedMemory({ ...editedMemory, visitedDate: e.target.value })} />
            <input type="file" accept="image/*" onChange={(e) => setNewImage(e.target.files[0])} />
            <button onClick={handleSave}>Save Changes</button>
            <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryDetail;
