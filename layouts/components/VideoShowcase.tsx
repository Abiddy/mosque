import TextFade from "./ui/TextFade";

const VideoShowcase = () => {
  return (
    <section id="video" className="iit-section">
      <TextFade className="mx-auto max-w-3xl text-center">
        <p className="font-instrument-serif text-[34px] italic leading-[1.1] text-white sm:text-[48px] md:text-[64px]">
          Which of the favors of your Lord will you deny?
        </p>
        <p className="iit-eyebrow mt-6">Surah Ar-Rahman · 55:13</p>
        <p className="iit-lead mx-auto mt-8 max-w-md">
          Join us at the Islamic Institute of Torrance.
        </p>
      </TextFade>
    </section>
  );
};

export default VideoShowcase;
