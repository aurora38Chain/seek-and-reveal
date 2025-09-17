import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, Navigation, AlertTriangle, CheckCircle } from "lucide-react";
import compass from "@/assets/compass.png";

interface MapData {
  id: string;
  name: string;
  encryptedCoords: string;
  proximityRadius: number;
  reward: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Legendary";
  isLocked: boolean;
  distance?: number;
}

export function TreasureMap() {
  const [selectedMap, setSelectedMap] = useState<MapData | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [maps] = useState<MapData[]>([
    {
      id: "1",
      name: "Blackbeard's Lost Gold",
      encryptedCoords: "0x7f3d9a2b...encrypted",
      proximityRadius: 100,
      reward: "500 GOLD",
      difficulty: "Hard",
      isLocked: true,
      distance: 2500,
    },
    {
      id: "2",
      name: "Siren's Cove Mystery",
      encryptedCoords: "0x9c4e8f1a...encrypted",
      proximityRadius: 50,
      reward: "250 GOLD",
      difficulty: "Medium",
      isLocked: true,
      distance: 850,
    },
    {
      id: "3",
      name: "The Kraken's Hoard",
      encryptedCoords: "0x2a6b3d9e...encrypted",
      proximityRadius: 200,
      reward: "1000 GOLD",
      difficulty: "Legendary",
      isLocked: true,
      distance: 5000,
    },
  ]);

  useEffect(() => {
    // Mock geolocation
    navigator.geolocation?.getCurrentPosition((position) => {
      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, []);

  const handleReveal = (map: MapData) => {
    // Mock proximity check
    if (map.distance && map.distance < map.proximityRadius) {
      alert(`Coordinates revealed: ${map.name} at 40.7128° N, 74.0060° W`);
    } else {
      alert(`Too far away! Get within ${map.proximityRadius}m to reveal coordinates.`);
    }
  };

  return (
    <section className="py-20 bg-gradient-ocean">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-pirate text-center text-parchment mb-12">
          Active Treasure Maps
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {maps.map((map) => (
            <Card
              key={map.id}
              className="parchment-texture border-4 border-wood-dark overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedMap(map)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-pirate text-mapInk">{map.name}</h3>
                  {map.isLocked ? (
                    <Lock className="w-6 h-6 text-bloodRed" />
                  ) : (
                    <Unlock className="w-6 h-6 text-treasure" />
                  )}
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="font-nautical text-mapInk">Difficulty:</span>
                    <span className={`font-bold ${
                      map.difficulty === "Easy" ? "text-ocean-light" :
                      map.difficulty === "Medium" ? "text-brass" :
                      map.difficulty === "Hard" ? "text-bloodRed" :
                      "text-treasure"
                    }`}>
                      {map.difficulty}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-nautical text-mapInk">Reward:</span>
                    <span className="font-bold text-treasure treasure-glow">
                      {map.reward}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-nautical text-mapInk">Distance:</span>
                    <span className="font-nautical text-mapInk">
                      {map.distance ? `${map.distance}m` : "Calculating..."}
                    </span>
                  </div>
                  
                  <div className="bg-wood-dark/10 rounded p-3">
                    <p className="text-sm font-nautical text-mapInk/70">
                      Encrypted: <code className="text-xs">{map.encryptedCoords}</code>
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="compass"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReveal(map);
                  }}
                >
                  <Navigation className="mr-2" />
                  Reveal Coordinates
                </Button>
              </div>
              
              <div className="bg-wood-dark/20 px-6 py-3 border-t-2 border-wood-dark/30">
                {map.distance && map.distance < map.proximityRadius ? (
                  <div className="flex items-center gap-2 text-treasure">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-nautical">In range!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-bloodRed">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-nautical">
                      Get within {map.proximityRadius}m
                    </span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <img
            src={compass}
            alt="Compass"
            className="w-32 h-32 mx-auto mb-4 compass-spin opacity-50"
          />
          <p className="text-parchment font-nautical text-lg">
            Navigate to treasure locations to unlock encrypted coordinates
          </p>
        </div>
      </div>
    </section>
  );
}