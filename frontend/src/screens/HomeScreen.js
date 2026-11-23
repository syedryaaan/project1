// NexaStore — Premium Home Screen
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiArrowRight, FiZap, FiShield, FiTruck } from "react-icons/fi";

import ProductCard from "../components/ProductCard";
import { listProducts } from "../actions/productActions";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";
import Meta from "../components/Meta";

const CATEGORIES = [
  { name: "Electronics", slug: "Electronics", icon: "💻" },
  { name: "Audio", slug: "Audio", icon: "🎧" },
  { name: "Gaming", slug: "Gaming", icon: "🎮" },
  { name: "Photography", slug: "Photography", icon: "📷" },
  { name: "Smart Home", slug: "Smart Home", icon: "🏠" },
  { name: "Accessories", slug: "Accessories", icon: "🖱️" },
];

const FEATURES = [
  { icon: <FiTruck size={22} />, title: "Free Shipping", desc: "On orders over $100" },
  { icon: <FiShield size={22} />, title: "2-Year Warranty", desc: "On all products" },
  { icon: <FiZap size={22} />, title: "Fast Delivery", desc: "2-5 business days" },
];

const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton" style={{ aspectRatio: "1", width: "100%" }} />
    <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div className="skeleton" style={{ height: 12, width: "60%" }} />
      <div className="skeleton" style={{ height: 16, width: "90%" }} />
      <div className="skeleton" style={{ height: 16, width: "75%" }} />
      <div className="skeleton" style={{ height: 24, width: "40%" }} />
    </div>
  </div>
);

const HomeScreen = () => {
  const { keyword, pageNumber = 1 } = useParams();
  const dispatch = useDispatch();

  const { loading, error, products, page, pages } = useSelector(
    (s) => s.productList
  );

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]);

  return (
    <>
      <Meta />

      {/* ── Hero Section (only on main page) ── */}
      {!keyword && (
        <section className="hero-section">
          <div className="hero-content">
            <div>
              <div className="hero-badge">🔥 New Collection 2024</div>
              <h1 className="hero-title">
                Tech That Elevates{" "}
                <span className="gradient-text">Your Lifestyle</span>
              </h1>
              <p className="hero-description">
                Curated premium electronics, audio gear, and lifestyle products.
                Discover the future of technology — delivered to your door.
              </p>
              <div className="hero-actions">
                <Link to="#products" className="btn-primary">
                  Shop Now <FiArrowRight size={16} />
                </Link>
                <Link to="#categories" className="btn-secondary">
                  Browse Categories
                </Link>
              </div>
              <div className="hero-stats">
                {[
                  { value: "500+", label: "Products" },
                  { value: "50K+", label: "Happy Customers" },
                  { value: "4.9★", label: "Avg. Rating" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="hero-stat-value">{s.value}</div>
                    <div className="hero-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hero-image-wrap">
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(108,99,255,0.2), rgba(255,107,107,0.1))",
                  borderRadius: "var(--radius-xl)",
                  aspectRatio: "1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12rem",
                  border: "1px solid var(--border-color)",
                }}
              >
                🛍️
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Feature Strip ── */}
      {!keyword && (
        <section style={{ background: "var(--bg-secondary)", padding: "2rem 0", borderBottom: "1px solid var(--border-color)" }}>
          <div
            className="container-custom"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "2rem",
            }}
          >
            {FEATURES.map((f) => (
              <div key={f.title} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div
                  style={{
                    background: "rgba(108,99,255,0.12)",
                    color: "var(--brand-primary)",
                    padding: "0.75rem",
                    borderRadius: "var(--radius-sm)",
                    flexShrink: 0,
                  }}
                >
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{f.title}</div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="container-custom">
        {/* ── Shop by Category ── */}
        {!keyword && (
          <section className="section" id="categories">
            <div className="section-header">
              <div>
                <span className="section-label">Browse By</span>
                <h2 className="section-title">Shop Categories</h2>
              </div>
            </div>
            <div className="category-grid">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/search/${encodeURIComponent(cat.slug)}`}
                  className="category-card"
                >
                  <span className="category-icon">{cat.icon}</span>
                  <span className="category-name">{cat.name}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Products Section ── */}
        <section className="section" id="products">
          <div className="section-header">
            <div>
              {keyword ? (
                <>
                  <span className="section-label">Search Results</span>
                  <h2 className="section-title">"{keyword}"</h2>
                </>
              ) : (
                <>
                  <span className="section-label">Our Collection</span>
                  <h2 className="section-title">Latest Products</h2>
                </>
              )}
            </div>
            {keyword && (
              <Link to="/" className="btn-secondary btn-sm">
                ← Clear Search
              </Link>
            )}
          </div>

          {loading ? (
            <div className="product-grid">
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : products && products.length > 0 ? (
            <>
              <div className="product-grid">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <Paginate pages={pages} page={page} keyword={keyword || ""} />
            </>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "5rem 1.5rem",
                color: "var(--text-muted)",
              }}
            >
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔍</div>
              <h3>No products found</h3>
              <p style={{ marginTop: "0.5rem", marginBottom: "1.5rem" }}>
                Try a different search term or browse our categories.
              </p>
              <Link to="/" className="btn-primary">
                Browse All Products
              </Link>
            </div>
          )}
        </section>

        {/* ── Newsletter ── */}
        {!keyword && (
          <section className="newsletter-section">
            <span className="section-label">Stay Updated</span>
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", marginTop: "0.5rem" }}>
              Get Exclusive Deals First
            </h2>
            <p style={{ color: "var(--text-secondary)", marginTop: "0.75rem" }}>
              Subscribe to our newsletter and be the first to know about new arrivals,
              special offers, and tech news.
            </p>
            <div className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email address"
                className="newsletter-input"
              />
              <button className="btn-primary">Subscribe</button>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default HomeScreen;
