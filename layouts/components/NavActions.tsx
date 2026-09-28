import Link from "next/link";
import ButtonWithIcon from "@/components/ui/button-with-icon";

const navBtnClass =
  "inline-flex h-9 shrink-0 items-center justify-center rounded-full px-3.5 font-instrument-sans text-xs font-medium leading-none transition-colors sm:h-11 sm:px-5 sm:text-sm";

type NavActionsProps = {
  tone?: "light" | "dark";
};

const NavActions = ({ tone = "light" }: NavActionsProps) => {
  if (tone === "dark") {
    return (
      <div className="flex shrink-0 items-center gap-2">
        <Link
          href="#ask-a-question"
          className={`${navBtnClass} border border-white/20 bg-white/5 text-white backdrop-blur-sm hover:border-white/40 hover:bg-white/10`}
        >
          <span className="sm:hidden">Ask</span>
          <span className="hidden sm:inline">Ask a Question</span>
        </Link>
        <Link
          href="#donate"
          className={`${navBtnClass} bg-white text-[#0a0f1f] hover:bg-white/90`}
        >
          <span className="sm:hidden">Support</span>
          <span className="hidden sm:inline">Support Our Masjid</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-2">
      <ButtonWithIcon href="#ask-a-question">
        <span className="sm:hidden">Ask</span>
        <span className="hidden sm:inline">Ask a Question</span>
      </ButtonWithIcon>
      <Link
        href="#donate"
        className={`${navBtnClass} bg-black text-white hover:bg-[#2c2c2c]`}
      >
        <span className="sm:hidden">Support</span>
        <span className="hidden sm:inline">Support Our Masjid</span>
      </Link>
    </div>
  );
};

export default NavActions;
