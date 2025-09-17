import { useContract, useContractRead, useContractWrite, useAccount } from 'wagmi';
import { useState } from 'react';

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

  const updateProgress = async (expeditionId: number, newProgress: number) => {
    if (!contract) {
      setError('Contract not available');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const tx = await contract.updateExpeditionProgress(expeditionId, newProgress);
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
