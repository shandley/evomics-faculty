/**
 * Add Missing Faculty to Database
 * Research and add Ben Langmead, Petr Daněček to faculty database
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load current faculty data
const facultyDataPath = join(__dirname, '../src/data/facultyData.json');
const facultyDataRaw = JSON.parse(readFileSync(facultyDataPath, 'utf8'));

// Research data for missing faculty
const missingFaculty = [
  {
    id: "langmead-ben",
    firstName: "Ben",
    lastName: "Langmead",
    researchNote: "Johns Hopkins University, Associate Professor, Bioinformatics specialist, Known for Bowtie/Bowtie2 alignment tools",
    workshopRole: "Genome Indexing expert",
    addedReason: "Found in 2025 WoG workshop teaching Genome Indexing"
  },
  {
    id: "danecek-petr", 
    firstName: "Petr",
    lastName: "Daněček",
    researchNote: "Wellcome Sanger Institute, Senior Bioinformatician, BCFtools/SAMtools contributor",
    workshopRole: "Bioinformatics file formats specialist",
    addedReason: "Found in 2024 WoG workshop teaching Essential File Types in Bioinformatics"
  }
];

// Add to faculty array
missingFaculty.forEach(faculty => {
  const facultyEntry = {
    id: faculty.id,
    firstName: faculty.firstName,
    lastName: faculty.lastName
  };
  
  facultyDataRaw.faculty.push(facultyEntry);
  console.log(`✅ Added: ${faculty.firstName} ${faculty.lastName} (${faculty.researchNote})`);
});

// Sort faculty array by lastName for consistency
facultyDataRaw.faculty.sort((a, b) => a.lastName.localeCompare(b.lastName));

// Create backup
const backupPath = join(__dirname, '../src/data/facultyData.backup.json');
writeFileSync(backupPath, JSON.stringify(facultyDataRaw, null, 2));

// Save updated faculty data
writeFileSync(facultyDataPath, JSON.stringify(facultyDataRaw, null, 2));

console.log('\n📊 Updated Faculty Database:');
console.log(`  Total Faculty: ${facultyDataRaw.faculty.length}`);
console.log(`  Added Faculty: ${missingFaculty.length}`);
console.log(`  Backup saved: ${backupPath}`);

// Test enhanced matching with updated database
console.log('\n🧪 Testing with Updated Database:');

// Import enhanced matching (simplified inline version)
function enhancedNameNormalization(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/^(dr\.|prof\.|mr\.|ms\.|mrs\.)\s+/i, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ýÿ]/g, 'y')
    .replace(/[čć]/g, 'c')
    .replace(/[žš]/g, 's')
    .replace(/[ň]/g, 'n')
    .replace(/[ě]/g, 'e')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function quickFacultyMatch(presenterName, facultyList) {
  const normalizedPresenter = enhancedNameNormalization(presenterName);
  const presenterParts = normalizedPresenter.split(' ');
  
  if (presenterParts.length < 2) return null;
  
  const presenterFirstName = presenterParts[0];
  const presenterLastName = presenterParts[presenterParts.length - 1];
  
  for (const faculty of facultyList) {
    const normalizedFaculty = enhancedNameNormalization(`${faculty.firstName} ${faculty.lastName}`);
    const facultyParts = normalizedFaculty.split(' ');
    const facultyFirstName = facultyParts[0];
    const facultyLastName = facultyParts[facultyParts.length - 1];
    
    if (presenterFirstName === facultyFirstName && presenterLastName === facultyLastName) {
      return faculty;
    }
  }
  
  return null;
}

// Test the previously unmatched faculty
const testCases = ['Ben Langmead', 'Petr Daněček', 'Daniel Kintzl'];

testCases.forEach(testCase => {
  const match = quickFacultyMatch(testCase, facultyDataRaw.faculty);
  if (match) {
    console.log(`  ✅ "${testCase}" → ${match.firstName} ${match.lastName}`);
  } else {
    console.log(`  ❌ "${testCase}" → Still no match`);
  }
});

// Export addition log
const additionLog = {
  addedAt: new Date().toISOString(),
  addedFaculty: missingFaculty,
  newTotalFaculty: facultyDataRaw.faculty.length,
  reason: "Workshop presenter matching improvement for 2023-2025 WoG data",
  expectedImprovements: [
    "Ben Langmead: 2025 WoG Genome Indexing sessions",
    "Petr Daněček: 2024 WoG Essential File Types session"
  ]
};

const logPath = join(__dirname, '../data/processed/facultyAdditionLog.json');
writeFileSync(logPath, JSON.stringify(additionLog, null, 2));

console.log(`\n📝 Addition log saved: ${logPath}`);

export { additionLog };