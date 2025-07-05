#!/usr/bin/env node

// Clean up duplicate faculty entries in the database
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧹 Cleaning up duplicate faculty entries\n');

// Load faculty data
const facultyPath = path.join(__dirname, 'src/data/facultyData.json');
const facultyData = JSON.parse(fs.readFileSync(facultyPath, 'utf8'));

console.log(`📊 Original faculty count: ${facultyData.faculty.length}`);

// Find duplicates
const duplicates = [];
const seen = new Set();
const cleanFaculty = [];

facultyData.faculty.forEach((faculty, index) => {
  const key = `${faculty.firstName}|${faculty.lastName}|${faculty.id}`;
  
  if (seen.has(key)) {
    duplicates.push({ index, faculty });
    console.log(`🔍 Found duplicate: ${faculty.firstName} ${faculty.lastName} (${faculty.id})`);
  } else {
    seen.add(key);
    cleanFaculty.push(faculty);
  }
});

// Also check for similar entries (like Petr with different accents)
const problematicEntries = [];
cleanFaculty.forEach((faculty, index) => {
  if ((faculty.firstName === "Petr" && faculty.lastName === "Danacek") ||
      (faculty.firstName === "Ben" && faculty.lastName === "Langmead")) {
    // Check if they have any teaching data
    console.log(`🔍 Checking problematic entry: ${faculty.firstName} ${faculty.lastName} (${faculty.id})`);
    problematicEntries.push({ index, faculty });
  }
});

console.log(`\n📋 Summary:`);
console.log(`- Exact duplicates found: ${duplicates.length}`);
console.log(`- Problematic entries found: ${problematicEntries.length}`);
console.log(`- Clean faculty count: ${cleanFaculty.length}`);

// Remove the problematic entries without teaching data
const finalCleanFaculty = cleanFaculty.filter(faculty => {
  // Keep the correctly accented version of Petr Daněček
  if (faculty.firstName === "Petr") {
    return faculty.lastName === "Daněček" && faculty.id === "danecek-petr";
  }
  // Remove Ben Langmead entries for now since they don't have teaching data
  if (faculty.firstName === "Ben" && faculty.lastName === "Langmead") {
    console.log(`❌ Removing Ben Langmead entry (no teaching data): ${faculty.id}`);
    return false;
  }
  return true;
});

// Also remove the non-accented Petr entry
const finalFacultyData = {
  ...facultyData,
  faculty: finalCleanFaculty.filter(faculty => {
    if (faculty.firstName === "Petr" && faculty.lastName === "Danacek") {
      console.log(`❌ Removing non-accented Petr entry: ${faculty.id}`);
      return false;
    }
    return true;
  })
};

console.log(`\n✅ Final clean faculty count: ${finalFacultyData.faculty.length}`);

// Write cleaned data back
fs.writeFileSync(facultyPath, JSON.stringify(finalFacultyData, null, 2));
console.log(`💾 Saved cleaned faculty data to: ${facultyPath}`);

// Show the remaining Petr entry
const remainingPetr = finalFacultyData.faculty.filter(f => f.firstName === "Petr");
if (remainingPetr.length > 0) {
  console.log(`\n✅ Remaining Petr entry:`, remainingPetr[0]);
}

console.log(`\n🚀 Faculty database cleaned successfully!`);