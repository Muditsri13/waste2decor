import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-4 mt-5">
      <div className="container d-flex flex-column align-items-center">
        <div className="mb-2">
          © {new Date().getFullYear()} Waste2Decor — Sustainable Living Marketplace
        </div>
        <div className="d-flex gap-3">
          <Link to="/terms" className="text-secondary text-decoration-none hover-text-white">
            App Guide & Terms
          </Link>
          <a href="mailto:support@waste2decor.com" className="text-secondary text-decoration-none hover-text-white">
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
