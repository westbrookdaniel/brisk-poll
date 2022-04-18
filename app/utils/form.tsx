import * as React from "react";
import { Input } from "./input";

interface Stylable {
  className?: string;
}

interface FormLabelProps
  extends Stylable,
    Pick<React.HTMLProps<HTMLInputElement>, "name"> {
  label?: string;
}

export const FormLabel: React.FC<FormLabelProps> = ({
  label,
  name,
  className = "",
}) => {
  return label ? (
    <label htmlFor={name} className={`text-gray-900 ${className}`}>
      {label}
    </label>
  ) : null;
};

interface FormHelperProps extends Stylable {
  helper?: string;
}

export const FormHelper: React.FC<FormHelperProps> = ({
  helper,
  className = "",
}) => {
  return helper ? (
    <p className={`text-sm text-gray-700 ${className}`}>{helper}</p>
  ) : null;
};

interface FormErrorProps
  extends Stylable,
    Pick<React.HTMLProps<HTMLInputElement>, "name"> {
  error?: string;
}

export const FormError: React.FC<FormErrorProps> = ({
  error,
  name,
  className = "",
}) => {
  return error ? (
    <p id={`${name}-error`} className={`text-sm text-red-700 ${className}`}>
      {error}
    </p>
  ) : null;
};

interface FormElementsProps
  extends FormLabelProps,
    FormHelperProps,
    FormErrorProps {}

export const FormElements: React.FC<FormElementsProps> = ({
  children,
  helper,
  error,
  label,
  name,
}) => {
  return (
    <div>
      <div className="mb-2">
        <FormLabel label={label} name={name} />
        <FormHelper helper={helper} />
      </div>
      {children}
      <FormError className="mt-2" error={error} name={name} />
    </div>
  );
};

export const FormInput: React.FC<
  FormElementsProps & React.HTMLProps<HTMLInputElement>
> = ({ label, helper, error, name, ...props }) => {
  return (
    <FormElements helper={helper} error={error} label={label} name={name}>
      <p>
        <Input
          id={name}
          name={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={`${name}-error`}
          {...props}
          className="w-full"
          type="text"
        />
      </p>
    </FormElements>
  );
};
