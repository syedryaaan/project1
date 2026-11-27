// NexaStore — Support & Policy Information Screen
import React from "react";
import { Link } from "react-router-dom";
import {
  FiHelpCircle,
  FiTruck,
  FiRefreshCw,
  FiShield,
  FiArrowLeft,
} from "react-icons/fi";
import Meta from "../components/Meta";

const PAGE_CONTENT = {
  help: {
    title: "Help Center",
    icon: <FiHelpCircle color="var(--brand-primary)" aria-hidden="true" />,
    subtitle: "Answers to common questions about ordering, payments, and account security.",
    sections: [
      {
        heading: "Orders & Tracking",
        body: "Sign in and visit your Profile page at any time to inspect payment status, order items, and delivery progress.",
      },
      {
        heading: "Payments",
        body: "We support PayPal and card checkout. All order totals, taxes, and shipping rules are verified server-side prior to order confirmation.",
      },
    ],
  },
  returns: {
    title: "Returns & Warranty",
    icon: <FiRefreshCw color="var(--brand-primary)" aria-hidden="true" />,
    subtitle: "Simple 30-day return eligibility and 2-year standard product warranty.",
    sections: [
      {
        heading: "30-Day Return Window",
        body: "Unused items in original packaging may be returned within 30 days of delivery for a full refund.",
      },
      {
        heading: "2-Year Warranty",
        body: "Every hardware item includes a 2-year manufacturer defect warranty covering repair or replacement.",
      },
    ],
  },
  shipping: {
    title: "Shipping Policy",
    icon: <FiTruck color="var(--brand-primary)" aria-hidden="true" />,
    subtitle: "Fast, transparent shipping rates on every order.",
    sections: [
      {
        heading: "Free Shipping Threshold",
        body: "Orders with an item subtotal above $100 qualify automatically for free standard shipping. Orders $100 and under ship for a flat $10 fee.",
      },
      {
        heading: "Dispatch & Delivery",
        body: "Most orders are processed within 1 business day and delivered within 2–5 business days.",
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    icon: <FiShield color="var(--brand-primary)" aria-hidden="true" />,
    subtitle: "How NexaStore handles your account, order, and session information.",
    sections: [
      {
        heading: "Account Security",
        body: "Passwords are hashed with bcrypt before storage, and authenticated sessions are protected with signed JSON Web Tokens.",
      },
      {
        heading: "Data Usage",
        body: "Shipping addresses and order records are used strictly to process and fulfill your purchases.",
      },
    ],
  },
};

const SupportScreen = ({ topic = "help" }) => {
  const content = PAGE_CONTENT[topic] || PAGE_CONTENT.help;

  return (
    <>
      <Meta title={content.title} />
      <div
        className="container-custom"
        style={{ paddingTop: "2.5rem", paddingBottom: "4rem", maxWidth: 820 }}
      >
        <Link
          to="/"
          className="btn-secondary btn-sm"
          style={{ marginBottom: "1.5rem", display: "inline-flex" }}
        >
          <FiArrowLeft size={14} aria-hidden="true" /> Back to Store
        </Link>

        <div className="card">
          <div className="card-header" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {content.icon}
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800 }}>{content.title}</h1>
          </div>
          <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <p style={{ color: "var(--text-secondary)" }}>{content.subtitle}</p>
            {content.sections.map((sec) => (
              <section key={sec.heading}>
                <h2 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                  {sec.heading}
                </h2>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                  {sec.body}
                </p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SupportScreen;
