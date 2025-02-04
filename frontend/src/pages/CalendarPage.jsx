import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Sidebar from "../components/Sidebar";
import "../styles/CalendarPage.css";

const CalendarPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Загружаем мемори из localStorage
    const storedMemories = JSON.parse(localStorage.getItem("memories")) || [];

    // Конвертируем их в формат событий для FullCalendar
    const formattedEvents = storedMemories.map((memory) => ({
      id: memory._id,
      title: memory.title,
      start: memory.visitedDate, // Используем дату посещения
    }));

    setEvents(formattedEvents);
  }, []);

  return (
    <div className="calendar-layout">
     <Sidebar setFilteredMemories={() => {}} />
      <div className="calendar-container">
        <h2>📅 Calendar</h2>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          image = {events.imageUrl}
          // eventClick={(e) => {
          //   const memoryId = e.event.id;
          //   const storedMemories = JSON.parse(localStorage.getItem("memories")) || [];
          //   const selectedMemory = storedMemories.find((memory) => memory._id === memoryId);
          //   alert(`📝 Memory: ${selectedMemory.title}\n📅 Date: ${selectedMemory.visitedDate}`);
          // }}
          editable={false}
          selectable={false}
        />
      </div>
    </div>
  );
};

export default CalendarPage;
