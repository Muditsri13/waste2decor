// src/pages/Register.js
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [err, setErr] = useState("");

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submitHandler = (e) => {
    e.preventDefault();
    try {
      register(form);
      navigate("/");
    } catch (error) {
      setErr(error.message || "Register failed");
    }
  };

  return (
    <div className="col-md-7 mx-auto">
      <h2 className="mb-4 text-center">Create Account</h2>
      {err && <div className="alert alert-danger">{err}</div>}
      <form onSubmit={submitHandler}>
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input name="name" className="form-control" value={form.name} onChange={onChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input name="email" type="email" className="form-control" value={form.email} onChange={onChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input name="password" type="password" className="form-control" value={form.password} onChange={onChange} required />
        </div>

        <button className="btn btn-success w-100">Register & Login</button>
      </form>
    </div>
  );
}

export default Register;
