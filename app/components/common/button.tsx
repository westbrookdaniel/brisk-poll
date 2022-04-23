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

const variantStyles = {
  block: {
    blue: `text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800`,
    red: `text-white bg-red-500 hover:bg-red-600 active:bg-red-700`,
    gray: `text-white bg-gray-900 hover:bg-gray-700 active:bg-gray-500`,
  },
  ghost: {
    blue: `bg-transparent text-blue-700 hover:bg-blue-100 active:bg-blue-200`,
    red: `bg-transparent text-red-600 hover:bg-red-100 active:bg-red-200`,
    gray: `bg-transparent hover:bg-gray-100 active:bg-gray-200`,
  },
};

const common = `block rounded-lg text-center select-none font-medium focus-visible:outline-0 ${withRing}`;

interface DefaultProps {
  size?: "sm" | "md" | "lg";
  variant?: "block" | "ghost";
  colorScheme?: "blue" | "red" | "gray";
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    DefaultProps {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      className = "",
      size = "md",
      variant = "block",
      colorScheme = "gray",
      ...props
    },
    ref
  ) {
    return (
      <button
        className={`${common} transition-all ${transition} ${variantStyles[variant][colorScheme]} ${sizeStyles[size]} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

interface LinkButtonProps extends LinkProps, DefaultProps {}

export const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
  function LinkButton(
    {
      className = "",
      size = "md",
      variant = "block",
      colorScheme = "gray",
      ...props
    },
    ref
  ) {
    return (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      <Link
        className={`${common} transition-all ${transition} ${variantStyles[variant][colorScheme]} ${sizeStyles[size]} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

interface ActionButtonProps extends ButtonProps {
  action: string;
}

export const ActionButton = React.forwardRef<
  HTMLButtonElement,
  ActionButtonProps
>(function ActionButton(
  {
    className = "",
    size = "md",
    variant = "block",
    colorScheme = "gray",
    action,
    ...props
  },
  ref
) {
  return (
    <Form action={action} method="post">
      <button
        className={`${common} transition-all ${transition} ${variantStyles[variant][colorScheme]} ${sizeStyles[size]} ${className}`}
        type="submit"
        ref={ref}
        {...props}
      />
    </Form>
  );
});

interface IconButtonProps extends Omit<ButtonProps, "size"> {
  // This is the type of the icons from @heroicons/react
  icon: (props: React.ComponentProps<"svg">) => JSX.Element;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      className = "",
      variant = "block",
      colorScheme = "gray",
      icon: Icon,
      ...props
    },
    ref
  ) {
    return (
      <button
        className={`${common} transition-all ${transition} ${variantStyles[variant][colorScheme]} p-3 ${className}`}
        ref={ref}
        {...props}
      >
        <Icon className="w-4 h-4" />
      </button>
    );
  }
);
