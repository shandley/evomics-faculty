#!/usr/bin/env node

// Process all historical workshop data and create comprehensive teaching database
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔄 Processing Comprehensive Historical Workshop Integration\n');

// Load all data
const facultyData = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/facultyData.json'), 'utf8'));
const existingTeaching = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/processed/teachingDataMultiWorkshop.json'), 'utf8'));

// Load all historical workshop data
const workshops = [
  { file: 'wog-2022.json', workshop: 'WoG', year: 2022 },
  { file: 'wpsg-2022.json', workshop: 'WPSG', year: 2022 },
  { file: 'wphylo-2019.json', workshop: 'WPhylo', year: 2019 },
  { file: 'wphylo-2017.json', workshop: 'WPhylo', year: 2017 }
];

// Enhanced name normalization function
function normalizeForMatching(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[-\s]+/g, ' ')
    .trim();
}

// Find faculty match with enhanced matching
function findFacultyMatch(presenterName, facultyList) {
  const normalized = normalizeForMatching(presenterName);
  
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

// Function to determine specialization based on topic
function getSpecialization(topic, workshop) {
  const topicLower = topic.toLowerCase();
  
  // WoG specializations
  if (workshop === 'WoG') {
    if (topicLower.includes('genome annotation') || topicLower.includes('annotation')) {
      return 'Genome Annotation';
    } else if (topicLower.includes('assembly')) {
      return 'Genome Assembly';
    } else if (topicLower.includes('variant') || topicLower.includes('calling')) {
      return 'Variant Analysis';
    } else if (topicLower.includes('transcriptomics') || topicLower.includes('rnaseq') || topicLower.includes('expression')) {
      return 'Transcriptomics';
    } else if (topicLower.includes('alignment')) {
      return 'Sequence Alignment';
    } else if (topicLower.includes('sequencing')) {
      return 'Sequencing Technologies';
    } else if (topicLower.includes('population genomics')) {
      return 'Population Genomics';
    } else if (topicLower.includes('comparative genomics')) {
      return 'Population Genomics';
    } else if (topicLower.includes('microbiome') || topicLower.includes('metagenomics')) {
      return 'Microbiome Analysis';
    } else if (topicLower.includes('phylogenomics')) {
      return 'Phylogenomics';
    } else if (topicLower.includes('structural variation')) {
      return 'Structural Variation';
    } else if (topicLower.includes('unix') || topicLower.includes('data') || topicLower.includes('computational')) {
      return 'Computational Methods';
    } else {
      return 'General Genomics';
    }
  }
  
  // WPSG specializations
  if (workshop === 'WPSG') {
    if (topicLower.includes('population genomics') || topicLower.includes('molecular population')) {
      return 'Population Genomics';
    } else if (topicLower.includes('coalescent') || topicLower.includes('fastsimcoal')) {
      return 'Coalescent Theory';
    } else if (topicLower.includes('structural variation') || topicLower.includes('pangenomics')) {
      return 'Structural Variation';
    } else if (topicLower.includes('machine learning')) {
      return 'Machine Learning';
    } else if (topicLower.includes('hybridisation') || topicLower.includes('introgression')) {
      return 'Hybridization & Introgression';
    } else if (topicLower.includes('selection') || topicLower.includes('adaptation')) {
      return 'Selection & Adaptation';
    } else if (topicLower.includes('ancient genomics')) {
      return 'Ancient Genomics';
    } else if (topicLower.includes('conservation genomics')) {
      return 'Conservation Genomics';
    } else if (topicLower.includes('simulation') || topicLower.includes('tree sequences')) {
      return 'Simulation Methods';
    } else if (topicLower.includes('speciation')) {
      return 'Speciation Genomics';
    } else {
      return 'Population Genomics';
    }
  }
  
  // WPhylo specializations
  if (workshop === 'WPhylo') {
    if (topicLower.includes('phylogenomics') || topicLower.includes('phylogenetic')) {
      return 'Phylogenomics';
    } else if (topicLower.includes('alignment') || topicLower.includes('trimming')) {
      return 'Sequence Alignment';
    } else if (topicLower.includes('orthology') || topicLower.includes('paralogy')) {
      return 'Orthology & Paralogy';
    } else if (topicLower.includes('coalescent')) {
      return 'Coalescent Methods';
    } else if (topicLower.includes('trait evolution') || topicLower.includes('diversification')) {
      return 'Trait Evolution';
    } else if (topicLower.includes('gene family') || topicLower.includes('gene gain')) {
      return 'Gene Family Evolution';
    } else if (topicLower.includes('horizontal gene transfer') || topicLower.includes('hgt')) {
      return 'Horizontal Gene Transfer';
    } else if (topicLower.includes('bayesian') || topicLower.includes('mcmc')) {
      return 'Bayesian Phylogenetics';
    } else if (topicLower.includes('network') || topicLower.includes('non-vertical')) {
      return 'Phylogenetic Networks';
    } else if (topicLower.includes('selection') || topicLower.includes('detecting selection')) {
      return 'Selection Analysis';
    } else if (topicLower.includes('dating') || topicLower.includes('molecular clock')) {
      return 'Molecular Dating';
    } else {
      return 'Phylogenomics';
    }
  }
  
  return 'General Genomics';
}

// Process all workshops
let totalProcessed = 0;
let totalMatched = 0;
const allUnmatchedPresenters = new Set();
const facultyTeachingData = {};

console.log(`📋 Processing ${workshops.length} historical workshops:\n`);

for (const workshopInfo of workshops) {
  const workshopPath = path.join(__dirname, 'data/workshops', workshopInfo.file);
  
  if (!fs.existsSync(workshopPath)) {
    console.log(`⚠️  Skipping ${workshopInfo.file} - file not found`);
    continue;
  }
  
  const workshop = JSON.parse(fs.readFileSync(workshopPath, 'utf8'));
  console.log(`\n🔍 Processing ${workshop.workshop} ${workshop.year}:`);
  
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
      // Skip generic entries
      if (presenterName === "Workshop Team" || presenterName === "Workshop Instructors") {
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
          .filter(p => p !== presenterName && p !== "Workshop Team" && p !== "Workshop Instructors")
          .map(p => {
            const coFaculty = findFacultyMatch(p, facultyData.faculty);
            return coFaculty ? `${coFaculty.firstName} ${coFaculty.lastName}` : p;
          });
        
        // Add session
        teaching.workshopsHistory[workshop.workshop][workshop.year].push({
          date: session.date,
          time: session.time,
          topic: session.topic,
          type: session.type,
          location: session.location,
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
        allUnmatchedPresenters.add(`${presenterName} (${workshop.workshop} ${workshop.year})`);
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
    const newHistorical = facultyTeachingData[facultyId].teaching;
    
    // Merge workshop histories
    Object.keys(newHistorical.workshopsHistory).forEach(workshopType => {
      if (!existing.workshopsHistory[workshopType]) {
        existing.workshopsHistory[workshopType] = {};
      }
      Object.keys(newHistorical.workshopsHistory[workshopType]).forEach(year => {
        existing.workshopsHistory[workshopType][year] = 
          newHistorical.workshopsHistory[workshopType][year];
      });
    });
    
    // Update totals
    existing.totalSessions += newHistorical.totalSessions;
    existing.lastTaught = Math.max(existing.lastTaught, newHistorical.lastTaught);
    existing.firstTaught = Math.min(existing.firstTaught, newHistorical.firstTaught);
    
    // Merge specializations
    const allSpecs = new Set([...existing.specializations, ...newHistorical.specializations]);
    existing.specializations = Array.from(allSpecs);
    
    // Merge years active
    const allYears = new Set([...existing.yearsActive, ...newHistorical.yearsActive]);
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
console.log(`\n📊 Historical Integration Results:`);
console.log(`- Total session instances processed: ${totalProcessed}`);
console.log(`- Successfully matched: ${totalMatched}/${totalProcessed} (${Math.round(totalMatched/totalProcessed*100)}%)`);
console.log(`- Faculty with new historical teaching: ${Object.keys(facultyTeachingData).length}`);
console.log(`- Total faculty with complete teaching history: ${Object.keys(mergedTeachingData).length}`);

if (allUnmatchedPresenters.size > 0) {
  console.log(`\n❌ Unmatched presenters (${allUnmatchedPresenters.size}):`);
  Array.from(allUnmatchedPresenters).sort().forEach(presenter => {
    console.log(`  - ${presenter}`);
  });
}

// Save comprehensive historical teaching data
const outputPath = path.join(__dirname, 'data/processed/teachingDataHistoricalComplete.json');
fs.writeFileSync(outputPath, JSON.stringify(mergedTeachingData, null, 2));

console.log(`\n💾 Saved comprehensive historical teaching data to: ${outputPath}`);
console.log(`\n🎯 Complete Historical Coverage:`);

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

console.log(`\n🚀 Ready to deploy comprehensive historical teaching database!`);