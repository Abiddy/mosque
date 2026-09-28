import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faYoutube,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import Link from "next/link";
import IITLogo from "@layouts/components/IITLogo";

type FooterProps = {
  dark?: boolean;
};

const Footer = ({ dark = false }: FooterProps) => {
  const t = dark
    ? {
        footer: "relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-sm",
        title: "font-instrument-serif text-xl text-white",
        body: "text-white/60",
        faint: "text-white/40",
        link: "text-white/50 transition-colors hover:text-white",
      }
    : {
        footer: "border-t border-[#e8e8e8] bg-[#fefffc]",
        title: "font-instrument-serif text-xl text-[#2c2c2c]",
        body: "text-[#646464]",
        faint: "text-[#b4b8b4]",
        link: "text-[#b4b8b4] transition-colors hover:text-[#2c2c2c]",
      };

  return (
    <footer className={t.footer}>
      <div className="mx-auto max-w-6xl px-6 py-10 font-instrument-sans">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <div className="mb-3 flex items-center justify-center gap-2.5 md:justify-start">
              <IITLogo size={36} />
              <p className={t.title}>Islamic Institute of Torrance</p>
            </div>
            <p className={`mt-2 text-sm ${t.body}`}>
              18103 Prairie Ave, Torrance, CA 90504 · (310) 956-8006
            </p>
            <p className={`mt-1 text-xs ${t.faint}`}>
              © {new Date().getFullYear()} IIT. Made with حُب in Gardena
            </p>
          </div>

          <div className="flex items-center gap-5">
            <a
              href="https://www.facebook.com/groups/iitorrance/"
              target="_blank"
              rel="noopener noreferrer"
              className={t.link}
              aria-label="Facebook"
            >
              <FontAwesomeIcon icon={faFacebook as IconProp} size="lg" />
            </a>
            <a
              href="https://www.youtube.com/@iitorrance285"
              target="_blank"
              rel="noopener noreferrer"
              className={t.link}
              aria-label="YouTube"
            >
              <FontAwesomeIcon icon={faYoutube as IconProp} size="lg" />
            </a>
            <a
              href="https://www.instagram.com/masjidiit/"
              target="_blank"
              rel="noopener noreferrer"
              className={t.link}
              aria-label="Instagram"
            >
              <FontAwesomeIcon icon={faInstagram as IconProp} size="lg" />
            </a>
          </div>

          <div className={`flex flex-wrap justify-center gap-4 text-sm ${t.body}`}>
            <Link href="#announcements" className={t.link}>
              Events
            </Link>
            <Link href="#activities" className={t.link}>
              Activities
            </Link>
            <Link href="#ask-a-question" className={t.link}>
              Ask a Question
            </Link>
            <Link href="#donate" className={t.link}>
              Donate
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
