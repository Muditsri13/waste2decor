// src/components/Spinner.js
import React from "react";

export default function Spinner({ size=40 }) {
  return (
    <div className="center-spinner">
      <div className="spinner-border text-success" style={{ width: size, height: size }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
