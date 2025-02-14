import { useState } from "react";
import { Search, Plus } from "lucide-react";
import AddMemoryForm from "./AddMemoryForm";
import { useLocation } from "react-router-dom";
import "../styles/MobileHeader.css";

const MobileHeader = ({ onSearch }) => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchText, setSearchText] = useState("");

  const location = useLocation();
  const hiddenHeaderPaths = ["/login", "/register", "/"];

  if (hiddenHeaderPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <div className="mobile-header">
      <button
        className="mobile-search-toggle"
        onClick={() => setSearchVisible(!searchVisible)}
      >
        <Search size={22} />
      </button>

      {searchVisible && (
        <input
          type="text"
          className={`mobile-search-input ${searchVisible ? "visible" : ""}`}
          placeholder="Search memories..."
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            onSearch(e.target.value);
          }}
        />
      )}
      <button
        className="mobile-add-story-btn"
        onClick={() => setShowForm(true)}
      >
        <Plus size={24} />
      </button>

      {showForm && <AddMemoryForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default MobileHeader;
