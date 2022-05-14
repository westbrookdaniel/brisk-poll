import * as React from "react";
import { noRing, transition, withRing } from "./styles";

const manualBlockInvalid = `focus:border-red-700 border-red-700`;
const blockInvalid = `focus:invalid:border-red-700 invalid:border-red-700`;
const blockFocused = `focus:border-gray-500 focus:bg-white focus:outline-none focus:outline-0`;
const block = `block bg-gray-100 transition-color ${transition} ${blockInvalid} ${blockFocused}`;

export interface TextAreaProps extends React.HTMLProps<HTMLTextAreaElement> {
  autoExpand?:
    | false
    | true
    | {
        min?: number;
        max?: number;
        resize?: boolean;
      };
}

const autoExpandDefaults = {
  min: 1,
  max: 4,
  canResize: false,
};

export const TextArea: React.FC<TextAreaProps> = ({
  className = "",
  "aria-invalid": invalid,
  onChange,
  autoExpand,
  rows,
  ...props
}) => {
  const { min, max, canResize } =
    typeof autoExpand === "object"
      ? { ...autoExpandDefaults, ...autoExpand }
      : autoExpandDefaults;
  return (
    <textarea
      className={`${block} ${noRing} ${
        invalid ? manualBlockInvalid : "border-transparent"
      } ${canResize ? "" : "w-full resize-none"} ${
        autoExpand ? "whitespace-nowrap" : ""
      } form-input rounded-lg ${className}`}
      rows={autoExpand ? min : rows}
      wrap={autoExpand ? "none" : undefined}
      onChange={(e) => {
        if (autoExpand) {
          const lineCount = e.target.value.split(/\r\n|\r|\n/).length;
          if (lineCount > e.target.rows) {
            if (!max || lineCount <= max) {
              e.target.rows = lineCount;
            }
          } else if (lineCount < e.target.rows) {
            if (!min || lineCount >= min) {
              e.target.rows = lineCount;
            }
          }
        }
        onChange?.(e);
      }}
      aria-invalid={invalid}
      {...props}
    />
  );
};

export const Input: React.FC<React.HTMLProps<HTMLInputElement>> = ({
  className = "",
  "aria-invalid": invalid,
  ...props
}) => {
  return (
    <input
      className={`${block} ${noRing} ${
        invalid ? manualBlockInvalid : "border-transparent"
      } form-input rounded-lg ${className}`}
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
      } form-checkbox text-blue-600 accent-blue-600 ${className}`}
      aria-invalid={invalid}
      {...props}
      type="checkbox"
    />
  );
};

export const Radio: React.FC<React.HTMLProps<HTMLInputElement>> = ({
  className = "",
  "aria-invalid": invalid,
  ...props
}) => {
  return (
    <input
      className={`${block} ${withRing} ${
        invalid ? manualBlockInvalid : "border-transparent"
      } form-radio text-blue-600 accent-blue-600 ${className}`}
      {...props}
      type="radio"
    />
  );
};
