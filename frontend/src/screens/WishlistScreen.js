// NexaStore — Wishlist Screen
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiHeart, FiShoppingBag, FiShoppingCart, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import Meta from "../components/Meta";
import { addToCart } from "../actions/cartActions";
import { getWishlistItems, removeWishlistItem } from "../utils/wishlist";

const WishlistScreen = () => {
  const { userInfo } = useSelector((s) => s.userLogin);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [items, setItems] = useState(() => getWishlistItems());

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    const sync = () => setItems(getWishlistItems());
    window.addEventListener("wishlist:updated", sync);
    return () => window.removeEventListener("wishlist:updated", sync);
  }, []);

  if (!userInfo) {
    return null;
  }

  const handleRemove = (id) => {
    setItems(removeWishlistItem(id));
    toast.info("Removed from wishlist");
  };

  const handleMoveToCart = (item) => {
    if (item.countInStock === 0) return;
    dispatch(addToCart(item._id, 1));
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <>
      <Meta title="My Wishlist" />
      <div className="container-custom" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        <h1 style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem", fontWeight: 800 }}>
          <FiHeart color="var(--brand-secondary)" aria-hidden="true" /> My Wishlist ({items.length})
        </h1>

        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 1.5rem" }}>
            <div style={{ fontSize: "5rem", marginBottom: "1.5rem" }} aria-hidden="true">💝</div>
            <h2>Your wishlist is empty</h2>
            <p style={{ color: "var(--text-muted)", marginTop: "0.5rem", marginBottom: "2rem" }}>
              Browse products and click the heart icon to save items for later.
            </p>
            <Link to="/" className="btn-primary">
              <FiShoppingBag size={16} aria-hidden="true" /> Discover Products
            </Link>
          </div>
        ) : (
          <div className="product-grid">
            {items.map((item) => {
              const effectivePrice = item.discount
                ? item.price * (1 - item.discount / 100)
                : item.price;
              return (
                <article key={item._id} className="product-card">
                  <Link to={`/product/${item._id}`} className="product-card-link">
                    <div className="product-image-wrap">
                      <img src={item.image} alt={item.name} loading="lazy" />
                    </div>
                  </Link>
                  <div className="product-info">
                    <div className="product-category-tag">{item.category}</div>
                    <Link to={`/product/${item._id}`} className="product-card-link">
                      <h2 className="product-name">{item.name}</h2>
                    </Link>
                    <div className="product-price-row">
                      <span className="product-price">${effectivePrice.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="product-card-actions">
                    <button
                      type="button"
                      className="btn-primary btn-sm"
                      style={{ flex: 1, justifyContent: "center" }}
                      disabled={item.countInStock === 0}
                      onClick={() => handleMoveToCart(item)}
                    >
                      <FiShoppingCart size={14} aria-hidden="true" />
                      {item.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                    <button
                      type="button"
                      className="btn-danger"
                      style={{ padding: "0.45rem 0.75rem" }}
                      aria-label={`Remove ${item.name} from wishlist`}
                      onClick={() => handleRemove(item._id)}
                    >
                      <FiTrash2 size={14} aria-hidden="true" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default WishlistScreen;
