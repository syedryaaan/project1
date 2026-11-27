// NexaStore — Shipping Screen (RRD v6)
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiArrowRight } from "react-icons/fi";

import CheckoutSteps from "../components/CheckoutSteps";
import { saveShippingAddress } from "../actions/cartActions";
import Meta from "../components/Meta";

const ShippingScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shippingAddress } = useSelector((s) => s.cart);

  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || "");
  const [country, setCountry] = useState(shippingAddress?.country || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate("/payment");
  };

  return (
    <>
      <Meta title="Shipping Address" />
      <div className="container-custom" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        <CheckoutSteps step1 step2 />
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div className="form-card">
            <h1 style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem", fontWeight: 800, fontSize: "1.5rem" }}>
              <FiMapPin color="var(--brand-primary)" aria-hidden="true" /> Shipping Address
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "2rem" }}>
              Where should we deliver your order?
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
              {[
                { id: "ship-address", label: "Street Address", value: address, setter: setAddress, placeholder: "123 Main St", autoComplete: "street-address" },
                { id: "ship-city", label: "City", value: city, setter: setCity, placeholder: "New York", autoComplete: "address-level2" },
                { id: "ship-postal", label: "Postal Code", value: postalCode, setter: setPostalCode, placeholder: "10001", autoComplete: "postal-code" },
                { id: "ship-country", label: "Country", value: country, setter: setCountry, placeholder: "United States", autoComplete: "country-name" },
              ].map((field) => (
                <div key={field.id} className="form-group">
                  <label htmlFor={field.id} className="form-label">{field.label}</label>
                  <input
                    id={field.id}
                    type="text"
                    className="form-control"
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    autoComplete={field.autoComplete}
                    required
                  />
                </div>
              ))}

              <button type="submit" className="btn-primary btn-block" style={{ marginTop: "0.5rem" }}>
                Continue to Payment <FiArrowRight size={16} aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShippingScreen;
