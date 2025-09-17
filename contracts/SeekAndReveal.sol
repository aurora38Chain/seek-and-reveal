// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract SeekAndReveal is SepoliaConfig {
    using FHE for *;
    
    struct TreasureMap {
        euint32 mapId;
        euint32 difficulty;
        euint32 rewardAmount;
        euint32 participantCount;
        euint32 completionCount;
        bool isActive;
        bool isVerified;
        string name;
        string description;
        string ipfsHash;
        address creator;
        uint256 createdAt;
        uint256 expiresAt;
    }
    
    struct Expedition {
        euint32 expeditionId;
        euint32 mapId;
        euint32 progress;
        euint32 score;
        bool isCompleted;
        bool isVerified;
        address explorer;
        uint256 startTime;
        uint256 endTime;
    }
    
    struct Clue {
        euint32 clueId;
        euint32 mapId;
        euint32 order;
        euint32 points;
        bool isRevealed;
        string encryptedData;
        string ipfsHash;
        address creator;
        uint256 createdAt;
    }
    
    struct LeaderboardEntry {
        address explorer;
        euint32 totalScore;
        euint32 expeditionsCompleted;
        euint32 mapsCreated;
        uint256 lastActivity;
    }
    
    mapping(uint256 => TreasureMap) public treasureMaps;
    mapping(uint256 => Expedition) public expeditions;
    mapping(uint256 => Clue) public clues;
    mapping(address => LeaderboardEntry) public leaderboard;
    mapping(address => euint32) public explorerReputation;
    mapping(address => euint32) public creatorReputation;
    
    uint256 public mapCounter;
    uint256 public expeditionCounter;
    uint256 public clueCounter;
    
    address public owner;
    address public verifier;
    
    event TreasureMapCreated(uint256 indexed mapId, address indexed creator, string name);
    event ExpeditionStarted(uint256 indexed expeditionId, uint256 indexed mapId, address indexed explorer);
    event ExpeditionCompleted(uint256 indexed expeditionId, uint256 indexed mapId, address indexed explorer);
    event ClueRevealed(uint256 indexed clueId, uint256 indexed mapId, address indexed explorer);
    event MapVerified(uint256 indexed mapId, bool isVerified);
    event ReputationUpdated(address indexed user, uint32 reputation);
    event RewardClaimed(uint256 indexed expeditionId, address indexed explorer, uint32 amount);
    
    constructor(address _verifier) {
        owner = msg.sender;
        verifier = _verifier;
    }
    
    function createTreasureMap(
        string memory _name,
        string memory _description,
        string memory _ipfsHash,
        uint256 _difficulty,
        uint256 _rewardAmount,
        uint256 _duration
    ) public returns (uint256) {
        require(bytes(_name).length > 0, "Map name cannot be empty");
        require(_duration > 0, "Duration must be positive");
        require(_difficulty > 0 && _difficulty <= 10, "Difficulty must be between 1 and 10");
        
        uint256 mapId = mapCounter++;
        
        treasureMaps[mapId] = TreasureMap({
            mapId: FHE.asEuint32(0), // Will be set properly later
            difficulty: FHE.asEuint32(0), // Will be set to actual value via FHE operations
            rewardAmount: FHE.asEuint32(0), // Will be set to actual value via FHE operations
            participantCount: FHE.asEuint32(0),
            completionCount: FHE.asEuint32(0),
            isActive: true,
            isVerified: false,
            name: _name,
            description: _description,
            ipfsHash: _ipfsHash,
            creator: msg.sender,
            createdAt: block.timestamp,
            expiresAt: block.timestamp + _duration
        });
        
        emit TreasureMapCreated(mapId, msg.sender, _name);
        return mapId;
    }
    
    function startExpedition(
        uint256 mapId,
        externalEuint32 initialProgress,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(treasureMaps[mapId].creator != address(0), "Map does not exist");
        require(treasureMaps[mapId].isActive, "Map is not active");
        require(block.timestamp <= treasureMaps[mapId].expiresAt, "Map has expired");
        
        uint256 expeditionId = expeditionCounter++;
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalProgress = FHE.fromExternal(initialProgress, inputProof);
        
        expeditions[expeditionId] = Expedition({
            expeditionId: FHE.asEuint32(0), // Will be set properly later
            mapId: FHE.asEuint32(0), // Will be set to actual value via FHE operations
            progress: internalProgress,
            score: FHE.asEuint32(0),
            isCompleted: false,
            isVerified: false,
            explorer: msg.sender,
            startTime: block.timestamp,
            endTime: 0
        });
        
        // Update map participant count
        treasureMaps[mapId].participantCount = FHE.add(treasureMaps[mapId].participantCount, FHE.asEuint32(1));
        
        emit ExpeditionStarted(expeditionId, mapId, msg.sender);
        return expeditionId;
    }
    
    function updateExpeditionProgress(
        uint256 expeditionId,
        externalEuint32 newProgress,
        bytes calldata inputProof
    ) public {
        require(expeditions[expeditionId].explorer == msg.sender, "Only explorer can update progress");
        require(!expeditions[expeditionId].isCompleted, "Expedition already completed");
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalProgress = FHE.fromExternal(newProgress, inputProof);
        
        expeditions[expeditionId].progress = internalProgress;
        
        // Check if expedition is completed (progress >= 100)
        ebool isCompleted = FHE.gte(internalProgress, FHE.asEuint32(100));
        expeditions[expeditionId].isCompleted = FHE.decrypt(isCompleted);
        
        if (FHE.decrypt(isCompleted)) {
            expeditions[expeditionId].endTime = block.timestamp;
            uint256 mapId = uint256(FHE.decrypt(expeditions[expeditionId].mapId));
            treasureMaps[mapId].completionCount = FHE.add(treasureMaps[mapId].completionCount, FHE.asEuint32(1));
            emit ExpeditionCompleted(expeditionId, mapId, msg.sender);
        }
    }
    
    function revealClue(
        uint256 mapId,
        uint256 clueOrder,
        string memory _encryptedData,
        string memory _ipfsHash
    ) public returns (uint256) {
        require(treasureMaps[mapId].creator == msg.sender, "Only map creator can reveal clues");
        require(treasureMaps[mapId].isActive, "Map must be active");
        
        uint256 clueId = clueCounter++;
        
        clues[clueId] = Clue({
            clueId: FHE.asEuint32(0), // Will be set properly later
            mapId: FHE.asEuint32(0), // Will be set to actual value via FHE operations
            order: FHE.asEuint32(0), // Will be set to actual value via FHE operations
            points: FHE.asEuint32(0), // Will be set to actual value via FHE operations
            isRevealed: true,
            encryptedData: _encryptedData,
            ipfsHash: _ipfsHash,
            creator: msg.sender,
            createdAt: block.timestamp
        });
        
        emit ClueRevealed(clueId, mapId, msg.sender);
        return clueId;
    }
    
    function verifyMap(uint256 mapId, bool isVerified) public {
        require(msg.sender == verifier, "Only verifier can verify maps");
        require(treasureMaps[mapId].creator != address(0), "Map does not exist");
        
        treasureMaps[mapId].isVerified = isVerified;
        emit MapVerified(mapId, isVerified);
    }
    
    function updateReputation(address user, euint32 reputation, bool isCreator) public {
        require(msg.sender == verifier, "Only verifier can update reputation");
        require(user != address(0), "Invalid user address");
        
        if (isCreator) {
            creatorReputation[user] = reputation;
        } else {
            explorerReputation[user] = reputation;
        }
        
        emit ReputationUpdated(user, 0); // FHE.decrypt(reputation) - will be decrypted off-chain
    }
    
    function claimReward(uint256 expeditionId) public {
        require(expeditions[expeditionId].explorer == msg.sender, "Only explorer can claim reward");
        require(expeditions[expeditionId].isCompleted, "Expedition must be completed");
        require(expeditions[expeditionId].isVerified, "Expedition must be verified");
        
        uint256 mapId = uint256(FHE.decrypt(expeditions[expeditionId].mapId));
        uint256 rewardAmount = uint256(FHE.decrypt(treasureMaps[mapId].rewardAmount));
        
        // Transfer reward to explorer
        // Note: In a real implementation, funds would be transferred based on decrypted amount
        expeditions[expeditionId].isVerified = false; // Prevent double claiming
        
        emit RewardClaimed(expeditionId, msg.sender, uint32(rewardAmount));
    }
    
    function getMapInfo(uint256 mapId) public view returns (
        string memory name,
        string memory description,
        string memory ipfsHash,
        uint8 difficulty,
        uint8 rewardAmount,
        uint8 participantCount,
        uint8 completionCount,
        bool isActive,
        bool isVerified,
        address creator,
        uint256 createdAt,
        uint256 expiresAt
    ) {
        TreasureMap storage map = treasureMaps[mapId];
        return (
            map.name,
            map.description,
            map.ipfsHash,
            0, // FHE.decrypt(map.difficulty) - will be decrypted off-chain
            0, // FHE.decrypt(map.rewardAmount) - will be decrypted off-chain
            0, // FHE.decrypt(map.participantCount) - will be decrypted off-chain
            0, // FHE.decrypt(map.completionCount) - will be decrypted off-chain
            map.isActive,
            map.isVerified,
            map.creator,
            map.createdAt,
            map.expiresAt
        );
    }
    
    function getExpeditionInfo(uint256 expeditionId) public view returns (
        uint8 mapId,
        uint8 progress,
        uint8 score,
        bool isCompleted,
        bool isVerified,
        address explorer,
        uint256 startTime,
        uint256 endTime
    ) {
        Expedition storage expedition = expeditions[expeditionId];
        return (
            0, // FHE.decrypt(expedition.mapId) - will be decrypted off-chain
            0, // FHE.decrypt(expedition.progress) - will be decrypted off-chain
            0, // FHE.decrypt(expedition.score) - will be decrypted off-chain
            expedition.isCompleted,
            expedition.isVerified,
            expedition.explorer,
            expedition.startTime,
            expedition.endTime
        );
    }
    
    function getClueInfo(uint256 clueId) public view returns (
        uint8 mapId,
        uint8 order,
        uint8 points,
        bool isRevealed,
        string memory encryptedData,
        string memory ipfsHash,
        address creator,
        uint256 createdAt
    ) {
        Clue storage clue = clues[clueId];
        return (
            0, // FHE.decrypt(clue.mapId) - will be decrypted off-chain
            0, // FHE.decrypt(clue.order) - will be decrypted off-chain
            0, // FHE.decrypt(clue.points) - will be decrypted off-chain
            clue.isRevealed,
            clue.encryptedData,
            clue.ipfsHash,
            clue.creator,
            clue.createdAt
        );
    }
    
    function getExplorerReputation(address explorer) public view returns (uint8) {
        return 0; // FHE.decrypt(explorerReputation[explorer]) - will be decrypted off-chain
    }
    
    function getCreatorReputation(address creator) public view returns (uint8) {
        return 0; // FHE.decrypt(creatorReputation[creator]) - will be decrypted off-chain
    }
    
    function getLeaderboardEntry(address user) public view returns (
        uint8 totalScore,
        uint8 expeditionsCompleted,
        uint8 mapsCreated,
        uint256 lastActivity
    ) {
        LeaderboardEntry storage entry = leaderboard[user];
        return (
            0, // FHE.decrypt(entry.totalScore) - will be decrypted off-chain
            0, // FHE.decrypt(entry.expeditionsCompleted) - will be decrypted off-chain
            0, // FHE.decrypt(entry.mapsCreated) - will be decrypted off-chain
            entry.lastActivity
        );
    }
}
