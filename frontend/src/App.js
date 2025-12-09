import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { CartProvider } from './CartContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';
import AdminMenu from './pages/AdminMenu';
import { clearAuth, isLoggedIn, getUser } from './auth';
import { socket } from './socket';

// Only admins can see admin pages
function RequireAdmin({ children }) {
  const user = getUser();
  if (!user || user.role !== 'admin') {
    return <p style={{ color: 'red' }}>Admin access only.</p>;
  }
  return children;
}

function App() {
  const user = getUser();

  // Socket connection based on logged-in user
  useEffect(() => {
    if (user && !socket.connected) {
      socket.connect();
      if (user.role === 'admin') {
        socket.emit('join_admin');
      } else {
        socket.emit('join_user', user.id || user._id);
      }
    }

    return () => {
      if (!isLoggedIn() && socket.connected) {
        socket.disconnect();
      }
    };
  }, [user]);

  return (
    <Router>
      <CartProvider>
        <div className="main-wrapper">
          <nav className="navbar navbar-dark navbar-expand-lg bg-dark">
            <div className="container-fluid">
              <Link className="navbar-brand" to="/menu">
                Canteen
              </Link>

              <div className="collapse navbar-collapse show">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link className="nav-link" to="/menu">
                      Menu
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/orders">
                      My Orders
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin">
                      Admin
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin-menu">
                      Admin Menu
                    </Link>
                  </li>
                </ul>

                <div className="d-flex">
                  {!isLoggedIn() && (
                    <>
                      <Link
                        className="btn btn-outline-light me-2"
                        to="/login"
                      >
                        Login
                      </Link>
                      <Link className="btn btn-light" to="/register">
                        Register
                      </Link>
                    </>
                  )}

                  {isLoggedIn() && (
                    <>
                      <span className="navbar-text text-white me-2">
                        {user?.name} ({user?.role})
                      </span>
                      <button
                        className="btn btn-outline-light"
                        onClick={() => {
                          clearAuth();
                          window.location.href = '/login';
                        }}
                      >
                        Logout
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </nav>

          <div className="container mt-4">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/orders" element={<Orders />} />
              <Route
                path="/admin"
                element={
                  <RequireAdmin>
                    <AdminDashboard />
                  </RequireAdmin>
                }
              />
              <Route
                path="/admin-menu"
                element={
                  <RequireAdmin>
                    <AdminMenu />
                  </RequireAdmin>
                }
              />
              <Route path="/" element={<Menu />} />
            </Routes>
          </div>
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
