import enrichedData from './src/data/facultyEnriched.json' with { type: 'json' };
import facultyData from './src/data/facultyData.json' with { type: 'json' };
import { getInstitutionCoordinates } from './src/utils/geocoding.js';

// Test Julia Barth's case
const juliaAffiliation = "University of Oslo / University of Basel";
console.log('Testing Julia Barth affiliation:', juliaAffiliation);

const coords = getInstitutionCoordinates(juliaAffiliation);
console.log('Returned coordinates:', coords);

// Test each part separately
console.log('\nTesting split parts:');
const parts = juliaAffiliation.split(' / ');
parts.forEach(part => {
  const partCoords = getInstitutionCoordinates(part.trim());
  console.log(`${part.trim()}:`, partCoords);
});

// Check if Oslo is in the coordinates database
console.log('\n\nChecking for Oslo in database:');
import coordinatesData from './src/data/institutionCoordinates.json' with { type: 'json' };

Object.entries(coordinatesData).forEach(([key, value]) => {
  if (key.toLowerCase().includes('oslo')) {
    console.log(key, value);
  }
});