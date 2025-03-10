import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null); 
  const [username, setUsername] = useState("");
  const [imageUrl, setImageUrl] = useState("/default-avatar.png");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [loading, setLoading] = useState(true); 

  const navigate = useNavigate();

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

          if (data.backgroundImage) {
            setBackgroundImage(data.backgroundImage);
            localStorage.setItem("backgroundImage", data.backgroundImage);
            document.body.style.backgroundImage = `url(${data.backgroundImage})`;
          } else {
            localStorage.removeItem("backgroundImage");
            document.body.style.backgroundImage = "none";
          }
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error validating token:", error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false); 
      }
    };

    checkToken();
  }, []);

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
        localStorage.removeItem("backgroundImage");
        document.body.style.backgroundImage = "none";
        navigate("/", { replace: true }); 
      } else {
        console.error("Logout error:", response.statusText);
      }
    } catch (error) {
      console.error("Network error during logout:", error);
    }
  };

  useEffect(() => {
    const savedBackground = localStorage.getItem("backgroundImage");
    if (savedBackground) {
      setBackgroundImage(savedBackground);
      document.body.style.backgroundImage = `url(${savedBackground})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
    }
  }, []);

  const updateBackground = (newBg) => {
    setBackgroundImage(newBg);
    if (newBg) {
      localStorage.setItem("backgroundImage", newBg);
      document.body.style.backgroundImage = `url(${newBg})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
    } else {
      localStorage.removeItem("backgroundImage");
      document.body.style.backgroundImage = "none";
      document.body.style.backgroundColor = "#f7f9fa";
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
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };


