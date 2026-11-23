// NexaStore — Wishlist Screen
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiHeart, FiShoppingBag } from "react-icons/fi";
import Meta from "../components/Meta";

const WishlistScreen = () => {
  const { userInfo } = useSelector((s) => s.userLogin);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [userInfo, navigate]);

  if (!userInfo) {
    return null;
  }

  return (
    <>
      <Meta title="My Wishlist" />
      <div className="container-custom" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        <h1 style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem", fontWeight: 800 }}>
          <FiHeart color="var(--brand-secondary)" /> My Wishlist
        </h1>
        <div style={{ textAlign: "center", padding: "5rem 1.5rem" }}>
          <div style={{ fontSize: "5rem", marginBottom: "1.5rem" }}>💝</div>
          <h2>Your wishlist is empty</h2>
          <p style={{ color: "var(--text-muted)", marginTop: "0.5rem", marginBottom: "2rem" }}>
            Browse products and click the heart icon to save items for later.
          </p>
          <Link to="/" className="btn-primary">
            <FiShoppingBag size={16} /> Discover Products
          </Link>
        </div>
      </div>
    </>
  );
};

export default WishlistScreen;
