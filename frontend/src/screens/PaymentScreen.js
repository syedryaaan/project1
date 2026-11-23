// NexaStore — Payment Screen (RRD v6)
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiCreditCard, FiArrowRight } from "react-icons/fi";

import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../actions/cartActions";
import Meta from "../components/Meta";

const PAYMENT_METHODS = [
  { value: "PayPal", label: "PayPal", icon: "💳", desc: "Pay securely with PayPal" },
  { value: "Credit Card", label: "Credit / Debit Card", icon: "🏦", desc: "Visa, Mastercard, Amex" },
];

const PaymentScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shippingAddress } = useSelector((s) => s.cart);
  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  useEffect(() => {
    if (!shippingAddress?.address) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  return (
    <>
      <Meta title="Payment Method" />
      <div className="container-custom" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        <CheckoutSteps step1 step2 step3 />
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div className="form-card">
            <h2 style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem", fontWeight: 800 }}>
              <FiCreditCard color="var(--brand-primary)" /> Payment Method
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "2rem" }}>
              Choose how you'd like to pay for your order.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {PAYMENT_METHODS.map((m) => (
                <label
                  key={m.value}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1.25rem",
                    background: paymentMethod === m.value ? "rgba(108,99,255,0.08)" : "var(--bg-secondary)",
                    border: `2px solid ${paymentMethod === m.value ? "var(--brand-primary)" : "var(--border-color)"}`,
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={m.value}
                    checked={paymentMethod === m.value}
                    onChange={() => setPaymentMethod(m.value)}
                    style={{ accentColor: "var(--brand-primary)" }}
                  />
                  <span style={{ fontSize: "1.5rem" }}>{m.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600 }}>{m.label}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{m.desc}</div>
                  </div>
                </label>
              ))}

              <button type="submit" className="btn-primary btn-block" style={{ marginTop: "0.5rem" }}>
                Review Order <FiArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentScreen;
