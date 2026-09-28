import type { ReactNode } from "react";
import SiteNavbar from "./SiteNavbar";

type PageShellProps = {
  children: ReactNode;
};

const PageShell = ({ children }: PageShellProps) => {
  return (
    <div className="text-white">
      <SiteNavbar revealAfterHero />
      {children}
    </div>
  );
};

export default PageShell;
