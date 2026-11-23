// NexaStore — Footer Component
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="nexa-footer">
      <div className="footer-grid">
        {/* Brand Column */}
        <div>
          <div className="nexa-logo" style={{ fontSize: "1.4rem" }}>
            Nexa<span style={{ color: "var(--brand-secondary)" }}>Store</span>
          </div>
          <p className="footer-brand-desc">
            Premium tech & lifestyle products curated for the modern explorer.
            Quality, style, and innovation — delivered to your door.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
            {["Twitter", "Instagram", "GitHub"].map((social) => (
              <a
                key={social}
                href="#!"
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-sm)",
                  padding: "0.5rem 0.75rem",
                  fontSize: "0.75rem",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  transition: "all var(--transition-fast)",
                }}
              >
                {social}
              </a>
            ))}
          </div>
        </div>

        {/* Shop Column */}
        <div>
          <h4 className="footer-heading">Shop</h4>
          <ul className="footer-links">
            <li><Link to="/">All Products</Link></li>
            <li><Link to="/search/electronics">Electronics</Link></li>
            <li><Link to="/search/audio">Audio</Link></li>
            <li><Link to="/search/gaming">Gaming</Link></li>
            <li><Link to="/search/photography">Photography</Link></li>
          </ul>
        </div>

        {/* Account Column */}
        <div>
          <h4 className="footer-heading">Account</h4>
          <ul className="footer-links">
            <li><Link to="/login">Sign In</Link></li>
            <li><Link to="/register">Create Account</Link></li>
            <li><Link to="/profile">My Orders</Link></li>
            <li><Link to="/wishlist">Wishlist</Link></li>
          </ul>
        </div>

        {/* Support Column */}
        <div>
          <h4 className="footer-heading">Support</h4>
          <ul className="footer-links">
            <li><a href="#!">Help Center</a></li>
            <li><a href="#!">Track Order</a></li>
            <li><a href="#!">Returns</a></li>
            <li><a href="#!">Shipping Policy</a></li>
            <li><a href="#!">Privacy Policy</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          © {new Date().getFullYear()} NexaStore. All rights reserved.
        </p>
        <p className="footer-attribution">
          Built on{" "}
          <a href="https://github.com/mariosknl/ProShop" target="_blank" rel="noreferrer">
            ProShop
          </a>{" "}
          by Marios Kanellopoulos (MIT), tutorial by Brad Traversy.
          Transformed into NexaStore.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
