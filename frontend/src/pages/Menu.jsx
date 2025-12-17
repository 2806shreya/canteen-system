// src/pages/Menu.jsx

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useCart } from "../CartContext";
import { API_BASE_URL } from "../api";

// put your backend origin here (same place that serves /uploads/.. images)
const IMAGE_BASE_URL = API_BASE_URL; // or "http://localhost:5000"

export default function Menu() {
  const { addToCart } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const loadMenu = async () => {
  try {
    setLoading(true);
    setErrMsg("");
    const res = await axios.get(`${API_BASE_URL}/api/menu`);
    console.log("ONE MENU ITEM ->", res.data[0]);
    setItems(res.data);
  } catch (err) {
    console.error("Failed to load menu", err);
    setErrMsg("Failed to load menu. Please try again.");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    loadMenu();
  }, []);

  const grouped = useMemo(() => {
    const map = {};
    for (const it of items) {
      const cat = it.category || "Other";
      if (!map[cat]) map[cat] = [];
      map[cat].push(it);
    }
    return map;
  }, [items]);

  if (loading) return <p>Loading menu...</p>;
  if (errMsg) return <p>{errMsg}</p>;

  return (
    <div className="menu-page">
      <h2>Today&apos;s Menu</h2>
      <p>Fresh food from the campus canteen. Order and skip the queue.</p>

      {Object.keys(grouped).map((category) => (
        <section key={category} style={{ marginTop: "24px" }}>
          <h4 className="menu-category-title">{category}</h4>

          <div className="row">
            {grouped[category].map((item) => (
              <div key={item._id} className="col-md-4">
                <div className="card h-100">
                  {item.image && (
                    <img
                      src={
                        item.image.startsWith("http")
                          ? item.image
                          : `${IMAGE_BASE_URL}${item.image}`
                      }
                      alt={item.name}
                      className="card-img-top"
                      loading="lazy"
                    />
                  )}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text mb-1">₹{item.price}</p>
                    {item.description && (
                      <p className="card-text text-muted small">
                        {item.description}
                      </p>
                    )}
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
        </section>
      ))}

      {items.length === 0 && <p>No menu items found.</p>}
    </div>
  );
}
