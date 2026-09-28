import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const CARDS = [
  {
    label: "Worship",
    text: "Standing together in prayer at IIT",
    image: "/w0.png",
  },
  {
    label: "Community",
    text: "Quran, tafseer, and seerah programs for all ages",
    image: "/w1.jpg",
  },
  {
    label: "Education",
    text: "A welcoming home for worship and fellowship",
    image: "/w2.jpg",
  },
  {
    label: "Youth",
    text: "Programs that nurture the next generation",
    image: "/w3.jpg",
  },
  {
    label: "Events",
    text: "Gatherings that bring our community together",
    image: "/w4.jpg",
  },
  {
    label: "Service",
    text: "Supporting families across the South Bay",
    image: "/w5.jpg",
  },
];

const ease = [0.32, 0.72, 0, 1] as const;

const CommunityCarousel = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const t = window.setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % CARDS.length);
    }, 4000);
    return () => window.clearInterval(t);
  }, []);

  const go = (dir: number) => {
    setDirection(dir);
    setIndex((i) => (i + dir + CARDS.length) % CARDS.length);
  };

  const visible = [
    CARDS[index],
    CARDS[(index + 1) % CARDS.length],
    CARDS[(index + 2) % CARDS.length],
  ];

  return (
    <section
      id="community-gallery"
      className="iit-section"
      aria-label="Community photos"
    >
      <div className="mx-auto max-w-6xl">
        <p className="iit-eyebrow mb-4">Gallery</p>
        <h2 className="iit-title mb-10 max-w-[700px]">
          Life at the Islamic Institute of Torrance
        </h2>

        <div className="relative">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout" custom={direction}>
              {visible.map((card, i) => (
                <motion.article
                  key={`${card.label}-${index}-${i}`}
                  custom={direction}
                  initial={{ opacity: 0, x: direction > 0 ? 40 : -40, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: direction > 0 ? -40 : 40, scale: 0.95 }}
                  transition={{ duration: 0.7, ease }}
                  className={`group relative border border-white/10 h-[380px] overflow-hidden rounded-2xl md:h-[500px] ${
                    i > 0 ? "hidden md:block" : ""
                  } ${i > 1 ? "hidden lg:block" : ""}`}
                >
                  <Image
                    src={card.image}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="iit-eyebrow mb-2 !text-white/75">{card.label}</p>
                    <p className="font-instrument-serif text-2xl leading-tight text-white md:text-3xl">
                      {card.text}
                    </p>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white backdrop-blur-sm transition-colors hover:border-white/40 hover:bg-white/10"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white backdrop-blur-sm transition-colors hover:border-white/40 hover:bg-white/10"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityCarousel;
