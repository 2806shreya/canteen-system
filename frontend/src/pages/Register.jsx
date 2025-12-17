// frontend/src/pages/Register.jsx

import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/api/auth/register`, form);
      setMessage("Registered! Now go to Login.");
      setIsError(false);
    } catch (err) {
      console.error(err);
      setMessage("Registration failed. Try again.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">
            Sign up to start ordering from the campus canteen.
          </p>
        </div>

        {message && (
          <div className={isError ? "auth-error" : "auth-success"}>
            {message}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label">Name</label>
            <input
              name="name"
              type="text"
              className="auth-input"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

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
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
}
