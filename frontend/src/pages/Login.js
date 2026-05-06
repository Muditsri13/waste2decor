import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  // handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // handle login
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login({ email: formData.email, password: formData.password });

      alert("Login successful ✅");

      // redirect to marketplace
      navigate("/marketplace");

    } catch (error) {
      console.log(error);
      const errorMsg = error.message || "Login failed ❌";
      alert(`Login failed: ${errorMsg}`);
    }
  };

  return (
    <div className="container mt-5">

      <div className="card p-4 shadow col-md-4 mx-auto">
        <h2 className="text-center mb-4">Login 🔐</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="form-control mb-3"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="form-control mb-3"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button className="btn btn-success w-100">
            Login 🚀
          </button>

          <div className="text-center mt-3">
            <span 
              className="text-muted small" 
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => setFormData({ email: "admin@test.com", password: "adminpassword123" })}
            >
              Autofill Admin Credentials (Testing)
            </span>
          </div>

        </form>
      </div>

    </div>
  );
}

export default Login;