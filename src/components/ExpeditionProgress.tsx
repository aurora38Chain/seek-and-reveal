import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  MapPin, 
  Shield, 
  Loader2, 
  CheckCircle, 
  Compass,
  Eye,
  EyeOff,
  Lock,
  Unlock
} from "lucide-react";
import { useUpdateExpeditionProgress, useDecryptTreasureData } from "@/hooks/useContract";
import { useAccount } from "wagmi";
import { watchLocation, stopWatchingLocation, UserLocation, calculateDistance, formatDistance } from "@/lib/location";
import { EncryptedData, decryptCoordinates } from "@/lib/fhe";

interface ExpeditionProgressProps {
  expeditionId: number;
  encryptedTreasures: EncryptedData[];
  onTreasureFound: (treasureId: number, coordinates: any) => void;
}

export function ExpeditionProgress({ 
  expeditionId, 
  encryptedTreasures, 
  onTreasureFound 
}: ExpeditionProgressProps) {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [progress, setProgress] = useState(0);
  const [cluesFound, setCluesFound] = useState(0);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [revealedTreasures, setRevealedTreasures] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);

  const { address, isConnected } = useAccount();
  const { updateProgress, isLoading: isUpdating } = useUpdateExpeditionProgress();
  const { decryptTreasure, isLoading: isDecryptingTreasure } = useDecryptTreasureData();

  // Start watching location when component mounts
  useEffect(() => {
    if (!isConnected) return;

    const startWatching = () => {
      const id = watchLocation(
        (location) => {
          setUserLocation(location);
          checkForNearbyTreasures(location);
        },
        (error) => {
          setError(`Location error: ${error}`);
        }
      );
      
      if (id) {
        setWatchId(id);
      }
    };

    startWatching();

    return () => {
      if (watchId) {
        stopWatchingLocation(watchId);
      }
    };
  }, [isConnected]);

  const checkForNearbyTreasures = async (location: UserLocation) => {
    for (let i = 0; i < encryptedTreasures.length; i++) {
      if (revealedTreasures.has(i)) continue;

      try {
        const decryptedTreasure = decryptCoordinates(encryptedTreasures[i], location);
        
        if (decryptedTreasure) {
          setRevealedTreasures(prev => new Set([...prev, i]));
          onTreasureFound(i, decryptedTreasure);
          
          // Update progress
          const newProgress = Math.min(100, ((revealedTreasures.size + 1) / encryptedTreasures.length) * 100);
          setProgress(newProgress);
          
          // Update clues found
          setCluesFound(prev => prev + 1);
          
          // Update on blockchain
          await updateProgress(expeditionId, newProgress, cluesFound + 1);
        }
      } catch (error) {
        console.error(`Failed to decrypt treasure ${i}:`, error);
      }
    }
  };

  const handleManualDecrypt = async (treasureIndex: number) => {
    if (!userLocation) {
      setError("Location not available");
      return;
    }

    setIsDecrypting(true);
    setError(null);

    try {
      const decryptedTreasure = await decryptTreasure(encryptedTreasures[treasureIndex], userLocation);
      
      if (decryptedTreasure) {
        setRevealedTreasures(prev => new Set([...prev, treasureIndex]));
        onTreasureFound(treasureIndex, decryptedTreasure);
        
        // Update progress
        const newProgress = Math.min(100, ((revealedTreasures.size + 1) / encryptedTreasures.length) * 100);
        setProgress(newProgress);
        setCluesFound(prev => prev + 1);
        
        // Update on blockchain
        await updateProgress(expeditionId, newProgress, cluesFound + 1);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Decryption failed');
    } finally {
      setIsDecrypting(false);
    }
  };

  if (!isConnected) {
    return (
      <Card className="parchment-texture border-4 border-wood-dark p-6">
        <Alert className="border-wood-dark bg-parchment/50">
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-mapInk">
            Please connect your wallet to track expedition progress
          </AlertDescription>
        </Alert>
      </Card>
    );
  }

  return (
    <Card className="parchment-texture border-4 border-wood-dark p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Compass className="w-6 h-6 text-brass" />
          <h3 className="text-xl font-pirate text-mapInk">Expedition Progress</h3>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-nautical text-mapInk">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-treasure">{cluesFound}</div>
            <div className="text-sm font-nautical text-mapInk/70">Clues Found</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-mapInk">{encryptedTreasures.length}</div>
            <div className="text-sm font-nautical text-mapInk/70">Total Treasures</div>
          </div>
        </div>

        {/* Location Status */}
        {userLocation && (
          <Alert className="border-green-500 bg-green-50">
            <MapPin className="h-4 w-4" />
            <AlertDescription className="text-green-700">
              Location: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
              <br />
              Accuracy: {Math.round(userLocation.accuracy)}m
            </AlertDescription>
          </Alert>
        )}

        {/* Error Messages */}
        {error && (
          <Alert className="border-red-500 bg-red-50">
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Treasure List */}
        <div className="space-y-3">
          <h4 className="font-pirate text-lg text-mapInk">Encrypted Treasures</h4>
          {encryptedTreasures.map((treasure, index) => {
            const isRevealed = revealedTreasures.has(index);
            const distance = userLocation ? 
              calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                0, // Would be actual treasure coordinates
                0
              ) : null;

            return (
              <div 
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border-2 ${
                  isRevealed 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-wood-light bg-parchment/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isRevealed ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Lock className="w-5 h-5 text-wood-dark" />
                  )}
                  <span className="font-nautical text-mapInk">
                    Treasure #{index + 1}
                  </span>
                  {distance && (
                    <span className="text-sm text-mapInk/70">
                      {formatDistance(distance)} away
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {isRevealed ? (
                    <span className="text-sm font-nautical text-green-600">
                      Revealed
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleManualDecrypt(index)}
                      disabled={isDecrypting || isDecryptingTreasure}
                    >
                      {isDecrypting || isDecryptingTreasure ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* FHE Status */}
        <Alert className="border-blue-500 bg-blue-50">
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-blue-700">
            All treasure data is encrypted with FHE. Coordinates only reveal when you're in proximity.
          </AlertDescription>
        </Alert>
      </div>
    </Card>
  );
}
