import { Menu as HeadlessMenu, Transition } from "@headlessui/react";
import * as React from "react";

type First<T> = T extends [infer U, ...any] ? U : T;

type HeadlessMenuButtonProps = First<Parameters<typeof HeadlessMenu.Button>>;

interface Props {
  children?: React.ReactNode;
  buttonProps?: HeadlessMenuButtonProps;
  body: React.ReactNode;
  className?: string;
}

export function Menu({
  children,
  body,
  buttonProps = {},
  className = "",
}: Props) {
  return (
    <HeadlessMenu as="div" className={`relative ${className}`}>
      <div>
        <HeadlessMenu.Button {...buttonProps}>{children}</HeadlessMenu.Button>
      </div>
      <Transition
        as={React.Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <HeadlessMenu.Items className="absolute right-0 mt-2 bg-white shadow-lg origin-top-right divide-y divide-gray-100 focus:outline-none">
          {body}
        </HeadlessMenu.Items>
      </Transition>
    </HeadlessMenu>
  );
}

interface MenuItemProps {
  children: React.ReactNode | ((active: boolean) => React.ReactNode);
}

export function MenuItem({ children }: MenuItemProps) {
  return (
    <HeadlessMenu.Item>
      {({ active }) => (
        <button
          className={`${
            active ? "bg-gray-200" : "text-gray-900"
          } flex w-full items-center px-4 py-2`}
        >
          {typeof children === "function" ? children(active) : children}
        </button>
      )}
    </HeadlessMenu.Item>
  );
}

export function MenuSlot({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center w-full px-4 py-2">
      {children}
    </div>
  );
}

interface MenuItemsProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
}

export function MenuItems({
  children,
  className = "",
  ...props
}: MenuItemsProps) {
  return (
    <div className={`py-3 ${className}`} {...props}>
      {children}
    </div>
  );
}
