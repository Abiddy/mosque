import { useEffect, useState } from "react";
import Link from "next/link";
import IITLogo from "../IITLogo";
import NavActions from "../NavActions";

type SiteNavbarProps = {
  /** Keep hidden while the full-screen hero is in view. */
  revealAfterHero?: boolean;
};

const SiteNavbar = ({ revealAfterHero = false }: SiteNavbarProps) => {
  const [visible, setVisible] = useState(!revealAfterHero);

  useEffect(() => {
    if (!revealAfterHero) return;
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [revealAfterHero]);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-30 border-b border-white/10 bg-[#050c1f]/60 backdrop-blur-md transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl min-w-0 items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6 md:h-[72px]">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-1.5 transition-opacity hover:opacity-90 sm:flex-1 sm:gap-2.5"
        >
          <IITLogo size={28} className="sm:hidden" />
          <IITLogo size={40} className="hidden sm:block" />
          <span className="font-instrument-serif text-lg leading-tight text-white sm:min-w-0 sm:truncate sm:text-2xl">
            <span className="block text-[15px] leading-[1.05] sm:hidden">
              Islamic Institute
              <br />
              of Torrance
            </span>
            <span className="hidden sm:inline">Islamic Institute of Torrance</span>
          </span>
        </Link>

        <NavActions tone="dark" />
      </div>
    </header>
  );
};

export default SiteNavbar;
