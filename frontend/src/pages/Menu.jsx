import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api';
import { useCart } from '../CartContext';

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/menu`);
        setItems(res.data);
      } catch (err) {
        console.error('Failed to load menu', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading menu...</div>;
  }

  return (
    <div>
      <h2 className="mb-4">Today&apos;s Menu</h2>
      {items.length === 0 && <p>No items yet.</p>}

      <div className="row g-3">
        {items.map((item) => (
          <div key={item._id} className="col-md-4">
            <div className="card shadow-sm h-100">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{item.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  {item.category}
                </h6>
                <p className="card-text fw-bold mb-3">₹{item.price}</p>
                <button
                  className="btn btn-primary mt-auto"
                  onClick={() => addToCart(item)}
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
