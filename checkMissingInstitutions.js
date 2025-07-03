import enrichedData from './src/data/facultyEnriched.json' with { type: 'json' };
import coordinatesData from './src/data/institutionCoordinates.json' with { type: 'json' };

const missingInstitutions = new Set();
const foundInstitutions = new Set();

// Check all faculty affiliations
Object.values(enrichedData).forEach(faculty => {
  const affiliation = faculty.enrichment?.professional?.affiliation;
  if (!affiliation) return;
  
  // Handle dual affiliations
  if (affiliation.includes(' / ')) {
    const parts = affiliation.split(' / ');
    parts.forEach(part => {
      const trimmedPart = part.trim();
      if (coordinatesData[trimmedPart]) {
        foundInstitutions.add(trimmedPart);
      } else {
        missingInstitutions.add(trimmedPart);
      }
    });
  } else {
    if (coordinatesData[affiliation]) {
      foundInstitutions.add(affiliation);
    } else {
      missingInstitutions.add(affiliation);
    }
  }
});

console.log('Missing institutions from coordinates database:');
console.log('================================================');
[...missingInstitutions].sort().forEach(inst => {
  console.log(`- ${inst}`);
});

console.log(`\nTotal missing: ${missingInstitutions.size}`);
console.log(`Total found: ${foundInstitutions.size}`);