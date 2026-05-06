import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const PRICING = {
  "Wood": { pricePerKg: 5, minWeight: 10 },
  "Plastic": { pricePerKg: 8, minWeight: 10 },
  "Cardboard": { pricePerKg: 4, minWeight: 10 },
  "Cotton": { pricePerKg: 10, minWeight: 10 },
  "E-Waste": { pricePerKg: 20, minWeight: 10 },
  "Other": { pricePerKg: 2, minWeight: 10 }
};

function SellBulk() {
  const [material, setMaterial] = useState("Wood");
  const [weight, setWeight] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const currentPricing = PRICING[material];
  const calculatedPrice = weight ? parseFloat(weight) * currentPricing.pricePerKg : 0;
  const isWeightValid = weight ? parseFloat(weight) >= currentPricing.minWeight : true;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isWeightValid || !weight) {
      toast.error(`Minimum weight for ${material} is ${currentPricing.minWeight}kg`);
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("Please login to sell bulk waste");
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("material", material);
    formData.append("weight", weight);
    formData.append("price", calculatedPrice);
    formData.append("sellerId", userId);
    if (image) formData.append("image", image);

    try {
      await axios.post("http://localhost:5001/api/bulk/add", formData);
      toast.success("Bulk waste listed successfully!");
      navigate("/bulk");
    } catch (error) {
      console.error(error);
      toast.error("Failed to list bulk waste");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg border-0 rounded-4 p-4 p-md-5">
            <h2 className="fw-bold mb-4 text-center">Sell Bulk Waste 📦</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label fw-bold">Material Type</label>
                <select 
                  className="form-select form-select-lg bg-light" 
                  value={material} 
                  onChange={(e) => setMaterial(e.target.value)}
                >
                  {Object.keys(PRICING).map(mat => (
                    <option key={mat} value={mat}>{mat}</option>
                  ))}
                </select>
                <div className="form-text mt-2 text-muted">
                  Current rate: <strong>₹{currentPricing.pricePerKg}/kg</strong> (Min: {currentPricing.minWeight}kg)
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">Weight (in kg)</label>
                <input 
                  type="number" 
                  className={`form-control form-control-lg bg-light ${weight && !isWeightValid ? 'is-invalid' : ''}`}
                  placeholder={`Enter at least ${currentPricing.minWeight}`}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  min="1"
                  required
                />
                {weight && !isWeightValid && (
                  <div className="invalid-feedback">
                    Weight must be at least {currentPricing.minWeight}kg for {material}.
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">Upload Image (Optional)</label>
                <input 
                  type="file" 
                  className="form-control form-control-lg bg-light" 
                  onChange={(e) => setImage(e.target.files[0])}
                  accept="image/*"
                />
              </div>

              <div className="alert bg-success text-white border-0 rounded-3 mb-4 d-flex justify-content-between align-items-center">
                <span className="fs-5">Estimated Earnings:</span>
                <span className="fs-3 fw-bold">₹{calculatedPrice.toFixed(2)}</span>
              </div>

              <button 
                type="submit" 
                className="btn btn-success btn-lg w-100 rounded-pill fw-bold shadow-sm"
                disabled={!isWeightValid || !weight}
              >
                List Bulk Waste
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellBulk;
