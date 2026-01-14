import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { apiFetch } from "../../services/api";

const AuthPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";

      const body = isLogin
        ? { email, password }
        : { name, email, password };

      const data = await apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
      });

      localStorage.setItem("token", data.token);
      onLogin(data.user);
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">
            <CheckCircle2 size={32} color="white" />
          </div>
          <h1 className="auth-title">TaskFlow Pro</h1>
          <p className="auth-subtitle">Professional Task Management</p>
        </div>

        <div className="auth-box">
          <div className="auth-tabs">
            <button
              onClick={() => setIsLogin(true)}
              className={`auth-tab ${isLogin ? "active" : ""}`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`auth-tab ${!isLogin ? "active" : ""}`}
            >
              Register
            </button>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p style={{ color: "red", marginBottom: "0.5rem" }}>
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            className="btn-primary"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Sign In"
              : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
