import { useState, useContext } from "react";
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

  // Function to fetch coordinates from Nominatim API
  const fetchCoordinates = async (location) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
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

  // Function to fetch city name suggestions
  const fetchCitySuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(query)}`,
        {
          headers: {
            "Accept-Language": "en",
          },
        }
      );
      const data = await response.json();

      const citySuggestions = data
        .map((item) => {
          const city = item.address.city || item.address.town || item.address.village || item.address.municipality;
          const country = item.address.country;

          if (city && country) {
            return {
              name: `${city}, ${country}`,
              lat: item.lat,
              lon: item.lon,
            };
          }
          return null;
        })
        .filter(Boolean); // Remove empty results

      setSuggestions(citySuggestions);
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
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
        memory,
        cityName: visitedLocation, // Save city name
        visitedLocation: coordinates, // Save coordinates
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

  // Function to get user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Reverse geocoding request to Nominatim API
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();

            if (data.address) {
              const city = data.address.city || data.address.town || data.address.village || "Unknown City";
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
          setError("Failed to get location. Ensure you allowed location access.");
        }
      );
    } else {
      setError("Your browser does not support geolocation.");
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
            value={memory}
            onChange={(e) => setMemory(e.target.value)}
            required
          />

          {/* City input field with autocomplete */}
          <input
            type="text"
            placeholder="Enter City (e.g. Paris, France)"
            value={visitedLocation}
            onChange={(e) => {
              setVisitedLocation(e.target.value);
              fetchCitySuggestions(e.target.value);
            }}
            required
          />
          <button type="button" onClick={getCurrentLocation}>
            Use Current Location
          </button>

          {/* Suggestions dropdown */}
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setVisitedLocation(suggestion.name);
                    setSuggestions([]); // Clear list after selection
                  }}
                  className="suggestion-item"
                >
                  {suggestion.name}
                </li>
              ))}
            </ul>
          )}

          <input
            type="date"
            value={visitedDate}
            onChange={(e) => setVisitedDate(e.target.value)}
            required
          />

          <input type="file" accept="image/*" onChange={handleImageChange} />

          {image && <img src={image} alt="Preview" className="uploaded-image" />}
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


