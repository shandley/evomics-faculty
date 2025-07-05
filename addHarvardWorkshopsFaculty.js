#!/usr/bin/env node

// Add faculty from Harvard University workshops (2016 Microbial Genomics, 2017 Transcriptomics)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🏛️ Adding Faculty from Harvard University Workshops\n');

// Load current faculty data
const facultyPath = path.join(__dirname, 'src/data/facultyData.json');
const facultyData = JSON.parse(fs.readFileSync(facultyPath, 'utf8'));

console.log('📋 Current faculty count:', facultyData.faculty.length);

// Faculty from 2017 Workshop on Transcriptomics
const transcriptomicsFaculty = [
  {
    id: "leonard-guy",
    firstName: "Guy",
    lastName: "Leonard"
  },
  {
    id: "handley-scott", 
    firstName: "Scott",
    lastName: "Handley"
  },
  {
    id: "haas-brian",
    firstName: "Brian",
    lastName: "Haas"
  },
  {
    id: "reyes-alejandro",
    firstName: "Alejandro", 
    lastName: "Reyes"
  },
  {
    id: "kharchenko-peter",
    firstName: "Peter",
    lastName: "Kharchenko"
  }
];

// Faculty from 2016 Workshop on Microbial Genomics
const microbialGenomicsFaculty = [
  {
    id: "gardy-jennifer",
    firstName: "Jennifer",
    lastName: "Gardy"
  },
  {
    id: "shaw-sophie",
    firstName: "Sophie",
    lastName: "Shaw"
  },
  {
    id: "grad-yonatan",
    firstName: "Yonatan",
    lastName: "Grad"
  },
  {
    id: "desjardins-christopher",
    firstName: "Christopher",
    lastName: "Desjardins"
  },
  {
    id: "kosakovsky-pond-sergei",
    firstName: "Sergei L",
    lastName: "Kosakovsky Pond"
  },
  {
    id: "eren-murat",
    firstName: "A. Murat",
    lastName: "Eren"
  },
  {
    id: "vazquez-baeza-yoshiki",
    firstName: "Yoshiki",
    lastName: "Vázquez-Baeza"
  }
];

// Combine all new faculty
const allNewFaculty = [
  ...transcriptomicsFaculty,
  ...microbialGenomicsFaculty
];

console.log('➕ Adding', allNewFaculty.length, 'faculty from Harvard workshops:');

// Add new faculty members
let addedCount = 0;
allNewFaculty.forEach(faculty => {
  // Check if already exists
  const exists = facultyData.faculty.find(f => f.id === faculty.id);
  if (!exists) {
    facultyData.faculty.push(faculty);
    addedCount++;
    console.log(`  ✅ Added: ${faculty.firstName} ${faculty.lastName} (${faculty.id})`);
  } else {
    console.log(`  ⚠️  Already exists: ${faculty.firstName} ${faculty.lastName} (${faculty.id})`);
  }
});

// Add participation records for Harvard workshops
const newParticipations = [
  // 2017 Transcriptomics
  ...transcriptomicsFaculty.map(faculty => ({
    facultyId: faculty.id,
    workshopId: "htranscriptomics",
    year: 2017,
    role: "faculty"
  })),
  // 2016 Microbial Genomics
  ...microbialGenomicsFaculty.map(faculty => ({
    facultyId: faculty.id,
    workshopId: "hmicrobial",
    year: 2016,
    role: "faculty"
  }))
];

console.log('\n📚 Adding participation records for Harvard workshops:');

let participationAddedCount = 0;
newParticipations.forEach(participation => {
  // Check if participation already exists
  const exists = facultyData.participations.find(p => 
    p.facultyId === participation.facultyId && 
    p.workshopId === participation.workshopId && 
    p.year === participation.year
  );
  
  if (!exists) {
    facultyData.participations.push(participation);
    participationAddedCount++;
    console.log(`  ✅ Added: ${participation.facultyId} → ${participation.workshopId} ${participation.year}`);
  } else {
    console.log(`  ⚠️  Exists: ${participation.facultyId} → ${participation.workshopId} ${participation.year}`);
  }
});

// Sort faculty alphabetically by lastName
facultyData.faculty.sort((a, b) => a.lastName.localeCompare(b.lastName));

// Save updated faculty data
fs.writeFileSync(facultyPath, JSON.stringify(facultyData, null, 2));

console.log('\n💾 Updated faculty database saved to:', facultyPath);
console.log('📊 Total faculty count:', facultyData.faculty.length);
console.log('📚 Total participations:', facultyData.participations.length);
console.log(`➕ New faculty added: ${addedCount}`);
console.log(`📋 New participations added: ${participationAddedCount}`);

console.log('\n🎯 Next Steps:');
console.log('1. Add Harvard workshop definitions to workshops.json');
console.log('2. Run enrichment pipeline on new faculty members');
console.log('3. Extract workshop schedule data for teaching history');
console.log('4. Investigate 2014/2015 Harvard workshops');

console.log('\n✅ Harvard University workshops faculty integration complete!');