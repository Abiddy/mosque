import { motion } from "framer-motion";
import Navbar from "./Navbar";
import PrayerTimesBand from "./PrayerTimesBand";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] w-full flex-col text-white"
    >
      <Navbar tone="dark" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        className="flex flex-1 items-center px-4 pb-12 pt-28 sm:px-8 lg:px-12"
      >
        <PrayerTimesBand />
      </motion.div>
    </section>
  );
};

export default Hero;
