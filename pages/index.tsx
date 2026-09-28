import React from "react";
import dynamic from "next/dynamic";
import config from "@config/config.json";
import Base from "@layouts/Baseof";
import { NextUIProvider } from "@nextui-org/react";
import Hero from "@layouts/components/Hero";
import PageShell from "@layouts/components/layout/PageShell";
import Announcements from "@layouts/components/Announcements";
import ActivitiesSection from "@layouts/components/ActivitiesSection";
import DonateSection from "@layouts/components/DonateSection";
import AboutSection from "@layouts/components/AboutSection";
import VideoShowcase from "@layouts/components/VideoShowcase";
import AskQuestionSection from "@layouts/components/AskQuestionSection";
import CommunityCarousel from "@layouts/components/CommunityCarousel";
import { getListPage } from "@lib/contentParser";

const CosmicDustBackground = dynamic(
  () => import("@/components/ui/cosmic-dust-background"),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_40%_45%,#1d4290_0%,#0f2350_45%,#060e24_100%)]" />
    ),
  }
);

const Home = () => {
  const { title } = config.site;

  return (
    <Base title={title} dark>
      <NextUIProvider>
        <CosmicDustBackground followScroll />

        <div className="relative z-10">
          <Hero />

          <PageShell>
            <VideoShowcase />
            <Announcements />
            <ActivitiesSection />
            <AskQuestionSection />
            <AboutSection />
            <DonateSection />
            <CommunityCarousel />
          </PageShell>
        </div>
      </NextUIProvider>
    </Base>
  );
};

export const getStaticProps = async () => {
  const homePage = await getListPage("content/_index.md");
  const { frontmatter } = homePage;
  return {
    props: {
      frontmatter,
    },
  };
};

export default Home;
