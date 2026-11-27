// NexaStore — Place Order Screen (RRD v6)
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiPackage, FiMapPin, FiCreditCard } from "react-icons/fi";
import { toast } from "react-toastify";

import CheckoutSteps from "../components/CheckoutSteps";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Meta from "../components/Meta";
import { createOrder } from "../actions/orderActions";
import { ORDER_CREATE_RESET } from "../constants/orderConstants";

const PlaceOrderScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, shippingAddress, paymentMethod } = useSelector((s) => s.cart);
  const { loading, error, success, order } = useSelector((s) => s.orderCreate);

  const itemsPrice = cartItems.reduce((acc, i) => acc + i.price * i.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = itemsPrice * 0.15;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  useEffect(() => {
    if (!shippingAddress?.address) {
      navigate("/shipping");
    } else if (!paymentMethod) {
      navigate("/payment");
    }
  }, [shippingAddress, paymentMethod, navigate]);

  useEffect(() => {
    if (success && order?._id) {
      dispatch({ type: ORDER_CREATE_RESET });
      navigate(`/order/${order._id}`);
    }
    if (error) toast.error(error);
  }, [success, navigate, order, dispatch, error]);

  const handlePlaceOrder = () => {
    dispatch(
      createOrder({
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice: itemsPrice.toFixed(2),
        taxPrice: taxPrice.toFixed(2),
        shippingPrice: shippingPrice.toFixed(2),
        totalPrice: totalPrice.toFixed(2),
      })
    );
  };

  return (
    <>
      <Meta title="Place Order" />
      <div className="container-custom" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        <CheckoutSteps step1 step2 step3 step4 />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "2rem", alignItems: "start" }} className="placeorder-layout">
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Shipping */}
            <div className="card">
              <div className="card-header" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <FiMapPin color="var(--brand-primary)" aria-hidden="true" /> Shipping Address
              </div>
              <div className="card-body">
                <p style={{ color: "var(--text-secondary)" }}>
                  {shippingAddress?.address}, {shippingAddress?.city}{" "}
                  {shippingAddress?.postalCode}, {shippingAddress?.country}
                </p>
              </div>
            </div>

            {/* Payment */}
            <div className="card">
              <div className="card-header" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <FiCreditCard color="var(--brand-primary)" aria-hidden="true" /> Payment Method
              </div>
              <div className="card-body">
                <p style={{ color: "var(--text-secondary)" }}>{paymentMethod || "PayPal"}</p>
              </div>
            </div>

            {/* Items */}
            <div className="card">
              <div className="card-header" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <FiPackage color="var(--brand-primary)" aria-hidden="true" /> Order Items
              </div>
              <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {cartItems.length === 0 ? (
                  <Message variant="info">
                    Your cart is empty. <Link to="/">Browse products</Link>
                  </Message>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.product} style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        style={{ width: 48, height: 48, objectFit: "cover", borderRadius: "var(--radius-sm)" }}
                      />
                      <Link to={`/product/${item.product}`} style={{ flex: 1, minWidth: 140, fontSize: "0.875rem", fontWeight: 600 }}>
                        {item.name}
                      </Link>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.875rem", whiteSpace: "nowrap" }}>
                        {item.qty} × ${item.price.toFixed(2)} = ${(item.qty * item.price).toFixed(2)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="card" style={{ position: "sticky", top: "calc(var(--header-height) + var(--announcement-height) + 1rem)" }}>
            <div className="card-header" style={{ fontWeight: 800 }}>Order Summary</div>
            <div className="card-body">
              {[
                { label: "Items", value: `$${itemsPrice.toFixed(2)}` },
                { label: "Shipping", value: shippingPrice === 0 ? "FREE" : `$${shippingPrice.toFixed(2)}` },
                { label: "Tax (15%)", value: `$${taxPrice.toFixed(2)}` },
              ].map((row) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "0.65rem 0", borderBottom: "1px solid var(--border-color)", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                  <span>{row.label}</span>
                  <span style={{ fontWeight: 600, color: row.value === "FREE" ? "#22C55E" : "var(--text-primary)" }}>{row.value}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "1rem 0", fontWeight: 800, fontSize: "1.15rem" }}>
                <span>Total</span><span>${totalPrice.toFixed(2)}</span>
              </div>

              {error && <Message variant="danger">{error}</Message>}
              {loading && <Loader message="Placing order..." />}

              <button
                type="button"
                className="btn-primary btn-block"
                onClick={handlePlaceOrder}
                disabled={cartItems.length === 0 || loading}
              >
                Place Order 🎉
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) { .placeorder-layout { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  );
};

export default PlaceOrderScreen;
