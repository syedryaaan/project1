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
    <div className="checkout-steps">
      {steps.map(({ label, step }, idx) => {
        const isActive = enabled[idx];
        const isDone = enabled.slice(idx + 1).some(Boolean);

        return (
          <React.Fragment key={step}>
            <div
              className={`checkout-step ${isDone ? "done" : ""} ${isActive && !isDone ? "active" : ""}`}
            >
              <div className="step-number">
                {isDone ? <FiCheck size={14} /> : step}
              </div>
              <span>{label}</span>
            </div>
            {idx < steps.length - 1 && <div className="step-divider" />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default CheckoutSteps;
