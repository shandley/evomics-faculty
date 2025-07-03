const taxonomy = require('./src/data/taxonomy/scientificTopics.json');
const mappings = require('./src/data/taxonomy/termMappings.json');
const enriched = require('./src/data/facultyEnriched.json');
const facultyData = require('./src/data/facultyData.json');

// Analyze data richness
let totalTopics = 0;
Object.values(taxonomy).forEach(level => {
  if (typeof level === 'object' && !Array.isArray(level) && level !== null) {
    Object.values(level).forEach(item => {
      if (item && typeof item === 'object' && item.id) {
        totalTopics++;
      }
    });
  }
});

let facultyWithOrcid = 0;
let facultyWithWebsite = 0;
let facultyWithBio = 0;
let facultyWithDepartment = 0;
let totalYearsTeaching = 0;
let topicUsage = new Map();

Object.values(enriched).forEach(f => {
  if (f.enrichment?.academic?.orcid) facultyWithOrcid++;
  if (f.enrichment?.professional?.labWebsite) facultyWithWebsite++;
  if (f.enrichment?.profile?.shortBio) facultyWithBio++;
  if (f.enrichment?.professional?.department) facultyWithDepartment++;
  
  // Count topic usage
  if (f.enrichment?.academic?.researchAreas?.standardized) {
    const { primary = [], secondary = [], techniques = [] } = f.enrichment.academic.researchAreas.standardized;
    [...primary, ...secondary, ...techniques].forEach(topic => {
      topicUsage.set(topic.id, (topicUsage.get(topic.id) || 0) + 1);
    });
  }
});

// Count total teaching years from faculty data
Object.values(enriched).forEach(f => {
  // Count years from faculty statistics
  const stats = f.statistics || {};
  totalYearsTeaching += (stats.totalYears || 0);
});

console.log('=== Data Richness Analysis ===');
console.log('\nTaxonomy:');
console.log('- Total topics:', totalTopics);
console.log('- Term mappings:', Object.keys(mappings.mappings).length);
console.log('- Topics with faculty:', topicUsage.size);

console.log('\nFaculty Data (163 enriched):');
console.log('- With ORCID:', facultyWithOrcid, `(${(facultyWithOrcid/163*100).toFixed(1)}%)`);
console.log('- With websites:', facultyWithWebsite, `(${(facultyWithWebsite/163*100).toFixed(1)}%)`);
console.log('- With bios:', facultyWithBio, `(${(facultyWithBio/163*100).toFixed(1)}%)`);
console.log('- With departments:', facultyWithDepartment, `(${(facultyWithDepartment/163*100).toFixed(1)}%)`);

console.log('\nWorkshop Data:');
console.log('- Total teaching instances:', totalYearsTeaching);
console.log('- Total faculty:', facultyData.faculty.length);
console.log('- Workshops covered:', facultyData.workshops ? Object.keys(facultyData.workshops).length : 3);

// Find most popular topics
const topTopics = Array.from(topicUsage.entries())
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10);

console.log('\nTop 10 Research Topics:');
topTopics.forEach(([topic, count]) => {
  console.log(`- ${topic}: ${count} faculty`);
});