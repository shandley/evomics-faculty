/**
 * Enhanced Faculty Matching with Accent and Hyphenation Handling
 * Fixes the Mercè Montoliu Nerín → Mercè Montoliu-Nerin matching issue
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load data
const workshopDataPath = join(__dirname, '../data/workshops/wog_2023_2025_extracted.json');
const facultyDataPath = join(__dirname, '../src/data/facultyData.json');

const workshopData = JSON.parse(readFileSync(workshopDataPath, 'utf8'));
const facultyDataRaw = JSON.parse(readFileSync(facultyDataPath, 'utf8'));
const facultyData = facultyDataRaw.faculty;

function enhancedNameNormalization(name) {
  return name
    .toLowerCase()
    .trim()
    // Remove titles
    .replace(/^(dr\.|prof\.|mr\.|ms\.|mrs\.)\s+/i, '')
    // Unicode normalization (decompose)
    .normalize('NFD')
    // Remove diacritics/accents
    .replace(/[\u0300-\u036f]/g, '')
    // Explicit accent replacements
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ýÿ]/g, 'y')
    .replace(/ç/g, 'c')
    .replace(/ñ/g, 'n')
    // Eastern European characters
    .replace(/[čć]/g, 'c')
    .replace(/[žš]/g, 's')
    .replace(/[ď]/g, 'd')
    .replace(/[ť]/g, 't')
    .replace(/[ľĺ]/g, 'l')
    .replace(/[ř]/g, 'r')
    .replace(/[ň]/g, 'n')
    .replace(/[ě]/g, 'e')
    // Normalize spaces and hyphens
    .replace(/[-_]/g, ' ')      // Convert hyphens to spaces
    .replace(/\s+/g, ' ')       // Normalize multiple spaces
    .trim();
}

function extractNameParts(normalizedName) {
  const parts = normalizedName.split(' ').filter(part => part.length > 0);
  if (parts.length < 2) return null;
  
  return {
    firstName: parts[0],
    lastName: parts[parts.length - 1],
    middleNames: parts.slice(1, -1),
    fullName: normalizedName
  };
}

function enhancedFacultyMatch(presenterName, facultyList) {
  const normalizedPresenter = enhancedNameNormalization(presenterName);
  const presenterParts = extractNameParts(normalizedPresenter);
  
  if (!presenterParts) return null;
  
  const matches = [];
  
  for (const faculty of facultyList) {
    const facultyFullName = `${faculty.firstName} ${faculty.lastName}`;
    const normalizedFaculty = enhancedNameNormalization(facultyFullName);
    const facultyParts = extractNameParts(normalizedFaculty);
    
    if (!facultyParts) continue;
    
    let matchScore = 0;
    let matchType = '';
    
    // Exact match after normalization
    if (presenterParts.firstName === facultyParts.firstName && 
        presenterParts.lastName === facultyParts.lastName) {
      matchScore = 1.0;
      matchType = 'exact_normalized';
    }
    // Last name exact + first name starts with
    else if (presenterParts.lastName === facultyParts.lastName && 
             facultyParts.firstName.startsWith(presenterParts.firstName)) {
      matchScore = 0.9;
      matchType = 'lastname_exact_firstname_prefix';
    }
    // Last name exact + first initial
    else if (presenterParts.lastName === facultyParts.lastName && 
             facultyParts.firstName[0] === presenterParts.firstName[0]) {
      matchScore = 0.8;
      matchType = 'lastname_exact_firstname_initial';
    }
    // Fuzzy last name + exact first name
    else if (presenterParts.firstName === facultyParts.firstName && 
             levenshteinSimilarity(presenterParts.lastName, facultyParts.lastName) > 0.8) {
      matchScore = 0.7;
      matchType = 'firstname_exact_lastname_fuzzy';
    }
    
    if (matchScore > 0) {
      matches.push({
        faculty,
        score: matchScore,
        type: matchType,
        presenterNormalized: normalizedPresenter,
        facultyNormalized: normalizedFaculty
      });
    }
  }
  
  // Return best match if score > 0.7
  matches.sort((a, b) => b.score - a.score);
  return matches.length > 0 && matches[0].score > 0.7 ? matches[0] : null;
}

function levenshteinSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

function levenshteinDistance(str1, str2) {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

// Test the enhanced matching
console.log('🔧 Testing Enhanced Faculty Matching\n');

// Extract all unique presenters
const allPresenters = new Set();
workshopData.forEach(workshop => {
  workshop.weeks.forEach(week => {
    week.sessions.forEach(session => {
      session.presenters.forEach(presenter => {
        if (presenter !== 'Everyone' && presenter !== 'Workshop Team') {
          allPresenters.add(presenter);
        }
      });
    });
  });
});

const presenters = Array.from(allPresenters);
console.log(`Testing ${presenters.length} unique presenters:\n`);

const results = {
  matched: [],
  unmatched: [],
  improved: []
};

presenters.forEach(presenter => {
  const match = enhancedFacultyMatch(presenter, facultyData);
  
  if (match) {
    results.matched.push({
      presenter,
      faculty: `${match.faculty.firstName} ${match.faculty.lastName}`,
      score: match.score,
      type: match.type,
      presenterNormalized: match.presenterNormalized,
      facultyNormalized: match.facultyNormalized
    });
  } else {
    results.unmatched.push({
      presenter,
      normalized: enhancedNameNormalization(presenter)
    });
  }
});

console.log('✅ Successfully Matched:');
results.matched.forEach(match => {
  const confidence = match.score >= 0.95 ? 'HIGH' : match.score >= 0.8 ? 'MEDIUM' : 'LOW';
  console.log(`  ${match.presenter} → ${match.faculty} (${confidence}: ${match.score.toFixed(2)})`);
  if (match.presenterNormalized !== match.facultyNormalized) {
    console.log(`    Normalized: "${match.presenterNormalized}" → "${match.facultyNormalized}"`);
  }
});

console.log('\n❌ Still Unmatched:');
results.unmatched.forEach(unmatch => {
  console.log(`  ${unmatch.presenter} (normalized: "${unmatch.normalized}")`);
});

console.log('\n📊 Enhanced Matching Results:');
console.log(`  Total Presenters: ${presenters.length}`);
console.log(`  Successfully Matched: ${results.matched.length} (${(results.matched.length/presenters.length*100).toFixed(1)}%)`);
console.log(`  Still Unmatched: ${results.unmatched.length} (${(results.unmatched.length/presenters.length*100).toFixed(1)}%)`);

// Analyze specific cases
console.log('\n🎯 Key Matching Cases:');
const keyTests = [
  'Mercè Montoliu Nerín',
  'Petr Daněček', 
  'Ben Langmead',
  'Daniel Kintzl',
  'Dag Ahrén',
  'Rosa Fernández'
];

keyTests.forEach(testName => {
  const match = enhancedFacultyMatch(testName, facultyData);
  if (match) {
    console.log(`  ✅ "${testName}" → "${match.faculty.firstName} ${match.faculty.lastName}" (${match.score.toFixed(2)})`);
  } else {
    console.log(`  ❌ "${testName}" → No match found`);
  }
});

// Export enhanced results
const enhancedResults = {
  totalPresenters: presenters.length,
  matchedCount: results.matched.length,
  unmatchedCount: results.unmatched.length,
  matchRate: (results.matched.length / presenters.length * 100).toFixed(1),
  matches: results.matched,
  unmatched: results.unmatched,
  processedAt: new Date().toISOString()
};

const outputPath = join(__dirname, '../data/processed/enhancedMatchingResults.json');
writeFileSync(outputPath, JSON.stringify(enhancedResults, null, 2));

console.log(`\n💾 Results saved to: ${outputPath}`);

export { enhancedFacultyMatch, enhancedNameNormalization, enhancedResults };