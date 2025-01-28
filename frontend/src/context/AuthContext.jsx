import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/validate-token",
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(true);
          setUsername(data.username);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error validating token:", error);
        setIsLoggedIn(false);
      }
    };
    checkToken();
  }, []);

  const value = {
    isLoggedIn,
    setIsLoggedIn,
    username,
    setUsername,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider, AuthContext };
