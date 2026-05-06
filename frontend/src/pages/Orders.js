import React, { useEffect, useState } from "react";
import axios from "axios";

function Orders() {

  const [orders, setOrders] = useState([]);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    axios.get(`http://localhost:5001/api/orders/${userId}`)
      .then(res => setOrders(res.data))
      .catch(err => console.log(err));
  }, [userId]);

  return (
    <div className="container mt-4">

      <h2>My Orders 🛒</h2>

      <div className="row">
        {orders.map((o) => (
          <div className="col-md-3" key={o._id}>

            <div className="card mb-3 shadow">

              <img
                src={o.productId?.image?.startsWith("http") ? o.productId.image : `http://localhost:5001/uploads/${o.productId.image}`}
                className="card-img-top"
                alt=""
              />

              <div className="card-body">
                <h5>{o.productId.name}</h5>
                <p>₹{o.productId.price}</p>
                <p>Status: {o.status}</p>
              </div>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

export default Orders;
