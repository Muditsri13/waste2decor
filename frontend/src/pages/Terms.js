import React from "react";

function Terms() {
  return (
    <div className="container mt-5 mb-5" style={{ maxWidth: "800px" }}>
      <h2 className="fw-bold mb-4 text-center text-success">App Guide & Legal 📜</h2>

      <div className="card shadow-sm border-0 rounded-4 p-4 mb-4">
        <h4 className="fw-bold text-dark border-bottom pb-2 mb-3">🛠️ How to Use Waste2Decor</h4>
        <ol className="fs-5 text-secondary" style={{ lineHeight: "1.8" }}>
          <li>
            <strong>Register an Account:</strong> Sign up as a user to access the marketplace, dashboard, and communication tools.
          </li>
          <li>
            <strong>Buy & Sell Marketplace:</strong> Browse upcycled and eco-friendly products. If you want to sell, go to your Dashboard to upload a product.
          </li>
          <li>
            <strong>Bulk Waste Collection:</strong> Have raw scrap (metal, plastic, e-waste)? Navigate to the "Bulk Waste" section to list your raw materials by weight, and let buyers contact you for pickup or delivery.
          </li>
          <li>
            <strong>Awareness Hub:</strong> Share your sustainable living tips, DIY decor ideas, and engage with other eco-warriors using text, images, and videos.
          </li>
          <li>
            <strong>Real-time Chat:</strong> Found something you like? Click on a seller's profile or product to instantly message them and negotiate or arrange delivery.
          </li>
        </ol>
      </div>

      <div className="card shadow-sm border-0 rounded-4 p-4 mb-4">
        <h4 className="fw-bold text-dark border-bottom pb-2 mb-3">⚠️ Disclaimer</h4>
        <p className="fs-5 text-secondary" style={{ lineHeight: "1.6" }}>
          Waste2Decor is a platform intended to facilitate the exchange of recyclable materials and upcycled products between individuals. 
          We do not own, verify, or guarantee the quality, safety, or legality of any items listed on this platform. 
          All transactions are strictly between the buyer and the seller. Users are advised to exercise caution and common sense when meeting strangers or making payments.
        </p>
      </div>

      <div className="card shadow-sm border-0 rounded-4 p-4">
        <h4 className="fw-bold text-dark border-bottom pb-2 mb-3">⚖️ Terms and Conditions</h4>
        <ul className="fs-5 text-secondary" style={{ lineHeight: "1.6" }}>
          <li className="mb-2"><strong>User Responsibility:</strong> Users are solely responsible for the accuracy of their listings and their interactions with others.</li>
          <li className="mb-2"><strong>Prohibited Items:</strong> Listing hazardous waste, illegal items, or non-recyclable materials that violate local laws is strictly prohibited.</li>
          <li className="mb-2"><strong>Account Termination:</strong> We reserve the right to suspend or terminate accounts that engage in fraudulent activity, harassment, or violations of these terms.</li>
          <li className="mb-2"><strong>Data Privacy:</strong> By using this app, you agree to our collection of basic account information (Name, Email) to facilitate transactions. We will not sell your data to third parties.</li>
        </ul>
      </div>
    </div>
  );
}

export default Terms;
