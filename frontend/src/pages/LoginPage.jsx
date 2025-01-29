import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/LoginPage.css"


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setIsLoggedIn, setUsername } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setError("");
        setIsLoggedIn(true);
        setUsername(data.username);
        navigate("/main");
      } else {
        setError(data.error || "Failed to login. Please try again.");
      }
    } catch (error) {
      setError(error,"An unexpected error occurred. Please try again later.");
    }
  };

  const handleNavigateToRegister = () => {
    navigate("/register");
  };

  return (
    <section className="login-page">
      <div className="login-image">
        <img src="Register.jpg" alt="Login Illustration" className="image" />
        <div className="logo-text">MEMORA</div>
      </div>

      <div className="login-form">
        <h2 className="login-title">Welcome Back</h2>
        <form onSubmit={handleLogin}>
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
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="submit-button">
              Login
            </button>
          </div>
        </form>
        <p className="register-prompt">Dont have an account?</p>
        <button onClick={handleNavigateToRegister} className="register-button">
          Go to Register
        </button>
      </div>
    </section>
  );
};

export default LoginPage;

