import type { EnrichedFacultyProfile } from '../types';
import coordinatesData from '../data/institutionCoordinates.json';

export interface LocationData {
  lat: number;
  lng: number;
  city: string;
  country: string;
}

export interface FacultyLocation extends LocationData {
  institution: string;
  faculty: EnrichedFacultyProfile[];
  count: number;
}

// Type the imported coordinates
const institutionCoordinates: Record<string, LocationData> = coordinatesData;

// Normalize institution names for matching
function normalizeInstitution(name: string): string {
  return name
    .toLowerCase()
    .replace(/[,\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Find coordinates for an institution
export function getInstitutionCoordinates(institution: string): LocationData | null {
  // Direct match
  if (institutionCoordinates[institution]) {
    return institutionCoordinates[institution];
  }
  
  // Normalized match
  const normalized = normalizeInstitution(institution);
  for (const [key, coords] of Object.entries(institutionCoordinates)) {
    if (normalizeInstitution(key) === normalized) {
      return coords;
    }
  }
  
  // Partial match
  for (const [key, coords] of Object.entries(institutionCoordinates)) {
    if (institution.includes(key) || key.includes(institution)) {
      return coords;
    }
    // Check for common university patterns
    const instLower = institution.toLowerCase();
    const keyLower = key.toLowerCase();
    if (
      (instLower.includes('university') && keyLower.includes('university') && 
       (instLower.includes(keyLower.split('university')[0].trim()) || 
        keyLower.includes(instLower.split('university')[0].trim()))) ||
      (instLower.includes('institute') && keyLower.includes('institute') &&
       (instLower.includes(keyLower.split('institute')[0].trim()) ||
        keyLower.includes(instLower.split('institute')[0].trim())))
    ) {
      return coords;
    }
  }
  
  return null;
}

// Aggregate faculty by location
export function aggregateFacultyByLocation(faculty: EnrichedFacultyProfile[]): FacultyLocation[] {
  const locationMap = new Map<string, FacultyLocation>();
  const unmappedInstitutions = new Set<string>();
  
  faculty.forEach(profile => {
    const institution = profile.enrichment?.professional?.affiliation;
    if (!institution) return;
    
    const coords = getInstitutionCoordinates(institution);
    if (coords) {
      const key = `${coords.lat},${coords.lng}`;
      if (!locationMap.has(key)) {
        locationMap.set(key, {
          ...coords,
          institution,
          faculty: [],
          count: 0
        });
      }
      const location = locationMap.get(key)!;
      location.faculty.push(profile);
      location.count++;
      
      // Update institution name if this one is more specific
      if (institution.length > location.institution.length) {
        location.institution = institution;
      }
    } else {
      unmappedInstitutions.add(institution);
    }
  });
  
  // Log unmapped institutions for future improvement
  if (unmappedInstitutions.size > 0) {
    console.log('Unmapped institutions:', Array.from(unmappedInstitutions));
  }
  
  return Array.from(locationMap.values());
}

// Get location statistics
export function getLocationStatistics(locations: FacultyLocation[]) {
  const countries = new Map<string, number>();
  const cities = new Map<string, number>();
  
  locations.forEach(location => {
    countries.set(location.country, (countries.get(location.country) || 0) + location.count);
    cities.set(`${location.city}, ${location.country}`, 
      (cities.get(`${location.city}, ${location.country}`) || 0) + location.count);
  });
  
  return {
    totalLocations: locations.length,
    totalCountries: countries.size,
    totalCities: cities.size,
    topCountries: Array.from(countries.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10),
    topCities: Array.from(cities.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
  };
}