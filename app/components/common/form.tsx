import * as React from "react";
import { Checkbox, Input, Radio } from "./input";

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
    <p className={`text-sm text-gray-500 ${className}`}>{helper}</p>
  ) : null;
};

interface FormErrorProps
  extends Stylable,
    Pick<React.HTMLProps<HTMLInputElement>, "name"> {
  error?: string | boolean;
}

export const FormError: React.FC<FormErrorProps> = ({
  error,
  name,
  className = "",
}) => {
  return typeof error === "string" ? (
    <p id={`${name}-error`} className={`text-sm text-red-700 ${className}`}>
      {error}
    </p>
  ) : null;
};

interface FormElementsProps
  extends FormLabelProps,
    FormHelperProps,
    FormErrorProps {
  containerProps?: React.HTMLProps<HTMLDivElement>;
}

export const FormElements: React.FC<FormElementsProps> = ({
  children,
  helper,
  error,
  label,
  name,
  containerProps,
}) => {
  return (
    <div {...containerProps}>
      {label || helper ? (
        <div className="mb-2 space-y-1">
          <FormLabel label={label} name={name} />
          <FormHelper helper={helper} />
        </div>
      ) : null}
      {children}
      <FormError className="mt-2" error={error} name={name} />
    </div>
  );
};

export const FormInput: React.FC<
  FormElementsProps & React.HTMLProps<HTMLInputElement>
> = ({ label, helper, error, containerProps, name, ...props }) => {
  return (
    <FormElements
      containerProps={containerProps}
      helper={helper}
      error={error}
      label={label}
      name={name}
    >
      <p>
        <Input
          id={name}
          name={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={`${name}-error`}
          className="w-full"
          {...props}
        />
      </p>
    </FormElements>
  );
};

export const FormCheckbox: React.FC<
  FormElementsProps & React.HTMLProps<HTMLInputElement>
> = ({ label, helper, error, name, className, ...props }) => {
  return (
    <div className="space-x-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={name}
          name={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={`${name}-error`}
          {...props}
        />
        {label || helper ? (
          <FormLabel
            className={`${className ? className : "text-sm"} select-none`}
            label={label}
            name={name}
          />
        ) : null}
      </div>
      <FormError className="mt-2" error={error} name={name} />
    </div>
  );
};

export const FormRadio: React.FC<
  FormElementsProps & React.HTMLProps<HTMLInputElement>
> = ({ label, helper, error, name, value: v, className, ...props }) => {
  const value = v as string;
  return (
    <div className="space-x-2">
      <div className="flex items-center space-x-2">
        <Radio
          id={value}
          name={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={`${name}-error`}
          value={value}
          {...props}
        />
        {label || helper ? (
          <FormLabel
            className={`${className ? className : "text-sm"} select-none`}
            label={label}
            name={value}
          />
        ) : null}
      </div>
      <FormError className="mt-2" error={error} name={value} />
    </div>
  );
};
