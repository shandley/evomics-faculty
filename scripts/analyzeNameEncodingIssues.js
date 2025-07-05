/**
 * Analyze Name Encoding Issues in Current Dataset
 * Identify potential accent/special character problems
 */

import { readFileSync } from 'fs';
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

// Extract all unique presenters from workshops
const workshopPresenters = new Set();
workshopData.forEach(workshop => {
  workshop.weeks.forEach(week => {
    week.sessions.forEach(session => {
      session.presenters.forEach(presenter => {
        if (presenter !== 'Everyone' && presenter !== 'Workshop Team') {
          workshopPresenters.add(presenter);
        }
      });
    });
  });
});

// Analyze name characteristics
function analyzeNameCharacters(name) {
  const analysis = {
    hasAccents: /[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]/i.test(name),
    hasSpecialChars: /[čćžšđňťľĺŕýáíéóúĺľťňčšžý]/i.test(name),
    hasDiacritics: /[\u0300-\u036f]/i.test(name),
    hasHyphens: /-/.test(name),
    hasApostrophes: /'/.test(name),
    hasSpaces: / /.test(name),
    charCodes: [...name].map(char => ({ char, code: char.charCodeAt(0) }))
  };
  
  return analysis;
}

function normalizeForMatching(name) {
  return name
    .toLowerCase()
    // Remove titles
    .replace(/^(dr\.|prof\.|mr\.|ms\.|mrs\.)\s+/i, '')
    // Normalize accents and special characters
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    // Common character replacements
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ýÿ]/g, 'y')
    .replace(/ç/g, 'c')
    .replace(/ñ/g, 'n')
    // Eastern European
    .replace(/[čć]/g, 'c')
    .replace(/[žš]/g, 's')
    .replace(/[ď]/g, 'd')
    .replace(/[ť]/g, 't')
    .replace(/[ľĺ]/g, 'l')
    .replace(/[ř]/g, 'r')
    .replace(/[ň]/g, 'n')
    // Clean up
    .replace(/\s+/g, ' ')
    .trim();
}

function findFacultyMatchRobust(presenterName, facultyList) {
  const normalizedPresenter = normalizeForMatching(presenterName);
  const presenterParts = normalizedPresenter.split(' ');
  
  if (presenterParts.length < 2) return null;
  
  const presenterLastName = presenterParts[presenterParts.length - 1];
  const presenterFirstName = presenterParts[0];
  
  for (const faculty of facultyList) {
    const normalizedFaculty = normalizeForMatching(`${faculty.firstName} ${faculty.lastName}`);
    const facultyParts = normalizedFaculty.split(' ');
    const facultyLastName = facultyParts[facultyParts.length - 1];
    const facultyFirstName = facultyParts[0];
    
    // Exact match after normalization
    if (presenterFirstName === facultyFirstName && presenterLastName === facultyLastName) {
      return { faculty, matchType: 'exact_normalized', confidence: 'high' };
    }
    
    // Last name + first initial
    if (presenterLastName === facultyLastName && facultyFirstName.startsWith(presenterFirstName[0])) {
      return { faculty, matchType: 'lastname_initial', confidence: 'medium' };
    }
    
    // Last name + partial first name (3+ chars)
    if (presenterLastName === facultyLastName && presenterFirstName.length >= 3 && 
        facultyFirstName.startsWith(presenterFirstName.substring(0, 3))) {
      return { faculty, matchType: 'lastname_partial', confidence: 'medium' };
    }
  }
  
  return null;
}

console.log('🔍 Name Encoding Analysis for Evomics Workshop Data\n');

// Analyze all workshop presenters
const presenterAnalysis = Array.from(workshopPresenters).map(presenter => {
  const analysis = analyzeNameCharacters(presenter);
  const match = findFacultyMatchRobust(presenter, facultyData);
  
  return {
    originalName: presenter,
    normalizedName: normalizeForMatching(presenter),
    analysis,
    facultyMatch: match,
    isProblematic: analysis.hasAccents || analysis.hasSpecialChars || analysis.hasDiacritics
  };
});

// Categorize results
const problematicNames = presenterAnalysis.filter(p => p.isProblematic);
const unmatchedNames = presenterAnalysis.filter(p => !p.facultyMatch);
const newMatches = presenterAnalysis.filter(p => p.facultyMatch && 
  !['Everyone', 'Workshop Team'].includes(p.originalName));

console.log('📊 Current Dataset Analysis:');
console.log(`  Total Individual Presenters: ${presenterAnalysis.length}`);
console.log(`  Names with Special Characters: ${problematicNames.length}`);
console.log(`  Currently Unmatched: ${unmatchedNames.length}`);
console.log(`  With Robust Matching: ${newMatches.length} matches`);

console.log('\n🚨 Names with Special Characters:');
problematicNames.forEach(presenter => {
  const match = presenter.facultyMatch ? '✅ MATCHED' : '❌ UNMATCHED';
  console.log(`  ${presenter.originalName} → ${presenter.normalizedName} ${match}`);
  if (presenter.analysis.hasAccents || presenter.analysis.hasSpecialChars) {
    const specialChars = [...presenter.originalName]
      .filter(char => /[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿčćžšđňťľĺŕý]/i.test(char))
      .map(char => `${char}(${char.charCodeAt(0)})`)
      .join(', ');
    console.log(`    Special chars: ${specialChars}`);
  }
});

console.log('\n🔧 Improved Matching Results:');
console.log('Previously unmatched names that now match with robust algorithm:');
unmatchedNames.forEach(presenter => {
  const robustMatch = findFacultyMatchRobust(presenter.originalName, facultyData);
  if (robustMatch) {
    console.log(`  ✅ "${presenter.originalName}" → ${robustMatch.faculty.firstName} ${robustMatch.faculty.lastName}`);
    console.log(`     Match type: ${robustMatch.matchType}, Confidence: ${robustMatch.confidence}`);
  }
});

// Check faculty database for names that might need variants
console.log('\n🎯 Faculty Database Names with Special Characters:');
const facultyWithSpecialChars = facultyData.filter(faculty => {
  const fullName = `${faculty.firstName} ${faculty.lastName}`;
  const analysis = analyzeNameCharacters(fullName);
  return analysis.hasAccents || analysis.hasSpecialChars || analysis.hasDiacritics;
});

facultyWithSpecialChars.forEach(faculty => {
  const fullName = `${faculty.firstName} ${faculty.lastName}`;
  const normalized = normalizeForMatching(fullName);
  console.log(`  ${fullName} → ${normalized}`);
});

// Generate improvement recommendations
console.log('\n💡 Recommendations for Data Quality Improvement:');

const recommendations = {
  immediateNameFixes: [],
  databaseAdditions: [],
  algorithmEnhancements: [],
  dataCollectionImprovements: []
};

unmatchedNames.forEach(presenter => {
  const robustMatch = findFacultyMatchRobust(presenter.originalName, facultyData);
  if (robustMatch) {
    recommendations.immediateNameFixes.push({
      presenter: presenter.originalName,
      faculty: `${robustMatch.faculty.firstName} ${robustMatch.faculty.lastName}`,
      issue: 'Special character normalization'
    });
  } else {
    recommendations.databaseAdditions.push({
      presenter: presenter.originalName,
      normalizedName: presenter.normalizedName,
      issue: 'Potentially missing from faculty database'
    });
  }
});

console.log('\n🔨 Immediate Fixes Needed:');
recommendations.immediateNameFixes.forEach(fix => {
  console.log(`  - Map "${fix.presenter}" to "${fix.faculty}" (${fix.issue})`);
});

console.log('\n📚 Potential Database Additions:');
recommendations.databaseAdditions.forEach(addition => {
  console.log(`  - Research: "${addition.presenter}" (normalized: "${addition.normalizedName}")`);
});

// Export analysis results
const analysisResults = {
  totalPresenters: presenterAnalysis.length,
  problematicNames: problematicNames.length,
  currentUnmatched: unmatchedNames.length,
  potentialNewMatches: newMatches.length,
  presenterDetails: presenterAnalysis,
  facultyWithSpecialChars,
  recommendations,
  analyzedAt: new Date().toISOString()
};

export { analysisResults, normalizeForMatching, findFacultyMatchRobust };