import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function BulkWaste() {
  const [bulkItems, setBulkItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBulkItems();
  }, []);

  const fetchBulkItems = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/bulk/all");
      setBulkItems(res.data);
    } catch (error) {
      console.error("Error fetching bulk items", error);
    }
  };

  const handleChat = (sellerId) => {
    navigate(`/chat/${sellerId}`);
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <div>
          <h2 className="display-5 fw-bold text-dark">Bulk Waste Listings</h2>
          <p className="text-muted fs-5">Buy bulk raw materials for your upcycling projects.</p>
        </div>
        <Link to="/bulk/sell" className="btn btn-success btn-lg shadow-sm">
          Sell Your Bulk Waste 📦
        </Link>
      </div>

      <div className="row g-4">
        {bulkItems.length === 0 ? (
          <div className="col-12 text-center py-5">
            <h4 className="text-muted">No bulk waste listings available right now.</h4>
          </div>
        ) : (
          bulkItems.map((item) => (
            <div className="col-md-4" key={item._id}>
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden hover-lift">
                {item.image ? (
                  <img
                    src={item.image?.startsWith("http") ? item.image : `http://localhost:5001/uploads/${item.image}`}
                    alt={item.material}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                ) : (
                  <div className="bg-light d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                    <span className="fs-1">📦</span>
                  </div>
                )}
                
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title fw-bold fs-4 mb-0">{item.material}</h5>
                    <span className="badge bg-success rounded-pill px-3 py-2 fs-6">
                      ₹{item.price}
                    </span>
                  </div>
                  <p className="text-muted mb-3 fs-5">
                    <strong>Weight:</strong> {item.weight} kg
                  </p>
                  
                  <div className="d-flex align-items-center mb-4">
                    <div className="bg-secondary rounded-circle text-white d-flex justify-content-center align-items-center me-2" style={{width: '35px', height: '35px'}}>
                      {item.sellerId?.name?.charAt(0) || "U"}
                    </div>
                    <span className="text-muted">Listed by {item.sellerId?.name || "User"}</span>
                  </div>

                  <button 
                    onClick={() => handleChat(item.sellerId?._id)} 
                    className="btn btn-outline-success w-100 py-2 rounded-pill fw-bold"
                  >
                    💬 Chat to Buy
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default BulkWaste;
