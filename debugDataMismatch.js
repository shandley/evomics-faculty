import enrichedData from './src/data/facultyEnriched.json' with { type: 'json' };
import facultyDataJson from './src/data/facultyData.json' with { type: 'json' };

// Get all faculty IDs from base data
const baseFacultyIds = new Set(facultyDataJson.faculty.map(f => f.id));

// Get all faculty IDs from enriched data
const enrichedFacultyIds = new Set(Object.keys(enrichedData));

// Find mismatches
const inBaseNotEnriched = [...baseFacultyIds].filter(id => !enrichedFacultyIds.has(id));
const inEnrichedNotBase = [...enrichedFacultyIds].filter(id => !baseFacultyIds.has(id));

console.log('Faculty in base data but not enriched:', inBaseNotEnriched.length);
if (inBaseNotEnriched.length > 0) {
  console.log('Examples:', inBaseNotEnriched.slice(0, 5));
}

console.log('\nFaculty in enriched data but not base:', inEnrichedNotBase.length);
if (inEnrichedNotBase.length > 0) {
  console.log('Examples:', inEnrichedNotBase.slice(0, 5));
}

// Check if there are faculty without enrichment data
const facultyWithoutEnrichment = [];
facultyDataJson.faculty.forEach(f => {
  if (!enrichedData[f.id] || !enrichedData[f.id].enrichment) {
    facultyWithoutEnrichment.push(f);
  }
});

console.log('\nFaculty without enrichment data:', facultyWithoutEnrichment.length);
if (facultyWithoutEnrichment.length > 0) {
  console.log('These faculty might be defaulting to wrong locations!');
  facultyWithoutEnrichment.slice(0, 10).forEach(f => {
    console.log(`- ${f.firstName} ${f.lastName} (${f.id})`);
  });
}