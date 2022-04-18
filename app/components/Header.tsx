import { Link } from "react-router-dom";
import { useOptionalUser } from "~/utils";
import { ActionButton, LinkButton } from "./common/button";
import { withRing } from "./common/styles";

export default function Header() {
  const user = useOptionalUser();

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
            <ActionButton variant="ghost" action="/logout">
              Logout
            </ActionButton>
          </>
        ) : (
          <>
            <LinkButton variant="ghost" to="/login">
              Login
            </LinkButton>
            <LinkButton to="/join">Sign Up</LinkButton>
          </>
        )}
      </div>
    </header>
  );
}
