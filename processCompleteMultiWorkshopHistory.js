#!/usr/bin/env node

// Process complete multi-workshop historical data (WoG, WPSG, WPhylo) and integrate comprehensive dataset
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔄 Processing Complete Multi-Workshop Historical Integration\n');

// Load all data
const facultyData = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/facultyData.json'), 'utf8'));
const existingTeaching = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/processed/teachingDataCompleteWoGHistorical.json'), 'utf8'));

// Define all workshops to be processed
const allWorkshops = [
  // WPSG workshops (biennial: 2016, 2018, 2020, 2022, 2025)
  { file: 'wpsg-2016.json', workshop: 'WPSG', year: 2016 },
  { file: 'wpsg-2018.json', workshop: 'WPSG', year: 2018 },
  { file: 'wpsg-2020.json', workshop: 'WPSG', year: 2020 },
  { file: 'wpsg-2022.json', workshop: 'WPSG', year: 2022 },
  { file: 'wpsg-2025.json', workshop: 'WPSG', year: 2025 },
  
  // WPhylo workshops (irregular: 2017, 2019, 2024 - COVID hiatus 2020-2023)
  { file: 'wphylo-2017.json', workshop: 'WPhylo', year: 2017 },
  { file: 'wphylo-2019.json', workshop: 'WPhylo', year: 2019 },
  { file: 'wphylo-2024.json', workshop: 'WPhylo', year: 2024 }
];

// Enhanced name normalization function
function normalizeForMatching(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\\u0300-\\u036f]/g, '')
    .replace(/[-\\s]+/g, ' ')
    .replace(/dr\\.?\\s*/g, '')
    .replace(/prof\\.?\\s*/g, '')
    .trim();
}

// Enhanced faculty matching with specific name mappings for multi-workshop faculty
function findFacultyMatch(presenterName, facultyList) {
  const normalized = normalizeForMatching(presenterName);
  
  // Multi-workshop specific name mappings
  const nameMap = {
    'walter salzburger': 'salzburger-walter',
    'daniel falush': 'falush-daniel',
    'simon martin': 'martin-simon',
    'chris jiggins': 'jiggins-chris',
    'claudia bank': 'bank-claudia',
    'ludovic orlando': 'orlando-ludovic',
    'anders albrechtsen': 'albrechtsen-anders',
    'angela hancock': 'hancock-angela',
    'kelley harris': 'harris-kelley',
    'vitor sousa': 'sousa-vitor',
    'alexei drummond': 'drummond-alexei',
    'tim vaughan': 'vaughan-tim',
    'huw ogilvie': 'ogilvie-huw',
    'daniel berner': 'berner-daniel',
    'alex buerkle': 'buerkle-alex',
    'ryan gutenkunst': 'gutenkurst-ryan',
    'felicity jones': 'jones-felicity',
    'oscar gaggiotti': 'gaggiotti-oscar',
    'matteo fumagalli': 'fumagalli-matteo',
    'david swofford': 'swofford-david'
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
  
  // WPSG specializations
  if (workshop === 'WPSG') {
    if (topicLower.includes('population structure') || topicLower.includes('structure')) {
      return 'Population Structure';
    } else if (topicLower.includes('coalescent') || topicLower.includes('fastsimcoal')) {
      return 'Coalescent Theory';
    } else if (topicLower.includes('adaptation') || topicLower.includes('selection')) {
      return 'Selection & Adaptation';
    } else if (topicLower.includes('speciation') || topicLower.includes('hybridization') || topicLower.includes('gene flow')) {
      return 'Speciation Genomics';
    } else if (topicLower.includes('ancient genomics')) {
      return 'Ancient Genomics';
    } else if (topicLower.includes('gwas') || topicLower.includes('association')) {
      return 'GWAS Analysis';
    } else if (topicLower.includes('demography') || topicLower.includes('demographic')) {
      return 'Demographic Inference';
    } else if (topicLower.includes('mutation spectrum')) {
      return 'Mutation Analysis';
    } else if (topicLower.includes('diversification')) {
      return 'Organismal Diversification';
    } else if (topicLower.includes('experimental design')) {
      return 'Experimental Design';
    } else if (topicLower.includes('likelihood') || topicLower.includes('bayesian')) {
      return 'Statistical Methods';
    } else if (topicLower.includes('site frequency') || topicLower.includes('sfs')) {
      return 'Site Frequency Spectrum';
    } else if (topicLower.includes('angsd') || topicLower.includes('low coverage')) {
      return 'Low Coverage Analysis';
    } else if (topicLower.includes('abba baba')) {
      return 'Introgression Analysis';
    } else {
      return 'Population Genomics';
    }
  }
  
  // WPhylo specializations  
  if (workshop === 'WPhylo') {
    if (topicLower.includes('phylogeny') || topicLower.includes('phylogenetic')) {
      return 'Phylogenetic Analysis';
    } else if (topicLower.includes('species tree') || topicLower.includes('species delimitation')) {
      return 'Species Tree Methods';
    } else if (topicLower.includes('gene tree') || topicLower.includes('gene trees')) {
      return 'Gene Tree Analysis';
    } else if (topicLower.includes('coalescent') || topicLower.includes('multi-species')) {
      return 'Multispecies Coalescent';
    } else if (topicLower.includes('beast') || topicLower.includes('bayesian')) {
      return 'Bayesian Phylogenetics';
    } else if (topicLower.includes('molecular evolution')) {
      return 'Molecular Evolution';
    } else if (topicLower.includes('divergence time') || topicLower.includes('dating')) {
      return 'Divergence Time Estimation';
    } else if (topicLower.includes('network') || topicLower.includes('hybridization')) {
      return 'Phylogenetic Networks';
    } else if (topicLower.includes('genome evolution')) {
      return 'Genome Evolution';
    } else if (topicLower.includes('concatenation')) {
      return 'Concatenation Methods';
    } else if (topicLower.includes('likelihood') || topicLower.includes('maximum likelihood')) {
      return 'Maximum Likelihood';
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

console.log(`📋 Processing ${allWorkshops.length} multi-workshop files:\\n`);

for (const workshopInfo of allWorkshops) {
  const workshopPath = path.join(__dirname, 'data/workshops', workshopInfo.file);
  
  if (!fs.existsSync(workshopPath)) {
    console.log(`⚠️  Skipping ${workshopInfo.file} - file not found`);
    continue;
  }
  
  const workshop = JSON.parse(fs.readFileSync(workshopPath, 'utf8'));
  console.log(`\\n🔍 Processing ${workshop.workshop} ${workshop.year}:`);
  
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
        
        // Add session
        teaching.workshopsHistory[workshop.workshop][workshop.year].push({
          date: session.date,
          time: session.time,
          topic: session.topic,
          type: session.type,
          location: session.location || workshop.location,
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

// Merge with existing teaching data (WoG)
const mergedTeachingData = { ...existingTeaching };

Object.keys(facultyTeachingData).forEach(facultyId => {
  if (mergedTeachingData[facultyId]) {
    // Merge with existing data
    const existing = mergedTeachingData[facultyId].teaching;
    const newMultiWorkshop = facultyTeachingData[facultyId].teaching;
    
    // Merge workshop histories
    Object.keys(newMultiWorkshop.workshopsHistory).forEach(workshopType => {
      if (!existing.workshopsHistory[workshopType]) {
        existing.workshopsHistory[workshopType] = {};
      }
      Object.keys(newMultiWorkshop.workshopsHistory[workshopType]).forEach(year => {
        existing.workshopsHistory[workshopType][year] = 
          newMultiWorkshop.workshopsHistory[workshopType][year];
      });
    });
    
    // Update totals
    existing.totalSessions += newMultiWorkshop.totalSessions;
    existing.lastTaught = Math.max(existing.lastTaught, newMultiWorkshop.lastTaught);
    existing.firstTaught = Math.min(existing.firstTaught, newMultiWorkshop.firstTaught);
    
    // Merge specializations
    const allSpecs = new Set([...existing.specializations, ...newMultiWorkshop.specializations]);
    existing.specializations = Array.from(allSpecs);
    
    // Merge years active
    const allYears = new Set([...existing.yearsActive, ...newMultiWorkshop.yearsActive]);
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
console.log(`\\n📊 Complete Multi-Workshop Integration Results:`);
console.log(`- Total session instances processed: ${totalProcessed}`);
console.log(`- Successfully matched: ${totalMatched}/${totalProcessed} (${Math.round(totalMatched/totalProcessed*100)}%)`);
console.log(`- Faculty with new multi-workshop teaching: ${Object.keys(facultyTeachingData).length}`);
console.log(`- Total faculty with complete teaching history: ${Object.keys(mergedTeachingData).length}`);

if (allUnmatchedPresenters.size > 0) {
  console.log(`\\n❌ Unmatched presenters (${allUnmatchedPresenters.size}):`);
  Array.from(allUnmatchedPresenters).sort().forEach(presenter => {
    console.log(`  - ${presenter}`);
  });
}

// Save comprehensive teaching data
const outputPath = path.join(__dirname, 'data/processed/teachingDataCompleteMultiWorkshop.json');
fs.writeFileSync(outputPath, JSON.stringify(mergedTeachingData, null, 2));

console.log(`\\n💾 Saved complete multi-workshop teaching data to: ${outputPath}`);
console.log(`\\n🎯 Complete Multi-Workshop Historical Coverage:`);

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

console.log(`\\n🚀 Ready to deploy complete multi-workshop historical teaching database!`);