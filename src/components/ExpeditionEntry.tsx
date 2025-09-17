import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Coins, Users, Calendar, Anchor } from "lucide-react";

export function ExpeditionEntry() {
  const [entryFee, setEntryFee] = useState("10");
  const [expeditionName, setExpeditionName] = useState("");

  const handleJoinExpedition = () => {
    if (!expeditionName) {
      alert("Please enter an expedition name");
      return;
    }
    alert(`Joining expedition: ${expeditionName} with ${entryFee} GOLD entry fee`);
  };

  return (
    <section className="py-20 bg-gradient-parchment">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-pirate text-center text-mapInk mb-12">
          Join an Expedition
        </h2>
        
        <div className="max-w-2xl mx-auto">
          <Card className="parchment-texture border-4 border-wood-dark shadow-2xl">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Anchor className="w-8 h-8 text-brass" />
                <h3 className="text-2xl font-pirate text-mapInk">
                  Expedition Entry Form
                </h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="expedition" className="text-mapInk font-nautical text-lg">
                    Expedition Name
                  </Label>
                  <Input
                    id="expedition"
                    type="text"
                    placeholder="Enter expedition code..."
                    value={expeditionName}
                    onChange={(e) => setExpeditionName(e.target.value)}
                    className="mt-2 bg-parchment/50 border-2 border-wood-light text-mapInk font-nautical"
                  />
                </div>
                
                <div>
                  <Label htmlFor="fee" className="text-mapInk font-nautical text-lg">
                    Entry Fee (GOLD)
                  </Label>
                  <Input
                    id="fee"
                    type="number"
                    value={entryFee}
                    onChange={(e) => setEntryFee(e.target.value)}
                    className="mt-2 bg-parchment/50 border-2 border-wood-light text-mapInk font-nautical"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4 py-6 border-y-2 border-wood-light/50">
                  <div className="text-center">
                    <Users className="w-8 h-8 text-brass mx-auto mb-2" />
                    <p className="text-sm font-nautical text-mapInk/70">Crew Size</p>
                    <p className="text-lg font-bold text-mapInk">12/20</p>
                  </div>
                  
                  <div className="text-center">
                    <Coins className="w-8 h-8 text-treasure mx-auto mb-2" />
                    <p className="text-sm font-nautical text-mapInk/70">Prize Pool</p>
                    <p className="text-lg font-bold text-treasure">500 GOLD</p>
                  </div>
                  
                  <div className="text-center">
                    <Calendar className="w-8 h-8 text-brass mx-auto mb-2" />
                    <p className="text-sm font-nautical text-mapInk/70">Starts In</p>
                    <p className="text-lg font-bold text-mapInk">2 Days</p>
                  </div>
                </div>
                
                <div className="bg-wood-dark/10 rounded-lg p-4">
                  <h4 className="font-pirate text-lg text-mapInk mb-2">
                    Expedition Rules
                  </h4>
                  <ul className="space-y-1 text-sm font-nautical text-mapInk/80">
                    <li>• Wallet required for entry verification</li>
                    <li>• Coordinates unlock based on proximity</li>
                    <li>• First to reach all treasures wins the pool</li>
                    <li>• No sharing of decrypted coordinates</li>
                  </ul>
                </div>
                
                <Button
                  variant="treasure"
                  size="lg"
                  className="w-full text-lg"
                  onClick={handleJoinExpedition}
                >
                  <Coins className="mr-2" />
                  Pay Entry & Join Expedition
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}