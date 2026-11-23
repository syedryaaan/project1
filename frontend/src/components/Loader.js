// NexaStore — Loader Component
import React from "react";

const Loader = ({ message = "Loading..." }) => (
  <div className="loader-container">
    <div className="spinner" />
    <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>{message}</p>
  </div>
);

export default Loader;
