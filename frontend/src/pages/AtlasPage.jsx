import { useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Sidebar from "../components/Sidebar";
import { MemoryContext } from "../context/MemoryContext";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "../styles/AtlasPage.css";


const customIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});


const AtlasPage = () => {
  
  const { memories } = useContext(MemoryContext) || { memories: [] };

  console.log("Loaded memories:", memories);

  return (
    <div className="atlas-page">
      <Sidebar setFilteredMemories={() => {}} />

      <div className="map-container">
        <MapContainer center={[51.505, -0.09]} zoom={5} style={{ height: "100vh", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {memories &&
            memories.length > 0 &&
            memories.map((memory) => {
              if (!memory.visitedLocation || !Array.isArray(memory.visitedLocation) || memory.visitedLocation.length < 2) {
                console.warn(`Skipping memory "${memory.title}" due to invalid coordinates:`, memory.visitedLocation);
                return null;
              }

              const [lat, lng] = memory.visitedLocation;

              return (
                <Marker key={memory._id} position={[lat, lng]} icon={customIcon}>
                  <Popup>
                    <h3>{memory.title}</h3>
                    <p>{memory.memorie}</p>
                    {memory.imageUrl && (
                      <img src={memory.imageUrl} alt={memory.title} style={{ width: "100px", borderRadius: "8px" }} />
                    )}
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>
      </div>
    </div>
  );
};

export default AtlasPage;

