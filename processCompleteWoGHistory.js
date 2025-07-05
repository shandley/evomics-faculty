#!/usr/bin/env node

// Process complete WoG historical workshop data (2011-2014) and integrate with existing database
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔄 Processing Complete WoG Historical Integration (2011-2014)\n');

// Load all data
const facultyData = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/facultyData.json'), 'utf8'));
const existingTeaching = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/processed/teachingDataExtendedHistorical.json'), 'utf8'));

// Load complete WoG early historical workshop data
const workshops = [
  { file: 'wog-2014.json', workshop: 'WoG', year: 2014 },
  { file: 'wog-2013.json', workshop: 'WoG', year: 2013 },
  { file: 'wog-2012.json', workshop: 'WoG', year: 2012 },
  { file: 'wog-2011-fort-collins.json', workshop: 'WoG', year: 2011, location: 'Fort Collins' },
  { file: 'wog-2011-smithsonian.json', workshop: 'WoG', year: 2011, location: 'Smithsonian' }
];

// Enhanced name normalization function for early workshops with different naming conventions
function normalizeForMatching(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[-\s]+/g, ' ')
    .replace(/dr\.?\s*/g, '')
    .replace(/prof\.?\s*/g, '')
    .trim();
}

// Enhanced faculty matching for early workshops with potential name variations
function findFacultyMatch(presenterName, facultyList) {
  const normalized = normalizeForMatching(presenterName);
  
  // Handle special cases for early workshops
  const nameMap = {
    'henrik kaessmann': 'kaessman-henrik',
    'shaun jackman': 'jackman-shaun',
    'anton nekrutenko': 'nekrutenko-anton',
    'inanc birol': 'birol-inanc',
    'sheldon mckay': 'mckay-sheldon',
    'kendra kerr nightingale': 'nightingale-kendra',
    'craig cummings': 'cummings-craig',
    'sepideh rogers': 'rogers-sepideh',
    'jay evans': 'evans-jay',
    'scott cornman': 'cornman-scott',
    'nick loman': 'loman-nick',
    'neil hall': 'hall-neil',
    'chris ponting': 'ponting-chris',
    'johannes droge': 'droge-johannes'
  };
  
  // Check direct name mapping first
  if (nameMap[normalized]) {
    const mappedFaculty = facultyList.find(f => f.id === nameMap[normalized]);
    if (mappedFaculty) return mappedFaculty;
  }
  
  for (const faculty of facultyList) {
    const facultyFullName = `${faculty.firstName} ${faculty.lastName}`;
    const facultyNormalized = normalizeForMatching(facultyFullName);
    
    // Exact match after normalization
    if (normalized === facultyNormalized) {
      return faculty;
    }
    
    // Last name + first initial match
    const presenterParts = normalized.split(' ');
    const facultyParts = facultyNormalized.split(' ');
    
    if (presenterParts.length >= 2 && facultyParts.length >= 2) {
      const presenterLast = presenterParts[presenterParts.length - 1];
      const presenterFirst = presenterParts[0];
      const facultyLast = facultyParts[facultyParts.length - 1];
      const facultyFirst = facultyParts[0];
      
      if (presenterLast === facultyLast && presenterFirst[0] === facultyFirst[0]) {
        return faculty;
      }
    }
  }
  
  return null;
}

// Function to determine specialization based on topic and workshop
function getSpecialization(topic, workshop) {
  const topicLower = topic.toLowerCase();
  
  // WoG specializations including early workshop topics
  if (workshop === 'WoG') {
    if (topicLower.includes('genome annotation') || topicLower.includes('annotation') || topicLower.includes('gmod') || topicLower.includes('gbrowse')) {
      return 'Genome Annotation';
    } else if (topicLower.includes('assembly') || topicLower.includes('abyss')) {
      return 'Genome Assembly';
    } else if (topicLower.includes('variant') || topicLower.includes('calling') || topicLower.includes('mapping')) {
      return 'Variant Analysis';
    } else if (topicLower.includes('transcriptomics') || topicLower.includes('rnaseq') || topicLower.includes('expression')) {
      return 'Transcriptomics';
    } else if (topicLower.includes('alignment') || topicLower.includes('mapping')) {
      return 'Sequence Alignment';
    } else if (topicLower.includes('sequencing') || topicLower.includes('next-gen') || topicLower.includes('technology')) {
      return 'Sequencing Technologies';
    } else if (topicLower.includes('population genomics')) {
      return 'Population Genomics';
    } else if (topicLower.includes('microbiome') || topicLower.includes('metagenomics') || topicLower.includes('microbial ecology')) {
      return 'Microbiome Analysis';
    } else if (topicLower.includes('phylogenomics')) {
      return 'Phylogenomics';
    } else if (topicLower.includes('structural variation')) {
      return 'Structural Variation';
    } else if (topicLower.includes('single cell')) {
      return 'Single Cell Genomics';
    } else if (topicLower.includes('pathogenomics') || topicLower.includes('pathogen')) {
      return 'Pathogenomics';
    } else if (topicLower.includes('galaxy') || topicLower.includes('platform')) {
      return 'Computational Platforms';
    } else if (topicLower.includes('perl') || topicLower.includes('bioperl') || topicLower.includes('python') || topicLower.includes('programming')) {
      return 'Programming & Scripting';
    } else if (topicLower.includes('evolutionary genomics') || topicLower.includes('mammalian genomes')) {
      return 'Evolutionary Genomics';
    } else if (topicLower.includes('clinical') || topicLower.includes('medical')) {
      return 'Clinical Genomics';
    } else if (topicLower.includes('ecological genomics')) {
      return 'Ecological Genomics';
    } else if (topicLower.includes('quality') || topicLower.includes('assessment') || topicLower.includes('control')) {
      return 'Quality Control';
    } else if (topicLower.includes('unix') || topicLower.includes('command line') || topicLower.includes('data') || topicLower.includes('computational') || topicLower.includes('statistics')) {
      return 'Computational Methods';
    } else {
      return 'General Genomics';
    }
  }
  
  return 'General Genomics';
}

// Process all workshops
let totalProcessed = 0;
let totalMatched = 0;
const allUnmatchedPresenters = new Set();
const facultyTeachingData = {};

console.log(`📋 Processing ${workshops.length} complete WoG historical workshops:\n`);

for (const workshopInfo of workshops) {
  const workshopPath = path.join(__dirname, 'data/workshops', workshopInfo.file);
  
  if (!fs.existsSync(workshopPath)) {
    console.log(`⚠️  Skipping ${workshopInfo.file} - file not found`);
    continue;
  }
  
  const workshop = JSON.parse(fs.readFileSync(workshopPath, 'utf8'));
  const displayName = workshopInfo.location ? 
    `${workshop.workshop} ${workshop.year} (${workshopInfo.location})` : 
    `${workshop.workshop} ${workshop.year}`;
  
  console.log(`\n🔍 Processing ${displayName}:`);
  
  let sessionCount = 0;
  let matchedCount = 0;
  
  // Extract all sessions
  const allSessions = [];
  workshop.weeks.forEach(week => {
    week.sessions.forEach(session => {
      allSessions.push(session);
    });
  });
  
  allSessions.forEach(session => {
    session.presenters.forEach(presenterName => {
      // Skip generic entries and social events
      if (presenterName === "Workshop Team" || 
          presenterName === "Workshop Instructors" ||
          presenterName === "Participants" ||
          presenterName === "Free Day" ||
          presenterName === "Social") {
        return;
      }
      
      sessionCount++;
      
      const faculty = findFacultyMatch(presenterName, facultyData.faculty);
      
      if (faculty) {
        matchedCount++;
        
        // Initialize faculty teaching data if not exists
        if (!facultyTeachingData[faculty.id]) {
          facultyTeachingData[faculty.id] = {
            teaching: {
              totalSessions: 0,
              workshopsHistory: {},
              specializations: new Set(),
              lastTaught: 0,
              firstTaught: 9999,
              yearsActive: new Set()
            }
          };
        }
        
        const teaching = facultyTeachingData[faculty.id].teaching;
        
        // Initialize workshop history
        if (!teaching.workshopsHistory[workshop.workshop]) {
          teaching.workshopsHistory[workshop.workshop] = {};
        }
        
        if (!teaching.workshopsHistory[workshop.workshop][workshop.year]) {
          teaching.workshopsHistory[workshop.workshop][workshop.year] = [];
        }
        
        // Determine co-presenters
        const coPresenters = session.presenters
          .filter(p => p !== presenterName && 
                      p !== "Workshop Team" && 
                      p !== "Workshop Instructors" &&
                      p !== "Participants" &&
                      p !== "Free Day" &&
                      p !== "Social")
          .map(p => {
            const coFaculty = findFacultyMatch(p, facultyData.faculty);
            return coFaculty ? `${coFaculty.firstName} ${coFaculty.lastName}` : p;
          });
        
        // Add session with location context for multi-location years
        const sessionLocation = workshopInfo.location ? 
          `${session.location || workshop.location} (${workshopInfo.location})` : 
          session.location || workshop.location;
        
        teaching.workshopsHistory[workshop.workshop][workshop.year].push({
          date: session.date,
          time: session.time,
          topic: session.topic,
          type: session.type,
          location: sessionLocation,
          coPresenters: coPresenters
        });
        
        // Update statistics
        teaching.totalSessions++;
        teaching.lastTaught = Math.max(teaching.lastTaught, workshop.year);
        teaching.firstTaught = Math.min(teaching.firstTaught, workshop.year);
        teaching.yearsActive.add(workshop.year);
        
        // Add specialization
        const specialization = getSpecialization(session.topic, workshop.workshop);
        teaching.specializations.add(specialization);
        
        console.log(`  ✅ ${presenterName} → ${faculty.firstName} ${faculty.lastName}`);
      } else {
        allUnmatchedPresenters.add(`${presenterName} (${displayName})`);
        console.log(`  ❌ ${presenterName} → No match found`);
      }
    });
  });
  
  console.log(`  📊 ${matchedCount}/${sessionCount} sessions matched (${Math.round(matchedCount/sessionCount*100)}%)`);
  totalProcessed += sessionCount;
  totalMatched += matchedCount;
}

// Convert Sets to Arrays and finalize data
Object.keys(facultyTeachingData).forEach(facultyId => {
  const teaching = facultyTeachingData[facultyId].teaching;
  teaching.specializations = Array.from(teaching.specializations);
  teaching.yearsActive = Array.from(teaching.yearsActive).sort((a, b) => a - b);
  
  // Calculate year range
  if (teaching.yearsActive.length > 0) {
    const first = Math.min(...teaching.yearsActive);
    const last = Math.max(...teaching.yearsActive);
    teaching.yearRange = first === last ? `${first}-${first}` : `${first}-${last}`;
  }
});

// Merge with existing teaching data
const mergedTeachingData = { ...existingTeaching };

Object.keys(facultyTeachingData).forEach(facultyId => {
  if (mergedTeachingData[facultyId]) {
    // Merge with existing data
    const existing = mergedTeachingData[facultyId].teaching;
    const newEarly = facultyTeachingData[facultyId].teaching;
    
    // Merge workshop histories
    Object.keys(newEarly.workshopsHistory).forEach(workshopType => {
      if (!existing.workshopsHistory[workshopType]) {
        existing.workshopsHistory[workshopType] = {};
      }
      Object.keys(newEarly.workshopsHistory[workshopType]).forEach(year => {
        // Merge with existing year data if it exists
        if (existing.workshopsHistory[workshopType][year]) {
          existing.workshopsHistory[workshopType][year] = 
            [...existing.workshopsHistory[workshopType][year], ...newEarly.workshopsHistory[workshopType][year]];
        } else {
          existing.workshopsHistory[workshopType][year] = 
            newEarly.workshopsHistory[workshopType][year];
        }
      });
    });
    
    // Update totals
    existing.totalSessions += newEarly.totalSessions;
    existing.lastTaught = Math.max(existing.lastTaught, newEarly.lastTaught);
    existing.firstTaught = Math.min(existing.firstTaught, newEarly.firstTaught);
    
    // Merge specializations
    const allSpecs = new Set([...existing.specializations, ...newEarly.specializations]);
    existing.specializations = Array.from(allSpecs);
    
    // Merge years active
    const allYears = new Set([...existing.yearsActive, ...newEarly.yearsActive]);
    existing.yearsActive = Array.from(allYears).sort((a, b) => a - b);
    
    // Update year range
    const first = Math.min(...existing.yearsActive);
    const last = Math.max(...existing.yearsActive);
    existing.yearRange = first === last ? `${first}-${first}` : `${first}-${last}`;
    
  } else {
    // Add as new faculty
    mergedTeachingData[facultyId] = facultyTeachingData[facultyId];
  }
});

// Print comprehensive summary
console.log(`\n📊 Complete WoG Historical Integration Results (2011-2014):`);
console.log(`- Total session instances processed: ${totalProcessed}`);
console.log(`- Successfully matched: ${totalMatched}/${totalProcessed} (${Math.round(totalMatched/totalProcessed*100)}%)`);
console.log(`- Faculty with new early historical teaching: ${Object.keys(facultyTeachingData).length}`);
console.log(`- Total faculty with complete teaching history: ${Object.keys(mergedTeachingData).length}`);

if (allUnmatchedPresenters.size > 0) {
  console.log(`\n❌ Unmatched presenters (${allUnmatchedPresenters.size}):`);
  Array.from(allUnmatchedPresenters).sort().forEach(presenter => {
    console.log(`  - ${presenter}`);
  });
}

// Save comprehensive teaching data
const outputPath = path.join(__dirname, 'data/processed/teachingDataCompleteWoGHistorical.json');
fs.writeFileSync(outputPath, JSON.stringify(mergedTeachingData, null, 2));

console.log(`\n💾 Saved complete WoG historical teaching data to: ${outputPath}`);
console.log(`\n🎯 Complete WoG Historical Coverage (2011-2025):`);

// Calculate final totals
let totalFaculty = Object.keys(mergedTeachingData).length;
let totalSessions = 0;
let specializations = new Set();
let workshopsSet = new Set();
let yearsSet = new Set();

Object.values(mergedTeachingData).forEach(data => {
  totalSessions += data.teaching.totalSessions;
  data.teaching.specializations.forEach(spec => specializations.add(spec));
  data.teaching.yearsActive.forEach(year => yearsSet.add(year));
  Object.keys(data.teaching.workshopsHistory).forEach(workshop => workshopsSet.add(workshop));
});

console.log(`- Faculty with teaching history: ${totalFaculty}`);
console.log(`- Total teaching sessions: ${totalSessions}`);
console.log(`- Unique specializations: ${specializations.size}`);
console.log(`- Workshop types: ${Array.from(workshopsSet).join(', ')}`);
console.log(`- Year span: ${Math.min(...yearsSet)}-${Math.max(...yearsSet)} (${yearsSet.size} years)`);

console.log(`\n🚀 Ready to deploy complete 14-year WoG historical teaching database (2011-2025)!`);