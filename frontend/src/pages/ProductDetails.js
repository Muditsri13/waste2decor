import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [inWishlist, setInWishlist] = useState(false);

  const fetchProduct = () => {
    axios.get(`http://localhost:5001/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchProduct();
    // Check if in wishlist
    const userId = localStorage.getItem("userId");
    if (userId) {
      axios.get(`http://localhost:5001/api/auth/wishlist/${userId}`)
        .then(res => {
          if (res.data.some(p => p._id === id)) {
            setInWishlist(true);
          }
        })
        .catch(err => console.log(err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const toggleWishlist = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("Please login to use your wishlist");
      navigate("/login");
      return;
    }

    try {
      await axios.post("http://localhost:5001/api/auth/wishlist/toggle", {
        userId,
        productId: product._id
      });
      setInWishlist(!inWishlist);
      toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist 🤍");
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  if (!product) {
    return <h3 className="text-center mt-5">Loading...</h3>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden mb-5">
            {/* Product Image */}
            <img
              src={
                product.image?.startsWith("http") 
                  ? product.image 
                  : `http://localhost:5001/uploads/${product.image}`
              }
              alt={product.name}
              style={{ height: "400px", objectFit: "cover", width: "100%" }}
            />

            <div className="card-body p-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="fw-bold mb-0">{product.name}</h2>
                <span className="badge bg-success rounded-pill px-3 py-2 fs-5">
                  ₹{product.price}
                </span>
              </div>
              <p className="text-muted mb-3 fs-5">{product.description}</p>
              <div className="d-flex flex-column gap-2 mb-4 text-secondary">
                <div><strong>Category:</strong> <span className="text-capitalize">{product.category}</span></div>
                <div><strong>Seller:</strong> {product.sellerId?.name || "Unknown Seller"}</div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-3 mt-4">
                <button
                  className="btn btn-success btn-lg flex-grow-1 fw-bold rounded-pill shadow"
                  onClick={() => navigate(`/chat/${product.sellerId?._id || product.sellerId}`)}
                >
                  💬 Chat with Seller to Buy
                </button>

                <button
                  className={`btn ${inWishlist ? 'btn-danger' : 'btn-outline-danger'} btn-lg flex-grow-1 fw-bold rounded-pill`}
                  onClick={toggleWishlist}
                >
                  {inWishlist ? "❤️ Remove from Wishlist" : "🤍 Add to Wishlist"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;