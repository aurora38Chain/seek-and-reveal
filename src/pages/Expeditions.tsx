import { Navigation } from "@/components/Navigation";
import { ExpeditionEntry } from "@/components/ExpeditionEntry";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Trophy, Clock, Ship } from "lucide-react";

const Expeditions = () => {
  const activeExpeditions = [
    {
      id: "1",
      name: "Caribbean Gold Rush",
      participants: "15/20",
      prizePool: "1000 GOLD",
      timeLeft: "2d 5h",
      difficulty: "Medium"
    },
    {
      id: "2",
      name: "Bermuda Triangle Mystery",
      participants: "8/12",
      prizePool: "2500 GOLD",
      timeLeft: "5d 12h",
      difficulty: "Legendary"
    },
    {
      id: "3",
      name: "Drake's Lost Fortune",
      participants: "20/20",
      prizePool: "750 GOLD",
      timeLeft: "Starting Soon",
      difficulty: "Hard"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-ocean">
      <Navigation />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-pirate text-center text-parchment mb-12">
            Active Expeditions
          </h1>
          
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {activeExpeditions.map((expedition) => (
              <Card key={expedition.id} className="parchment-texture border-4 border-wood-dark p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Ship className="w-6 h-6 text-brass" />
                  <h3 className="text-xl font-pirate text-mapInk">{expedition.name}</h3>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-mapInk font-nautical">
                      <Users className="w-4 h-4" />
                      Crew
                    </span>
                    <span className="font-bold text-mapInk">{expedition.participants}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-mapInk font-nautical">
                      <Trophy className="w-4 h-4" />
                      Prize
                    </span>
                    <span className="font-bold text-treasure">{expedition.prizePool}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-mapInk font-nautical">
                      <Clock className="w-4 h-4" />
                      Starts
                    </span>
                    <span className="font-bold text-mapInk">{expedition.timeLeft}</span>
                  </div>
                </div>
                
                <Button variant="treasure" className="w-full">
                  View Details
                </Button>
              </Card>
            ))}
          </div>
          
          <ExpeditionEntry />
        </div>
      </main>
    </div>
  );
};

export default Expeditions;