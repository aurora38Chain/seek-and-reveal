import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { useState } from 'react';
import { encryptProgress, decryptProgress, EncryptedData } from '../lib/fhe';
import { getCurrentLocation, UserLocation } from '../lib/location';

// Contract ABI - Simplified for demonstration
const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_mapId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_progress",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_encryptedData",
        "type": "string"
      }
    ],
    "name": "updateExpeditionProgress",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_mapId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_initialProgress",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_encryptedProgress",
        "type": "string"
      }
    ],
    "name": "startExpedition",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_mapId",
        "type": "uint256"
      }
    ],
    "name": "getMapInfo",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "reward",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isActive",
            "type": "bool"
          }
        ],
        "internalType": "struct SeekAndReveal.MapInfo",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Contract address - Replace with your deployed contract address
const CONTRACT_ADDRESS = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6' as const;

// Custom hook for contract interaction
export function useSeekAndRevealContract() {
  const { address, isConnected } = useAccount();
  
  return {
    address,
    isConnected,
    contractAddress: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
  };
}

export function useUpdateExpeditionProgress() {
  const { writeContract, isPending, error } = useWriteContract();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateProgress = async (
    expeditionId: number, 
    newProgress: number,
    cluesFound: number = 0
  ) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Get current location for proximity verification
      const userLocation = await getCurrentLocation();
      if (!userLocation) {
        throw new Error('Location access required for progress update');
      }

      // Create progress data with FHE encryption
      const progressData = {
        expeditionId,
        progress: newProgress,
        cluesFound,
        lastUpdate: Date.now()
      };

      // Encrypt progress data
      const encryptedProgress = encryptProgress(progressData);
      
      // In a real implementation, this would use FHE external types
      // For now, we'll simulate the encrypted data transmission
      const encryptedData = JSON.stringify(encryptedProgress);
      
      // Update progress on blockchain with encrypted data
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'updateExpeditionProgress',
        args: [BigInt(expeditionId), BigInt(newProgress), encryptedData]
      });
      
      return true;
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateProgress,
    isLoading: isLoading || isPending,
    error: errorMessage || (error ? error.message : null),
  };
}

export function useGetMapInfo(mapId: number) {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getMapInfo',
    args: [BigInt(mapId)],
    query: {
      enabled: mapId >= 0,
    }
  });

  return {
    mapInfo: data,
    isLoading,
    error: error ? error.message : null,
  };
}

export function useJoinExpedition() {
  const { writeContract, isPending, error } = useWriteContract();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const joinExpedition = async (
    mapId: number,
    entryFee: number,
    encryptedLocationData: EncryptedData
  ) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Get current location for verification
      const userLocation = await getCurrentLocation();
      if (!userLocation) {
        throw new Error('Location access required to join expedition');
      }

      // Verify encrypted location data
      const locationData = JSON.stringify(encryptedLocationData);
      
      // Start expedition with encrypted initial progress
      const initialProgress = {
        expeditionId: 0, // Will be set by contract
        progress: 0,
        cluesFound: 0,
        lastUpdate: Date.now()
      };

      const encryptedProgress = encryptProgress(initialProgress);
      
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'startExpedition',
        args: [BigInt(mapId), BigInt(0), JSON.stringify(encryptedProgress)]
      });
      
      return true;
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    joinExpedition,
    isLoading: isLoading || isPending,
    error: errorMessage || (error ? error.message : null),
  };
}

export function useDecryptTreasureData() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const decryptTreasure = async (
    encryptedData: EncryptedData,
    userLocation: UserLocation
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, this would use FHE decryption
      // For now, we'll simulate the decryption process
      const decryptedData = JSON.parse(atob(encryptedData.encryptedValue));
      
      // Verify proximity for treasure revelation
      const distance = Math.sqrt(
        Math.pow(userLocation.latitude - decryptedData.latitude, 2) +
        Math.pow(userLocation.longitude - decryptedData.longitude, 2)
      ) * 111000; // Rough conversion to meters

      if (distance <= decryptedData.radius) {
        return decryptedData;
      } else {
        throw new Error('You are not close enough to reveal this treasure');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Decryption failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    decryptTreasure,
    isLoading,
    error,
  };
}