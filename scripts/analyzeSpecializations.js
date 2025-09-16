#!/usr/bin/env node

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read enriched faculty data
const enrichedData = JSON.parse(readFileSync(join(__dirname, '../src/data/facultyEnriched.json'), 'utf8'));

console.log('SPECIALIZATION FREQUENCY ANALYSIS');
console.log('='.repeat(60));

// Count specialization frequencies
const specializationCounts = new Map();
const specializationFaculty = new Map(); // Track which faculty have each specialization

Object.entries(enrichedData).forEach(([facultyId, data]) => {
  if (data.enrichment?.academic?.researchAreas?.standardized) {
    const { primary = [], secondary = [], techniques = [] } = data.enrichment.academic.researchAreas.standardized;
    const allTopics = [...primary, ...secondary, ...techniques];

    // Track unique specializations per faculty
    const facultySpecializations = new Set();

    allTopics.forEach(topic => {
      if (topic.label) {
        facultySpecializations.add(topic.label);
      }
    });

    // Count each unique specialization
    facultySpecializations.forEach(spec => {
      specializationCounts.set(spec, (specializationCounts.get(spec) || 0) + 1);

      if (!specializationFaculty.has(spec)) {
        specializationFaculty.set(spec, []);
      }
      specializationFaculty.get(spec).push(data.name);
    });
  }
});

// Sort by frequency
const sortedSpecializations = Array.from(specializationCounts.entries())
  .sort((a, b) => b[1] - a[1]);

console.log('\nTOP 30 SPECIALIZATIONS BY FREQUENCY:');
console.log('-'.repeat(60));
sortedSpecializations.slice(0, 30).forEach(([spec, count], index) => {
  console.log(`${(index + 1).toString().padStart(2)}. ${spec.padEnd(40)} ${count} faculty`);
});

console.log('\n\nSIMILAR/DUPLICATE SPECIALIZATIONS TO CONSOLIDATE:');
console.log('-'.repeat(60));

// Find similar specializations
const consolidationCandidates = [];

// Look for similar terms
sortedSpecializations.forEach(([spec1, count1]) => {
  sortedSpecializations.forEach(([spec2, count2]) => {
    if (spec1 !== spec2) {
      const spec1Lower = spec1.toLowerCase();
      const spec2Lower = spec2.toLowerCase();

      // Check for variations
      if (
        // Plural variations
        (spec1Lower === spec2Lower + 's' || spec2Lower === spec1Lower + 's') ||
        // Methods vs Theory
        (spec1Lower.includes('method') && spec2Lower.includes('theory') &&
         spec1Lower.replace('method', '') === spec2Lower.replace('theory', '')) ||
        // Analysis vs Analytics
        (spec1Lower.includes('analysis') && spec2Lower.includes('analytic')) ||
        // Genomics variations
        (spec1Lower.includes('genomic') && spec2Lower.includes('genomic') &&
         Math.abs(spec1.length - spec2.length) < 5) ||
        // Dating variations
        (spec1Lower.includes('dating') && spec2Lower.includes('dating')) ||
        // Evolution variations
        (spec1Lower.includes('evolution') && spec2Lower.includes('evolution') &&
         Math.abs(spec1.length - spec2.length) < 10)
      ) {
        const pair = [spec1, spec2].sort();
        const pairKey = pair.join('|');
        if (!consolidationCandidates.find(c => c.key === pairKey)) {
          consolidationCandidates.push({
            key: pairKey,
            specs: pair,
            counts: [count1, count2]
          });
        }
      }
    }
  });
});

// Display consolidation candidates
const displayed = new Set();
consolidationCandidates.forEach(({ specs, counts }) => {
  const [spec1, spec2] = specs;
  if (!displayed.has(spec1) && !displayed.has(spec2)) {
    console.log(`• "${spec1}" (${counts[0]}) + "${spec2}" (${counts[1]})`);
    displayed.add(spec1);
    displayed.add(spec2);
  }
});

console.log('\n\nRECOMMENDED CONSOLIDATIONS:');
console.log('-'.repeat(60));

const consolidationMap = {
  // Methods/Theory consolidations
  'Coalescent Methods': 'Coalescent Theory',
  'Computational Methods': 'Computational Platforms',

  // Dating consolidations
  'Molecular Dating': 'Divergence Time Estimation',

  // Genomics consolidations
  'Evolutionary Genomics': 'Genome Evolution',
  'Ecological Genomics': 'Environmental Genomics',
  'Marine Genomics': 'Marine Biology',

  // Analysis consolidations
  'Introgression Analysis': 'Hybridization & Introgression',
  'Low Coverage Analysis': 'Low Coverage Sequencing',

  // General consolidations
  'General Genomics': 'Genomics & Omics Sciences',
  'Genome Annotation': 'Genome Assembly',
  'Multispecies Coalescent': 'Coalescent Theory',
  'GWAS Analysis': 'Association Studies'
};

Object.entries(consolidationMap).forEach(([from, to]) => {
  const fromCount = specializationCounts.get(from) || 0;
  const toCount = specializationCounts.get(to) || 0;
  if (fromCount > 0 || toCount > 0) {
    console.log(`• Merge "${from}" (${fromCount}) → "${to}" (${toCount}) = ${fromCount + toCount} total`);
  }
});

// Apply consolidations and recalculate
const consolidatedCounts = new Map();
sortedSpecializations.forEach(([spec, count]) => {
  const consolidated = consolidationMap[spec] || spec;
  consolidatedCounts.set(consolidated, (consolidatedCounts.get(consolidated) || 0) + count);
});

const finalSorted = Array.from(consolidatedCounts.entries())
  .sort((a, b) => b[1] - a[1]);

console.log('\n\nTOP 15 AFTER CONSOLIDATION:');
console.log('-'.repeat(60));
finalSorted.slice(0, 15).forEach(([spec, count], index) => {
  console.log(`${(index + 1).toString().padStart(2)}. ${spec.padEnd(40)} ${count} faculty`);
});

console.log('\n\nSUMMARY:');
console.log('='.repeat(60));
console.log(`Total unique specializations before: ${sortedSpecializations.length}`);
console.log(`Total unique specializations after: ${finalSorted.length}`);
console.log(`Reduction: ${sortedSpecializations.length - finalSorted.length} specializations`);
console.log(`\nRecommendation: Show top 12 specializations + "Show all..." option`);

// Export the top specializations for use in the app
console.log('\n\nTOP 12 FOR DROPDOWN (copy to code):');
console.log('-'.repeat(60));
console.log('const TOP_SPECIALIZATIONS = [');
finalSorted.slice(0, 12).forEach(([spec]) => {
  console.log(`  '${spec}',`);
});
console.log('];');