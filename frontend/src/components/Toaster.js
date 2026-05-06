// src/components/Toaster.js
import React from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Toaster() {
  return <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} newestOnTop />;
}
