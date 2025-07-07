#!/usr/bin/env node

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read data files
const facultyData = JSON.parse(readFileSync(join(__dirname, '../src/data/facultyData.json'), 'utf8'));
const enrichedData = JSON.parse(readFileSync(join(__dirname, '../src/data/facultyEnriched.json'), 'utf8'));

console.log('FACULTY DATA GAPS ANALYSIS');
console.log('='.repeat(60));

// 1. Missing Titles
console.log('\n1. MISSING PROFESSIONAL TITLES:');
console.log('-'.repeat(40));
const missingTitles = [];
Object.entries(enrichedData).forEach(([id, data]) => {
  if (!data.enrichment?.professional?.title) {
    const faculty = facultyData.faculty.find(f => f.id === id);
    missingTitles.push({
      id,
      name: faculty ? `${faculty.firstName} ${faculty.lastName}` : data.name,
      affiliation: data.enrichment?.professional?.affiliation || 'Unknown'
    });
  }
});
missingTitles.forEach((f, i) => {
  console.log(`${i + 1}. ${f.name} (${f.id})`);
  console.log(`   Affiliation: ${f.affiliation}`);
});

// 2. Missing Affiliations
console.log('\n\n2. MISSING AFFILIATIONS:');
console.log('-'.repeat(40));
const missingAffiliations = [];
Object.entries(enrichedData).forEach(([id, data]) => {
  if (!data.enrichment?.professional?.affiliation) {
    const faculty = facultyData.faculty.find(f => f.id === id);
    missingAffiliations.push({
      id,
      name: faculty ? `${faculty.firstName} ${faculty.lastName}` : data.name,
      title: data.enrichment?.professional?.title || 'Unknown'
    });
  }
});
missingAffiliations.forEach((f, i) => {
  console.log(`${i + 1}. ${f.name} (${f.id})`);
  console.log(`   Title: ${f.title}`);
});

// 3. Missing Research Areas
console.log('\n\n3. MISSING RESEARCH AREAS:');
console.log('-'.repeat(40));
const missingResearchAreas = [];
Object.entries(enrichedData).forEach(([id, data]) => {
  const hasResearchAreas = data.enrichment?.academic?.researchAreas?.raw?.length > 0 || 
                          data.enrichment?.academic?.researchAreas?.length > 0;
  if (!hasResearchAreas) {
    const faculty = facultyData.faculty.find(f => f.id === id);
    missingResearchAreas.push({
      id,
      name: faculty ? `${faculty.firstName} ${faculty.lastName}` : data.name,
      affiliation: data.enrichment?.professional?.affiliation || 'Unknown'
    });
  }
});
missingResearchAreas.forEach((f, i) => {
  console.log(`${i + 1}. ${f.name} (${f.id})`);
  console.log(`   Affiliation: ${f.affiliation}`);
});

// 4. Missing ORCIDs
console.log('\n\n4. MISSING ORCID IDs:');
console.log('-'.repeat(40));
const missingOrcids = [];
Object.entries(enrichedData).forEach(([id, data]) => {
  if (!data.enrichment?.academic?.orcid) {
    const faculty = facultyData.faculty.find(f => f.id === id);
    missingOrcids.push({
      id,
      name: faculty ? `${faculty.firstName} ${faculty.lastName}` : data.name,
      affiliation: data.enrichment?.professional?.affiliation || 'Unknown'
    });
  }
});
console.log(`Total missing: ${missingOrcids.length}`);
missingOrcids.slice(0, 15).forEach((f, i) => {
  console.log(`${i + 1}. ${f.name} (${f.id})`);
  console.log(`   Affiliation: ${f.affiliation}`);
});
if (missingOrcids.length > 15) {
  console.log(`   ... and ${missingOrcids.length - 15} more`);
}

console.log('\n\nSUMMARY:');
console.log('='.repeat(60));
console.log(`Missing Titles: ${missingTitles.length}`);
console.log(`Missing Affiliations: ${missingAffiliations.length}`);
console.log(`Missing Research Areas: ${missingResearchAreas.length}`);
console.log(`Missing ORCIDs: ${missingOrcids.length}`);