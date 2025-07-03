import enrichedData from './src/data/facultyEnriched.json' with { type: 'json' };
import coordinatesData from './src/data/institutionCoordinates.json' with { type: 'json' };

// Manually implement the geocoding logic to test
function testGeocode(institution) {
  // Handle dual affiliations
  if (institution.includes(' / ')) {
    const parts = institution.split(' / ');
    for (const part of parts) {
      const result = testGeocode(part.trim());
      if (result) {
        return { ...result, matchedPart: part.trim() };
      }
    }
  }
  
  // Direct match
  if (coordinatesData[institution]) {
    return { ...coordinatesData[institution], matchType: 'direct', matchedKey: institution };
  }
  
  // Normalized match
  const normalized = institution.toLowerCase().replace(/[,\-]/g, ' ').replace(/\s+/g, ' ').trim();
  for (const [key, coords] of Object.entries(coordinatesData)) {
    const keyNorm = key.toLowerCase().replace(/[,\-]/g, ' ').replace(/\s+/g, ' ').trim();
    if (keyNorm === normalized) {
      return { ...coords, matchType: 'normalized', matchedKey: key };
    }
  }
  
  // Handle "University Medical Center X" -> "University of X" pattern
  if (institution.includes('University Medical Center')) {
    const cityMatch = institution.match(/University Medical Center (\w+)/);
    if (cityMatch) {
      const universityVariant = `University of ${cityMatch[1]}`;
      if (coordinatesData[universityVariant]) {
        return { ...coordinatesData[universityVariant], matchType: 'medical-center', matchedKey: universityVariant };
      }
    }
  }
  
  // Partial match
  for (const [key, coords] of Object.entries(coordinatesData)) {
    if (institution.includes(key) || key.includes(institution)) {
      return { ...coords, matchType: 'partial', matchedKey: key, originalInst: institution };
    }
  }
  
  return null;
}

// Test all faculty and find those matching Uppsala
const uppsalaMatches = [];
const allMatches = [];

Object.values(enrichedData).forEach(faculty => {
  const affiliation = faculty.enrichment?.professional?.affiliation;
  if (!affiliation) return;
  
  const result = testGeocode(affiliation);
  if (result) {
    allMatches.push({ faculty: faculty.name, affiliation, result });
    if (result.city === 'Uppsala') {
      uppsalaMatches.push({ faculty: faculty.name, affiliation, result });
    }
  }
});

console.log('Faculty mapped to Uppsala:');
console.log('=========================');
uppsalaMatches.forEach(match => {
  console.log(`\n${match.faculty}`);
  console.log(`  Affiliation: ${match.affiliation}`);
  console.log(`  Match type: ${match.result.matchType}`);
  console.log(`  Matched key: ${match.result.matchedKey}`);
  if (match.result.matchedPart) {
    console.log(`  Matched part: ${match.result.matchedPart}`);
  }
});

console.log(`\nTotal Uppsala matches: ${uppsalaMatches.length}`);