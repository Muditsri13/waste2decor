import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <span style={{ fontSize: "1.8rem" }}>♻️</span> Waste2Decor
        </Link>
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-2">
            <li className="nav-item dropdown">
              <span 
                className="nav-link dropdown-toggle" 
                role="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                Categories
              </span>
              <ul className="dropdown-menu border-0 shadow-sm" style={{ borderRadius: "15px" }}>
                <li><Link className="dropdown-item" to="/plastic">♻️ Plastic</Link></li>
                <li><Link className="dropdown-item" to="/metal">🔩 Metal</Link></li>
                <li><Link className="dropdown-item" to="/ewaste">💻 E-Waste</Link></li>
                <li><Link className="dropdown-item" to="/fabric">🧵 Fabric</Link></li>
              </ul>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/marketplace">Marketplace</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/bulk" style={{ color: "var(--dark-green)", fontWeight: "bold" }}>📦 Bulk Waste</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/awareness">Awareness Hub</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link fw-bold" to="/aichat" style={{ color: "#10b981" }}>🤖 EcoBot AI</NavLink>
            </li>
            {user && (
              <>
                <li className="nav-item dropdown">
                  <span className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown">
                    Dashboards
                  </span>
                  <ul className="dropdown-menu border-0 shadow-sm" style={{ borderRadius: "15px" }}>
                    {user.role !== "admin" && <li><Link className="dropdown-item" to="/dashboard">My Dashboard</Link></li>}
                    {user.role === "admin" && <li><Link className="dropdown-item" to="/admin-dashboard">Admin Dashboard</Link></li>}
                  </ul>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link fw-bold text-primary" to="/inbox">Messages 💬</NavLink>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            {!user ? (
              <>
                <Link to="/login" className="btn btn-outline-success rounded-pill px-4">Login</Link>
                <Link to="/register" className="btn btn-success rounded-pill px-4">Sign Up</Link>
              </>
            ) : (
              <div className="dropdown">
                <button className="btn btn-success dropdown-toggle rounded-pill px-4" type="button" data-bs-toggle="dropdown">
                  Hey, {user.name.split(' ')[0]}
                </button>
                <ul className="dropdown-menu dropdown-menu-end border-0 shadow-sm" style={{ borderRadius: "15px" }}>
                  <li><Link className="dropdown-item" to="/account">My Account</Link></li>
                  <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
