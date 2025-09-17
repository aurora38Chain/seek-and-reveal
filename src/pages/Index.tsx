import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-ocean">
      <Navigation />
      <main>
        <HeroSection />
      </main>
    </div>
  );
};

export default Index;
