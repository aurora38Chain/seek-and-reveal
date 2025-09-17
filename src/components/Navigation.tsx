import { Button } from "@/components/ui/button";
import { Map, Skull, Anchor, Ship } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { TreasureLogo } from "./TreasureLogo";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

export function Navigation() {
  const { address, isConnected } = useAccount();

  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-parchment border-b-4 border-wood-dark shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <TreasureLogo />
            <h1 className="text-2xl font-bold text-mapInk font-pirate">
              Seek and Reveal
            </h1>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/my-maps" 
              className={`flex items-center gap-2 transition-colors ${
                isActive('/my-maps') ? 'text-treasure' : 'text-mapInk hover:text-brass'
              }`}
            >
              <Map className="w-5 h-5" />
              <span className="font-nautical font-semibold">My Maps</span>
            </Link>
            <Link 
              to="/expeditions" 
              className={`flex items-center gap-2 transition-colors ${
                isActive('/expeditions') ? 'text-treasure' : 'text-mapInk hover:text-brass'
              }`}
            >
              <Ship className="w-5 h-5" />
              <span className="font-nautical font-semibold">Expeditions</span>
            </Link>
            <Link 
              to="/leaderboard" 
              className={`flex items-center gap-2 transition-colors ${
                isActive('/leaderboard') ? 'text-treasure' : 'text-mapInk hover:text-brass'
              }`}
            >
              <Skull className="w-5 h-5" />
              <span className="font-nautical font-semibold">Leaderboard</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <ConnectButton 
              chainStatus="icon"
              accountStatus={{
                smallScreen: 'avatar',
                largeScreen: 'full',
              }}
              showBalance={{
                smallScreen: false,
                largeScreen: true,
              }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}