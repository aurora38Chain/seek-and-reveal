import { Navigation } from "@/components/Navigation";
import { TreasureMap } from "@/components/TreasureMap";

const MyMaps = () => {
  return (
    <div className="min-h-screen bg-gradient-ocean">
      <Navigation />
      <main className="pt-20">
        <TreasureMap />
      </main>
    </div>
  );
};

export default MyMaps;