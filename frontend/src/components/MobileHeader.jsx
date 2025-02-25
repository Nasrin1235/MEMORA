import { useState ,useRef} from "react";
import { Search, Plus } from "lucide-react";
import AddMemoryForm from "./AddMemoryForm";
import { useLocation } from "react-router-dom";
import "../styles/MobileHeader.css";

const MobileHeader = ({ onSearch }) => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  const dialogRef = useRef(null);

  const location = useLocation();
  const hiddenHeaderPaths = ["/login", "/register", "/", "/memory/:id"];

  if (hiddenHeaderPaths.includes(location.pathname) || location.pathname.startsWith("/memory/")) {
    return null;
  }

  const handleOpenForm = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

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
        onClick={handleOpenForm}
      >
        <Plus size={24} />
      </button>
      <AddMemoryForm dialogRef={dialogRef} onClose={() => dialogRef.current?.close()} />
    </div>
  );
};

export default MobileHeader;
