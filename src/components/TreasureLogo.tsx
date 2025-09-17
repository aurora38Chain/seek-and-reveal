import { Map, X } from "lucide-react";

export function TreasureLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <div className="relative">
        {/* Background map icon */}
        <Map className="w-10 h-10 text-brass" />
        {/* X marks the spot overlay */}
        <X className="absolute inset-0 w-10 h-10 text-treasure animate-pulse" style={{ strokeWidth: 3 }} />
        {/* Treasure dot in center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-treasure rounded-full treasure-glow" />
      </div>
    </div>
  );
}