import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Marketplace() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async (currentPage) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5001/api/products/all?page=${currentPage}&limit=8`);
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.sellerId && p.sellerId.name && p.sellerId.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container mt-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-dark display-5">Upcycled Marketplace 🌍</h2>
        <p className="text-muted fs-5">Find unique, sustainable products created by eco-conscious sellers.</p>
        
        {/* Search Bar */}
        <div className="mt-4 mx-auto" style={{ maxWidth: "600px" }}>
          <div className="input-group input-group-lg shadow-sm rounded-pill overflow-hidden border">
            <span className="input-group-text bg-white border-0 ps-4 text-muted">🔍</span>
            <input 
              type="text" 
              className="form-control border-0 shadow-none" 
              placeholder="Search products or sellers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <h4 className="text-center text-muted">Loading eco-creations...</h4>
      ) : (
        <>
          <div className="row g-4">
            {filteredProducts.length === 0 ? (
              <h4 className="text-center text-muted mt-5">No products found.</h4>
            ) : (
              filteredProducts.map((p) => (
                <div className="col-md-3 col-sm-6" key={p._id}>
                  <div className="card shadow-sm border-0 h-100 rounded-4 overflow-hidden hover-lift">
                    <img
                      src={p.image?.startsWith("http") ? p.image : `http://localhost:5001/uploads/${p.image}`}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                      alt={p.name}
                    />
                    <div className="card-body text-center d-flex flex-column p-4">
                      <h5 className="fw-bold fs-5 text-dark mb-1 text-truncate">{p.name}</h5>
                      <p className="text-muted small mb-2">Sold by: {p.sellerId?.name || "Unknown Seller"}</p>
                      <p className="text-success fw-bold fs-5 mb-3">₹{p.price}</p>
                      
                      {p.reviews && p.reviews.length > 0 && (
                        <div className="mb-3 text-warning">
                          {"★".repeat(Math.round(p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length))}
                          {"☆".repeat(5 - Math.round(p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length))}
                          <span className="text-muted small ms-1">({p.reviews.length})</span>
                        </div>
                      )}

                      <button 
                        className="btn btn-outline-success w-100 mt-auto rounded-pill fw-bold"
                        onClick={() => navigate(`/product/${p._id}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center mt-5 gap-3">
              <button 
                className="btn btn-success rounded-pill px-4" 
                onClick={handlePrevPage} 
                disabled={page === 1}
              >
                ⬅️ Previous
              </button>
              <span className="fw-bold fs-5 text-muted">
                Page {page} of {totalPages}
              </span>
              <button 
                className="btn btn-success rounded-pill px-4" 
                onClick={handleNextPage} 
                disabled={page === totalPages}
              >
                Next ➡️
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Marketplace;