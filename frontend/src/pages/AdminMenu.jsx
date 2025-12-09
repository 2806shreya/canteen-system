import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api';

export default function AdminMenu() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', category: '' });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const loadMenu = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/menu`);
      setItems(res.data);
    } catch (err) {
      console.error('Failed to load menu', err);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/api/menu/${editingId}`, {
          name: form.name,
          price: Number(form.price),
          category: form.category
        });
        setMessage('Item updated');
      } else {
        await axios.post(`${API_BASE_URL}/api/menu`, {
          name: form.name,
          price: Number(form.price),
          category: form.category
        });
        setMessage('Item created');
      }
      setForm({ name: '', price: '', category: '' });
      setEditingId(null);
      loadMenu();
    } catch (err) {
      console.error(err);
      setMessage('Save failed (are you logged in as admin?)');
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name,
      price: item.price,
      category: item.category
    });
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    setMessage('');
    try {
      await axios.delete(`${API_BASE_URL}/api/menu/${id}`);
      setMessage('Item deleted');
      loadMenu();
    } catch (err) {
      console.error(err);
      setMessage('Delete failed');
    }
  };

  return (
    <div className="row">
      <div className="col-md-5 mb-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="card-title mb-3">
              {editingId ? 'Edit Menu Item' : 'Add Menu Item'}
            </h3>
            {message && <div className="alert alert-info">{message}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  name="name"
                  className="form-control"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Price</label>
                <input
                  name="price"
                  type="number"
                  className="form-control"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Category</label>
                <input
                  name="category"
                  className="form-control"
                  value={form.category}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                {editingId ? 'Update Item' : 'Add Item'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="col-md-7">
        <h3 className="mb-3">Current Menu</h3>
        {items.length === 0 ? (
          <p>No items.</p>
        ) : (
          <ul className="list-group">
            {items.map((item) => (
              <li
                key={item._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <div>{item.name}</div>
                  <small className="text-muted">
                    ₹{item.price} • {item.category}
                  </small>
                </div>
                <div>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => startEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => deleteItem(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
