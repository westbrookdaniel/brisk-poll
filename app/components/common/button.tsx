import type { LinkProps } from "@remix-run/react";
import { Link } from "@remix-run/react";
import * as React from "react";
import { transition, withRing } from "./styles";

const sizeStyles = {
  sm: `px-3 py-2 text-sm`,
  md: `px-4 py-2`,
  lg: `px-6 py-3 text-lg`,
};

const blockHovered = `hover:bg-gray-700`;
const blockActive = `active:bg-gray-500`;
const blockFocused = `focus-visible:outline-0 ${withRing}`;

const ghostHovered = `hover:bg-gray-100`;
const ghostActive = `active:bg-gray-200`;
const ghostFocused = `focus-visible:outline-0 ${withRing}`;

const variantStyles = {
  block: `block select-none bg-gray-900 text-white transition-all ${transition} ${blockActive} ${blockHovered} ${blockFocused}`,
  ghost: `block select-none bg-transparent transition-all ${transition} ${ghostActive} ${ghostHovered} ${ghostFocused}`,
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  variant?: "block" | "ghost";
}

export const Button: React.FC<ButtonProps> = ({
  className = "",
  size = "md",
  variant = "block",
  ...props
}) => {
  return (
    <button
      className={`${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    />
  );
};

interface LinkButtonProps extends LinkProps {
  size?: "sm" | "md" | "lg";
  variant?: "block" | "ghost";
}

export const LinkButton: React.FC<LinkButtonProps> = ({
  className = "",
  size = "md",
  variant = "block",
  ...props
}) => {
  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <Link
      className={`${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    />
  );
};
