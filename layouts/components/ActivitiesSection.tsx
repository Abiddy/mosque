import { Wrench } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import activities from "./activities.json";
import TextFade from "./ui/TextFade";

function activityPreview(item: {
  content?: string;
  readmore?: string;
}) {
  const c = (item.content || "").trim();
  if (c) return c;
  const r = (item.readmore || "").trim();
  if (r.length <= 140) return r;
  return `${r.slice(0, 137).trim()}…`;
}

const Modal = ({
  title,
  body,
  onClose,
}: {
  title: string;
  body: string;
  onClose: () => void;
}) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    onClick={onClose}
  >
    <div
      className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-[#0b1a3a]/90 p-8 backdrop-blur-xl"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="mb-4 font-instrument-serif text-3xl text-white">{title}</h2>
      <p className="mb-8 font-instrument-sans text-sm leading-relaxed text-white/70">
        {body}
      </p>
      <button
        type="button"
        onClick={onClose}
        className="w-full rounded-full bg-white py-3 font-instrument-sans text-sm font-medium text-[#0a0f1f] hover:bg-white/90"
      >
        Close
      </button>
    </div>
  </div>
);

const ActivitiesSection = () => {
  const [modal, setModal] = useState<{ title: string; body: string } | null>(
    null
  );

  return (
    <section id="activities" className="iit-section">
      <div className="mx-auto max-w-6xl">
        <TextFade className="mb-10 md:mb-14">
          <p className="iit-eyebrow mb-4">Programs</p>
          <h2 className="iit-title max-w-[700px]">
            Programs that serve our community
          </h2>
          <p className="iit-lead mt-5 max-w-[540px]">
            Quran learning, youth gatherings, halaqahs, and weekend events —
            open to everyone.
          </p>
        </TextFade>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
          {activities.map((item, i) => (
            <article
              key={i}
              className="iit-card flex min-h-[240px] flex-col p-6 md:min-h-[280px]"
            >
              <h3 className="mb-3 font-instrument-serif text-2xl leading-tight text-white">
                {item.name}
              </h3>
              <p className="mb-6 flex-1 font-instrument-sans text-sm leading-relaxed text-white/65">
                {activityPreview(item)}
              </p>
              <div className="flex items-end justify-between">
                <button
                  type="button"
                  onClick={() =>
                    setModal({ title: item.name, body: item.readmore })
                  }
                  className="font-instrument-sans text-sm font-medium text-white/60 transition-colors hover:text-white"
                >
                  Read more →
                </button>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                  {item.icon ? (
                    <div className="relative h-5 w-5">
                      <Image
                        src={item.icon}
                        alt=""
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <Wrench className="h-4 w-4 text-white/60" strokeWidth={1.5} />
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {modal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Modal
            title={modal.title}
            body={modal.body}
            onClose={() => setModal(null)}
          />
        </motion.div>
      )}
    </section>
  );
};

export default ActivitiesSection;
