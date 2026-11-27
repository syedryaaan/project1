// NexaStore — Rating Component
import React from "react";
import { FiStar } from "react-icons/fi";

const Rating = ({ value = 0, text, color = "#FFD93D" }) => {
  const stars = [1, 2, 3, 4, 5].map((star) => (
    <span key={star} className="rating-star" aria-hidden="true">
      <FiStar
        size={14}
        fill={value >= star ? color : "none"}
        color={value >= star - 0.4 ? color : "var(--text-muted)"}
      />
    </span>
  ));

  return (
    <div
      className="rating"
      role="img"
      aria-label={`Rated ${Number(value).toFixed(1)} out of 5 stars`}
    >
      {stars}
      {text && <span className="rating-text">{text}</span>}
    </div>
  );
};

export default Rating;
