// NexaStore — Admin Navigation Component
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiGrid, FiBox, FiShoppingBag, FiUsers, FiArrowLeft } from "react-icons/fi";

const AdminNav = () => {
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: <FiGrid size={16} /> },
    { label: "Products", path: "/admin/productlist", icon: <FiBox size={16} /> },
    { label: "Orders", path: "/admin/orderlist", icon: <FiShoppingBag size={16} /> },
    { label: "Customers", path: "/admin/userlist", icon: <FiUsers size={16} /> },
  ];

  return (
    <div style={{ marginBottom: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <span className="section-label">Administration</span>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Control Center</h2>
        </div>
        <Link to="/" className="btn-secondary btn-sm" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
          <FiArrowLeft size={14} /> Back to Store
        </Link>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem" }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== "/admin/dashboard" && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`btn-sm ${isActive ? "btn-primary" : "btn-secondary"}`}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}
            >
              {item.icon} {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AdminNav;
