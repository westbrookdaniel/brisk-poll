import type { LinkProps } from "@remix-run/react";
import { Form } from "@remix-run/react";
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

const common = `block text-center select-none`;

const variantStyles = {
  block: `${common} bg-gray-900 text-white transition-all ${transition} ${blockActive} ${blockHovered} ${blockFocused}`,
  ghost: `${common} bg-transparent transition-all ${transition} ${ghostActive} ${ghostHovered} ${ghostFocused}`,
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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

interface ActionButtonProps extends ButtonProps {
  action: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  className = "",
  size = "md",
  variant = "block",
  action,
  ...props
}) => {
  return (
    <Form action={action} method="post">
      <button
        className={`${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        type="submit"
        {...props}
      />
    </Form>
  );
};

interface IconButtonProps extends Omit<ButtonProps, "size"> {
  // This is the type of the icons from @heroicons/react
  icon: (props: React.ComponentProps<"svg">) => JSX.Element;
}

export const IconButton: React.FC<IconButtonProps> = ({
  className = "",
  variant = "block",
  icon: Icon,
  ...props
}) => {
  return (
    <button className={`${variantStyles[variant]} p-3 ${className}`} {...props}>
      <Icon className="w-4 h-4" />
    </button>
  );
};
