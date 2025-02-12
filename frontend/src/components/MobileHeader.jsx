import { useState } from "react";
import { Search, Plus } from "lucide-react";
import AddMemoryForm from "./AddMemoryForm"; // Импортируем форму
import "../styles/MobileHeader.css";

const MobileHeader = () => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchText, setSearchText] = useState(""); // Управляем текстом поиска

  return (
    <div className="mobile-header">
      {/* Кнопка поиска (🔍) */}
      <button className="mobile-search-toggle" onClick={() => setSearchVisible(!searchVisible)}>
        <Search size={22} />
      </button>

      {/* Поле поиска (появляется при клике) */}
      {searchVisible && (
        <input
          type="text"
          className="mobile-search-input"
          placeholder="Search memories..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      )}

      {/* Кнопка Add Story (➕) */}
      <button className="mobile-add-story-btn" onClick={() => setShowForm(true)}>
        <Plus size={24} />
      </button>

      {/* Форма добавления истории (открывается по клику на ➕) */}
      {showForm && <AddMemoryForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default MobileHeader;
