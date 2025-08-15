import { useState } from "react";

const Button = ({
  children,
  onClick,
  normalColor = "bg-blue-500",
  hoverColor = "bg-blue-600",
  textColor = "text-white",
  size = "medium",
  disabled = false,
  className = "",
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    small: "px-4 py-2 text-sm",
    medium: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg",
  };

  const buttonClasses = `
    ${isHovered ? hoverColor : normalColor}
    ${textColor}
    ${sizeClasses[size]}
    font-medium rounded-lg
    transition-all duration-200 ease-in-out
    transform active:scale-95
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
    ${
      disabled
        ? "opacity-50 cursor-not-allowed"
        : "cursor-pointer"
    }
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  return (
    <button
      className={buttonClasses}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
