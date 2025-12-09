import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api';
import { socket } from '../socket';

const STATUS_OPTIONS = ['PLACED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'];

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');

  const loadOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/orders`);
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to load orders', err);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // realtime listeners
  useEffect(() => {
    const handleCreated = (order) => {
      setOrders((prev) => [order, ...prev]);
    };
    const handleUpdated = (order) => {
      setOrders((prev) =>
        prev.map((o) => (o._id === order._id ? order : o))
      );
    };

    socket.on('order:created', handleCreated);
    socket.on('order:updated', handleUpdated);

    return () => {
      socket.off('order:created', handleCreated);
      socket.off('order:updated', handleUpdated);
    };
  }, []);

  const updateStatus = async (orderId, status) => {
    setMessage('');
    try {
      await axios.patch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        status
      });
      setMessage('Status updated');
      // list will also update via socket
    } catch (err) {
      console.error(err);
      setMessage('Failed to update');
    }
  };

  return (
    <div>
      <h2 className="mb-3">Admin Orders</h2>
      {message && <div className="alert alert-info">{message}</div>}

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul className="list-group">
          {orders.map((order) => (
            <li
              key={order._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <div>#{order._id.slice(-6)}</div>
                <small className="text-muted">₹{order.totalAmount}</small>
              </div>
              <div className="d-flex align-items-center">
                <span className="badge bg-secondary me-2">{order.status}</span>
                <select
                  className="form-select form-select-sm"
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
