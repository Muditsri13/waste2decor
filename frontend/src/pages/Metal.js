import React, { useEffect, useState } from "react";
import axios from "axios";

function Metal() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5001/api/products/category/metal")
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Metal Waste Products ♻️</h2>

      <div className="row">
        {products.map((p) => (
          <div className="col-md-3" key={p._id}>
            <div className="card mb-3 shadow">
              <img
                src={p.image || "https://via.placeholder.com/150"}
                className="card-img-top"
                alt=""
              />
              <div className="card-body">
                <h5>{p.name}</h5>
                <p>₹{p.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Metal;