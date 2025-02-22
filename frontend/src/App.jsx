import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import HomePage from "./pages/Homepage";
import CalendarPage from "./pages/CalendarPage";
import AtlasPage from "./pages/AtlasPage";
import FavoritesPage from "./pages/FavoritesPage";
import { AuthProvider } from "./context/AuthContext";
import MediaPage from "./pages/MediaPage";
import MobileHeader from "./components/MobileHeader";
import MemoryDetailPage from "./pages/MemoryDetailPage";



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
        <Route path="/main" element={<MainPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/atlas" element={<AtlasPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/media" element={<MediaPage />} />
        <Route path="/memory/:id" element={<MemoryDetailPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
