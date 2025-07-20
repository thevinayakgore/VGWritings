import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import { NewsletterSection } from "@/components/NewsletterSection";
import MyTravels from "@/components/MyTravels";
import LearninigPosts from "@/components/LearninigPosts";
import CareerGrowth from "@/components/CareerGrowth";

export default function Home() {
  return (
    <>
      <main className="flex-1 w-full">
        <Hero />

        <CareerGrowth />

        <MyTravels />

        <AboutSection />

        <LearninigPosts />

        <NewsletterSection />
      </main>
    </>
  );
}
