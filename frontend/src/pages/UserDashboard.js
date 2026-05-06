import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function UserDashboard() {
  const [activeTab, setActiveTab] = useState("wishlist"); // wishlist, listings, add
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Upload Form State
  const [product, setProduct] = useState({ name: "", description: "", price: "", category: "", image: null });

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, activeTab]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (activeTab === "wishlist") {
        const res = await axios.get(`http://localhost:5001/api/auth/wishlist/${userId}`);
        setWishlist(res.data);
      } else if (activeTab === "listings") {
        const res = await axios.get(`http://localhost:5001/api/products/seller/${userId}`);
        setListings(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };



  const handleProductDelete = async (productId) => {
    if(!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      await axios.delete(`http://localhost:5001/api/products/delete/${productId}`);
      toast.success("Listing deleted");
      fetchDashboardData();
    } catch (error) {
      toast.error("Failed to delete listing");
    }
  };

  const onUploadChange = (e) => {
    if (e.target.name === "image") {
      setProduct({ ...product, image: e.target.files[0] });
    } else {
      setProduct({ ...product, [e.target.name]: e.target.value });
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("category", product.category);
    formData.append("image", product.image);
    formData.append("userId", userId);

    try {
      await axios.post("http://localhost:5001/api/products/add", formData, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Product listed successfully! 🔥");
      setProduct({ name: "", description: "", price: "", category: "", image: null });
      setActiveTab("listings");
    } catch (error) {
      toast.error("Upload failed ❌");
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <div>
          <h2 className="fw-bold text-dark">My Dashboard 📊</h2>
          <p className="text-muted fs-5">Manage your wishlist and listings in one place.</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-pills nav-fill mb-5 gap-2 bg-light p-2 rounded-pill shadow-sm">
        <li className="nav-item">
          <button className={`nav-link rounded-pill fw-bold ${activeTab === 'wishlist' ? 'active bg-success' : 'text-success'}`} onClick={() => setActiveTab('wishlist')}>
            🤍 My Wishlist
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link rounded-pill fw-bold ${activeTab === 'listings' ? 'active bg-success' : 'text-success'}`} onClick={() => setActiveTab('listings')}>
            📦 My Active Listings
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link rounded-pill fw-bold ${activeTab === 'add' ? 'active bg-success' : 'text-success'}`} onClick={() => setActiveTab('add')}>
            ➕ Add Product
          </button>
        </li>
      </ul>

      {/* TAB CONTENT */}
      <div className="mb-5">
        {loading && activeTab !== "add" ? (
          <h5 className="text-center text-muted py-5">Loading your data...</h5>
        ) : (
          <>
            {/* 1. MY WISHLIST */}
            {activeTab === "wishlist" && (
              <div className="row g-4">
                {wishlist.length === 0 ? (
                  <div className="text-center py-5 w-100">
                    <h5 className="text-muted">Your wishlist is empty.</h5>
                    <Link to="/marketplace" className="btn btn-success mt-3 rounded-pill px-4">Browse Marketplace</Link>
                  </div>
                ) : (
                  wishlist.map((p) => (
                    <div className="col-md-3 col-sm-6" key={p._id}>
                      <div className="card shadow-sm border-0 rounded-4 overflow-hidden h-100 cursor-pointer" onClick={() => navigate(`/product/${p._id}`)}>
                        <img src={p.image?.startsWith("http") ? p.image : `http://localhost:5001/uploads/${p.image}`} className="card-img-top" style={{ height: "180px", objectFit: "cover", cursor: "pointer" }} alt={p.name} />
                        <div className="card-body text-center d-flex flex-column">
                          <h5 className="fw-bold fs-6 text-truncate">{p.name}</h5>
                          <p className="text-success fw-bold">₹{p.price}</p>
                          <button className="btn btn-sm btn-outline-success w-100 mt-auto rounded-pill" onClick={(e) => { e.stopPropagation(); navigate(`/product/${p._id}`); }}>View Details</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 2. MY LISTINGS */}
            {activeTab === "listings" && (
              <div className="row g-4">
                {listings.length === 0 ? (
                  <div className="text-center py-5 w-100">
                    <h5 className="text-muted">You have no active listings.</h5>
                    <button className="btn btn-success mt-3 rounded-pill px-4" onClick={() => setActiveTab('add')}>List a Product</button>
                  </div>
                ) : (
                  listings.map((p) => (
                    <div className="col-md-3 col-sm-6" key={p._id}>
                      <div className="card shadow-sm border-0 rounded-4 overflow-hidden h-100">
                        <img src={p.image?.startsWith("http") ? p.image : `http://localhost:5001/uploads/${p.image}`} className="card-img-top" style={{ height: "180px", objectFit: "cover" }} alt={p.name} />
                        <div className="card-body text-center d-flex flex-column">
                          <h5 className="fw-bold fs-6 text-truncate">{p.name}</h5>
                          <p className="text-success fw-bold">₹{p.price}</p>
                          <button className="btn btn-sm btn-outline-danger w-100 mt-auto rounded-pill" onClick={() => handleProductDelete(p._id)}>Delete Listing</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 3. ADD PRODUCT */}
            {activeTab === "add" && (
              <div className="card p-5 shadow-sm border-0 rounded-4 mx-auto" style={{maxWidth: '600px'}}>
                <h4 className="text-center fw-bold mb-4">List a New Product 📦</h4>
                <form onSubmit={handleUploadSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Product Name</label>
                    <input type="text" name="name" className="form-control" value={product.name} onChange={onUploadChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea name="description" rows="3" className="form-control" value={product.description} onChange={onUploadChange} required />
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Price (₹)</label>
                      <input type="number" name="price" className="form-control" value={product.price} onChange={onUploadChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Category</label>
                      <select name="category" className="form-select" value={product.category} onChange={onUploadChange} required>
                        <option value="">Select...</option>
                        <option value="plastic">Plastic</option>
                        <option value="metal">Metal</option>
                        <option value="ewaste">E-Waste</option>
                        <option value="fabric">Fabric</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Product Image</label>
                    <input type="file" name="image" className="form-control" onChange={onUploadChange} required />
                  </div>
                  <button className="btn btn-success btn-lg w-100 fw-bold rounded-pill">Upload Listing 🚀</button>
                </form>
              </div>
            )}


          </>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
