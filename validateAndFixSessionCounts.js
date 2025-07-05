#!/usr/bin/env node

// Validate and fix session count discrepancies in teaching data
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Validating and Fixing Session Count Discrepancies\n');

// Load teaching data
const teachingPath = path.join(__dirname, 'data/processed/teachingDataCompleteWoGHistorical.json');
const teachingData = JSON.parse(fs.readFileSync(teachingPath, 'utf8'));

console.log('📊 Found teaching data for', Object.keys(teachingData).length, 'faculty\n');

let discrepanciesFound = 0;
let totalFixedSessions = 0;
const discrepancyDetails = [];

// Validate each faculty member's session counts
Object.keys(teachingData).forEach(facultyId => {
  const faculty = teachingData[facultyId];
  const teaching = faculty.teaching;
  
  if (!teaching || !teaching.workshopsHistory) {
    console.log(`⚠️  ${facultyId}: No teaching history found`);
    return;
  }
  
  // Calculate actual session count from workshop history
  let actualSessionCount = 0;
  const sessionsByYear = {};
  
  Object.keys(teaching.workshopsHistory).forEach(workshop => {
    Object.keys(teaching.workshopsHistory[workshop]).forEach(year => {
      const sessions = teaching.workshopsHistory[workshop][year];
      actualSessionCount += sessions.length;
      
      if (!sessionsByYear[year]) {
        sessionsByYear[year] = 0;
      }
      sessionsByYear[year] += sessions.length;
    });
  });
  
  // Check for discrepancy
  const recordedCount = teaching.totalSessions;
  if (actualSessionCount !== recordedCount) {
    discrepanciesFound++;
    const discrepancy = {
      facultyId,
      recorded: recordedCount,
      actual: actualSessionCount,
      difference: actualSessionCount - recordedCount,
      sessionsByYear
    };
    discrepancyDetails.push(discrepancy);
    
    console.log(`❌ ${facultyId}:`);
    console.log(`   Recorded: ${recordedCount} sessions`);
    console.log(`   Actual: ${actualSessionCount} sessions`);
    console.log(`   Difference: ${discrepancy.difference}`);
    console.log(`   Sessions by year:`, sessionsByYear);
    console.log('');
    
    // Fix the count
    teaching.totalSessions = actualSessionCount;
    totalFixedSessions += Math.abs(discrepancy.difference);
  }
});

console.log(`\n📋 Validation Summary:`);
console.log(`- Total faculty checked: ${Object.keys(teachingData).length}`);
console.log(`- Discrepancies found: ${discrepanciesFound}`);
console.log(`- Total session count corrections: ${totalFixedSessions}`);

if (discrepanciesFound > 0) {
  console.log(`\n🔧 Fixing discrepancies...`);
  
  // Recalculate other derived statistics for affected faculty
  discrepancyDetails.forEach(({ facultyId }) => {
    const teaching = teachingData[facultyId].teaching;
    
    // Recalculate years active
    const allYears = new Set();
    Object.keys(teaching.workshopsHistory).forEach(workshop => {
      Object.keys(teaching.workshopsHistory[workshop]).forEach(year => {
        allYears.add(parseInt(year));
      });
    });
    
    teaching.yearsActive = Array.from(allYears).sort((a, b) => a - b);
    teaching.firstTaught = Math.min(...allYears);
    teaching.lastTaught = Math.max(...allYears);
    teaching.yearRange = teaching.firstTaught === teaching.lastTaught 
      ? `${teaching.firstTaught}-${teaching.firstTaught}` 
      : `${teaching.firstTaught}-${teaching.lastTaught}`;
  });
  
  // Save corrected data
  fs.writeFileSync(teachingPath, JSON.stringify(teachingData, null, 2));
  console.log(`💾 Saved corrected teaching data to: ${teachingPath}`);
  
  console.log(`\n✅ Most significant discrepancies fixed:`);
  discrepancyDetails
    .sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference))
    .slice(0, 10)
    .forEach(({ facultyId, recorded, actual, difference }) => {
      console.log(`   ${facultyId}: ${recorded} → ${actual} (${difference > 0 ? '+' : ''}${difference})`);
    });
} else {
  console.log(`\n✅ No session count discrepancies found! All data is consistent.`);
}

// Generate summary statistics
const facultyWithTeaching = Object.values(teachingData).filter(f => f.teaching.totalSessions > 0);
const totalSessions = facultyWithTeaching.reduce((sum, f) => sum + f.teaching.totalSessions, 0);
const allYears = new Set();
facultyWithTeaching.forEach(f => {
  f.teaching.yearsActive.forEach(year => allYears.add(year));
});

console.log(`\n📊 Final Corrected Statistics:`);
console.log(`- Faculty with teaching history: ${facultyWithTeaching.length}`);
console.log(`- Total teaching sessions: ${totalSessions}`);
console.log(`- Year span: ${Math.min(...allYears)}-${Math.max(...allYears)} (${allYears.size} years)`);

console.log(`\n🚀 Session count validation and correction complete!`);