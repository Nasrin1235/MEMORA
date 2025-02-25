import { useState, useEffect, useContext } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { MemoryContext } from "../context/MemoryContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import "../styles/AddMemoryForm.css";

const AddMemoryForm = ({ dialogRef, onClose }) => {
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
 


  const resetForm = () => {
    setTitle("");
    setMemory("");
    setVisitedLocation("");
    setCoordinates(null);
    setVisitedDate("");
    setImage(null);
    setImageUrl("");
    setError("");
    setSuggestions([]);
  };

  const fetchLocationData = async (query, signal) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(
          query
        )}`,
        { headers: { "Accept-Language": "en" }, signal }
      );

      if (!response.ok) throw new Error("Request error");

      const data = await response.json();

      const locationResults = data
        .map((item) => {
          const city =
            item.address.city ||
            item.address.town ||
            item.address.village ||
            item.address.municipality;
          const country = item.address.country;
          return city && country
            ? {
                name: `${city}, ${country}`,
                lat: parseFloat(item.lat),
                lon: parseFloat(item.lon),
              }
            : null;
        })
        .filter(Boolean);

      const uniqueLocations = Array.from(
        new Set(locationResults.map((s) => s.name))
      ).map((name) => locationResults.find((s) => s.name === name));

      setSuggestions(uniqueLocations);
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error fetching location data:", error);
      }
    }
  };

  useEffect(() => {
    if (visitedLocation.length < 3) {
      setSuggestions([]);
      return;
    }

    if (visitedLocation === lastQuery) return;
    setLastQuery(visitedLocation);

    const controller = new AbortController();
    const signal = controller.signal;

    const delayFetch = setTimeout(() => {
      fetchLocationData(visitedLocation, signal);
    }, 800);

    return () => {
      clearTimeout(delayFetch);
      controller.abort();
    };
  }, [visitedLocation]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setError("Invalid file type. Only JPEG, PNG, and GIF are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size too large. Maximum allowed is 5MB.");
      return;
    }

    const objectURL = URL.createObjectURL(file);
    setImage(objectURL);
    setImageUrl(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !memory || !visitedLocation || !visitedDate) {
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
        memorie: memory,
        cityName: visitedLocation,
        visitedLocation: coordinates,
        visitedDate,
        imageUrl: uploadedImageUrl,
      });

      queryClient.invalidateQueries(["memories"]);

      resetForm();
      handleClose();
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
              setCoordinates([latitude, longitude]);
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

  const handleClose = () => {
    resetForm();
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    onClose();
  };

  return (
    <dialog ref={dialogRef} className="addMemoryForm-dialog">
     
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
                    setCoordinates([suggestion.lat, suggestion.lon]);
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

          <DatePicker
            selected={visitedDate ? new Date(visitedDate) : null}
            onChange={(date) => setVisitedDate(date)}
            dateFormat="dd.MM.yyyy"
            className="custom-date-input"
          />
          <Calendar className="calendar-icon" size={20} />
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
          <button type="submit" className="add-memory">Add Memory</button>
          <button type="button" onClick={handleClose} className="cancel-add">
            Cancel
          </button>
        </form>

    </dialog>
  );
};

export default AddMemoryForm;
