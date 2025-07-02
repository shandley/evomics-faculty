#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ORCID IDs found through search
const orcidsToAdd = [
  { id: 'leonard-guy', orcid: '0000-0002-4607-2064', name: 'Guy Leonard' },
  { id: 'marcet-houben-marina', orcid: '0000-0003-4838-187X', name: 'Marina Marcet-Houben' },
  { id: 'mcdonald-daniel', orcid: '0000-0003-0876-9060', name: 'Daniel McDonald' },
  { id: 'bank-claudia', orcid: '0000-0003-4730-758X', name: 'Claudia Bank' },
  { id: 'catchen-julian', orcid: '0000-0002-4798-660X', name: 'Julian Catchen' },
  { id: 'kubatko-laura', orcid: '0000-0002-5215-7144', name: 'Laura Kubatko' }
];

// Read the enriched faculty data
const dataPath = join(__dirname, '../src/data/facultyEnriched.json');
const enrichedData = JSON.parse(readFileSync(dataPath, 'utf8'));

console.log('Adding ORCID IDs to faculty profiles...\n');

let updatedCount = 0;

orcidsToAdd.forEach(({ id, orcid, name }) => {
  if (enrichedData[id]) {
    if (!enrichedData[id].enrichment.academic) {
      enrichedData[id].enrichment.academic = {};
    }
    
    const existing = enrichedData[id].enrichment.academic.orcid;
    if (existing !== orcid) {
      enrichedData[id].enrichment.academic.orcid = orcid;
      enrichedData[id].enrichment.lastUpdated = new Date().toISOString();
      console.log(`✓ Added ORCID ${orcid} for ${name}`);
      updatedCount++;
    } else {
      console.log(`- ${name} already has ORCID ${orcid}`);
    }
  } else {
    console.log(`✗ ${name} (${id}) not found in enriched data`);
  }
});

// Write back the updated data
if (updatedCount > 0) {
  writeFileSync(dataPath, JSON.stringify(enrichedData, null, 2));
  console.log(`\n✓ Updated ${updatedCount} faculty profiles with ORCID IDs`);
} else {
  console.log('\nNo updates needed.');
}

// Count total ORCID coverage
let totalWithOrcid = 0;
Object.values(enrichedData).forEach(faculty => {
  if (faculty.enrichment?.academic?.orcid) {
    totalWithOrcid++;
  }
});

console.log(`\nORCID Coverage: ${totalWithOrcid}/${Object.keys(enrichedData).length} (${(totalWithOrcid/Object.keys(enrichedData).length * 100).toFixed(1)}%)`);

// List remaining faculty needing ORCID IDs
const needingOrcid = [
  'catchen-julian',
  'kubatko-laura', 
  'malinsky-milan',
  'matschiner-michael',
  'marchet-camille',
  'bielawski-joseph'
];

console.log('\nStill need ORCID IDs for:');
needingOrcid.forEach(id => {
  if (enrichedData[id] && !enrichedData[id].enrichment?.academic?.orcid) {
    console.log(`- ${enrichedData[id].name}`);
  }
});