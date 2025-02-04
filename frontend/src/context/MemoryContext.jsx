import { createContext, useState, useEffect } from "react";

 const MemoryContext = createContext();

 const MemoryProvider = ({ children }) => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMemories();
  }, []);

// ✅ Load all memories on startup
  const fetchMemories = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/memory/get", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setMemories(data || []);
      } else {
        setError(data.error || "Failed to fetch memories");
      }
    } catch {
      setError("Error loading memories");
    } finally {
      setLoading(false);
    }
  };


 // ✅ Function for adding a memory
  const addMemory = async (newMemory) => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/memory/add-memories",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMemory),
          credentials: "include",
        }
      );

      if (response.ok) {
        fetchMemories();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to add memory");
      }
    } catch {
      setError("Error adding memory");
    }
  };
// Function for deleting a memory
  const deleteMemory = async (memoryId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/memory/delete/${memoryId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        fetchMemories();
      } else {
        setError("Failed to delete memory");
      }
    } catch {
      setError("Error deleting memory");
    }
  };
    // ✅ Image loading function
    const uploadImage = async (imageFile) => {
      const formData = new FormData();
      formData.append("image", imageFile);
  
      try {
        const response = await fetch("http://localhost:3001/api/memory/upload-image", {
          method: "POST",
          body: formData,
        });
  
        const data = await response.json();
  
        if (!response.ok) throw new Error(data.error || "Failed to upload image.");
  
        return data.imageUrl; // ✅ Возвращаем URL загруженного фото
      } catch (error) {
        console.error("Image upload error:", error);
        throw error;
      }
    };
  
   // ✅ Delete image function
    const deleteImage = async (imageUrl) => {
      try {
        const response = await fetch("http://localhost:3001/api/memory/delete-image", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl }),
        });
  
        const data = await response.json();
  
        if (!response.ok) throw new Error(data.error || "Failed to delete image.");
        
        console.log("Image deleted successfully");
      } catch (error) {
        console.error("Image deletion error:", error);
        throw error;
      }
    };
    // ✅ Function for updating a memory

  const updateMemory = async (memoryId, updatedMemory) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/memory/${memoryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedMemory),
          credentials: "include",
        }
      );

      if (response.ok) {
        fetchMemories();
      } else {
        setError("Failed to update memory");
      }
    } catch {
      setError("Error updating memory");
    }
  };

  return (
    <MemoryContext.Provider
      value={{
        memories,
        loading,
        error,
        addMemory,
        deleteMemory,
        updateMemory,
        fetchMemories,
        uploadImage,
         deleteImage,
      }}
    >
      {children}
    </MemoryContext.Provider>
  );
};
export { MemoryContext, MemoryProvider };