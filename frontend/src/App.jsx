import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import HomePage from "./pages/Homepage";
import CalendarPage from "./pages/CalendarPage";
import AtlasPage from "./pages/AtlasPage";
import FavoritesPage from "./pages/FavoritesPage";
import MediaPage from "./pages/MediaPage";
import MemoryDetailPage from "./pages/MemoryDetailPage";
import AboutUs from "./pages/AboutUs";
import MobileHeader from "./components/MobileHeader";
import { AuthProvider } from "./context/AuthContext";


const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isLoggedIn === false) {
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, loading, navigate]);

  if (loading) return null; 

  return isLoggedIn ? children : null;
};

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <AuthProvider>
      {isMobile && <MobileHeader />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/main" element={<ProtectedRoute><MainPage /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
        <Route path="/atlas" element={<ProtectedRoute><AtlasPage /></ProtectedRoute>} />
        <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
        <Route path="/media" element={<ProtectedRoute><MediaPage /></ProtectedRoute>} />
        <Route path="/memory/:id" element={<ProtectedRoute><MemoryDetailPage /></ProtectedRoute>} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;

