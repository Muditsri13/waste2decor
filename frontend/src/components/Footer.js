import React from "react";

function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-3 mt-5">
      <div className="container">
        © {new Date().getFullYear()} Waste2Decor — Sustainable Living Marketplace
      </div>
    </footer>
  );
}

export default Footer;
