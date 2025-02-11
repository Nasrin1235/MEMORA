import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [imageUrl, setImageUrl] = useState("/default-avatar.png");

  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/profile", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(true);
          setUsername(data.username);
          setImageUrl(data.imageUrl || "/default-avatar.png"); // 🔥 Устанавливаем аватар
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

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/logout", {
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider, AuthContext };

