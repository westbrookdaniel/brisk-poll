import { Link } from "@remix-run/react";
import { withRing } from "./common/styles";
import HeaderMenu from "./HeaderMenu";

export default function Header() {
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
        <HeaderMenu />
      </div>
    </header>
  );
}
