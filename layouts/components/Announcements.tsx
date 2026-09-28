import TextFade from "./ui/TextFade";

const ANNOUNCEMENTS = [
  {
    heading: "Halaqah",
    description:
      "IIT Weekly programs by Shaykh Ahmed Umarji — Tafseer on Tuesday and Seerah on Thursday after Isha.",
    date: "Tuesday / Thursday after Isha",
  },
  {
    heading: "Recite Quran in Group Setting",
    description:
      "Morning Quran Halqa from Monday to Saturday after Fajr Salat. Recite Quran in a group setting.",
    date: "Every morning after Fajr",
  },
];

const Announcements = () => {
  return (
    <section id="announcements" className="iit-section">
      <div className="mx-auto max-w-6xl">
        <TextFade className="mb-10 md:mb-14">
          <p className="iit-eyebrow mb-4">Community updates</p>
          <h2 className="iit-title max-w-[700px]">
            Events &amp; announcements from IIT
          </h2>
          <p className="iit-lead mt-5 max-w-[540px]">
            Stay updated with the latest programs, Jumu&apos;ah times, and news
            from our community.
          </p>
        </TextFade>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          {ANNOUNCEMENTS.map((item, i) => (
            <article key={i} className="iit-card flex flex-col p-6 md:p-8">
              <p className="iit-eyebrow mb-3 !text-[10px]">{item.date}</p>
              <h3 className="mb-3 font-instrument-serif text-2xl leading-tight text-white md:text-[28px]">
                {item.heading}
              </h3>
              <p className="flex-1 font-instrument-sans text-sm leading-relaxed text-white/65 md:text-base">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Announcements;
