// src/App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Menu from "./pages/Menu";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminMenu from "./pages/AdminMenu";
import AdminDashboard from "./pages/AdminDashboard";
import Orders from "./pages/Orders";
import "./Menu.css";
import { CartProvider } from "./CartContext";

function Navbar() {
  return (
    <header className="app-navbar">
      <div className="app-navbar-inner">
        <Link to="/menu" className="app-logo">
          Canteen
        </Link>
        <nav className="app-nav-links">
          <Link to="/menu" className="app-nav-link">
            Menu
          </Link>
          <Link to="/orders" className="app-nav-link">
            Orders
          </Link>
          <Link to="/admin/dashboard" className="app-nav-link">
            Admin
          </Link>
        </nav>
        <div className="app-nav-auth">
          <Link to="/login" className="app-nav-pill">
            Login
          </Link>
          <Link to="/register" className="app-nav-pill app-nav-pill-outline">
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}

function AppLayout({ children }) {
  return (
    <div className="app-root">
      <Navbar />
      <main className="app-main">
        <div className="app-main-inner">{children}</div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Auth routes */}
          <Route
            path="/login"
            element={
              <div className="app-auth-wrapper">
                <Login />
              </div>
            }
          />
          <Route
            path="/register"
            element={
              <div className="app-auth-wrapper">
                <Register />
              </div>
            }
          />

          {/* Main app routes */}
          <Route
            path="/menu"
            element={
              <AppLayout>
                <Menu />
              </AppLayout>
            }
          />
          <Route
            path="/orders"
            element={
              <AppLayout>
                <Orders />
              </AppLayout>
            }
          />
          <Route
            path="/admin/menu"
            element={
              <AppLayout>
                <AdminMenu />
              </AppLayout>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AppLayout>
                <AdminDashboard />
              </AppLayout>
            }
          />

          {/* Fallback */}
          <Route
            path="*"
            element={
              <AppLayout>
                <Menu />
              </AppLayout>
            }
          />
        </Routes>
      </Router>
    </CartProvider>
  );
}
