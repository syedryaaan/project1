// NexaStore — Premium Header Component
import React, { useState, useCallback, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiShoppingCart,
  FiUser,
  FiHeart,
  FiSearch,
  FiMenu,
  FiX,
  FiLogOut,
  FiPackage,
  FiSettings,
  FiChevronDown,
} from "react-icons/fi";
import { logout } from "../actions/userActions";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [searchText, setSearchText] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem("nexastore_theme");
    return stored === "light" || stored === "dark" ? stored : "dark";
  });

  const { userInfo } = useSelector((s) => s.userLogin);
  const { cartItems } = useSelector((s) => s.cart);

  const totalQty = cartItems.reduce((a, i) => a + i.qty, 0);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("nexastore_theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setDropdownOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      if (searchText.trim()) {
        navigate(`/search/${encodeURIComponent(searchText.trim())}`);
        setSearchText("");
      } else {
        navigate("/");
      }
      setMobileOpen(false);
    },
    [searchText, navigate]
  );

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    setMobileOpen(false);
    dispatch(logout());
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement-bar" role="region" aria-label="Promotions">
        🚀&nbsp; Free shipping over $100
        <span className="announcement-extra">
          &nbsp;•&nbsp; New arrivals every week
        </span>
        &nbsp;•&nbsp; Code&nbsp;<strong>NEXA20</strong>&nbsp;for 20% off
      </div>

      {/* Main Header */}
      <header className="nexa-header">
        <nav className="nexa-navbar" aria-label="Main navigation">
          {/* Logo */}
          <Link to="/" className="nexa-logo" style={{ textDecoration: "none" }}>
            Nexa<span>Store</span>
          </Link>

          {/* Search */}
          <div className="nav-search-wrap">
            <form className="nexa-search" onSubmit={handleSearch} role="search">
              <input
                type="search"
                aria-label="Search products and brands"
                placeholder="Search products, brands..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <button type="submit" aria-label="Submit search">
                <FiSearch size={16} aria-hidden="true" />
              </button>
            </form>
          </div>

          {/* Nav Actions */}
          <div className="nav-actions">
            {/* Theme Toggle */}
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="nav-icon-btn"
              aria-label="Wishlist"
              title="Wishlist"
            >
              <FiHeart size={18} aria-hidden="true" />
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="nav-icon-btn"
              aria-label={`Shopping cart with ${totalQty} items`}
              title="Cart"
            >
              <FiShoppingCart size={18} aria-hidden="true" />
              <span className="nav-cart-label">Cart</span>
              {totalQty > 0 && <span className="cart-badge">{totalQty}</span>}
            </Link>

            {/* Account */}
            {userInfo ? (
              <div
                ref={dropdownRef}
                className={`nav-dropdown ${dropdownOpen ? "open" : ""}`}
              >
                <button
                  type="button"
                  className="nav-icon-btn"
                  onClick={() => setDropdownOpen((o) => !o)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="menu"
                  aria-label="Account menu"
                >
                  <FiUser size={18} aria-hidden="true" />
                  <span
                    style={{
                      fontSize: "0.85rem",
                      maxWidth: 80,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {userInfo.name.split(" ")[0]}
                  </span>
                  <FiChevronDown size={14} aria-hidden="true" />
                </button>
                <div className="nav-dropdown-menu" role="menu">
                  <Link
                    to="/profile"
                    className="nav-dropdown-item"
                    role="menuitem"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FiUser size={15} aria-hidden="true" /> My Profile
                  </Link>
                  <Link
                    to="/profile#orders"
                    className="nav-dropdown-item"
                    role="menuitem"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FiPackage size={15} aria-hidden="true" /> My Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    className="nav-dropdown-item"
                    role="menuitem"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FiHeart size={15} aria-hidden="true" /> Wishlist
                  </Link>
                  {userInfo.isAdmin && (
                    <>
                      <div className="nav-dropdown-divider" />
                      <Link
                        to="/admin/dashboard"
                        className="nav-dropdown-item"
                        role="menuitem"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FiSettings size={15} aria-hidden="true" /> Admin Dashboard
                      </Link>
                    </>
                  )}
                  <div className="nav-dropdown-divider" />
                  <button
                    type="button"
                    className="nav-dropdown-item"
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    <FiLogOut size={15} aria-hidden="true" /> Sign Out
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
              type="button"
              className="theme-toggle mobile-menu-btn"
              onClick={() => setMobileOpen((o) => !o)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {mobileOpen ? (
                <FiX size={20} aria-hidden="true" />
              ) : (
                <FiMenu size={20} aria-hidden="true" />
              )}
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
              boxShadow: "var(--shadow-md)",
            }}
          >
            <form className="nexa-search" onSubmit={handleSearch} role="search">
              <input
                type="search"
                aria-label="Search products"
                placeholder="Search products, brands..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <button type="submit" aria-label="Submit mobile search">
                <FiSearch size={16} aria-hidden="true" />
              </button>
            </form>
            <Link
              to="/wishlist"
              className="nav-dropdown-item"
              onClick={() => setMobileOpen(false)}
            >
              <FiHeart size={15} aria-hidden="true" /> Wishlist
            </Link>
            <Link
              to="/cart"
              className="nav-dropdown-item"
              onClick={() => setMobileOpen(false)}
            >
              <FiShoppingCart size={15} aria-hidden="true" /> Cart ({totalQty})
            </Link>
            {userInfo ? (
              <>
                <Link
                  to="/profile"
                  className="nav-dropdown-item"
                  onClick={() => setMobileOpen(false)}
                >
                  <FiUser size={15} aria-hidden="true" /> My Profile & Orders
                </Link>
                {userInfo.isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="nav-dropdown-item"
                    onClick={() => setMobileOpen(false)}
                  >
                    <FiSettings size={15} aria-hidden="true" /> Admin Dashboard
                  </Link>
                )}
                <button
                  type="button"
                  className="nav-dropdown-item"
                  onClick={handleLogout}
                >
                  <FiLogOut size={15} aria-hidden="true" /> Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="btn-primary btn-block"
                onClick={() => setMobileOpen(false)}
              >
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
