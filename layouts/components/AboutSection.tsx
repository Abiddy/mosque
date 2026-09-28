import Image from "next/image";
import TextFade from "./ui/TextFade";

export default function AboutSection() {
  return (
    <section id="about" className="iit-section">
      <div className="mx-auto max-w-6xl">
        <TextFade className="mb-10 md:mb-14">
          <p className="iit-eyebrow mb-4">About us</p>
          <h2 className="iit-title max-w-[700px]">
            About the Islamic Institute of Torrance
          </h2>
          <p className="iit-lead mt-5 max-w-[540px]">
            Established to provide a place of worship and education for Muslims
            in Torrance and the surrounding South Bay.
          </p>
        </TextFade>

        <div className="iit-card grid grid-cols-1 gap-10 p-6 md:p-10 lg:grid-cols-12 lg:items-start">
          <figure className="flex flex-col items-center lg:col-span-4 lg:items-start">
            <div className="relative aspect-[3/4] w-[200px] overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <Image
                src="/images/imam.jpeg"
                alt="Sheikh Ahmad Umarji"
                fill
                sizes="200px"
                className="object-cover object-top"
              />
            </div>
            <figcaption className="mt-4 text-center lg:text-left">
              <p className="font-instrument-serif text-2xl text-white">
                Sheikh Ahmad Umarji
              </p>
              <p className="mt-1 font-instrument-sans text-sm text-white/55">
                Resident Imam
              </p>
            </figcaption>
          </figure>

          <div className="lg:col-span-8">
            <p className="iit-eyebrow mb-6">Meet our resident imam</p>
            <p className="iit-lead">
              Imam Ahmed Umarji graduated from the Tahfidh and Alimiyyah programs
              in South Africa, studying under esteemed scholars such as Mufti
              Radha Ul Haq and Mufti Sulaiman Moola. He holds Ijazahs in
              Qiraaat, Tafseer, and Hadith, and has a BS degree from Cal Poly
              Pomona. After graduation, he served as a Quran and Islamic Studies
              teacher. He is currently the Imam and Religious Director at IIT.
            </p>
            <p className="mt-8 font-instrument-sans text-sm text-white/50">
              18103 Prairie Ave, Torrance, CA 90504 · (310) 956-8006
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
