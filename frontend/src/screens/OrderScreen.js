// NexaStore — Order Screen (RRD v6) with PayPal
import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { FiPackage, FiMapPin, FiCreditCard, FiCheck } from "react-icons/fi";
import { toast } from "react-toastify";

import Message from "../components/Message";
import Loader from "../components/Loader";
import Meta from "../components/Meta";
import { getOrderDetails, payOrder, deliverOrder } from "../actions/orderActions";
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from "../constants/orderConstants";

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((s) => s.userLogin);
  const { loading, error, order } = useSelector((s) => s.orderDetails);
  const { loading: loadingPay, success: successPay } = useSelector((s) => s.orderPay);
  const { loading: loadingDeliver, success: successDeliver } = useSelector((s) => s.orderDeliver);

  useEffect(() => {
    if (successPay) { dispatch({ type: ORDER_PAY_RESET }); toast.success("Payment successful! 🎉"); }
    if (successDeliver) { dispatch({ type: ORDER_DELIVER_RESET }); toast.success("Order marked as delivered!"); }
    dispatch(getOrderDetails(orderId));
  }, [dispatch, orderId, successPay, successDeliver]);

  const onApprove = (data, actions) =>
    actions.order.capture().then((details) => {
      dispatch(payOrder(orderId, details));
    });

  const handleDeliver = () => dispatch(deliverOrder(order));

  if (loading || !order) return <div className="container-custom"><Loader /></div>;
  if (error) return <div className="container-custom"><Message variant="danger">{error}</Message></div>;

  const { orderItems, shippingAddress, paymentMethod, paymentResult, itemsPrice, shippingPrice, taxPrice, totalPrice, isPaid, paidAt, isDelivered, deliveredAt, status } = order;

  return (
    <>
      <Meta title={`Order #${orderId.substring(0, 8).toUpperCase()}`} />
      <div className="container-custom" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontWeight: 800 }}>Order #{orderId.substring(0, 8).toUpperCase()}</h1>
          <span className={`status-badge status-${status?.toLowerCase() || "pending"}`}>
            {status || "Pending"}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "2rem", alignItems: "start" }} className="order-layout">
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Shipping */}
            <div className="card">
              <div className="card-header" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <FiMapPin color="var(--brand-primary)" /> Shipping
              </div>
              <div className="card-body">
                <p style={{ color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
                  {shippingAddress.address}, {shippingAddress.city} {shippingAddress.postalCode}, {shippingAddress.country}
                </p>
                {isDelivered ? (
                  <Message variant="success">Delivered on {new Date(deliveredAt).toLocaleDateString()}</Message>
                ) : (
                  <Message variant="warning">Not yet delivered</Message>
                )}
              </div>
            </div>

            {/* Payment */}
            <div className="card">
              <div className="card-header" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <FiCreditCard color="var(--brand-primary)" /> Payment
              </div>
              <div className="card-body">
                <p style={{ color: "var(--text-secondary)", marginBottom: "0.75rem" }}>Method: {paymentMethod}</p>
                {isPaid ? (
                  <Message variant="success">Paid on {new Date(paidAt).toLocaleDateString()}</Message>
                ) : (
                  <Message variant="warning">Awaiting payment</Message>
                )}
              </div>
            </div>

            {/* Items */}
            <div className="card">
              <div className="card-header" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <FiPackage color="var(--brand-primary)" /> Items
              </div>
              <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {orderItems.map((item) => (
                  <div key={item.product} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <img src={item.image} alt={item.name} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: "var(--radius-sm)" }} />
                    <Link to={`/product/${item.product}`} style={{ flex: 1, fontSize: "0.875rem", fontWeight: 600 }}>{item.name}</Link>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.875rem", whiteSpace: "nowrap" }}>
                      {item.qty} × ${item.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="card" style={{ position: "sticky", top: "calc(var(--header-height) + var(--announcement-height) + 1rem)" }}>
            <div className="card-header" style={{ fontWeight: 800 }}>Order Summary</div>
            <div className="card-body">
              {[
                { label: "Items", value: `$${Number(itemsPrice).toFixed(2)}` },
                { label: "Shipping", value: Number(shippingPrice) === 0 ? "FREE" : `$${Number(shippingPrice).toFixed(2)}` },
                { label: "Tax", value: `$${Number(taxPrice).toFixed(2)}` },
              ].map((row) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "0.65rem 0", borderBottom: "1px solid var(--border-color)", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                  <span>{row.label}</span>
                  <span style={{ fontWeight: 600, color: row.value === "FREE" ? "#22C55E" : "var(--text-primary)" }}>{row.value}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "1rem 0", fontWeight: 800, fontSize: "1.15rem" }}>
                <span>Total</span><span>${Number(totalPrice).toFixed(2)}</span>
              </div>

              {/* PayPal Button */}
              {!isPaid && (
                <div style={{ marginTop: "1rem" }}>
                  {loadingPay && <Loader message="Processing payment..." />}
                  <PayPalScriptProvider options={{ "client-id": "sb", currency: "USD" }}>
                    <PayPalButtons
                      createOrder={(data, actions) =>
                        actions.order.create({
                          purchase_units: [{ amount: { value: totalPrice.toString() } }],
                        })
                      }
                      onApprove={onApprove}
                      onError={(err) => toast.error("Payment failed. Please try again.")}
                      style={{ layout: "vertical", shape: "rect" }}
                    />
                  </PayPalScriptProvider>
                </div>
              )}

              {/* Admin deliver button */}
              {userInfo?.isAdmin && isPaid && !isDelivered && (
                <button
                  className="btn-primary btn-block"
                  style={{ marginTop: "1rem" }}
                  onClick={handleDeliver}
                  disabled={loadingDeliver}
                >
                  <FiCheck size={16} />
                  {loadingDeliver ? "Updating..." : "Mark as Delivered"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) { .order-layout { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  );
};

export default OrderScreen;
