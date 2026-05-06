import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const { user } = useContext(AuthContext);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [aiContent, setAiContent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/products/all");
        // Only grab the latest 4 products for the homepage
        setFeaturedProducts(res.data.products.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      }
    };

    const fetchAiTrivia = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/ai/trivia");
        setAiContent(res.data);
      } catch (error) {
        console.error("Failed to fetch AI trivia:", error);
      }
    };

    fetchProducts();
    fetchAiTrivia();
  }, []);

  return (
    <div className="container py-4">
      {user && (
        <div className="alert bg-success text-white border-0 shadow-sm rounded-pill px-4 py-2 d-inline-block mb-4">
          Welcome back, <strong>{user.name}</strong>! You are logged in as a {user.role}.
        </div>
      )}

      {/* HERO SECTION */}
      <div className="hero-gradient text-center text-md-start d-flex align-items-center justify-content-between flex-wrap gap-4">
        <div className="col-md-6 px-md-4">
          <span className="badge-eco mb-3 d-inline-block">🌱 Sustainable Living</span>
          <h1 className="display-3 fw-bold mb-3" style={{ lineHeight: "1.2" }}>
            Turn Waste into <br />
            <span style={{ color: "#059669" }}>Art & Décor ♻️</span>
          </h1>
          <p className="lead fs-5 text-muted mb-4" style={{ maxWidth: "500px" }}>
            Buy and sell eco-friendly products made from recycled materials. Support artisans and protect the planet with every purchase.
          </p>
          <div className="d-flex gap-3 justify-content-center justify-content-md-start">
            <Link to="/marketplace" className="btn btn-success btn-lg px-5 py-3 fs-5 shadow-hover rounded-pill">
              Explore Marketplace 🚀
            </Link>
            <Link to="/awareness" className="btn btn-outline-success btn-lg px-4 py-3 fs-5 rounded-pill">
              Community Hub
            </Link>
          </div>
        </div>
        <div className="col-md-5 d-none d-md-block text-center">
          <img 
            src="https://images.unsplash.com/photo-1528323273322-d81458248d40?q=80&w=2105&auto=format&fit=crop" 
            alt="Eco Art" 
            className="img-fluid" 
            style={{ borderRadius: "40px", boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.25)", maxHeight: "400px", objectFit: "cover", width: "100%" }}
          />
        </div>
      </div>

      {/* AI TRIVIA & QUOTE SECTION */}
      {aiContent && (
        <div className="mt-5 mb-5">
          <div className="card border-0 shadow-lg" style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", borderRadius: "20px" }}>
            <div className="card-body p-4 p-md-5 text-white text-center position-relative overflow-hidden">
              <div className="position-absolute top-0 start-0 w-100 h-100 bg-white opacity-10" style={{ transform: "rotate(-5deg) scale(1.5)", zIndex: 0 }}></div>
              <div className="position-relative" style={{ zIndex: 1 }}>
                <h3 className="fw-bold mb-4">🌍 EcoBot's Daily Wisdom</h3>
                <div className="row g-4 justify-content-center">
                  <div className="col-md-5">
                    <div className="bg-white bg-opacity-25 p-4 rounded-4 h-100">
                      <h5 className="fw-bold mb-3">💡 Did You Know?</h5>
                      <p className="fs-5 mb-0">{aiContent.trivia}</p>
                    </div>
                  </div>
                  <div className="col-md-5">
                    <div className="bg-white bg-opacity-25 p-4 rounded-4 h-100 d-flex flex-column justify-content-center">
                      <h5 className="fw-bold mb-3">✨ Daily Quote</h5>
                      <p className="fs-5 mb-0 fst-italic">"{aiContent.quote}"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORIES SECTION */}
      <div className="mt-5 pt-5">
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold">Browse by Waste Category</h2>
          <p className="text-muted fs-5">Find upcycled items sorted by their original materials.</p>
        </div>

        <div className="row g-4 text-center">
          {[
            { title: "Plastic", icon: "♻️", link: "/plastic", color: "#3b82f6" },
            { title: "Metal", icon: "🔩", link: "/metal", color: "#64748b" },
            { title: "E-Waste", icon: "💻", link: "/ewaste", color: "#8b5cf6" },
            { title: "Fabric", icon: "🧵", link: "/fabric", color: "#ec4899" }
          ].map((cat, i) => (
            <div className="col-md-3 col-sm-6" key={i}>
              <Link to={cat.link} className="text-decoration-none">
                <div className="card h-100 p-4 border-0 shadow-sm hover-lift text-center" style={{ background: `linear-gradient(135deg, rgba(255,255,255,1) 0%, ${cat.color}15 100%)`, borderRadius: '20px' }}>
                  <div className="display-4 mb-3">{cat.icon}</div>
                  <h4 className="fw-bold" style={{ color: "var(--dark-green)" }}>{cat.title}</h4>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURED PRODUCTS SECTION */}
      {featuredProducts.length > 0 && (
        <div className="mt-5 pt-5">
          <div className="d-flex justify-content-between align-items-end mb-4 border-bottom pb-3">
            <div>
              <h2 className="display-6 fw-bold mb-0">Featured Products ⭐</h2>
              <p className="text-muted fs-5 mb-0">Discover the newest eco-creations.</p>
            </div>
            <Link to="/marketplace" className="btn btn-outline-success rounded-pill fw-bold">View All ➡️</Link>
          </div>

          <div className="row g-4">
            {featuredProducts.map((p) => (
              <div className="col-md-3 col-sm-6" key={p._id}>
                <div className="card shadow-sm border-0 h-100 rounded-4 overflow-hidden hover-lift">
                  <img
                    src={p.image?.startsWith("http") ? p.image : `http://localhost:5001/uploads/${p.image}`}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                    alt="product"
                  />
                  <div className="card-body d-flex flex-column text-center p-4">
                    <h5 className="fw-bold fs-5 mb-1 text-truncate">{p.name}</h5>
                    <p className="text-success fw-bold fs-5 mb-3">₹{p.price}</p>
                    <button 
                      className="btn btn-success w-100 mt-auto rounded-pill fw-bold"
                      onClick={() => navigate(`/product/${p._id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CALL TO ACTION CARDS */}
      <div className="row mt-5 pt-4 g-4 mb-5">
        <div className="col-md-6">
          <div className="card h-100 p-5 text-white border-0 shadow-lg" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", borderRadius: '25px' }}>
            <h3 className="fw-bold mb-3">Sell your upcycled items</h3>
            <p className="fs-5 text-light mb-4 opacity-75">Become a seller and list products that turn waste into value. Join our marketplace of eco-creators.</p>
            <div>
              <Link to="/seller-dashboard" className="btn btn-light text-dark fw-bold px-4 py-2 rounded-pill">Go to Seller Dashboard</Link>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100 p-5 text-white border-0 shadow-lg" style={{ background: "linear-gradient(135deg, #059669 0%, #10b981 100%)", borderRadius: '25px' }}>
            <h3 className="fw-bold mb-3">Join the Awareness Hub</h3>
            <p className="fs-5 text-light mb-4 opacity-75">Share tips, tutorials, and images about nature protection, recycling, and sustainable living.</p>
            <div>
              <Link to="/awareness" className="btn btn-light text-success fw-bold px-4 py-2 rounded-pill">Visit Awareness Hub</Link>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default Home;
