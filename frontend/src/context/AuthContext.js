// src/context/AuthContext.js
import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("w2d_user")) || null; } catch { return null; }
  });

  useEffect(() => {
    // Just a placeholder if we need future initialization
  }, []);

  const register = async ({ name, email, password, role }) => {
    try {
      await axios.post("http://localhost:5001/api/auth/register", {
        name,
        email,
        password,
        role
      });
      // After successful registration, log them in
      await login({ email, password });
    } catch (error) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  };

  const login = async ({ email, password }) => {
    try {
      const res = await axios.post("http://localhost:5001/api/auth/login", {
        email,
        password
      });
      const userData = res.data.user;
      localStorage.setItem("w2d_user", JSON.stringify(userData));
      localStorage.setItem("userId", userData._id); // Also save userId for compatibility with SellerDashboard
      setUser(userData);
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("w2d_user");
    localStorage.removeItem("userId");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
