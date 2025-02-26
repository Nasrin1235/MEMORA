import { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const MemoryContext = createContext();

const fetchMemories = async () => {
  const response = await fetch("/api/memory/get", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to fetch memories");

  const data = await response.json();
  return data;
};


const MemoryProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const { data: memories, error, isLoading } = useQuery({
    queryKey: ["memories"],
    queryFn: fetchMemories,
  });

  const addMemory = useMutation({
    mutationFn: async (newMemory) => {
      console.log("Sending to API:", newMemory); 
      const response = await fetch("/api/memory/add-memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMemory),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to add memory");
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["memories"] }),
  });

  const updateMemory = useMutation({
    mutationFn: async ({ id, updatedMemory }) => {
      const response = await fetch(`/api/memory/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedMemory),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to update memory");
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["memories"] }),
  });

  const deleteMemory = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`/api/memory/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete memory");
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["memories"] }),
  });

  const uploadImage = useMutation({
    mutationFn: async (formData) => {
      const response = await fetch("/api/memory/upload-image", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to upload image");
      return response.json();
    },
  });

  const deleteImage = useMutation({
    mutationFn: async (imageUrl) => {
      const response = await fetch("/api/memory/delete-image", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });
      if (!response.ok) throw new Error("Failed to delete image");
      return response.json();
    },
  });

  return (
    <MemoryContext.Provider
      value={{
        memories,
        isLoading,
        error,
        addMemory,
        updateMemory,
        deleteMemory,
        uploadImage,
        deleteImage,
      }}
    >
      {children}
    </MemoryContext.Provider>
  );
};

const useMemoryContext = () => {
  return useContext(MemoryContext);
};

export { MemoryContext, MemoryProvider, useMemoryContext };


