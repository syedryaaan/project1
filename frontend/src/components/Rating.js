// NexaStore — Rating Component
import React from "react";
import { FiStar } from "react-icons/fi";

const Rating = ({ value, text, color = "#FFD93D" }) => {
  const stars = [1, 2, 3, 4, 5].map((star) => (
    <span key={star} className="rating-star">
      <FiStar
        size={14}
        fill={value >= star ? color : value >= star - 0.5 ? "none" : "none"}
        color={value >= star - 0.4 ? color : "var(--text-muted)"}
        style={{
          fill: value >= star ? color : value >= star - 0.5 ? "none" : "none",
        }}
      />
    </span>
  ));

  return (
    <div className="rating">
      {stars}
      {text && <span className="rating-text">{text}</span>}
    </div>
  );
};

export default Rating;
