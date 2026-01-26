import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedBands } from "@/components/home/FeaturedBands";
import { GenreCategories } from "@/components/home/GenreCategories";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Testimonials } from "@/components/home/Testimonials";
import { BandCTA } from "@/components/home/BandCTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-background dark">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedBands />
        <GenreCategories />
        <HowItWorks />
        <Testimonials />
        <BandCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
