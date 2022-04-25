import { MenuIcon } from "@heroicons/react/solid";
import { Form, Link } from "@remix-run/react";
import { useHydrated } from "remix-utils";
import { useOptionalUser } from "~/utils";
import { LinkButton, IconButton } from "./common/button";
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
        <p className="hidden px-2 lg:block">{user.name}</p>
        <Menu
          body={
            <>
              <MenuItems className="min-w-[150px] max-w-[275px]">
                <div className="block lg:hidden">
                  <MenuSlot>
                    <p className="pr-2 text-left text-gray-500 whitespace-nowrap">
                      {user.name}
                    </p>
                  </MenuSlot>
                </div>
                <Link to="/profile">
                  <MenuItem>My Polls</MenuItem>
                </Link>
                <Link to="/profile/settings">
                  <MenuItem>Settings</MenuItem>
                </Link>
              </MenuItems>
              <MenuItems className="min-w-[150px] max-w-[275px]">
                <Form action={`/logout?${redirectSearchParams}`} method="post">
                  <MenuItem>Logout</MenuItem>
                </Form>
              </MenuItems>
            </>
          }
          buttonProps={{
            as: IconButton,
            icon: MenuIcon,
            colorScheme: "blue",
            "aria-label": "Menu",
          }}
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
