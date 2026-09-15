/**
 * Geographic calculation utilities for the hobby store locator.
 * Uses the Haversine formula to compute straight-line distance locally.
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Default reference coordinates in Singapore (City Hall / Central Singapore)
export const DEFAULT_SINGAPORE_COORDS: Coordinates = {
  latitude: 1.2930,
  longitude: 103.8520,
};

/**
 * Calculates the straight-line distance between two sets of coordinates using the Haversine formula.
 *
 * @param lat1 Latitude of point 1 (user's latitude)
 * @param lon1 Longitude of point 1 (user's longitude)
 * @param lat2 Latitude of point 2 (store's latitude)
 * @param lon2 Longitude of point 2 (store's longitude)
 * @returns Distance in kilometers (distanceKm) rounded to two decimal places
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's mean radius in kilometers
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const lat1Rad = toRad(lat1);
  const lat2Rad = toRad(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distanceKm = R * c;
  return Math.round(distanceKm * 100) / 100;
}

/**
 * Formats distance display according to user requirement:
 * - below 1 km: display metres, e.g. "650 m away"
 * - 1 km or more: display kilometres, e.g. "2.4 km away"
 */
export function formatStoreDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    const metres = Math.round(distanceKm * 1000);
    return `${metres} m away`;
  }
  return `${distanceKm.toFixed(1)} km away`;
}
