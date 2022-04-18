import * as React from "react";
import { noRing, transition, withRing } from "./styles";

const manualBlockInvalid = `focus:border-red-700 border-red-700`;
const blockInvalid = `focus:invalid:border-red-700 invalid:border-red-700`;
const blockFocused = `focus:border-gray-500 focus:bg-white focus:outline-none focus:outline-0`;
const block = `block bg-gray-100 transition-color ${transition} ${blockInvalid} ${blockFocused}`;

export const Input: React.FC<React.HTMLProps<HTMLInputElement>> = ({
  className = "",
  "aria-invalid": invalid,
  ...props
}) => {
  return (
    <input
      className={`${block} ${noRing} ${
        invalid ? manualBlockInvalid : "border-transparent"
      } form-input ${className}`}
      aria-invalid={invalid}
      {...props}
    />
  );
};

export const Checkbox: React.FC<React.HTMLProps<HTMLInputElement>> = ({
  className = "",
  "aria-invalid": invalid,
  ...props
}) => {
  return (
    <input
      className={`${block} ${withRing} ${
        invalid ? manualBlockInvalid : "border-transparent"
      } form-checkbox text-gray-900 accent-gray-900 ${className}`}
      aria-invalid={invalid}
      {...props}
      type="checkbox"
    />
  );
};
