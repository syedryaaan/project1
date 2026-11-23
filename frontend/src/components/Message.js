// NexaStore — Message / Alert Component
import React from "react";
import { FiAlertCircle, FiCheckCircle, FiInfo, FiAlertTriangle } from "react-icons/fi";

const iconMap = {
  danger: <FiAlertCircle size={18} />,
  success: <FiCheckCircle size={18} />,
  info: <FiInfo size={18} />,
  warning: <FiAlertTriangle size={18} />,
};

const Message = ({ variant = "info", children }) => (
  <div className={`alert alert-${variant}`}>
    {iconMap[variant]}
    <span>{children}</span>
  </div>
);

export default Message;
