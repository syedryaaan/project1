// NexaStore — Premium Header Component
import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiShoppingCart, FiUser, FiHeart, FiSearch, FiMenu, FiX, FiLogOut, FiPackage, FiSettings } from "react-icons/fi";
import { logout } from "../actions/userActions";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState("dark");

  const { userInfo } = useSelector((s) => s.userLogin);
  const { cartItems } = useSelector((s) => s.cart);

  const totalQty = cartItems.reduce((a, i) => a + i.qty, 0);

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      if (searchText.trim()) {
        navigate(`/search/${encodeURIComponent(searchText.trim())}`);
        setSearchText("");
      } else {
        navigate("/");
      }
    },
    [searchText, navigate]
  );

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const handleLogout = () => dispatch(logout());

  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement-bar">
        🚀&nbsp; Free shipping on orders over $100 &nbsp;•&nbsp; New arrivals every week &nbsp;•&nbsp; Use code{" "}
        <strong>&nbsp;NEXA20&nbsp;</strong> for 20% off your first order
      </div>

      {/* Main Header */}
      <header className="nexa-header">
        <nav className="nexa-navbar">
          {/* Logo */}
          <Link to="/" className="nexa-logo" style={{ textDecoration: "none" }}>
            Nexa<span>Store</span>
          </Link>

          {/* Search */}
          <div className="nav-search-wrap">
            <form className="nexa-search" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search products, brands..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <button type="submit" aria-label="Search">
                <FiSearch size={16} />
              </button>
            </form>
          </div>

          {/* Nav Actions */}
          <div className="nav-actions">
            {/* Theme Toggle */}
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="nav-icon-btn" title="Wishlist">
              <FiHeart size={18} />
            </Link>

            {/* Cart */}
            <Link to="/cart" className="nav-icon-btn" title="Cart">
              <FiShoppingCart size={18} />
              <span className="d-none d-md-inline" style={{ fontSize: "0.85rem" }}>
                Cart
              </span>
              {totalQty > 0 && (
                <span className="cart-badge">{totalQty}</span>
              )}
            </Link>

            {/* Account */}
            {userInfo ? (
              <div className="nav-dropdown">
                <button className="nav-icon-btn">
                  <FiUser size={18} />
                  <span style={{ fontSize: "0.85rem", maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {userInfo.name.split(" ")[0]}
                  </span>
                </button>
                <div className="nav-dropdown-menu">
                  <Link to="/profile" className="nav-dropdown-item">
                    <FiUser size={15} /> My Profile
                  </Link>
                  <Link to="/profile" className="nav-dropdown-item">
                    <FiPackage size={15} /> My Orders
                  </Link>
                  <Link to="/wishlist" className="nav-dropdown-item">
                    <FiHeart size={15} /> Wishlist
                  </Link>
                  {userInfo.isAdmin && (
                    <>
                      <div className="nav-dropdown-divider" />
                      <Link to="/admin/dashboard" className="nav-dropdown-item">
                        <FiSettings size={15} /> Admin Dashboard
                      </Link>
                    </>
                  )}
                  <div className="nav-dropdown-divider" />
                  <button className="nav-dropdown-item" onClick={handleLogout}>
                    <FiLogOut size={15} /> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn-primary btn-sm">
                Sign In
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="theme-toggle d-md-none"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Menu"
            >
              {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div
            style={{
              background: "var(--bg-card)",
              borderTop: "1px solid var(--border-color)",
              padding: "1rem 1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <form className="nexa-search" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <button type="submit">
                <FiSearch size={16} />
              </button>
            </form>
            {!userInfo && (
              <Link to="/login" className="btn-primary" onClick={() => setMobileOpen(false)}>
                Sign In
              </Link>
            )}
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
