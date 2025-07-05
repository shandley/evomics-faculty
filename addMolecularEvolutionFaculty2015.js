#!/usr/bin/env node

// Add missing faculty from 2015 Workshop on Molecular Evolution
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧬 Adding Missing Faculty from 2015 Workshop on Molecular Evolution\n');

// Load current faculty data
const facultyPath = path.join(__dirname, 'src/data/facultyData.json');
const facultyData = JSON.parse(fs.readFileSync(facultyPath, 'utf8'));

console.log('📋 Current faculty count:', facultyData.faculty.length);

// Missing faculty from 2015 Molecular Evolution Workshop
const newFaculty = [
  {
    id: "lewis-paul",
    firstName: "Paul",
    lastName: "Lewis"
  },
  {
    id: "beerli-peter",
    firstName: "Peter",
    lastName: "Beerli"
  },
  {
    id: "hoehna-sebastian",
    firstName: "Sebastian", 
    lastName: "Hoehna"
  },
  {
    id: "pennell-matt",
    firstName: "Matt",
    lastName: "Pennell"
  },
  {
    id: "stadler-tanja",
    firstName: "Tanja",
    lastName: "Stadler"
  }
];

console.log('➕ Adding', newFaculty.length, 'new faculty members:');

// Add new faculty members
newFaculty.forEach(faculty => {
  // Check if already exists
  const exists = facultyData.faculty.find(f => f.id === faculty.id);
  if (!exists) {
    facultyData.faculty.push(faculty);
    console.log(`  ✅ Added: ${faculty.firstName} ${faculty.lastName} (${faculty.id})`);
  } else {
    console.log(`  ⚠️  Already exists: ${faculty.firstName} ${faculty.lastName} (${faculty.id})`);
  }
});

// Add participation records for 2015 Molecular Evolution Workshop
const newParticipations = newFaculty.map(faculty => ({
  facultyId: faculty.id,
  workshopId: "wmolevo",
  year: 2015,
  role: "faculty"
}));

console.log('\n📚 Adding participation records for 2015 Workshop on Molecular Evolution:');

newParticipations.forEach(participation => {
  // Check if participation already exists
  const exists = facultyData.participations.find(p => 
    p.facultyId === participation.facultyId && 
    p.workshopId === participation.workshopId && 
    p.year === participation.year
  );
  
  if (!exists) {
    facultyData.participations.push(participation);
    console.log(`  ✅ Added participation: ${participation.facultyId} → ${participation.workshopId} ${participation.year}`);
  } else {
    console.log(`  ⚠️  Participation already exists: ${participation.facultyId} → ${participation.workshopId} ${participation.year}`);
  }
});

// Sort faculty alphabetically by lastName
facultyData.faculty.sort((a, b) => a.lastName.localeCompare(b.lastName));

// Save updated faculty data
fs.writeFileSync(facultyPath, JSON.stringify(facultyData, null, 2));

console.log('\n💾 Updated faculty database saved to:', facultyPath);
console.log('📊 Total faculty count:', facultyData.faculty.length);
console.log('📚 Total participations:', facultyData.participations.length);

console.log('\n🎯 Next Steps:');
console.log('1. Run enrichment pipeline on new faculty members');
console.log('2. Extract detailed 2015 workshop schedule data');
console.log('3. Process 2013 and 2011 Molecular Evolution workshops');
console.log('4. Add Workshop on Molecular Evolution to workshops.json');

console.log('\n✅ 2015 Molecular Evolution faculty integration complete!');