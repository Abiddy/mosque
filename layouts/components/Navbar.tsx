import Link from "next/link";
import IITLogo from "./IITLogo";
import NavActions from "./NavActions";

type NavbarProps = {
  tone?: "light" | "dark";
};

const Navbar = ({ tone = "light" }: NavbarProps) => {
  const dark = tone === "dark";

  return (
    <nav className="absolute left-1/2 top-5 z-30 w-full max-w-[1400px] -translate-x-1/2 px-4 sm:px-8 lg:px-12">
      <div className="flex min-w-0 items-center justify-between gap-2 sm:gap-4">
        <Link
          href="/"
          className={
            dark
              ? "flex min-w-0 items-center gap-2 transition-opacity hover:opacity-80 sm:gap-3"
              : "flex min-w-0 items-center gap-1.5 rounded-full border border-[#e8e8e8] bg-white/90 py-1 pr-2 pl-1 shadow-sm backdrop-blur-sm transition-opacity hover:opacity-90 sm:flex-1 sm:gap-2 sm:px-2"
          }
        >
          <IITLogo size={28} className="sm:hidden" />
          <IITLogo size={36} className="hidden sm:block" />
          <span
            className={
              dark
                ? "font-instrument-serif text-lg leading-tight text-white sm:text-2xl"
                : "font-pp text-sm leading-tight text-[#2c2c2c] sm:min-w-0 sm:truncate sm:text-[22px] lg:text-[26px]"
            }
          >
            <span className="sm:hidden">IIT</span>
            <span className="hidden sm:inline">Islamic Institute of Torrance</span>
          </span>
        </Link>

        <NavActions tone={tone} />
      </div>
    </nav>
  );
};

export default Navbar;
