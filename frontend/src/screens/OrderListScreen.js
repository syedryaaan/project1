// NexaStore — Admin Order List Screen (RRD v6)
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiCheck, FiX, FiEye } from "react-icons/fi";

import Message from "../components/Message";
import Loader from "../components/Loader";
import AdminNav from "../components/AdminNav";
import Meta from "../components/Meta";
import { listOrders } from "../actions/orderActions";

const OrderListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders());
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate, userInfo]);

  return (
    <>
      <Meta title="Admin Order Management" />
      <div className="container-custom" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        <AdminNav />

        <div style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Order Management</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            Track transactions, payment statuses, fulfillment, and customer delivery states.
          </p>
        </div>

        {loading ? (
          <Loader message="Loading orders..." />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Fulfillment</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders && orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order._id}>
                      <td style={{ fontFamily: "monospace", fontSize: "0.85rem", fontWeight: 600 }}>
                        {order._id.substring(0, 8).toUpperCase()}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{order.user ? order.user.name : "Guest / Deleted"}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          {order.user ? order.user.email : ""}
                        </div>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td style={{ fontWeight: 700 }}>${Number(order.totalPrice).toFixed(2)}</td>
                      <td>
                        {order.isPaid ? (
                          <span className="status-badge status-paid">
                            <FiCheck size={12} /> Paid ({new Date(order.paidAt).toLocaleDateString()})
                          </span>
                        ) : (
                          <span className="status-badge status-unpaid">
                            <FiX size={12} /> Unpaid
                          </span>
                        )}
                      </td>
                      <td>
                        {order.isDelivered ? (
                          <span className="status-badge status-delivered">
                            <FiCheck size={12} /> Delivered
                          </span>
                        ) : (
                          <span className="status-badge status-pending">
                            Pending Dispatch
                          </span>
                        )}
                      </td>
                      <td>
                        <Link
                          to={`/order/${order._id}`}
                          className="btn-secondary btn-sm"
                          style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                        >
                          <FiEye size={14} /> Review
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "2rem" }}>
                      No customer orders recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default OrderListScreen;
