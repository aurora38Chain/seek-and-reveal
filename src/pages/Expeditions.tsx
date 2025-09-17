import { Navigation } from "@/components/Navigation";
import { ExpeditionEntry } from "@/components/ExpeditionEntry";
import { ExpeditionProgress } from "@/components/ExpeditionProgress";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Trophy, Clock, Ship, MapPin } from "lucide-react";
import { useState } from "react";
import { encryptCoordinates } from "@/lib/fhe";

const Expeditions = () => {
  const [selectedExpedition, setSelectedExpedition] = useState<string | null>(null);
  const [foundTreasures, setFoundTreasures] = useState<Map<number, any>>(new Map());

  // Mock encrypted treasure data for demonstration
  const mockEncryptedTreasures = [
    encryptCoordinates({
      latitude: 25.7617,
      longitude: -80.1918,
      radius: 100
    }),
    encryptCoordinates({
      latitude: 25.7743,
      longitude: -80.1937,
      radius: 100
    }),
    encryptCoordinates({
      latitude: 25.7907,
      longitude: -80.1300,
      radius: 100
    })
  ];

  const activeExpeditions = [
    {
      id: "1",
      name: "Caribbean Gold Rush",
      participants: "15/20",
      prizePool: "1000 GOLD",
      timeLeft: "2d 5h",
      difficulty: "Medium",
      encryptedTreasures: mockEncryptedTreasures
    },
    {
      id: "2",
      name: "Bermuda Triangle Mystery",
      participants: "8/12",
      prizePool: "2500 GOLD",
      timeLeft: "5d 12h",
      difficulty: "Legendary",
      encryptedTreasures: mockEncryptedTreasures
    },
    {
      id: "3",
      name: "Drake's Lost Fortune",
      participants: "20/20",
      prizePool: "750 GOLD",
      timeLeft: "Starting Soon",
      difficulty: "Hard",
      encryptedTreasures: mockEncryptedTreasures
    }
  ];

  const handleTreasureFound = (treasureId: number, coordinates: any) => {
    setFoundTreasures(prev => new Map([...prev, [treasureId, coordinates]]));
  };

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
                
                <Button 
                  variant="treasure" 
                  className="w-full"
                  onClick={() => setSelectedExpedition(
                    selectedExpedition === expedition.id ? null : expedition.id
                  )}
                >
                  {selectedExpedition === expedition.id ? 'Hide Details' : 'View Details'}
                </Button>
              </Card>
            ))}
          </div>

          {/* Expedition Progress Section */}
          {selectedExpedition && (
            <div className="mb-16">
              <h2 className="text-3xl font-pirate text-center text-parchment mb-8">
                Expedition Progress
              </h2>
              <div className="max-w-4xl mx-auto">
                <ExpeditionProgress
                  expeditionId={parseInt(selectedExpedition)}
                  encryptedTreasures={activeExpeditions.find(e => e.id === selectedExpedition)?.encryptedTreasures || []}
                  onTreasureFound={handleTreasureFound}
                />
              </div>
            </div>
          )}

          {/* Found Treasures Display */}
          {foundTreasures.size > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-pirate text-center text-parchment mb-8">
                Discovered Treasures
              </h2>
              <div className="grid gap-4 max-w-2xl mx-auto">
                {Array.from(foundTreasures.entries()).map(([treasureId, coordinates]) => (
                  <Card key={treasureId} className="parchment-texture border-4 border-treasure p-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-6 h-6 text-treasure" />
                      <div>
                        <h3 className="font-pirate text-lg text-mapInk">
                          Treasure #{treasureId + 1}
                        </h3>
                        <p className="font-nautical text-mapInk/70">
                          Coordinates: {coordinates.latitude.toFixed(4)}, {coordinates.longitude.toFixed(4)}
                        </p>
                        <p className="font-nautical text-mapInk/70">
                          Discovery radius: {coordinates.radius}m
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          <ExpeditionEntry />
        </div>
      </main>
    </div>
  );
};

export default Expeditions;