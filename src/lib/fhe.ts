// FHE (Fully Homomorphic Encryption) utilities for Seek and Reveal
// This module handles encryption/decryption of sensitive treasure data

export interface EncryptedData {
  encryptedValue: string;
  publicKey: string;
  timestamp: number;
}

export interface TreasureCoordinates {
  latitude: number;
  longitude: number;
  radius: number; // meters
}

export interface ExpeditionProgress {
  expeditionId: number;
  progress: number; // 0-100
  cluesFound: number;
  lastUpdate: number;
}

/**
 * Encrypt treasure coordinates using FHE
 * In a real implementation, this would use actual FHE libraries
 */
export function encryptCoordinates(coordinates: TreasureCoordinates): EncryptedData {
  // Simulate FHE encryption
  const dataToEncrypt = JSON.stringify(coordinates);
  const encryptedValue = btoa(dataToEncrypt); // Base64 encoding as placeholder
  
  return {
    encryptedValue,
    publicKey: generatePublicKey(),
    timestamp: Date.now()
  };
}

/**
 * Decrypt treasure coordinates using FHE
 * Only works if user is within proximity
 */
export function decryptCoordinates(
  encryptedData: EncryptedData, 
  userLocation: { latitude: number; longitude: number }
): TreasureCoordinates | null {
  try {
    // Simulate proximity check
    const decryptedData = atob(encryptedData.encryptedValue);
    const coordinates: TreasureCoordinates = JSON.parse(decryptedData);
    
    // Check if user is within radius
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      coordinates.latitude,
      coordinates.longitude
    );
    
    if (distance <= coordinates.radius) {
      return coordinates;
    }
    
    return null; // User not close enough
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
}

/**
 * Encrypt expedition progress data
 */
export function encryptProgress(progress: ExpeditionProgress): EncryptedData {
  const dataToEncrypt = JSON.stringify(progress);
  const encryptedValue = btoa(dataToEncrypt);
  
  return {
    encryptedValue,
    publicKey: generatePublicKey(),
    timestamp: Date.now()
  };
}

/**
 * Decrypt expedition progress data
 */
export function decryptProgress(encryptedData: EncryptedData): ExpeditionProgress | null {
  try {
    const decryptedData = atob(encryptedData.encryptedValue);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error('Progress decryption failed:', error);
    return null;
  }
}

/**
 * Generate a mock public key for FHE
 */
function generatePublicKey(): string {
  return 'fhe_pk_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
}

/**
 * Create encrypted clue data
 */
export function encryptClue(clueData: {
  clueId: number;
  text: string;
  location: TreasureCoordinates;
  points: number;
}): EncryptedData {
  const dataToEncrypt = JSON.stringify(clueData);
  const encryptedValue = btoa(dataToEncrypt);
  
  return {
    encryptedValue,
    publicKey: generatePublicKey(),
    timestamp: Date.now()
  };
}

/**
 * Decrypt clue data
 */
export function decryptClue(
  encryptedData: EncryptedData,
  userLocation: { latitude: number; longitude: number }
): any | null {
  try {
    const decryptedData = atob(encryptedData.encryptedValue);
    const clueData = JSON.parse(decryptedData);
    
    // Check proximity for clue revelation
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      clueData.location.latitude,
      clueData.location.longitude
    );
    
    if (distance <= clueData.location.radius) {
      return clueData;
    }
    
    return null;
  } catch (error) {
    console.error('Clue decryption failed:', error);
    return null;
  }
}

/**
 * Validate FHE encrypted data integrity
 */
export function validateEncryptedData(encryptedData: EncryptedData): boolean {
  try {
    // Check if data is not too old (24 hours max)
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    if (Date.now() - encryptedData.timestamp > maxAge) {
      return false;
    }
    
    // Check if public key format is valid
    if (!encryptedData.publicKey.startsWith('fhe_pk_')) {
      return false;
    }
    
    // Try to decode the encrypted value
    atob(encryptedData.encryptedValue);
    
    return true;
  } catch (error) {
    return false;
  }
}
