import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Account() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="container mt-5 text-center">
        <h3>You are not logged in.</h3>
        <Link to="/login" className="btn btn-success mt-3">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg border-0 rounded-4 p-5 text-center">
            
            <div className="mb-4">
              <div 
                className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center mx-auto shadow"
                style={{ width: "100px", height: "100px", fontSize: "40px", fontWeight: "bold" }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>

            <h2 className="fw-bold mb-1">{user.name}</h2>
            <p className="text-muted fs-5 mb-3">{user.email}</p>
            
            <div className="mb-4">
              <span className={`badge px-3 py-2 fs-6 rounded-pill ${user.role === 'admin' ? 'bg-danger' : user.role === 'seller' ? 'bg-primary' : 'bg-success'}`}>
                Account Type: {user.role.toUpperCase()}
              </span>
            </div>

            <div className="d-grid gap-3">
              {user.role !== "admin" && (
                <Link to="/dashboard" className="btn btn-outline-success btn-lg rounded-pill fw-bold">
                  My Dashboard 📊
                </Link>
              )}

              {user.role === "admin" && (
                <Link to="/admin-dashboard" className="btn btn-outline-danger btn-lg rounded-pill fw-bold">
                  Go to Admin Dashboard 🛡️
                </Link>
              )}

              <button 
                onClick={handleLogout} 
                className="btn btn-light text-danger btn-lg rounded-pill fw-bold border"
              >
                Logout
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
