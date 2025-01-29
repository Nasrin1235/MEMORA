// import { useState, useEffect } from "react";
// import "../styles/MemoryList.css";

// const MemoryList = () => {
//   const [memories, setMemories] = useState([]);
//   const [error, setError] = useState({});
//   const [expanded, setExpanded] = useState({});

//   useEffect(() => {
//     const fetchMemories = async () => {
//       try {
//         const response = await fetch("http://localhost:3001/api/memory/get", {
//           method: "GET",
//           credentials: "include",
//         });

//         const data = await response.json();
//         if (response.ok) {
//           setMemories(data);
//         } else {
//           setError(data.error || "Failed to fetch memories.");
//         }
//       } catch (error) {
//         setError("Error loading memories.");
//       }
//     };

//     fetchMemories();
//   }, []);

//   const toggleExpand = (id) => {
//     setExpanded((prev) => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//   };

//   return (
//     <div className="memory-list">
//       <h2>📖 My Memories</h2>
//       {error && <p className="error-message">{JSON.stringify(error)}</p>}
//       {memories.length === 0 ? (
//         <p>No memories yet. Start adding some!</p>
//       ) : (
//         <ul>
//           {memories.map((memory) => (
//             <li key={memory._id} className="memory-item">
//               {memory.imageUrl && (
//                 <img src={memory.imageUrl} alt={memory.title} className="memory-image" />
//               )}
//               <div className="memory-content">
//                 <h3>📌 {memory.title}</h3>
//                 <p className="memory-meta">📅 {new Date(memory.visitedDate).toLocaleDateString()}</p>
//                 <p><strong>📍 Location:</strong> {Array.isArray(memory.visitedLocation) ? memory.visitedLocation.join(", ") : "Unknown"}</p>

//                 {/* Обрезаем текст только если "Read more" не нажато */}
//                 <p className="memory-text">
//                   {expanded[memory._id] ? memory.memorie : `${memory.memorie.slice(0, 150)}...`}
//                 </p>

//                 {/* Кнопка "Read more" / "Show less" */}
//                 {memory.memorie.length > 150 && (
//                   <span className="show-more" onClick={() => toggleExpand(memory._id)}>
//                     {expanded[memory._id] ? "Show less" : "Read more"}
//                   </span>
//                 )}
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default MemoryList;
import { useState, useEffect } from "react";
import "../styles/MemoryList.css";

const MemoryList = () => {
  const [memories, setMemories] = useState([]); // Храним истории
  const [error, setError] = useState({});
  const [expanded, setExpanded] = useState({}); // Отслеживаем развернутые истории

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/memory/get", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();
        if (response.ok) {
          setMemories(data);
        } else {
          setError(data.error || "Failed to fetch memories.");
        }
      } catch  {
        setError("Error loading memories.");
      }
    };

    fetchMemories();
  }, []);

  const toggleExpand = (id) => {
    setExpanded((prevState) => {
      const newState = { ...prevState, [id]: !prevState[id] };
      console.log("Toggled expand for:", id, "New state:", newState);
      return newState;
    });
  };

  return (
    <div className="memory-list">
      <h2>📖 My Memories</h2>
      {/* {error && <p className="error-message">{JSON.stringify(error)}</p>} */}
      {memories.length === 0 ? (
        <p>No memories yet. Start adding some!</p>
      ) : (
        <ul>
          {memories.map((memory) => {
            const isExpanded = expanded[memory._id] || false; // Проверяем, развернуто ли

            return (
              <li key={memory._id} className="memory-item">
                {memory.imageUrl && (
                  <img src={memory.imageUrl} alt={memory.title} className="memory-image" />
                )}
                <div className="memory-content">
                  <h3>📌 {memory.title}</h3>
                  <p className="memory-meta">📅 {new Date(memory.visitedDate).toLocaleDateString()}</p>
                  <p><strong>📍 Location:</strong> {Array.isArray(memory.visitedLocation) ? memory.visitedLocation.join(", ") : "Unknown"}</p>

                  {/* ✅ Теперь текст отображается корректно */}
                  <p className="memory-text">
                    {isExpanded ? memory.memorie : `${memory.memorie.slice(0, 150)}...`}
                  </p>

                  {/* ✅ Кнопка "Read more" теперь работает правильно */}
                  {memory.memorie.length > 150 && (
                    <span className="show-more" onClick={() => toggleExpand(memory._id)}>
                      {isExpanded ? "Show less" : "Read more"}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MemoryList;





