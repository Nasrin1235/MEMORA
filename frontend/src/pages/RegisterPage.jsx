import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import "../styles/RegisterPage.css";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async ({ username, email, password }) => {
      const response = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to register");
      }

      return response.json();
    },
    onSuccess: () => {
      navigate("/login");
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ username, email, password });
  };

  return (
    <section className="register-page">
      <div className="register-image">
        <img src="r-l.jpg" alt="Register Illustration" className="image" />
        <div className="logo-text">MEMORA</div>
      </div>
      <div className="register-form">
        <h2 className="register-title">Start Writing</h2>
        <form onSubmit={handleSubmit}>
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
            <button type="submit" className="submit-button" disabled={mutation.isLoading}>
              {mutation.isLoading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default RegisterPage;

