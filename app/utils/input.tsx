import * as React from "react";

const manualBlockInvalid = `focus:border-red-700 border-red-700`;
const blockInvalid = `focus:invalid:border-red-700 invalid:border-red-700`;
const blockFocused = `focus:border-gray-500 focus:bg-white focus:ring-0`;
const block = `block bg-gray-100 border-transparent ${blockInvalid} ${blockFocused}`;

export const Input: React.FC<React.HTMLProps<HTMLInputElement>> = ({
  className = "",
  "aria-invalid": invalid,
  ...props
}) => {
  return (
    <input
      className={`${block} ${
        invalid ? manualBlockInvalid : ""
      } form-input ${className}`}
      aria-invalid={invalid}
      {...props}
    />
  );
};
