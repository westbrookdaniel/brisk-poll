import { Link } from "@remix-run/react";
import { useHydrated } from "remix-utils";
import { useOptionalUser } from "~/utils";
import { ActionButton, LinkButton } from "./common/button";
import { withRing } from "./common/styles";

export default function Header() {
  const user = useOptionalUser();
  const hydrated = useHydrated();

  const redirectSearchParams = hydrated
    ? new URLSearchParams([["redirectTo", window.location.pathname]])
    : "";

  return (
    <header className="flex items-center justify-between w-full">
      <div className="flex-1">
        <Link to="/" className={withRing}>
          Logo
        </Link>
      </div>
      <Link to="/" className={withRing}>
        <h1 className="text-xl font-bold">Brisk Poll</h1>
      </Link>
      <div className="flex items-center justify-end flex-1 space-x-2">
        {user ? (
          <>
            <p className="px-2 text-gray-500">{user.email}</p>
            <ActionButton
              variant="ghost"
              action={`/logout?${redirectSearchParams}`}
            >
              Logout
            </ActionButton>
          </>
        ) : (
          <>
            <LinkButton variant="ghost" to={`/login?${redirectSearchParams}`}>
              Login
            </LinkButton>
            <LinkButton to={`/join?${redirectSearchParams}`}>
              Sign Up
            </LinkButton>
          </>
        )}
      </div>
    </header>
  );
}
