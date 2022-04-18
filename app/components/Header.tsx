import { useOptionalUser } from "~/utils";
import { LinkButton } from "./common/button";

export default function Header() {
  const user = useOptionalUser();

  return (
    <header className="flex items-center justify-between w-full">
      <p className="flex-1">Logo</p>
      <h1 className="text-xl font-bold">Brisk Poll</h1>
      <div className="flex items-center justify-end flex-1 space-x-2">
        {user ? (
          <>
            <p>Hello {user.email}</p>
            <LinkButton to="/logout">Logout</LinkButton>
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
