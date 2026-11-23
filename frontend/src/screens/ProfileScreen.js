// NexaStore — Profile Screen (RRD v6)
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiPackage, FiEdit } from "react-icons/fi";
import { toast } from "react-toastify";

import Message from "../components/Message";
import Loader from "../components/Loader";
import Meta from "../components/Meta";
import { getUserDetails, updateUserProfile } from "../actions/userActions";
import { listMyOrders } from "../actions/orderActions";

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { loading, error, user } = useSelector((s) => s.userDetails);
  const { userInfo } = useSelector((s) => s.userLogin);
  const { success } = useSelector((s) => s.userUpdateProfile);
  const { loading: ordersLoading, orders } = useSelector((s) => s.orderListMy);

  useEffect(() => {
    if (!userInfo) { navigate("/login"); return; }
    if (!user || !user.name) {
      dispatch(getUserDetails("profile"));
      dispatch(listMyOrders());
    } else {
      setName(user.name);
      setEmail(user.email);
    }
  }, [dispatch, userInfo, navigate, user]);

  useEffect(() => {
    if (success) toast.success("Profile updated successfully!");
    if (error) toast.error(error);
  }, [success, error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) { toast.error("Passwords do not match"); return; }
    if (password && password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    dispatch(updateUserProfile({ id: user._id, name, email, password }));
    setPassword(""); setConfirmPassword("");
  };

  if (!userInfo) return null;

  return (
    <>
      <Meta title="My Account" />
      <div className="container-custom" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: "2rem", alignItems: "start" }} className="profile-layout">
          {/* Profile Form */}
          <div className="form-card">
            <h2 style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontWeight: 800, marginBottom: "2rem" }}>
              <FiUser color="var(--brand-primary)" /> My Profile
            </h2>
            {loading && <Loader message="Loading..." />}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
              <div className="form-group">
                <label className="form-label"><FiUser size={13} style={{ marginRight: "0.4rem" }} />Name</label>
                <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label"><FiMail size={13} style={{ marginRight: "0.4rem" }} />Email</label>
                <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label"><FiLock size={13} style={{ marginRight: "0.4rem" }} />New Password</label>
                <input type="password" className="form-control" placeholder="Leave blank to keep current" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label"><FiLock size={13} style={{ marginRight: "0.4rem" }} />Confirm Password</label>
                <input type="password" className="form-control" placeholder="Repeat new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              <button type="submit" className="btn-primary btn-block" disabled={loading}>
                <FiEdit size={15} /> Update Profile
              </button>
            </form>
          </div>

          {/* Order History */}
          <div>
            <h2 style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontWeight: 800, marginBottom: "1.5rem" }}>
              <FiPackage color="var(--brand-primary)" /> My Orders
            </h2>
            {ordersLoading ? (
              <Loader message="Loading orders..." />
            ) : !orders || orders.length === 0 ? (
              <Message variant="info">You have no orders yet. <a href="/" style={{ color: "var(--brand-primary)" }}>Start shopping!</a></Message>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Paid</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>{order._id.substring(0, 8).toUpperCase()}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td style={{ fontWeight: 700 }}>${Number(order.totalPrice).toFixed(2)}</td>
                        <td>
                          <span className={`status-badge ${order.isPaid ? "status-paid" : "status-unpaid"}`}>
                            {order.isPaid ? "Paid" : "Unpaid"}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge status-${(order.status || "pending").toLowerCase()}`}>
                            {order.status || "Pending"}
                          </span>
                        </td>
                        <td>
                          <a href={`/order/${order._id}`} className="btn-secondary btn-sm" style={{ display: "inline-flex" }}>
                            Details
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) { .profile-layout { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  );
};

export default ProfileScreen;
