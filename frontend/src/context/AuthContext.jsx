import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/validate-token", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          setIsLoggedIn(true);
          const data = await response.json();//
          setUsername(data.username);//
        } else {
          setIsLoggedIn(false);
          setUsername("");
        }
      } catch (error) {
        console.error("Error validating token:", error);
        setIsLoggedIn(false);
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
        navigate("/login");
      
       
     
      } else {
        console.error("Ошибка выхода:", response.statusText);
      }
    } catch (error) {
      console.error("Ошибка сети при выходе:", error);
    }
  };

  const value = {
    isLoggedIn,
    setIsLoggedIn,
    username,
    setUsername,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider, AuthContext };