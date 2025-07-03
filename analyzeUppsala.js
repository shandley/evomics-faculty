import enrichedData from './src/data/facultyEnriched.json' with { type: 'json' };
import coordinatesData from './src/data/institutionCoordinates.json' with { type: 'json' };

const uppsalaCoords = coordinatesData["Uppsala University"];
console.log('Uppsala coordinates:', uppsalaCoords);

// Find all institutions that have the same coordinates as Uppsala
const institutionsAtUppsalaCoords = [];
Object.entries(coordinatesData).forEach(([inst, coords]) => {
  if (coords.lat === uppsalaCoords.lat && coords.lng === uppsalaCoords.lng) {
    institutionsAtUppsalaCoords.push(inst);
  }
});

console.log('\nInstitutions with same coordinates as Uppsala:');
institutionsAtUppsalaCoords.forEach(inst => console.log(`- ${inst}`));

// Check faculty by their affiliations
const facultyByAffiliation = {};
Object.values(enrichedData).forEach(faculty => {
  const affiliation = faculty.enrichment?.professional?.affiliation;
  if (affiliation) {
    if (!facultyByAffiliation[affiliation]) {
      facultyByAffiliation[affiliation] = [];
    }
    facultyByAffiliation[affiliation].push(faculty.name);
  }
});

// Show faculty with Uppsala affiliation
console.log('\nFaculty with Uppsala in their affiliation:');
Object.entries(facultyByAffiliation).forEach(([aff, names]) => {
  if (aff.toLowerCase().includes('uppsala')) {
    console.log(`\n${aff}:`);
    names.forEach(name => console.log(`  - ${name}`));
  }
});