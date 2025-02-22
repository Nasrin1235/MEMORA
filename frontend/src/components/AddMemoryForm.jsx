import { useState, useEffect, useContext } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { MemoryContext } from "../context/MemoryContext";
import "../styles/AddMemoryForm.css";

const AddMemoryForm = ({ onClose }) => {
  const { addMemory, uploadImage } = useContext(MemoryContext);
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [memory, setMemory] = useState("");
  const [visitedLocation, setVisitedLocation] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [visitedDate, setVisitedDate] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [lastQuery, setLastQuery] = useState("");

  useEffect(() => {
    if (visitedLocation.length < 3) {
      setSuggestions([]);
      return;
    }

    if (visitedLocation === lastQuery) return; // don't send the same request again
    setLastQuery(visitedLocation);

    const controller = new AbortController();
    const signal = controller.signal;

    // use a delay to avoid sending too many requests
    const delayFetch = setTimeout(() => {
      fetchCitySuggestions(visitedLocation, signal);
    }, 800);

    return () => {
      clearTimeout(delayFetch);
      controller.abort();
    };
  }, [visitedLocation]);

  const fetchCitySuggestions = async (query, signal) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(
          query
        )}`,
        { headers: { "Accept-Language": "en" }, signal }
      );

      if (!response.ok) throw new Error("Request error");

      const data = await response.json();

      const citySuggestions = data
        .map((item) => {
          const city =
            item.address.city ||
            item.address.town ||
            item.address.village ||
            item.address.municipality;
          const country = item.address.country;
          return city && country ? { name: `${city}, ${country}` } : null;
        })
        .filter(Boolean);

      const uniqueCities = Array.from(
        new Set(citySuggestions.map((s) => s.name))
      ).map((name) => citySuggestions.find((s) => s.name === name));

      setSuggestions(uniqueCities);
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Request aborted:", query);
      } else {
        console.error("Error fetching cities:", error);
      }
    }
  };

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
    if (!title || !memory || !visitedLocation || !visitedDate) {
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
        memorie: memory,
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

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();

            if (data.address) {
              const city =
                data.address.city ||
                data.address.town ||
                data.address.village ||
                "Unknown City";
              const country = data.address.country || "Unknown Country";
              setVisitedLocation(`${city}, ${country}`);
            } else {
              setError("Could not determine your location.");
            }
          } catch (error) {
            console.error("Error with reverse geocoding:", error);
            setError("Failed to get location details.");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setError(
            "Failed to get location. Ensure you allowed location access."
          );
        }
      );
    } else {
      setError("Your browser does not support geolocation.");
    }
  };

  return (
    <div className="addMemoryForm-modal-overlay">
      <div className="addMemoryForm-modal">
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <h2 className="addForm-h2">Adding memory</h2>
          <input
            type="text"
            placeholder="Title (required)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Memory description (required)"
            value={memory}
            onChange={(e) => setMemory(e.target.value)}
            required
          />
          <input
            type="text"
            className="location-input-city"
            placeholder="Enter City (e.g. Paris, France)"
            value={visitedLocation}
            onChange={(e) => setVisitedLocation(e.target.value)}
            required
          />
          {suggestions.length > 0 && (
            <ul className="addMemoryForm-suggestions-list">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setVisitedLocation(suggestion.name);
                    setSuggestions([]);
                  }}
                  className="addMemoryForm-suggestion-item"
                >
                  {suggestion.name}
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            className="location-button"
            onClick={getCurrentLocation}
          >
            Use Current Location
          </button>
          <input
            type="date"
            value={visitedDate}
            onChange={(e) => setVisitedDate(e.target.value)}
            required
          />
          <label className="custom-file-upload">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
            <span className="upload-icon">📂</span> Upload Image
          </label>
          {image && (
            <img
              src={image}
              alt="Preview"
              className="addMemoryForm-uploaded-image"
            />
          )}
          <div className="button-group">
            <button type="submit">Add Memory</button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemoryForm;
