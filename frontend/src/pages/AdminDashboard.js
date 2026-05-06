import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [bulkItems, setBulkItems] = useState([]);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === "users") {
        const res = await axios.get("http://localhost:5001/api/auth/users");
        setUsers(res.data);
      } else if (activeTab === "products") {
        const res = await axios.get("http://localhost:5001/api/products/all");
        setProducts(res.data.products);
      } else if (activeTab === "posts") {
        const res = await axios.get("http://localhost:5001/api/posts/all");
        setPosts(res.data);
      } else if (activeTab === "bulk") {
        const res = await axios.get("http://localhost:5001/api/bulk/all");
        setBulkItems(res.data);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast.error("Failed to load data.");
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      if (type === "user") {
        await axios.delete(`http://localhost:5001/api/auth/users/${id}`);
      } else if (type === "product") {
        await axios.delete(`http://localhost:5001/api/products/delete/${id}`);
      } else if (type === "post") {
        await axios.delete(`http://localhost:5001/api/posts/delete/${id}`);
      } else if (type === "bulk") {
        await axios.delete(`http://localhost:5001/api/bulk/delete/${id}`);
      }
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully.`);
      fetchData(); // Refresh the active tab
    } catch (error) {
      toast.error(`Failed to delete ${type}.`);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <div>
          <h2 className="fw-bold text-dark">Admin Dashboard 🛡️</h2>
          <p className="text-muted fs-5">Manage users, products, and community posts.</p>
        </div>
      </div>

      {/* ANALYTICS SUMMARY CARDS */}
      <div className="row mb-5 g-3">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 rounded-4 text-center p-3 bg-primary text-white" style={{background: 'linear-gradient(135deg, #4f46e5, #3b82f6)'}}>
            <h5 className="mb-1 fw-bold">Total Users</h5>
            <h2 className="display-5 fw-bold mb-0">{users.length}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 rounded-4 text-center p-3 bg-success text-white" style={{background: 'linear-gradient(135deg, #059669, #10b981)'}}>
            <h5 className="mb-1 fw-bold">Upcycled Products</h5>
            <h2 className="display-5 fw-bold mb-0">{products.length}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 rounded-4 text-center p-3 text-white" style={{background: 'linear-gradient(135deg, #d97706, #f59e0b)'}}>
            <h5 className="mb-1 fw-bold">Bulk Materials</h5>
            <h2 className="display-5 fw-bold mb-0">{bulkItems.length}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 rounded-4 text-center p-3 text-white" style={{background: 'linear-gradient(135deg, #db2777, #ec4899)'}}>
            <h5 className="mb-1 fw-bold">Eco-Posts</h5>
            <h2 className="display-5 fw-bold mb-0">{posts.length}</h2>
          </div>
        </div>
      </div>

      <ul className="nav nav-pills mb-4 gap-2">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'users' ? 'active bg-success' : 'text-success bg-light'}`} onClick={() => setActiveTab('users')}>Users</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'products' ? 'active bg-success' : 'text-success bg-light'}`} onClick={() => setActiveTab('products')}>Products</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'bulk' ? 'active bg-success' : 'text-success bg-light'}`} onClick={() => setActiveTab('bulk')}>Bulk Waste</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'posts' ? 'active bg-success' : 'text-success bg-light'}`} onClick={() => setActiveTab('posts')}>Community Posts</button>
        </li>
      </ul>

      <div className="card shadow-sm border-0 rounded-4 p-4">
        
        {/* USERS TAB */}
        {activeTab === "users" && (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Action</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td className="fw-bold">{u.name}</td>
                    <td>{u.email}</td>
                    <td><span className={`badge ${u.role === 'admin' ? 'bg-danger' : u.role === 'seller' ? 'bg-primary' : 'bg-success'}`}>{u.role}</span></td>
                    <td><button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete('user', u._id)}>Ban User</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === "products" && (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Action</th></tr></thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id}>
                    <td><img src={p.image?.startsWith("http") ? p.image : `http://localhost:5001/uploads/${p.image}`} alt="img" style={{width:'50px', height:'50px', objectFit:'cover', borderRadius:'8px'}}/></td>
                    <td className="fw-bold">{p.name}</td>
                    <td>{p.category}</td>
                    <td className="text-success">₹{p.price}</td>
                    <td><button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete('product', p._id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* BULK WASTE TAB */}
        {activeTab === "bulk" && (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead><tr><th>Material</th><th>Weight</th><th>Price</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {bulkItems.map(b => (
                  <tr key={b._id}>
                    <td className="fw-bold">{b.material}</td>
                    <td>{b.weight} kg</td>
                    <td className="text-success">₹{b.price}</td>
                    <td>{b.status}</td>
                    <td><button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete('bulk', b._id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* POSTS TAB */}
        {activeTab === "posts" && (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead><tr><th>Author</th><th>Text Preview</th><th>Image</th><th>Action</th></tr></thead>
              <tbody>
                {posts.map(p => (
                  <tr key={p._id}>
                    <td className="fw-bold">{p.author}</td>
                    <td className="text-truncate" style={{maxWidth: '200px'}}>{p.text}</td>
                    <td>{p.image ? <img src={p.image?.startsWith("http") ? p.image : `http://localhost:5001/uploads/${p.image}`} alt="img" style={{width:'50px', height:'50px', objectFit:'cover', borderRadius:'8px'}}/> : 'None'}</td>
                    <td><button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete('post', p._id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;
