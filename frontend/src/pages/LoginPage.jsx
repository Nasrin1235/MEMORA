import { useState, useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setIsLoggedIn, setUsername, setImageUrl, updateBackground } = useContext(AuthContext);

  const mutation = useMutation({
    mutationFn: async ({ email, password }) => {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to login");
      }

      return response.json();
    },
    onSuccess: async (data) => {
      setIsLoggedIn(true);
      setUsername(data.username);

      try {
        const profileResponse = await fetch("/api/profile", {
          method: "GET",
          credentials: "include",
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setImageUrl(profileData.imageUrl || "/default-avatar.png");

          
          localStorage.removeItem("backgroundImage");

          if (profileData.backgroundImage) {
            updateBackground(profileData.backgroundImage);
            localStorage.setItem("backgroundImage", profileData.backgroundImage);
            document.body.style.backgroundImage = `url(${profileData.backgroundImage})`;
          } else {
            document.body.style.backgroundImage = "none";
          }
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }

     
      queryClient.invalidateQueries(["memories"]);

      navigate("/main");
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <section className="login-page">
      <div className="login-image">
        <img src="r-l.jpg" alt="Login Illustration" className="image" />
        <div className="logo-text">MEMORA</div>
      </div>
      <div className="login-form">
        <h2 className="login-title">Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <div className="input-field">
              <label className="input-label">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="text-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="input-field">
              <label className="input-label">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="text-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <button type="submit" className="submit-button" disabled={mutation.isLoading}>
              {mutation.isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;




