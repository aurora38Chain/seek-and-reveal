import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Coins, Users, Calendar, Anchor, MapPin, Shield, Loader2 } from "lucide-react";
import { useJoinExpedition } from "@/hooks/useContract";
import { useAccount } from "wagmi";
import { requestLocationPermission, getCurrentLocation, UserLocation } from "@/lib/location";
import { encryptCoordinates, EncryptedData } from "@/lib/fhe";

export function ExpeditionEntry() {
  const [entryFee, setEntryFee] = useState("10");
  const [expeditionName, setExpeditionName] = useState("");
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [encryptedLocation, setEncryptedLocation] = useState<EncryptedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { address, isConnected } = useAccount();
  const { joinExpedition, isLoading, error: contractError } = useJoinExpedition();

  // Request location permission on component mount
  useEffect(() => {
    const requestPermission = async () => {
      try {
        const permission = await requestLocationPermission();
        setLocationPermission(permission.granted);
        
        if (permission.granted) {
          const location = await getCurrentLocation();
          setUserLocation(location);
          
          // Encrypt location data for privacy
          if (location) {
            const encrypted = encryptCoordinates({
              latitude: location.latitude,
              longitude: location.longitude,
              radius: 100 // 100 meter radius for treasure hunting
            });
            setEncryptedLocation(encrypted);
          }
        } else {
          setError(permission.error || 'Location permission denied');
        }
      } catch (err) {
        setError('Failed to get location permission');
      }
    };

    requestPermission();
  }, []);

  const handleJoinExpedition = async () => {
    if (!isConnected) {
      setError("Please connect your wallet first");
      return;
    }

    if (!expeditionName) {
      setError("Please enter an expedition name");
      return;
    }

    if (!locationPermission) {
      setError("Location access is required to join expeditions");
      return;
    }

    if (!encryptedLocation) {
      setError("Failed to encrypt location data");
      return;
    }

    try {
      setError(null);
      setSuccess(null);

      // Convert expedition name to map ID (in real app, this would be a lookup)
      const mapId = parseInt(expeditionName.replace(/\D/g, '')) || 1;
      const fee = parseFloat(entryFee);

      const txHash = await joinExpedition(mapId, fee, encryptedLocation);
      
      setSuccess(`Successfully joined expedition! Transaction: ${txHash}`);
      setExpeditionName("");
      setEntryFee("10");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join expedition');
    }
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
                {/* Wallet Connection Status */}
                {!isConnected && (
                  <Alert className="border-wood-dark bg-parchment/50">
                    <Anchor className="h-4 w-4" />
                    <AlertDescription className="text-mapInk">
                      Please connect your wallet to join expeditions
                    </AlertDescription>
                  </Alert>
                )}

                {/* Location Permission Status */}
                {locationPermission === false && (
                  <Alert className="border-red-500 bg-red-50">
                    <MapPin className="h-4 w-4" />
                    <AlertDescription className="text-red-700">
                      Location access is required for treasure hunting. Please enable location permissions.
                    </AlertDescription>
                  </Alert>
                )}

                {/* FHE Encryption Status */}
                {encryptedLocation && (
                  <Alert className="border-green-500 bg-green-50">
                    <Shield className="h-4 w-4" />
                    <AlertDescription className="text-green-700">
                      Location data encrypted with FHE. Your privacy is protected.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Error Messages */}
                {(error || contractError) && (
                  <Alert className="border-red-500 bg-red-50">
                    <AlertDescription className="text-red-700">
                      {error || contractError}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Success Messages */}
                {success && (
                  <Alert className="border-green-500 bg-green-50">
                    <AlertDescription className="text-green-700">
                      {success}
                    </AlertDescription>
                  </Alert>
                )}

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
                    disabled={!isConnected || !locationPermission}
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
                  disabled={!isConnected || !locationPermission || !encryptedLocation || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Joining Expedition...
                    </>
                  ) : (
                    <>
                      <Coins className="mr-2" />
                      Pay Entry & Join Expedition
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}