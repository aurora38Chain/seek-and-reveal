import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Trophy, Medal, Award, Coins } from "lucide-react";

const Leaderboard = () => {
  const leaderboardData = [
    { rank: 1, name: "Captain Blackbeard", treasures: 42, gold: "15,420", icon: Trophy },
    { rank: 2, name: "Anne Bonny", treasures: 38, gold: "12,850", icon: Medal },
    { rank: 3, name: "Calico Jack", treasures: 35, gold: "11,200", icon: Award },
    { rank: 4, name: "William Kidd", treasures: 31, gold: "9,800", icon: null },
    { rank: 5, name: "Henry Morgan", treasures: 28, gold: "8,650", icon: null },
    { rank: 6, name: "Edward Low", treasures: 25, gold: "7,500", icon: null },
    { rank: 7, name: "Mary Read", treasures: 22, gold: "6,800", icon: null },
    { rank: 8, name: "Bartholomew Roberts", treasures: 20, gold: "5,900", icon: null },
  ];

  return (
    <div className="min-h-screen bg-gradient-ocean">
      <Navigation />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-pirate text-center text-parchment mb-12">
            Legendary Pirates Leaderboard
          </h1>
          
          <Card className="parchment-texture border-4 border-wood-dark max-w-4xl mx-auto">
            <div className="p-8">
              <div className="grid grid-cols-12 gap-4 mb-4 pb-4 border-b-2 border-wood-light/50">
                <div className="col-span-1 text-center font-pirate text-mapInk">Rank</div>
                <div className="col-span-5 font-pirate text-mapInk">Pirate Name</div>
                <div className="col-span-3 text-center font-pirate text-mapInk">Treasures Found</div>
                <div className="col-span-3 text-center font-pirate text-mapInk">Total Gold</div>
              </div>
              
              {leaderboardData.map((pirate) => {
                const Icon = pirate.icon;
                return (
                  <div
                    key={pirate.rank}
                    className={`grid grid-cols-12 gap-4 py-4 items-center hover:bg-wood-light/10 transition-colors ${
                      pirate.rank <= 3 ? 'bg-treasure/5' : ''
                    }`}
                  >
                    <div className="col-span-1 text-center">
                      {Icon ? (
                        <Icon className={`w-6 h-6 mx-auto ${
                          pirate.rank === 1 ? 'text-treasure treasure-glow' :
                          pirate.rank === 2 ? 'text-gray-400' :
                          'text-brass'
                        }`} />
                      ) : (
                        <span className="font-pirate text-2xl text-mapInk">{pirate.rank}</span>
                      )}
                    </div>
                    
                    <div className="col-span-5">
                      <span className={`font-nautical text-lg ${
                        pirate.rank <= 3 ? 'text-mapInk font-bold' : 'text-mapInk'
                      }`}>
                        {pirate.name}
                      </span>
                    </div>
                    
                    <div className="col-span-3 text-center">
                      <span className="font-nautical text-mapInk">{pirate.treasures}</span>
                    </div>
                    
                    <div className="col-span-3 text-center">
                      <span className="font-bold text-treasure flex items-center justify-center gap-1">
                        <Coins className="w-4 h-4" />
                        {pirate.gold}
                      </span>
                    </div>
                  </div>
                );
              })}
              
              <div className="mt-8 pt-6 border-t-2 border-wood-light/50">
                <div className="text-center">
                  <p className="text-mapInk font-nautical mb-2">Your Current Rank</p>
                  <p className="text-3xl font-pirate text-brass">#127</p>
                  <p className="text-sm text-mapInk/70 font-nautical mt-1">Keep hunting to climb the ranks!</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;