import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function BuyerDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;
        const res = await axios.get(`http://localhost:5001/api/orders/${userId}`);
        setOrders(res.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center text-success mb-4">Buyer Dashboard 🛍️</h2>
      
      <div className="card shadow p-4">
        <h4 className="mb-4">My Orders</h4>
        
        {loading ? (
          <p className="text-center">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-5">
            <h5 className="text-muted">You haven't placed any orders yet.</h5>
            <Link to="/marketplace" className="btn btn-success mt-3">Browse Marketplace</Link>
          </div>
        ) : (
          <div className="row">
            {orders.map((order) => (
              <div key={order._id} className="col-md-6 mb-3">
                <div className="card h-100 border-success">
                  <div className="row g-0">
                    <div className="col-md-4">
                      <img 
                        src={order.productId?.image ? `http://localhost:5001/uploads/${order.productId.image}` : "https://via.placeholder.com/150"} 
                        className="img-fluid rounded-start h-100" 
                        alt="Product" 
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="col-md-8">
                      <div className="card-body">
                        <h5 className="card-title fw-bold">{order.productId?.name || "Product Unavailable"}</h5>
                        <p className="card-text text-success fw-semibold">₹{order.productId?.price || "N/A"}</p>
                        <p className="card-text mb-1"><small className="text-muted">Order ID: {order._id}</small></p>
                        <p className="card-text"><small className="text-muted">Placed on: {new Date(order.createdAt).toLocaleDateString()}</small></p>
                        
                        {order.productId?.sellerId && (
                          <Link to={`/chat/${order.productId.sellerId}`} className="btn btn-sm btn-outline-success mt-2">
                            Contact Seller
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BuyerDashboard;
