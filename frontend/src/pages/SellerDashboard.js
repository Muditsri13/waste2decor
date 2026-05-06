import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function SellerDashboard() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null
  });

  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("orders"); // "orders" or "upload"
  const userId = localStorage.getItem("userId");

  // Fetch incoming orders on load
  useEffect(() => {
    if (userId) {
      fetchOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/orders/seller/${userId}`);
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to fetch seller orders", error);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5001/api/orders/status/${orderId}`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders(); // refresh list
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const onChange = (e) => {
    if (e.target.name === "image") {
      setProduct({ ...product, image: e.target.files[0] });
    } else {
      setProduct({ ...product, [e.target.name]: e.target.value });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error("You must be logged in to upload a product ❌");
      return;
    }

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("category", product.category);
    formData.append("image", product.image);
    formData.append("userId", userId);

    try {
      await axios.post(
        "http://localhost:5001/api/products/add",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success("Product uploaded successfully 🔥");
      setProduct({ name: "", description: "", price: "", category: "", image: null });
      setActiveTab("orders"); // switch back to orders view
    } catch (error) {
      console.log(error);
      toast.error("Upload failed ❌");
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Seller Dashboard 🏪</h2>
        <div>
          <button 
            className={`btn ${activeTab === 'orders' ? 'btn-success' : 'btn-outline-success'} me-2`}
            onClick={() => setActiveTab('orders')}
          >
            Incoming Orders
          </button>
          <button 
            className={`btn ${activeTab === 'upload' ? 'btn-success' : 'btn-outline-success'}`}
            onClick={() => setActiveTab('upload')}
          >
            Upload Product
          </button>
        </div>
      </div>

      {activeTab === "orders" && (
        <div className="card shadow-sm border-0 rounded-4 p-4">
          <h4 className="mb-4 text-muted">Orders to Fulfill</h4>
          {orders.length === 0 ? (
            <p className="text-center py-5 fs-5">You don't have any orders yet. List more products!</p>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Buyer Name</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img 
                            src={order.productId?.image ? `http://localhost:5001/uploads/${order.productId.image}` : 'https://via.placeholder.com/50'} 
                            alt="prod" 
                            style={{width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px'}} 
                            className="me-3"
                          />
                          <div>
                            <div className="fw-bold">{order.productId?.name || "Deleted Product"}</div>
                            <div className="text-success small">₹{order.productId?.price}</div>
                          </div>
                        </div>
                      </td>
                      <td>{order.userId?.name || "Unknown"}</td>
                      <td style={{maxWidth: '200px'}} className="text-truncate">{order.address}</td>
                      <td>
                        <span className={`badge ${order.status === 'Pending' ? 'bg-warning text-dark' : order.status === 'Delivered' ? 'bg-success' : 'bg-primary'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <select 
                          className="form-select form-select-sm" 
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "upload" && (
        <div className="card p-4 shadow-sm border-0 rounded-4 mx-auto" style={{maxWidth: '600px'}}>
          <h4 className="text-center mb-4">Add New Product 📦</h4>
          <form onSubmit={submitHandler}>
            <input
              type="text" name="name" placeholder="Product Name"
              className="form-control mb-3" value={product.name} onChange={onChange} required
            />
            <textarea
              name="description" placeholder="Description" rows="3"
              className="form-control mb-3" value={product.description} onChange={onChange} required
            />
            <input
              type="number" name="price" placeholder="Price (₹)"
              className="form-control mb-3" value={product.price} onChange={onChange} required
            />
            <select
              name="category" className="form-select mb-3"
              value={product.category} onChange={onChange} required
            >
              <option value="">Select Category</option>
              <option value="plastic">Plastic</option>
              <option value="metal">Metal</option>
              <option value="ewaste">E-Waste</option>
              <option value="fabric">Fabric</option>
            </select>
            <input
              type="file" name="image" className="form-control mb-4" onChange={onChange} required
            />
            <button className="btn btn-success btn-lg w-100 fw-bold rounded-pill">
              Upload Product 🚀
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default SellerDashboard;
