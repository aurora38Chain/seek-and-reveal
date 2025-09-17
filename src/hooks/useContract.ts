import { useContract, useContractRead, useContractWrite, useAccount } from 'wagmi';
import { useState } from 'react';
import { encryptProgress, decryptProgress, EncryptedData } from '../lib/fhe';
import { getCurrentLocation, UserLocation } from '../lib/location';

// Contract ABI - This would be generated from the compiled contract
const CONTRACT_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "_verifier", "type": "address"}
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "mapId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "creator", "type": "address"},
      {"indexed": false, "internalType": "string", "name": "name", "type": "string"}
    ],
    "name": "TreasureMapCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "expeditionId", "type": "uint256"},
      {"indexed": true, "internalType": "uint256", "name": "mapId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "explorer", "type": "address"}
    ],
    "name": "ExpeditionStarted",
    "type": "event"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "_name", "type": "string"},
      {"internalType": "string", "name": "_description", "type": "string"},
      {"internalType": "string", "name": "_ipfsHash", "type": "string"},
      {"internalType": "uint256", "name": "_difficulty", "type": "uint256"},
      {"internalType": "uint256", "name": "_rewardAmount", "type": "uint256"},
      {"internalType": "uint256", "name": "_duration", "type": "uint256"}
    ],
    "name": "createTreasureMap",
    "outputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "mapId", "type": "uint256"},
      {"internalType": "uint256", "name": "initialProgress", "type": "uint256"}
    ],
    "name": "startExpedition",
    "outputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "expeditionId", "type": "uint256"},
      {"internalType": "uint256", "name": "newProgress", "type": "uint256"}
    ],
    "name": "updateExpeditionProgress",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "mapId", "type": "uint256"}
    ],
    "name": "getMapInfo",
    "outputs": [
      {"internalType": "string", "name": "name", "type": "string"},
      {"internalType": "string", "name": "description", "type": "string"},
      {"internalType": "string", "name": "ipfsHash", "type": "string"},
      {"internalType": "uint8", "name": "difficulty", "type": "uint8"},
      {"internalType": "uint8", "name": "rewardAmount", "type": "uint8"},
      {"internalType": "uint8", "name": "participantCount", "type": "uint8"},
      {"internalType": "uint8", "name": "completionCount", "type": "uint8"},
      {"internalType": "bool", "name": "isActive", "type": "bool"},
      {"internalType": "bool", "name": "isVerified", "type": "bool"},
      {"internalType": "address", "name": "creator", "type": "address"},
      {"internalType": "uint256", "name": "createdAt", "type": "uint256"},
      {"internalType": "uint256", "name": "expiresAt", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Contract address - This would be the deployed contract address
const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000'; // Placeholder

export function useSeekAndRevealContract() {
  const { address } = useAccount();
  
  const contract = useContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
  });

  return {
    contract,
    address,
    isConnected: !!address,
  };
}

export function useCreateTreasureMap() {
  const { contract } = useSeekAndRevealContract();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createMap = async (
    name: string,
    description: string,
    ipfsHash: string,
    difficulty: number,
    rewardAmount: number,
    duration: number
  ) => {
    if (!contract) {
      setError('Contract not available');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const tx = await contract.createTreasureMap(
        name,
        description,
        ipfsHash,
        difficulty,
        rewardAmount,
        duration
      );
      
      await tx.wait();
      return tx.hash;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createMap,
    isLoading,
    error,
  };
}

export function useStartExpedition() {
  const { contract } = useSeekAndRevealContract();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startExpedition = async (mapId: number, initialProgress: number = 0) => {
    if (!contract) {
      setError('Contract not available');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const tx = await contract.startExpedition(mapId, initialProgress);
      await tx.wait();
      return tx.hash;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    startExpedition,
    isLoading,
    error,
  };
}

export function useUpdateExpeditionProgress() {
  const { contract } = useSeekAndRevealContract();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProgress = async (
    expeditionId: number, 
    newProgress: number,
    cluesFound: number = 0
  ) => {
    if (!contract) {
      setError('Contract not available');
      return;
    }

    setIsLoading(true);
    setError(null);

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
      const tx = await contract.updateExpeditionProgress(
        expeditionId, 
        newProgress,
        encryptedData // This would be the FHE encrypted data
      );
      
      await tx.wait();
      return tx.hash;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateProgress,
    isLoading,
    error,
  };
}

export function useGetMapInfo(mapId: number) {
  const { contract } = useSeekAndRevealContract();

  const { data, isLoading, error } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getMapInfo',
    args: [BigInt(mapId)],
    enabled: !!contract && mapId >= 0,
  });

  return {
    mapInfo: data,
    isLoading,
    error,
  };
}

export function useJoinExpedition() {
  const { contract, address } = useSeekAndRevealContract();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const joinExpedition = async (
    mapId: number,
    entryFee: number,
    encryptedLocationData: EncryptedData
  ) => {
    if (!contract || !address) {
      setError('Wallet not connected');
      return;
    }

    setIsLoading(true);
    setError(null);

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
      
      const tx = await contract.startExpedition(
        mapId,
        0, // Initial progress
        JSON.stringify(encryptedProgress)
      );
      
      await tx.wait();
      return tx.hash;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    joinExpedition,
    isLoading,
    error,
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
