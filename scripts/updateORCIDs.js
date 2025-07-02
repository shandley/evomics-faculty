#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ORCID IDs found through search - Batch 3
const orcidsToAdd = [
  // Previous batches already added
  // High priority batch 1 (already added via Task)
  // High priority batch 2 (already added via Task)
  // High priority batch 3 (new)
  { id: 'meyer-britta', orcid: '0000-0002-2549-1825', name: 'Britta Meyer' },
  { id: 'rodriguez-ezpeleta-naiara', orcid: '0000-0001-6735-6755', name: 'Naiara Rodriguez-Ezpeleta' },
  { id: 'sousa-vitor', orcid: '0000-0003-3575-0875', name: 'Vitor Sousa' },
  { id: 'barnett-david', orcid: '0000-0003-1961-7206', name: 'David Barnett' },
  { id: 'garrison-erik', orcid: '0000-0003-3821-631X', name: 'Erik Garrison' },
  { id: 'griffith-malachi', orcid: '0000-0002-6388-446X', name: 'Malachi Griffith' }
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