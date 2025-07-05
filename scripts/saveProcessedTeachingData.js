/**
 * Save Processed Teaching Data for Faculty Integration
 * Exports teaching history in format ready for faculty site integration
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load the extracted and processed workshop data
const workshopDataPath = join(__dirname, '../data/workshops/wog_2023_2025_extracted.json');
const facultyDataPath = join(__dirname, '../src/data/facultyData.json');

const workshopData = JSON.parse(readFileSync(workshopDataPath, 'utf8'));
const facultyDataRaw = JSON.parse(readFileSync(facultyDataPath, 'utf8'));
const facultyData = facultyDataRaw.faculty;

// Import processing functions (simplified inline versions)
function normalizePresenterName(name) {
  return name
    .replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function findFacultyMatch(presenterName, facultyList) {
  const normalized = normalizePresenterName(presenterName);
  const nameParts = normalized.toLowerCase().split(' ');
  
  if (nameParts.length < 2) return null;
  
  const lastName = nameParts[nameParts.length - 1];
  const firstName = nameParts[0];
  
  // Try exact match first
  for (const faculty of facultyList) {
    const facultyFirst = faculty.firstName.toLowerCase();
    const facultyLast = faculty.lastName.toLowerCase();
    
    if (facultyFirst === firstName && facultyLast === lastName) {
      return faculty;
    }
  }
  
  // Try partial matches
  for (const faculty of facultyList) {
    const facultyFirst = faculty.firstName.toLowerCase();
    const facultyLast = faculty.lastName.toLowerCase();
    
    if (facultyLast === lastName && facultyFirst.startsWith(firstName[0])) {
      return faculty;
    }
  }
  
  return null;
}

function categorizeSession(topic) {
  const topicLower = topic.toLowerCase();
  
  if (topicLower.includes('assembly')) return 'Genome Assembly';
  if (topicLower.includes('annotation')) return 'Genome Annotation';
  if (topicLower.includes('variant') || topicLower.includes('calling')) return 'Variant Analysis';
  if (topicLower.includes('alignment')) return 'Sequence Alignment';
  if (topicLower.includes('sequencing') || topicLower.includes('technology')) return 'Sequencing Technologies';
  if (topicLower.includes('unix') || topicLower.includes('computing') || topicLower.includes('data')) return 'Computational Methods';
  if (topicLower.includes('transcriptomics') || topicLower.includes('rnaseq')) return 'Transcriptomics';
  if (topicLower.includes('population') || topicLower.includes('comparative')) return 'Population Genomics';
  if (topicLower.includes('phylogen')) return 'Phylogenomics';
  if (topicLower.includes('microbiome') || topicLower.includes('metagenom')) return 'Microbiome Analysis';
  if (topicLower.includes('structural')) return 'Structural Variation';
  if (topicLower.includes('experimental') || topicLower.includes('design')) return 'Experimental Design';
  
  return 'General Genomics';
}

// Process all sessions into faculty teaching data
const facultyTeachingData = {};

workshopData.forEach(workshop => {
  workshop.weeks.forEach(week => {
    week.sessions.forEach(session => {
      session.presenters.forEach(presenter => {
        if (presenter !== 'Everyone' && presenter !== 'Workshop Team') {
          const faculty = findFacultyMatch(presenter, facultyData);
          
          if (faculty) {
            const facultyKey = faculty.id;
            
            if (!facultyTeachingData[facultyKey]) {
              facultyTeachingData[facultyKey] = {
                faculty: faculty,
                teaching: {
                  totalSessions: 0,
                  workshopsHistory: {},
                  specializations: new Set(),
                  lastTaught: 0,
                  firstTaught: 9999,
                  yearsActive: new Set(),
                  allSessions: []
                }
              };
            }
            
            const teachingData = facultyTeachingData[facultyKey].teaching;
            
            // Add to workshop history
            if (!teachingData.workshopsHistory[workshop.workshop]) {
              teachingData.workshopsHistory[workshop.workshop] = {};
            }
            if (!teachingData.workshopsHistory[workshop.workshop][workshop.year]) {
              teachingData.workshopsHistory[workshop.workshop][workshop.year] = [];
            }
            
            const sessionData = {
              date: session.date,
              time: session.time,
              topic: session.topic,
              type: session.type,
              location: session.location,
              coPresenters: session.presenters.filter(p => 
                normalizePresenterName(p) !== normalizePresenterName(presenter) &&
                p !== 'Everyone' && p !== 'Workshop Team'
              )
            };
            
            teachingData.workshopsHistory[workshop.workshop][workshop.year].push(sessionData);
            teachingData.allSessions.push({
              ...sessionData,
              workshop: workshop.workshop,
              year: workshop.year,
              specialization: categorizeSession(session.topic)
            });
            
            // Update statistics
            teachingData.totalSessions++;
            teachingData.specializations.add(categorizeSession(session.topic));
            teachingData.lastTaught = Math.max(teachingData.lastTaught, workshop.year);
            teachingData.firstTaught = Math.min(teachingData.firstTaught, workshop.year);
            teachingData.yearsActive.add(workshop.year);
          }
        }
      });
    });
  });
});

// Convert sets to arrays and finalize data
Object.values(facultyTeachingData).forEach(data => {
  data.teaching.specializations = Array.from(data.teaching.specializations);
  data.teaching.yearsActive = Array.from(data.teaching.yearsActive).sort();
  data.teaching.yearRange = `${data.teaching.firstTaught}-${data.teaching.lastTaught}`;
  
  // Remove temporary arrays
  delete data.teaching.allSessions;
});

// Create output directory
const outputDir = join(__dirname, '../data/processed');
mkdirSync(outputDir, { recursive: true });

// Save faculty teaching data
const facultyTeachingOutput = {
  metadata: {
    source: 'WoG 2023-2025 Workshop Schedules',
    extractedAt: new Date().toISOString(),
    totalFaculty: Object.keys(facultyTeachingData).length,
    totalSessions: Object.values(facultyTeachingData).reduce((sum, f) => sum + f.teaching.totalSessions, 0),
    workshopsIncluded: ['WoG 2023', 'WoG 2024', 'WoG 2025'],
    processingNote: 'Ready for faculty site integration'
  },
  facultyTeaching: facultyTeachingData
};

writeFileSync(
  join(outputDir, 'facultyTeachingData.json'),
  JSON.stringify(facultyTeachingOutput, null, 2)
);

// Create simplified integration file for frontend
const integrationData = {};
Object.entries(facultyTeachingData).forEach(([facultyId, data]) => {
  integrationData[facultyId] = {
    teaching: data.teaching
  };
});

writeFileSync(
  join(outputDir, 'teachingDataForIntegration.json'),
  JSON.stringify(integrationData, null, 2)
);

// Generate summary statistics
const summary = {
  totalFaculty: Object.keys(facultyTeachingData).length,
  totalSessions: Object.values(facultyTeachingData).reduce((sum, f) => sum + f.teaching.totalSessions, 0),
  topTeachers: Object.entries(facultyTeachingData)
    .map(([id, data]) => ({
      name: `${data.faculty.firstName} ${data.faculty.lastName}`,
      sessions: data.teaching.totalSessions,
      specializations: data.teaching.specializations,
      years: data.teaching.yearsActive
    }))
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 10),
  specializations: {}
};

// Count specializations across all faculty
Object.values(facultyTeachingData).forEach(data => {
  data.teaching.specializations.forEach(spec => {
    summary.specializations[spec] = (summary.specializations[spec] || 0) + 1;
  });
});

writeFileSync(
  join(outputDir, 'teachingSummary.json'),
  JSON.stringify(summary, null, 2)
);

console.log('✅ Teaching data saved successfully!');
console.log(`📁 Output directory: ${outputDir}`);
console.log(`👥 Faculty with teaching data: ${summary.totalFaculty}`);
console.log(`📚 Total teaching sessions: ${summary.totalSessions}`);
console.log(`🏆 Top teacher: ${summary.topTeachers[0].name} (${summary.topTeachers[0].sessions} sessions)`);
console.log('\n📊 Top Specializations:');
Object.entries(summary.specializations)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 5)
  .forEach(([spec, count]) => {
    console.log(`   ${spec}: ${count} faculty`);
  });