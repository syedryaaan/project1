// NexaStore — Checkout Steps Component
import React from "react";
import { FiCheck } from "react-icons/fi";

const steps = [
  { label: "Sign In", step: 1 },
  { label: "Shipping", step: 2 },
  { label: "Payment", step: 3 },
  { label: "Review", step: 4 },
];

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const enabled = [step1, step2, step3, step4];

  return (
    <nav className="checkout-steps" aria-label="Checkout progress">
      {steps.map(({ label, step }, idx) => {
        const isActive = enabled[idx];
        const isDone = enabled.slice(idx + 1).some(Boolean);

        return (
          <React.Fragment key={step}>
            <div
              className={`checkout-step ${isDone ? "done" : ""} ${isActive && !isDone ? "active" : ""}`}
              aria-current={isActive && !isDone ? "step" : undefined}
            >
              <div className="step-number">
                {isDone ? <FiCheck size={14} aria-hidden="true" /> : step}
              </div>
              <span>{label}</span>
            </div>
            {idx < steps.length - 1 && <div className="step-divider" />}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default CheckoutSteps;
