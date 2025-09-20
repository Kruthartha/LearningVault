// src/components/ui/Card.jsx
import React from "react";

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 ${className}`}
  >
    {children}
  </div>
);

export default Card;