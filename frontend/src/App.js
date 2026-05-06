// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Toaster from "./components/Toaster";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Marketplace from "./pages/Marketplace";
import ProductDetails from "./pages/ProductDetails";
import Awareness from "./pages/Awareness";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Account from "./pages/Account";
import Orders from "./pages/Orders";
import Chat from "./components/Chat";
import AIChat from "./components/AIChat";
import Plastic from "./pages/Plastic";
import Metal from "./pages/Metal";
import Ewaste from "./pages/Ewaste";
import Fabric from "./pages/Fabric";
import BulkWaste from "./pages/BulkWaste";
import SellBulk from "./pages/SellBulk";
import Inbox from "./pages/Inbox";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Toaster />

      <main className="container my-4">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/awareness" element={<Awareness />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/plastic" element={<Plastic />} />
          <Route path="/metal" element={<Metal />} />
          <Route path="/ewaste" element={<Ewaste />} />
          <Route path="/fabric" element={<Fabric />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/bulk" element={<BulkWaste />} />
          

          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Generic protected routes (any logged-in user) */}
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

          <Route path="/chat/:sellerId" element={<Chat />} />

          <Route
            path="/aichat"
            element={
              <ProtectedRoute>
                <AIChat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bulk/sell"
            element={
              <ProtectedRoute>
                <SellBulk />
              </ProtectedRoute>
            }
          />

          {/* fallback route could be added here */}
        </Routes>
      </main>

      <Footer />
    </AuthProvider>
  );
}

export default App;
