#!/usr/bin/env node

// Comprehensive faculty enrichment audit
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Comprehensive Faculty Enrichment Audit\n');

// Load data
const facultyData = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/facultyData.json'), 'utf8'));
const enrichedData = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/facultyEnriched.json'), 'utf8'));

const totalFaculty = facultyData.faculty.length;
const enrichedCount = Object.keys(enrichedData).length;

console.log('📊 Overall Statistics:');
console.log('=====================');
console.log(`Total faculty: ${totalFaculty}`);
console.log(`Enriched faculty: ${enrichedCount}`);
console.log(`Missing enrichment: ${totalFaculty - enrichedCount}`);
console.log(`Coverage: ${((enrichedCount / totalFaculty) * 100).toFixed(1)}%\n`);

// Categorize faculty by enrichment status
const missingEnrichment = [];
const incompleteEnrichment = [];
const completeEnrichment = [];
const recentlyAdded = [];

facultyData.faculty.forEach(faculty => {
  const enriched = enrichedData[faculty.id];
  
  if (!enriched) {
    missingEnrichment.push(faculty);
  } else {
    const hasBasicInfo = enriched.enrichment && enriched.enrichment.professional;
    const hasAffiliation = enriched.enrichment?.professional?.affiliation && 
                          enriched.enrichment.professional.affiliation !== 'Unknown';
    const hasORCID = enriched.enrichment?.academic?.orcid;
    
    if (!hasBasicInfo || !hasAffiliation) {
      incompleteEnrichment.push({
        ...faculty,
        issues: [
          !hasBasicInfo ? 'No basic professional info' : null,
          !hasAffiliation ? 'No affiliation' : null
        ].filter(Boolean)
      });
    } else {
      completeEnrichment.push(faculty);
    }
  }
});

// Check for recently added faculty (likely from historical workshops)
const recentFacultyIds = [
  'lewis-paul', 'beerli-peter', 'hoehna-sebastian', 'pennell-matt', 'stadler-tanja',
  'reyes-alejandro', 'kharchenko-peter', 'grad-yonatan', 'desjardins-christopher', 
  'kosakovsky-pond-sergei', 'eren-murat'
];

recentlyAdded.push(...facultyData.faculty.filter(f => recentFacultyIds.includes(f.id)));

console.log('❌ Faculty Missing Enrichment (' + missingEnrichment.length + '):');
if (missingEnrichment.length > 0) {
  missingEnrichment.forEach(f => {
    const isRecent = recentFacultyIds.includes(f.id);
    console.log(`  ${isRecent ? '🆕' : '  '} ${f.firstName} ${f.lastName} (${f.id})`);
  });
} else {
  console.log('  ✅ None! All faculty have some enrichment data');
}

console.log('\n⚠️  Faculty with Incomplete Enrichment (' + incompleteEnrichment.length + '):');
incompleteEnrichment.slice(0, 15).forEach(f => {
  const isRecent = recentFacultyIds.includes(f.id);
  console.log(`  ${isRecent ? '🆕' : '  '} ${f.firstName} ${f.lastName} (${f.id})`);
  f.issues.forEach(issue => console.log(`      - ${issue}`));
});
if (incompleteEnrichment.length > 15) {
  console.log(`  ... and ${incompleteEnrichment.length - 15} more with incomplete data`);
}

console.log('\n✅ Faculty with Complete Enrichment (' + completeEnrichment.length + '):');
console.log(`  ${completeEnrichment.length} faculty have complete professional and academic data`);

console.log('\n🆕 Recently Added Faculty Status:');
console.log('================================');
recentlyAdded.forEach(faculty => {
  const enriched = enrichedData[faculty.id];
  const status = !enriched ? '❌ Missing' : 
                 (!enriched.enrichment?.professional?.affiliation || 
                  enriched.enrichment.professional.affiliation === 'Unknown') ? '⚠️  Incomplete' : '✅ Complete';
  console.log(`  ${status} ${faculty.firstName} ${faculty.lastName} (${faculty.id})`);
});

// Generate recommendations
console.log('\n🎯 Recommendations:');
console.log('==================');
if (missingEnrichment.length > 0) {
  console.log(`1. Run enrichment pipeline on ${missingEnrichment.length} faculty missing data`);
}
if (incompleteEnrichment.length > 0) {
  console.log(`2. Review and improve enrichment for ${incompleteEnrichment.length} faculty with incomplete data`);
}
console.log('3. Validate enrichment quality for all recently added faculty');
console.log('4. Consider manual enrichment for high-priority faculty with missing affiliations');

console.log('\n📋 Next Steps:');
console.log('=============');
console.log('1. Run: node scripts/enrichAllFaculty.mjs');
console.log('2. Manually verify recent faculty enrichment quality');
console.log('3. Update any remaining missing affiliations');

const coverageGrade = enrichedCount / totalFaculty;
const grade = coverageGrade >= 0.95 ? 'A+' : 
              coverageGrade >= 0.90 ? 'A' : 
              coverageGrade >= 0.85 ? 'B+' : 
              coverageGrade >= 0.80 ? 'B' : 'C';

console.log(`\n🏆 Overall Enrichment Grade: ${grade} (${(coverageGrade * 100).toFixed(1)}% coverage)`);