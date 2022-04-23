import { Link } from "@remix-run/react";
import { withRing } from "./common/styles";
import HeaderMenu from "./HeaderMenu";
import Logo from "./Logo";

export default function Header() {
  return (
    <header className="w-full border-b">
      <div className="flex items-center justify-between w-full max-w-6xl px-4 py-2 mx-auto md:px-8 lg:py-4">
        <div className="flex flex-1">
          <Link to="/" className={withRing}>
            <Logo className="w-12" />
          </Link>
        </div>
        <Link to="/" className={withRing}>
          <h1 className="text-xl logo">Brisk Poll</h1>
        </Link>
        <div className="flex items-center justify-end flex-1 space-x-2">
          <HeaderMenu />
        </div>
      </div>
    </header>
  );
}
