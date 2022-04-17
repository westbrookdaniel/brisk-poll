import { Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();
  return (
    <main className="max-w-xl p-8 mx-auto space-y-4">
      <h1 className="text-xl font-bold">Brisk Poll</h1>
      {user ? (
        <div className="flex flex-col space-y-4">
          <p>Hello {user.email}</p>
          <Link to="/logout">Logout</Link>
        </div>
      ) : (
        <div className="flex space-x-4">
          <Link to="/login">Login</Link>
          <Link to="/join">Sign Up</Link>
        </div>
      )}
    </main>
  );
}
