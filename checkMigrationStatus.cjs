const enrichedData = require('./src/data/facultyEnriched.json');
const facultyData = require('./src/data/facultyData.json');

const totalFaculty = facultyData.faculty.length;
const enrichedFaculty = Object.keys(enrichedData).length;
let withStandardized = 0;
let withRawOnly = 0;
let noResearchAreas = 0;

const facultyWithStandardized = [];
const facultyWithRawOnly = [];

Object.entries(enrichedData).forEach(([id, faculty]) => {
  if (faculty.enrichment?.academic?.researchAreas) {
    const areas = faculty.enrichment.academic.researchAreas;
    if (!Array.isArray(areas) && areas.standardized) {
      withStandardized++;
      facultyWithStandardized.push(faculty.name || id);
    } else if (Array.isArray(areas) || (areas.raw && !areas.standardized)) {
      withRawOnly++;
      facultyWithRawOnly.push(faculty.name || id);
    }
  } else {
    noResearchAreas++;
  }
});

console.log('=== Faculty Topic Standardization Status ===\n');
console.log('Total faculty in system:', totalFaculty);
console.log('Total enriched faculty:', enrichedFaculty);
console.log('Faculty with standardized topics:', withStandardized);
console.log('Faculty with raw research areas only:', withRawOnly);
console.log('Faculty with no research areas:', noResearchAreas);
console.log('\nCoverage: ' + ((withStandardized / totalFaculty * 100).toFixed(1)) + '% of all faculty');
console.log('Migration rate: ' + ((withStandardized / enrichedFaculty * 100).toFixed(1)) + '% of enriched faculty');

if (facultyWithRawOnly.length > 0) {
  console.log('\n=== Faculty Still Needing Migration ===');
  console.log('Count:', facultyWithRawOnly.length);
  console.log('Sample (first 5):', facultyWithRawOnly.slice(0, 5).join(', '));
}

console.log('\n=== Faculty With Standardized Topics ===');
console.log('Count:', facultyWithStandardized.length);
console.log('Sample (first 5):', facultyWithStandardized.slice(0, 5).join(', '));