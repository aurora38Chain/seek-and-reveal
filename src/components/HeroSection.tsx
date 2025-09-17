import { Button } from "@/components/ui/button";
import { Shield, Eye, MapPin, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import treasureMapHero from "@/assets/treasure-map-hero.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${treasureMapHero})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-wood-dark/80 via-ocean-deep/60 to-ocean-deep/90" />
      
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-pirate font-bold text-treasure mb-6 drop-shadow-2xl animate-pulse">
          Find Treasure Without Giving It Away
        </h1>
        
        <p className="text-xl md:text-2xl text-parchment font-nautical mb-12 max-w-3xl mx-auto">
          Encrypted coordinates that reveal only when ye be close enough. 
          No more map sniping, no more stolen bounty. 
          True pirate's honor in the digital age.
        </p>
        
        <div className="flex flex-wrap gap-6 justify-center mb-16">
          <Link to="/expeditions">
            <Button variant="treasure" size="lg" className="text-lg px-8 py-6">
              <MapPin className="mr-2" />
              Start Expedition
            </Button>
          </Link>
          <Link to="/my-maps">
            <Button variant="ocean" size="lg" className="text-lg px-8 py-6">
              <Eye className="mr-2" />
              View Active Maps
            </Button>
          </Link>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-parchment/10 backdrop-blur-sm rounded-lg p-6 border-2 border-brass/50">
            <Shield className="w-12 h-12 text-treasure mx-auto mb-4" />
            <h3 className="text-xl font-pirate text-parchment mb-2">Encrypted Safety</h3>
            <p className="text-parchment/80 font-nautical">
              Coordinates locked until proximity verified
            </p>
          </div>
          
          <div className="bg-parchment/10 backdrop-blur-sm rounded-lg p-6 border-2 border-brass/50">
            <MapPin className="w-12 h-12 text-treasure mx-auto mb-4" />
            <h3 className="text-xl font-pirate text-parchment mb-2">Real Adventure</h3>
            <p className="text-parchment/80 font-nautical">
              Physical exploration meets digital treasure
            </p>
          </div>
          
          <div className="bg-parchment/10 backdrop-blur-sm rounded-lg p-6 border-2 border-brass/50">
            <Sparkles className="w-12 h-12 text-treasure mx-auto mb-4" />
            <h3 className="text-xl font-pirate text-parchment mb-2">True Rewards</h3>
            <p className="text-parchment/80 font-nautical">
              Claim bounty only when you reach the X
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}