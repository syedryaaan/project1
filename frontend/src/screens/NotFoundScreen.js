// NexaStore — 404 Not Found Screen
import React from "react";
import { Link } from "react-router-dom";
import Meta from "../components/Meta";

const NotFoundScreen = () => (
  <>
    <Meta title="Page Not Found" />
    <div className="not-found-page">
      <div className="not-found-code">404</div>
      <h1 style={{ fontWeight: 800, marginBottom: "1rem" }}>Page Not Found</h1>
      <p style={{ color: "var(--text-muted)", maxWidth: 400, lineHeight: 1.7, marginBottom: "2.5rem" }}>
        The page you're looking for doesn't exist or has been moved.
        Let's get you back on track.
      </p>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <Link to="/" className="btn-primary">Go Home</Link>
        <button className="btn-secondary" onClick={() => window.history.back()}>
          Go Back
        </button>
      </div>
    </div>
  </>
);

export default NotFoundScreen;
