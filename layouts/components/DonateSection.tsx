import { motion } from "framer-motion";
import { Copy } from "lucide-react";
import { useState } from "react";
import { SiPaypal, SiVenmo, SiZelle } from "react-icons/si";
import TextFade from "./ui/TextFade";

const BRAND = {
  venmo: { color: "#008CFF", Icon: SiVenmo },
  zelle: { color: "#6D1ED4", Icon: SiZelle },
  paypal: { color: "#0070BA", Icon: SiPaypal },
} as const;

function PaymentLogo({ brand }: { brand: keyof typeof BRAND }) {
  const { color, Icon } = BRAND[brand];
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center sm:h-9 sm:w-9">
      <Icon color={color} size={26} aria-hidden />
    </span>
  );
}

const DonateSection = () => {
  const [copied, setCopied] = useState(false);
  const zelleEmail = "iit@torrancemasjid.org";

  const copyZelle = () => {
    navigator.clipboard?.writeText(zelleEmail).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const btnClass =
    "font-instrument-sans relative grid w-full grid-cols-[2.25rem_1fr_2.25rem] items-center gap-3 rounded-full border border-white/15 bg-white/[0.06] px-4 py-4 text-sm font-medium text-white backdrop-blur-md transition-colors hover:border-white/30 hover:bg-white/10 sm:grid-cols-[2.5rem_1fr_2.5rem] sm:px-5";

  return (
    <section id="donate" className="iit-section">
      <div className="mx-auto max-w-2xl">
        <TextFade className="mb-10 text-center md:mb-14">
          <p className="iit-eyebrow mb-4">Sadaqah</p>
          <h2 className="iit-title">Support our masjid</h2>
          <p className="mx-auto mt-6 max-w-[520px] font-instrument-serif text-xl italic leading-snug text-white/80 md:text-2xl">
            &ldquo;Those who in charity spend of their goods by night and by day,
            in secret and in public, have their reward with their Lord.&rdquo;
          </p>
          <p className="iit-eyebrow mt-4">Quran · 2:274</p>
        </TextFade>

        <div className="flex flex-col gap-3">
          <a
            href="https://venmo.com/u/IITMasjid"
            target="_blank"
            rel="noopener noreferrer"
            className={btnClass}
          >
            <PaymentLogo brand="venmo" />
            <span className="text-center">Donate via Venmo</span>
            <span aria-hidden />
          </a>

          <button type="button" onClick={copyZelle} className={btnClass}>
            <PaymentLogo brand="zelle" />
            <span className="flex flex-col items-center text-center">
              <span>Donate via Zelle</span>
              <span className="mt-1 text-xs text-white/55">{zelleEmail}</span>
            </span>
            <Copy className="mx-auto h-4 w-4 text-white/45" aria-hidden />
            {copied && (
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -top-10 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-1.5 text-xs text-[#0a0f1f]"
              >
                Copied
              </motion.span>
            )}
          </button>

          <a
            href="https://www.paypal.com/paypalme/torrancemasjid"
            target="_blank"
            rel="noopener noreferrer"
            className={btnClass}
          >
            <PaymentLogo brand="paypal" />
            <span className="text-center">Donate via PayPal</span>
            <span aria-hidden />
          </a>

          <a
            href="#donate"
            className="mt-2 block rounded-full bg-white py-4 text-center font-instrument-sans text-sm font-medium text-[#0a0f1f] transition-colors hover:bg-white/90"
          >
            Support Our Masjid
          </a>
        </div>

        <p className="iit-eyebrow mt-10 text-center !text-white/40">
          Every contribution makes a difference
        </p>
      </div>
    </section>
  );
};

export default DonateSection;
