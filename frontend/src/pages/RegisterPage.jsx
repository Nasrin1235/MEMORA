import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RegisterPage.css";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("register:", username, email, password);

    try {
      const response = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
        credentials: "include",
      });

      const data = await response.json();
      console.log("Response from server:", data);

      if (response.ok) {
        setError("");
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", username);
        navigate("/");
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleNavigateToLogin = () => {
    navigate("/login");
  };

  return (
    <section className="register-page">
      <div className="register-image">
  <img
    src="Register.jpg"
    alt="Register Illustration"
    className="image"
  />
  <div className="logo-text">MEMORA</div>
</div>

      <div className="register-form">
        <h2 className="register-title">Start Writing</h2>
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <div className="input-field">
              <label className="input-label">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                className="text-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
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
                autoComplete="new-password"
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="submit-button">
              Register
            </button>
          </div>
        </form>
        <p className="login-prompt">Already registered?</p>
        <button onClick={handleNavigateToLogin} className="login-button">
          Go to Login
        </button>
      </div>
    </section>
  );
};




export default RegisterPage;
