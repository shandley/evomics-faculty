#!/usr/bin/env node

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read data files
const facultyData = JSON.parse(readFileSync(join(__dirname, '../src/data/facultyData.json'), 'utf8'));
const enrichedData = JSON.parse(readFileSync(join(__dirname, '../src/data/facultyEnriched.json'), 'utf8'));

console.log('ORPHANED FACULTY PROFILES ANALYSIS');
console.log('='.repeat(60));
console.log('Finding faculty with enriched profiles but no workshop participation\n');

// Create a set of faculty IDs that have participation records
const facultyWithParticipation = new Set();
facultyData.participations.forEach(p => {
  facultyWithParticipation.add(p.facultyId);
});

// Create a set of faculty IDs from the main faculty list
const allFacultyIds = new Set(facultyData.faculty.map(f => f.id));

// Find enriched profiles that don't match any participation records
const orphanedProfiles = [];
const enrichedNotInFacultyList = [];

Object.entries(enrichedData).forEach(([id, data]) => {
  if (!allFacultyIds.has(id)) {
    enrichedNotInFacultyList.push({
      id,
      name: data.name,
      affiliation: data.enrichment?.professional?.affiliation || 'Unknown',
      confidence: data.enrichment?.confidence || 'Unknown'
    });
  } else if (!facultyWithParticipation.has(id)) {
    orphanedProfiles.push({
      id,
      name: data.name,
      affiliation: data.enrichment?.professional?.affiliation || 'Unknown',
      confidence: data.enrichment?.confidence || 'Unknown'
    });
  }
});

// Also find faculty in faculty list but no enrichment
const facultyWithoutEnrichment = [];
facultyData.faculty.forEach(f => {
  if (!enrichedData[f.id]) {
    const participationCount = facultyData.participations.filter(p => p.facultyId === f.id).length;
    facultyWithoutEnrichment.push({
      id: f.id,
      name: `${f.firstName} ${f.lastName}`,
      participations: participationCount
    });
  }
});

console.log('1. ENRICHED PROFILES WITHOUT WORKSHOP PARTICIPATION:');
console.log('-'.repeat(50));
console.log(`Found: ${orphanedProfiles.length} faculty\n`);

orphanedProfiles.forEach((f, i) => {
  console.log(`${i + 1}. ${f.name} (${f.id})`);
  console.log(`   Affiliation: ${f.affiliation}`);
  console.log(`   Confidence: ${f.confidence}`);
  console.log('   ⚠️  NO WORKSHOP PARTICIPATION RECORDS');
  console.log('');
});

console.log('\n2. ENRICHED PROFILES NOT IN FACULTY LIST:');
console.log('-'.repeat(50));
console.log(`Found: ${enrichedNotInFacultyList.length} entries\n`);

enrichedNotInFacultyList.forEach((f, i) => {
  console.log(`${i + 1}. ${f.name} (${f.id})`);
  console.log(`   Affiliation: ${f.affiliation}`);
  console.log(`   Confidence: ${f.confidence}`);
  console.log('   ⚠️  NOT IN MAIN FACULTY LIST');
  console.log('');
});

console.log('\n3. FACULTY WITH PARTICIPATION BUT NO ENRICHMENT:');
console.log('-'.repeat(50));
console.log(`Found: ${facultyWithoutEnrichment.length} faculty\n`);

facultyWithoutEnrichment.slice(0, 10).forEach((f, i) => {
  console.log(`${i + 1}. ${f.name} (${f.id})`);
  console.log(`   Participations: ${f.participations}`);
  console.log('   ⚠️  NO ENRICHMENT DATA');
  console.log('');
});

if (facultyWithoutEnrichment.length > 10) {
  console.log(`   ... and ${facultyWithoutEnrichment.length - 10} more\n`);
}

console.log('\nSUMMARY:');
console.log('='.repeat(60));
console.log(`Total faculty in database: ${facultyData.faculty.length}`);
console.log(`Total enriched profiles: ${Object.keys(enrichedData).length}`);
console.log(`Faculty with participation: ${facultyWithParticipation.size}`);
console.log('');
console.log('ISSUES FOUND:');
console.log(`• Orphaned enriched profiles: ${orphanedProfiles.length}`);
console.log(`• Enriched but not in faculty list: ${enrichedNotInFacultyList.length}`);
console.log(`• Faculty without enrichment: ${facultyWithoutEnrichment.length}`);
console.log('');

if (orphanedProfiles.length > 0) {
  console.log('RECOMMENDED ACTIONS:');
  console.log('1. Remove orphaned enriched profiles (no workshop participation)');
  console.log('2. Verify if these faculty should have participation records');
  console.log('3. Check for data entry errors in faculty IDs');
}