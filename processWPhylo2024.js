#!/usr/bin/env node

// Process 2024 WPhylo workshop data and integrate with faculty teaching history
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔄 Processing 2024 WPhylo Workshop Data for Faculty Integration\n');

// Load data
const facultyData = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/facultyData.json'), 'utf8'));
const workshop2024 = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/workshops/wphylo-2024.json'), 'utf8'));
const existingTeaching = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/processed/teachingDataWithWPSG2025.json'), 'utf8'));

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

// Process workshop sessions into faculty teaching data
const facultyTeachingData = {};
let totalSessions = 0;
let matchedSessions = 0;
const unmatchedPresenters = new Set();

// Extract all sessions from both weeks
const allSessions = [];
workshop2024.weeks.forEach(week => {
  week.sessions.forEach(session => {
    allSessions.push(session);
  });
});

console.log(`📋 Processing ${allSessions.length} sessions from 2024 WPhylo\n`);

allSessions.forEach(session => {
  session.presenters.forEach(presenterName => {
    // Skip generic entries
    if (presenterName === "Workshop Team") {
      return;
    }
    
    totalSessions++;
    
    const faculty = findFacultyMatch(presenterName, facultyData.faculty);
    
    if (faculty) {
      matchedSessions++;
      
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
      if (!teaching.workshopsHistory[workshop2024.workshop]) {
        teaching.workshopsHistory[workshop2024.workshop] = {};
      }
      
      if (!teaching.workshopsHistory[workshop2024.workshop][workshop2024.year]) {
        teaching.workshopsHistory[workshop2024.workshop][workshop2024.year] = [];
      }
      
      // Determine co-presenters
      const coPresenters = session.presenters
        .filter(p => p !== presenterName && p !== "Workshop Team")
        .map(p => {
          const coFaculty = findFacultyMatch(p, facultyData.faculty);
          return coFaculty ? `${coFaculty.firstName} ${coFaculty.lastName}` : p;
        });
      
      // Add session
      teaching.workshopsHistory[workshop2024.workshop][workshop2024.year].push({
        date: session.date,
        time: session.time,
        topic: session.topic,
        type: session.type,
        location: session.location,
        coPresenters: coPresenters
      });
      
      // Update statistics
      teaching.totalSessions++;
      teaching.lastTaught = Math.max(teaching.lastTaught, workshop2024.year);
      teaching.firstTaught = Math.min(teaching.firstTaught, workshop2024.year);
      teaching.yearsActive.add(workshop2024.year);
      
      // Add specialization based on topic
      const topic = session.topic.toLowerCase();
      if (topic.includes('phylogenomics') || topic.includes('phylogenetic')) {
        teaching.specializations.add('Phylogenomics');
      } else if (topic.includes('alignment') || topic.includes('trimming')) {
        teaching.specializations.add('Sequence Alignment');
      } else if (topic.includes('orthology') || topic.includes('paralogy')) {
        teaching.specializations.add('Orthology & Paralogy');
      } else if (topic.includes('coalescent')) {
        teaching.specializations.add('Coalescent Methods');
      } else if (topic.includes('trait evolution') || topic.includes('diversification')) {
        teaching.specializations.add('Trait Evolution');
      } else if (topic.includes('gene family') || topic.includes('gene gain')) {
        teaching.specializations.add('Gene Family Evolution');
      } else if (topic.includes('horizontal gene transfer') || topic.includes('hgt')) {
        teaching.specializations.add('Horizontal Gene Transfer');
      } else if (topic.includes('incongruence')) {
        teaching.specializations.add('Phylogenetic Incongruence');
      } else if (topic.includes('target capture') || topic.includes('sequencing')) {
        teaching.specializations.add('Sequencing Technologies');
      } else if (topic.includes('reticulate') || topic.includes('visualization')) {
        teaching.specializations.add('Data Visualization');
      } else if (topic.includes('unix') || topic.includes('lab') || topic.includes('computational')) {
        teaching.specializations.add('Computational Methods');
      } else {
        teaching.specializations.add('Phylogenomics');
      }
      
      console.log(`✅ ${presenterName} → ${faculty.firstName} ${faculty.lastName} (${session.topic})`);
    } else {
      unmatchedPresenters.add(presenterName);
      console.log(`❌ ${presenterName} → No match found`);
    }
  });
});

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
    const newWPhylo = facultyTeachingData[facultyId].teaching;
    
    // Add WPhylo sessions
    if (!existing.workshopsHistory[workshop2024.workshop]) {
      existing.workshopsHistory[workshop2024.workshop] = {};
    }
    existing.workshopsHistory[workshop2024.workshop][workshop2024.year] = 
      newWPhylo.workshopsHistory[workshop2024.workshop][workshop2024.year];
    
    // Update totals
    existing.totalSessions += newWPhylo.totalSessions;
    existing.lastTaught = Math.max(existing.lastTaught, newWPhylo.lastTaught);
    existing.firstTaught = Math.min(existing.firstTaught, newWPhylo.firstTaught);
    
    // Merge specializations
    const allSpecs = new Set([...existing.specializations, ...newWPhylo.specializations]);
    existing.specializations = Array.from(allSpecs);
    
    // Merge years active
    const allYears = new Set([...existing.yearsActive, ...newWPhylo.yearsActive]);
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

// Print summary
console.log(`\n📊 2024 WPhylo Processing Results:`);
console.log(`- Total session instances: ${totalSessions}`);
console.log(`- Successfully matched: ${matchedSessions}/${totalSessions} (${Math.round(matchedSessions/totalSessions*100)}%)`);
console.log(`- Faculty with 2024 WPhylo teaching: ${Object.keys(facultyTeachingData).length}`);
console.log(`- Total faculty with teaching history: ${Object.keys(mergedTeachingData).length}`);

if (unmatchedPresenters.size > 0) {
  console.log(`\n❌ Unmatched presenters (${unmatchedPresenters.size}):`);
  Array.from(unmatchedPresenters).forEach(presenter => {
    console.log(`  - ${presenter}`);
  });
}

// Save updated teaching data
const outputPath = path.join(__dirname, 'data/processed/teachingDataMultiWorkshop.json');
fs.writeFileSync(outputPath, JSON.stringify(mergedTeachingData, null, 2));

console.log(`\n💾 Saved comprehensive multi-workshop teaching data to: ${outputPath}`);
console.log(`\n🎯 Complete Multi-Workshop Coverage:`);

// Calculate new totals
let totalFaculty = Object.keys(mergedTeachingData).length;
let totalSessions2 = 0;
let specializations = new Set();

Object.values(mergedTeachingData).forEach(data => {
  totalSessions2 += data.teaching.totalSessions;
  data.teaching.specializations.forEach(spec => specializations.add(spec));
});

console.log(`- Faculty with teaching history: ${totalFaculty}`);
console.log(`- Total teaching sessions: ${totalSessions2}`);
console.log(`- Unique specializations: ${specializations.size}`);
console.log(`- Workshops covered: WoG (2023-2025) + WPSG (2025) + WPhylo (2024)`);

console.log(`\n🚀 Ready to deploy comprehensive multi-workshop teaching data!`);