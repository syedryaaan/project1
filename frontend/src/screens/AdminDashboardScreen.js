// NexaStore — Admin Dashboard Screen (Analytics & KPI Overview)
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  FiDollarSign,
  FiShoppingBag,
  FiUsers,
  FiBox,
  FiAlertTriangle,
  FiTrendingUp,
  FiPackage,
} from "react-icons/fi";
import AdminNav from "../components/AdminNav";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Meta from "../components/Meta";

const AdminDashboardScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((s) => s.userLogin);

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate("/login");
      return;
    }

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get("/api/orders/analytics", config);
        setAnalytics(data);
        setLoading(false);
      } catch (err) {
        setError(
          err.response && err.response.data.message
            ? err.response.data.message
            : err.message
        );
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [userInfo, navigate]);

  return (
    <>
      <Meta title="Admin Control Center" />
      <div className="container-custom" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        <AdminNav />

        {loading ? (
          <Loader message="Loading platform analytics..." />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : analytics ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {/* KPI Cards Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {/* Total Revenue */}
              <div className="stat-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="stat-label">Total Revenue</span>
                  <div style={{ color: "var(--brand-primary)", background: "rgba(108,99,255,0.12)", padding: "0.5rem", borderRadius: "var(--radius-sm)" }}>
                    <FiDollarSign size={20} />
                  </div>
                </div>
                <div className="stat-value">${analytics.totalRevenue?.toFixed(2)}</div>
                <div style={{ color: "#22C55E", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <FiTrendingUp size={14} /> From paid orders
                </div>
              </div>

              {/* Total Orders */}
              <div className="stat-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="stat-label">Total Orders</span>
                  <div style={{ color: "#3B82F6", background: "rgba(59,130,246,0.12)", padding: "0.5rem", borderRadius: "var(--radius-sm)" }}>
                    <FiShoppingBag size={20} />
                  </div>
                </div>
                <div className="stat-value">{analytics.totalOrders}</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                  {analytics.paidOrders} paid ({analytics.totalOrders ? Math.round((analytics.paidOrders / analytics.totalOrders) * 100) : 0}%)
                </div>
              </div>

              {/* Products in Catalog */}
              <div className="stat-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="stat-label">Catalog Products</span>
                  <div style={{ color: "#EAB308", background: "rgba(234,179,8,0.12)", padding: "0.5rem", borderRadius: "var(--radius-sm)" }}>
                    <FiBox size={20} />
                  </div>
                </div>
                <div className="stat-value">{analytics.totalProducts}</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                  Active items listed
                </div>
              </div>

              {/* Registered Customers */}
              <div className="stat-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="stat-label">Customers</span>
                  <div style={{ color: "#A855F7", background: "rgba(168,85,247,0.12)", padding: "0.5rem", borderRadius: "var(--radius-sm)" }}>
                    <FiUsers size={20} />
                  </div>
                </div>
                <div className="stat-value">{analytics.totalCustomers}</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                  Registered buyer accounts
                </div>
              </div>
            </div>

            {/* Inventory Alerts & Daily Trend */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }} className="admin-two-col">
              {/* Inventory Alerts */}
              <div className="card">
                <div className="card-header" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#EF4444" }}>
                  <FiAlertTriangle /> Inventory Health & Stock Warnings
                </div>
                <div className="card-body">
                  <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                    <span className="status-badge status-unpaid">
                      Out of stock: {analytics.outOfStockProducts}
                    </span>
                    <span className="status-badge status-pending">
                      Low stock (≤ 5): {analytics.lowStockProducts?.length || 0}
                    </span>
                  </div>

                  {analytics.lowStockProducts && analytics.lowStockProducts.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {analytics.lowStockProducts.map((p) => (
                        <div
                          key={p._id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "0.5rem 0.75rem",
                            background: "var(--bg-secondary)",
                            borderRadius: "var(--radius-sm)",
                            fontSize: "0.875rem",
                          }}
                        >
                          <span style={{ fontWeight: 500 }}>{p.name}</span>
                          <span style={{ color: "#EAB308", fontWeight: 700 }}>
                            {p.countInStock} units left
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
                      All items in stock have healthy inventory levels.
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Sales Trend */}
              <div className="card">
                <div className="card-header" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FiTrendingUp color="var(--brand-primary)" /> Recent 7-Day Revenue Summary
                </div>
                <div className="card-body">
                  {analytics.dailyRevenue && analytics.dailyRevenue.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      {analytics.dailyRevenue.map((d) => (
                        <div
                          key={d._id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "0.5rem 0.75rem",
                            borderBottom: "1px solid var(--border-color)",
                            fontSize: "0.875rem",
                          }}
                        >
                          <span style={{ color: "var(--text-secondary)" }}>{d._id}</span>
                          <span style={{ fontWeight: 700 }}>
                            ${d.revenue?.toFixed(2)} ({d.orders} orders)
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
                      No transactions recorded in the last 7 days.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="card">
              <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FiPackage color="var(--brand-primary)" /> Recent Orders
                </span>
                <Link to="/admin/orderlist" className="btn-secondary btn-sm">
                  View All Orders →
                </Link>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Paid</th>
                      <th>Delivery</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.recentOrders && analytics.recentOrders.length > 0 ? (
                      analytics.recentOrders.map((o) => (
                        <tr key={o._id}>
                          <td style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>
                            {o._id.substring(0, 8).toUpperCase()}
                          </td>
                          <td>{o.user ? o.user.name : "Guest"}</td>
                          <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                          <td style={{ fontWeight: 700 }}>${Number(o.totalPrice).toFixed(2)}</td>
                          <td>
                            <span className={`status-badge ${o.isPaid ? "status-paid" : "status-unpaid"}`}>
                              {o.isPaid ? "Paid" : "Unpaid"}
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge status-${(o.status || "pending").toLowerCase()}`}>
                              {o.status || "Pending"}
                            </span>
                          </td>
                          <td>
                            <Link to={`/order/${o._id}`} className="btn-secondary btn-sm">
                              Details
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" style={{ textAlign: "center", padding: "2rem" }}>
                          No orders placed yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-two-col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
};

export default AdminDashboardScreen;
