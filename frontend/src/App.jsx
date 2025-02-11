import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import HomePage from "./pages/Homepage";
import CalendarPage from "./pages/CalendarPage";
import AtlasPage from "./pages/AtlasPage";
import FavoritesPage from "./pages/FavoritesPage";
import { AuthProvider } from "./context/AuthContext";
import MediaPage from "./pages/MediaPage";


function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/atlas" element={<AtlasPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/media" element={<MediaPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
