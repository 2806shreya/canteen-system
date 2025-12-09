import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../CartContext';
import { API_BASE_URL } from '../api';
import { socket } from '../socket';

export default function Orders() {
  const { items, clearCart } = useCart();
  const [message, setMessage] = useState('');
  const [orders, setOrders] = useState([]);

  const totalAmount = items.reduce(
    (sum, it) => sum + it.price * it.quantity,
    0
  );

  const loadMyOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/orders/my`);
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to load my orders', err);
    }
  };

  useEffect(() => {
    loadMyOrders();
  }, []);

  // realtime listener for this user's orders
  useEffect(() => {
    const handleUpdated = (updatedOrder) => {
      setOrders((prev) =>
        prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
      );
    };

    socket.on('order:updated', handleUpdated);

    return () => {
      socket.off('order:updated', handleUpdated);
    };
  }, []);

  const placeOrder = async () => {
    setMessage('');
    if (items.length === 0) {
      setMessage('Cart is empty');
      return;
    }

    try {
      const orderItems = items.map((it) => ({
        menuItem: it._id,
        name: it.name,
        price: it.price,
        quantity: it.quantity
      }));

      await axios.post(`${API_BASE_URL}/api/orders`, {
        items: orderItems,
        totalAmount
      });

      setMessage('Order placed successfully!');
      clearCart();
      loadMyOrders();
    } catch (err) {
      console.error(err);
      setMessage('Failed to place order. Make sure you are logged in.');
    }
  };

  return (
    <div className="row">
      <div className="col-md-6">
        <h3>Cart</h3>
        {items.length === 0 ? (
          <p>No items in cart.</p>
        ) : (
          <>
            <ul className="list-group mb-3">
              {items.map((it) => (
                <li
                  key={it._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span>
                    {it.name} x {it.quantity}
                  </span>
                  <span>₹{it.price * it.quantity}</span>
                </li>
              ))}
            </ul>
            <p className="fw-bold">Total: ₹{totalAmount}</p>
            <button className="btn btn-success" onClick={placeOrder}>
              Place Order
            </button>
          </>
        )}
        {message && <div className="mt-2 alert alert-info">{message}</div>}
      </div>

      <div className="col-md-6 mt-4 mt-md-0">
        <h3>My Order History</h3>
        {orders.length === 0 ? (
          <p>No past orders yet.</p>
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
                <span className="badge bg-primary rounded-pill">
                  {order.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
