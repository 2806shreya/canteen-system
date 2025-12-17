// frontend/src/pages/AdminMenu.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api";

export default function AdminMenu() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", category: "" });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loadingList, setLoadingList] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadMenu = async () => {
    try {
      setLoadingList(true);
      const res = await axios.get(`${API_BASE_URL}/api/menu`);
      setItems(res.data);
    } catch (err) {
      console.error("Failed to load menu", err);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSaving(true);
    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/api/menu/${editingId}`, {
          name: form.name,
          price: Number(form.price),
          category: form.category,
        });
        setMessage("Item updated");
      } else {
        await axios.post(`${API_BASE_URL}/api/menu`, {
          name: form.name,
          price: Number(form.price),
          category: form.category,
        });
        setMessage("Item created");
      }
      setForm({ name: "", price: "", category: "" });
      setEditingId(null);
      loadMenu();
    } catch (err) {
      console.error(err);
      setMessage("Save failed (are you logged in as admin?)");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name,
      price: item.price,
      category: item.category,
    });
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    setMessage("");
    try {
      await axios.delete(`${API_BASE_URL}/api/menu/${id}`);
      setMessage("Item deleted");
      loadMenu();
    } catch (err) {
      console.error(err);
      setMessage("Delete failed");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-layout">
        {/* Left: form */}
        <section className="admin-card admin-form-card">
          <h1 className="admin-title">
            {editingId ? "Edit Menu Item" : "Add Menu Item"}
          </h1>
          <p className="admin-subtitle">
            Manage dishes, prices, and categories shown on the student menu.
          </p>

          {message && <div className="admin-message">{message}</div>}

          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="admin-field">
              <label className="admin-label">Name</label>
              <input
                name="name"
                className="admin-input"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-field">
              <label className="admin-label">Price (₹)</label>
              <input
                name="price"
                type="number"
                className="admin-input"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-field">
              <label className="admin-label">Category</label>
              <input
                name="category"
                className="admin-input"
                value={form.category}
                onChange={handleChange}
                placeholder="South Indian, chineese, snacks, soups…"
                required
              />
            </div>

            <button
              type="submit"
              className="admin-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Item"
                : "Add Item"}
            </button>
          </form>
        </section>

        {/* Right: list */}
        <section className="admin-card admin-list-card">
          <div className="admin-list-header">
            <h2 className="admin-title">Current Menu</h2>
            {loadingList && (
              <span className="admin-list-status">Loading…</span>
            )}
          </div>

          {items.length === 0 && !loadingList ? (
            <p className="admin-empty">No items in the menu yet.</p>
          ) : (
            <div className="admin-list">
              {items.map((item) => (
                <div key={item._id} className="admin-list-item">
                  <div className="admin-list-main">
                    <div className="admin-list-name">{item.name}</div>
                    <div className="admin-list-meta">
                      <span>₹{item.price}</span>
                      <span className="admin-list-dot">•</span>
                      <span>{item.category}</span>
                    </div>
                  </div>
                  <div className="admin-list-actions">
                    <button
                      type="button"
                      className="admin-chip-button"
                      onClick={() => startEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="admin-chip-button admin-chip-danger"
                      onClick={() => deleteItem(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
