import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [imageUrl, setImageUrl] = useState("/default-avatar.png");
  const [backgroundImage, setBackgroundImage] = useState("");

  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await fetch("/api/profile", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(true);
          setUsername(data.username);
          setImageUrl(data.imageUrl || "/default-avatar.png");
        } else {
          setIsLoggedIn(false);
          setUsername("");
          setImageUrl("/default-avatar.png");
        }
      } catch (error) {
        console.error("Error validating token:", error);
        setIsLoggedIn(false);
        setUsername("");
        setImageUrl("/default-avatar.png");
      }
    };
    checkToken();
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    const savedBackground = localStorage.getItem("backgroundImage");
    if (savedBackground) {
      setBackgroundImage(savedBackground);
      document.body.style.backgroundImage = `url(${savedBackground})`; // Применяем фон сразу!
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
    }
  }, []);

  const updateBackground = (newBg) => {
    console.log("Setting background to:", newBg);
    setBackgroundImage(newBg);
    if (newBg) {
    localStorage.setItem("backgroundImage", newBg);
    document.body.style.backgroundImage = `url(${newBg})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
  } else {
    localStorage.removeItem("backgroundImage");
    document.body.style.backgroundImage = "none"; // Убираем фон
    document.body.style.backgroundColor = "#f7f9fa"; // Цвет по умолчанию
  }
};

  const logout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setIsLoggedIn(false);
        setUsername("");
        setImageUrl("/default-avatar.png");
        navigate("/login");
      } else {
        console.error("Logout error:", response.statusText);
      }
    } catch (error) {
      console.error("Network error during logout:", error);
    }
  };

  const updateProfile = (newUsername, newImageUrl) => {
    setUsername(newUsername);
    setImageUrl(newImageUrl || "/default-avatar.png");
  };

  const value = {
    isLoggedIn,
    setIsLoggedIn,
    username,
    setUsername,
    imageUrl,
    setImageUrl,
    logout,
    updateProfile,
    backgroundImage,
    updateBackground,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider, AuthContext };

