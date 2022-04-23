import { MenuIcon } from "@heroicons/react/solid";
import { Form, Link } from "@remix-run/react";
import { useHydrated } from "remix-utils";
import { shortenString, useOptionalUser } from "~/utils";
import { LinkButton, ActionButton, IconButton } from "./common/button";
import { Menu, MenuItem, MenuItems, MenuSlot } from "./common/menu";

export default function HeaderMenu() {
  const user = useOptionalUser();
  const hydrated = useHydrated();

  const redirectSearchParams = hydrated
    ? new URLSearchParams([["redirectTo", window.location.pathname]])
    : "";

  if (user) {
    return (
      <>
        <p className="hidden px-4 lg:block">
          {shortenString(user.email, 30).shortened}
        </p>
        <ActionButton
          className="hidden lg:block"
          action={`/logout?${redirectSearchParams}`}
        >
          Logout
        </ActionButton>
        <Menu
          body={
            <MenuItems className="min-w-[150px] max-w-[275px]">
              <MenuSlot>
                <p className="pr-2 text-left text-gray-500 whitespace-nowrap">
                  {shortenString(user.email, 30).shortened}
                </p>
              </MenuSlot>
              <Form action={`/logout?${redirectSearchParams}`} method="post">
                <MenuItem>Logout</MenuItem>
              </Form>
            </MenuItems>
          }
          buttonProps={{
            as: IconButton,
            icon: MenuIcon,
            colorScheme: "blue",
            "aria-label": "Menu",
          }}
          className="block lg:hidden"
        />
      </>
    );
  }

  return (
    <>
      <LinkButton
        className="hidden lg:block"
        variant="ghost"
        to={`/login?${redirectSearchParams}`}
      >
        Login
      </LinkButton>
      <LinkButton
        className="hidden lg:block"
        to={`/join?${redirectSearchParams}`}
        colorScheme="blue"
      >
        Sign Up
      </LinkButton>
      <Menu
        body={
          <MenuItems className="w-[150px]">
            <Link to={`/login?${redirectSearchParams}`}>
              <MenuItem>Login</MenuItem>
            </Link>
            <Link to={`/join?${redirectSearchParams}`}>
              <MenuItem>Sign Up</MenuItem>
            </Link>
          </MenuItems>
        }
        buttonProps={{
          as: IconButton,
          icon: MenuIcon,
          colorScheme: "blue",
          "aria-label": "Menu",
        }}
        className="block lg:hidden"
      />
    </>
  );
}
