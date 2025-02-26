import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import "../styles/CalendarPage.css";

const fetchMemories = async () => {
  const response = await fetch("/api/memory/get", {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch memories");
  return response.json();
};

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedMemory, setSelectedMemory] = useState(null);

  useEffect(() => {
    const loadMemories = async () => {
      try {
        const memoriesFromServer = await fetchMemories();
        const formattedEvents = memoriesFromServer.map((memory) => ({
          id: memory._id,
          title: memory.title,
          start: memory.visitedDate,
          extendedProps: {
            description: memory.memorie,
            location: memory.visitedLocation,
            cityName: memory.cityName,
            imageUrl: memory.imageUrl,
          },
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error loading memories:", error);
      }
    };

    loadMemories();
  }, []);

  const handleEventClick = (e) => {
    setSelectedMemory({
      title: e.event.title,
      description: e.event.extendedProps.description,
      location: e.event.extendedProps.location,
      cityName: e.event.extendedProps.cityName,
      visitedDate: e.event.start,
      imageUrl: e.event.extendedProps.imageUrl,
    });
  };

  return (
    <div className="calendar-layout">
      <Sidebar />
      <div className="calendar-container">
        {events.length === 0 ? (
          <p>Loading events...</p>
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            dayMaxEventRows={3}
            moreLinkText="More"
            eventContent={(arg) => (
              <div className="calendar-event">
                {arg.event.extendedProps.imageUrl && (
                  <img
                    src={arg.event.extendedProps.imageUrl}
                    alt={arg.event.title}
                    className="calendar-thumbnail"
                  />
                )}
                <span>{arg.event.title}</span>
              </div>
            )}
            eventClick={handleEventClick}
            editable={false}
            selectable={false}
            height="100%"
            
            headerToolbar={{
              left: "prevYear,prev,next,nextYear today",
              center: "title",
              right: "dayGridMonth,dayGridWeek,dayGridDay",
            }}
          />
        )}
      </div>

      {selectedMemory && (
        <div className="calendar-modal-overlay" onClick={() => setSelectedMemory(null)}>
          <div className="calendar-modal" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedMemory(null)}
              className="calendar-cancel-btn">
              <X size={24} />
            </button>
            <h2>{selectedMemory.title}</h2>
            {selectedMemory.imageUrl && (
              <img
                src={selectedMemory.imageUrl}
                alt={selectedMemory.title}
                className="calendar-modal-image"
              />
            )}
            <p>
              <strong>Date:</strong>{" "}
              {new Date(selectedMemory.visitedDate).toLocaleDateString()}
            </p>
            <p>
              <strong> Location:</strong>{" "}
              {selectedMemory.cityName || "Unknown"}
            </p>
            <p className="parag">{selectedMemory.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;