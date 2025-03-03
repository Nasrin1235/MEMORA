import { useContext, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import Sidebar from "../components/Sidebar";
import { MemoryContext } from "../context/MemoryContext";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "../styles/AtlasPage.css";
import { X } from "lucide-react";

const customIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const AtlasPage = () => {
  const { memories } = useContext(MemoryContext) || { memories: [] };
  const [selectedMemory, setSelectedMemory] = useState(null);

  return (
    <div className="atlas-page">
      <Sidebar setFilteredMemories={() => {}} />
      <div className="map-container">
        <MapContainer
          center={[51.505, -0.09]}
          zoom={5}
          style={{ height: "100vh", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <MarkerClusterGroup>
            {memories &&
              memories.length > 0 &&
              memories.map((memory) => {
                if (!memory.visitedLocation || !Array.isArray(memory.visitedLocation) || memory.visitedLocation.length < 2) {
                  return null;
                }
                const [lat, lng] = memory.visitedLocation;

                return (
                  <Marker
                    key={`${lat}-${lng}-${memory._id}`}
                    position={[lat, lng]}
                    icon={customIcon}
                    eventHandlers={{ click: () => setSelectedMemory(memory) }}
                  >
                  </Marker>
                );
              })}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
      {selectedMemory && (
        <div className="atlas-modal-overlay" onClick={() => setSelectedMemory(null)}>
          <div className="atlas-modal" onClick={(e) => e.stopPropagation()}>
            <button className="atlas-close-btn" onClick={() => setSelectedMemory(null)}>
              <X size={24} />
            </button>
            <h2>{selectedMemory.title}</h2>
            {selectedMemory.imageUrl && (
              <img
                src={selectedMemory.imageUrl}
                alt={selectedMemory.title}
                className="atlas-modal-image"
              />
            )}
            <p>
              <strong>Date:</strong> {new Date(selectedMemory.visitedDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Location:</strong> {selectedMemory.cityName || "Unknown"}
            </p>
            <p className="atlas-modal-description">{selectedMemory.memorie}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AtlasPage;

