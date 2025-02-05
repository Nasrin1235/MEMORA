import "../styles/AtlasPage.css";
import "leaflet/dist/leaflet.css";
import { useState, useEffect, useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon, divIcon, point } from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../context/AuthContext";

const customIcon = new Icon({
  iconUrl: markerIconPng,
  iconSize: [25, 41],
  shadowUrl: markerShadowPng,
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const createClusterCustomIcon = (cluster) => {
  return new divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: point(33, 33, true),
  });
};

const AtlasPage = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      console.warn("User is not authenticated. Redirecting to login.");
      window.location.href = "/login";
      return;
    }

    const fetchMemories = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/memory/get", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch memories: ${response.status} ${response.statusText}`);
        }

        const memories = await response.json();
        console.log("Fetched Memories:", memories);

        const formattedMarkers = memories
          .map((memory) => {
            console.log("Memory Data:", memory);
            if (!memory.visitedLocation || typeof memory.visitedLocation !== "string") {
              console.warn(`Invalid visitedLocation for memory:`, memory);
              return null;
            }

            const locationArray = memory.visitedLocation.split(",").map(Number);
            if (locationArray.length !== 2 || isNaN(locationArray[0]) || isNaN(locationArray[1])) {
              console.warn(`Invalid coordinates:`, memory.visitedLocation);
              return null;
            }

            return {
              geocode: locationArray,
              popUp: memory.title,
            };
          })
          .filter(marker => marker !== null);

        console.log("Markers after processing:", formattedMarkers);
        setMarkers(formattedMarkers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching memories for map:", error);
        setAuthError(true);
        setLoading(false);
      }
    };

    fetchMemories();
  }, [isLoggedIn]);

  return (
    <div className="atlas-layout" style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div className="atlas-map-container" style={{ flexGrow: 1, height: "100vh" }}>
        {loading ? (
          <p>Loading...</p>
        ) : authError ? (
          <p>⚠️ Unable to load data. Please login again.</p>
        ) : (
          <MapContainer center={[48.8566, 2.3522]} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterCustomIcon}>
              {markers.length > 0 ? (
                markers.map((marker, index) => (
                  <Marker key={index} position={marker.geocode} icon={customIcon}>
                    <Popup>{marker.popUp}</Popup>
                  </Marker>
                ))
              ) : (
                console.warn("No markers found!")
              )}
            </MarkerClusterGroup>
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default AtlasPage;











