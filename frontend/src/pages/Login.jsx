// frontend/src/pages/Login.jsx

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api";
import { saveAuth } from "../auth";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, form);
      saveAuth(res.data.token, res.data.user);
      navigate("/menu");
    } catch (err) {
      setMessage("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">
            Sign in to continue ordering from the campus canteen.
          </p>
        </div>

        {message && <div className="auth-error">{message}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input
              name="email"
              type="email"
              className="auth-input"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input
              name="password"
              type="password"
              className="auth-input"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
