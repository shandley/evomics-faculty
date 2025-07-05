/**
 * Process Extracted Workshop Data (2023-2025 WoG)
 * Matches workshop presenters to faculty database and generates teaching history
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load extracted workshop data
const workshopDataPath = join(__dirname, '../data/workshops/wog_2023_2025_extracted.json');
const workshopData = JSON.parse(readFileSync(workshopDataPath, 'utf8'));

// Load faculty data for matching
const facultyDataPath = join(__dirname, '../src/data/facultyData.json');
const facultyDataRaw = JSON.parse(readFileSync(facultyDataPath, 'utf8'));
const facultyData = facultyDataRaw.faculty;

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
    
    // Match on last name and first initial
    if (facultyLast === lastName && facultyFirst.startsWith(firstName[0])) {
      return faculty;
    }
    
    // Match on last name and first few characters
    if (facultyLast === lastName && facultyFirst.startsWith(firstName.substring(0, 3))) {
      return faculty;
    }
  }
  
  return null;
}

function categorizeSession(topic) {
  const topicLower = topic.toLowerCase();
  
  if (topicLower.includes('reception') || topicLower.includes('dinner') || topicLower.includes('tour')) {
    return 'Social Events';
  }
  if (topicLower.includes('assembly')) {
    return 'Genome Assembly';
  }
  if (topicLower.includes('annotation')) {
    return 'Genome Annotation';
  }
  if (topicLower.includes('variant') || topicLower.includes('calling')) {
    return 'Variant Analysis';
  }
  if (topicLower.includes('alignment')) {
    return 'Sequence Alignment';
  }
  if (topicLower.includes('sequencing') || topicLower.includes('technology')) {
    return 'Sequencing Technologies';
  }
  if (topicLower.includes('unix') || topicLower.includes('computing') || topicLower.includes('data')) {
    return 'Computational Methods';
  }
  if (topicLower.includes('transcriptomics') || topicLower.includes('rnaseq')) {
    return 'Transcriptomics';
  }
  if (topicLower.includes('population') || topicLower.includes('comparative')) {
    return 'Population Genomics';
  }
  if (topicLower.includes('phylogen')) {
    return 'Phylogenomics';
  }
  if (topicLower.includes('microbiome') || topicLower.includes('metagenom')) {
    return 'Microbiome Analysis';
  }
  if (topicLower.includes('structural')) {
    return 'Structural Variation';
  }
  if (topicLower.includes('experimental') || topicLower.includes('design')) {
    return 'Experimental Design';
  }
  
  return 'General Genomics';
}

function extractAllSessions(workshopData) {
  const allSessions = [];
  
  workshopData.forEach(workshop => {
    if (workshop.weeks) {
      workshop.weeks.forEach(week => {
        week.sessions.forEach(session => {
          session.presenters.forEach(presenter => {
            if (presenter !== 'Everyone' && presenter !== 'Workshop Team') {
              allSessions.push({
                presenter: normalizePresenterName(presenter),
                workshop: workshop.workshop,
                year: workshop.year,
                date: session.date,
                time: session.time,
                topic: session.topic,
                type: session.type,
                location: session.location,
                specialization: categorizeSession(session.topic),
                coPresenters: session.presenters.filter(p => 
                  normalizePresenterName(p) !== normalizePresenterName(presenter) &&
                  p !== 'Everyone' && p !== 'Workshop Team'
                )
              });
            }
          });
        });
      });
    }
  });
  
  return allSessions;
}

function generateTeachingData(allSessions, facultyList) {
  const teachingData = {};
  const unmatchedPresenters = new Set();
  const matchedPresenters = new Set();
  
  allSessions.forEach(session => {
    const faculty = findFacultyMatch(session.presenter, facultyList);
    
    if (faculty) {
      matchedPresenters.add(session.presenter);
      const facultyKey = `${faculty.firstName} ${faculty.lastName}`;
      
      if (!teachingData[facultyKey]) {
        teachingData[facultyKey] = {
          faculty: faculty,
          sessions: [],
          specializations: new Set(),
          workshops: new Set(),
          years: new Set()
        };
      }
      
      teachingData[facultyKey].sessions.push(session);
      teachingData[facultyKey].specializations.add(session.specialization);
      teachingData[facultyKey].workshops.add(session.workshop);
      teachingData[facultyKey].years.add(session.year);
    } else {
      unmatchedPresenters.add(session.presenter);
    }
  });
  
  // Convert sets to arrays and calculate stats
  Object.values(teachingData).forEach(data => {
    data.specializations = Array.from(data.specializations);
    data.workshops = Array.from(data.workshops);
    data.years = Array.from(data.years).sort();
    data.totalSessions = data.sessions.length;
    data.yearRange = {
      first: Math.min(...data.years),
      last: Math.max(...data.years)
    };
  });
  
  return {
    teachingData,
    matchedPresenters: Array.from(matchedPresenters),
    unmatchedPresenters: Array.from(unmatchedPresenters)
  };
}

function generateWorkshopSummary(workshopData, allSessions) {
  const summary = {
    totalWorkshops: workshopData.length,
    workshopYears: workshopData.map(w => w.year).sort(),
    totalSessions: allSessions.length,
    uniquePresenters: new Set(allSessions.map(s => s.presenter)).size,
    locationStats: {},
    specializationStats: {},
    yearlyStats: {},
    sessionTypeStats: {}
  };
  
  allSessions.forEach(session => {
    // Location stats
    summary.locationStats[session.location] = (summary.locationStats[session.location] || 0) + 1;
    
    // Specialization stats
    summary.specializationStats[session.specialization] = (summary.specializationStats[session.specialization] || 0) + 1;
    
    // Yearly stats
    summary.yearlyStats[session.year] = (summary.yearlyStats[session.year] || 0) + 1;
    
    // Session type stats
    summary.sessionTypeStats[session.type] = (summary.sessionTypeStats[session.type] || 0) + 1;
  });
  
  return summary;
}

function analyzeTeachingPatterns(teachingData) {
  const patterns = {
    multiYearTeachers: [],
    multiTopicTeachers: [],
    frequentTeachers: [],
    collaborativeTeachers: [],
    specializationLeaders: {}
  };
  
  Object.entries(teachingData).forEach(([name, data]) => {
    // Multi-year teachers
    if (data.years.length > 1) {
      patterns.multiYearTeachers.push({
        name,
        years: data.years,
        yearsCount: data.years.length
      });
    }
    
    // Multi-topic teachers
    if (data.specializations.length > 1) {
      patterns.multiTopicTeachers.push({
        name,
        specializations: data.specializations,
        count: data.specializations.length
      });
    }
    
    // Frequent teachers (more than 2 sessions)
    if (data.totalSessions > 2) {
      patterns.frequentTeachers.push({
        name,
        sessions: data.totalSessions,
        years: data.years
      });
    }
    
    // Collaborative teachers (frequently co-presenting)
    const coPresenterSessions = data.sessions.filter(s => s.coPresenters.length > 0);
    if (coPresenterSessions.length > 0) {
      patterns.collaborativeTeachers.push({
        name,
        collaborativeSessions: coPresenterSessions.length,
        totalSessions: data.totalSessions,
        collaborationRate: (coPresenterSessions.length / data.totalSessions * 100).toFixed(1)
      });
    }
    
    // Track specialization leaders
    data.specializations.forEach(spec => {
      if (!patterns.specializationLeaders[spec]) {
        patterns.specializationLeaders[spec] = [];
      }
      patterns.specializationLeaders[spec].push({
        name,
        sessions: data.sessions.filter(s => s.specialization === spec).length
      });
    });
  });
  
  // Sort and format results
  patterns.multiYearTeachers.sort((a, b) => b.yearsCount - a.yearsCount);
  patterns.multiTopicTeachers.sort((a, b) => b.count - a.count);
  patterns.frequentTeachers.sort((a, b) => b.sessions - a.sessions);
  patterns.collaborativeTeachers.sort((a, b) => parseFloat(b.collaborationRate) - parseFloat(a.collaborationRate));
  
  Object.keys(patterns.specializationLeaders).forEach(spec => {
    patterns.specializationLeaders[spec].sort((a, b) => b.sessions - a.sessions);
  });
  
  return patterns;
}

// Main processing
console.log('🔄 Processing 2023-2025 WoG Workshop Data...\n');

const allSessions = extractAllSessions(workshopData);
console.log(`📊 Extracted ${allSessions.length} total sessions from ${workshopData.length} workshops`);

const { teachingData, matchedPresenters, unmatchedPresenters } = generateTeachingData(allSessions, facultyData);
console.log(`✅ Matched ${matchedPresenters.length} presenters to faculty database`);
console.log(`❓ Unmatched presenters: ${unmatchedPresenters.length}`);

if (unmatchedPresenters.length > 0) {
  console.log('\n🔍 Unmatched Presenters:');
  unmatchedPresenters.forEach(presenter => console.log(`  - ${presenter}`));
}

const summary = generateWorkshopSummary(workshopData, allSessions);
const patterns = analyzeTeachingPatterns(teachingData);

console.log('\n📈 Workshop Summary:');
console.log(`  Total Sessions: ${summary.totalSessions}`);
console.log(`  Unique Presenters: ${summary.uniquePresenters}`);
console.log(`  Years Covered: ${summary.workshopYears.join(', ')}`);

console.log('\n🏆 Teaching Patterns:');
console.log(`  Multi-year Teachers: ${patterns.multiYearTeachers.length}`);
console.log(`  Multi-topic Teachers: ${patterns.multiTopicTeachers.length}`);
console.log(`  Frequent Teachers (3+ sessions): ${patterns.frequentTeachers.length}`);
console.log(`  Collaborative Teachers: ${patterns.collaborativeTeachers.length}`);

if (patterns.frequentTeachers.length > 0) {
  console.log('\n🌟 Top Teaching Contributors:');
  patterns.frequentTeachers.slice(0, 5).forEach((teacher, index) => {
    console.log(`  ${index + 1}. ${teacher.name}: ${teacher.sessions} sessions (${teacher.years.join(', ')})`);
  });
}

console.log('\n🎯 Top Specializations:');
Object.entries(summary.specializationStats)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 5)
  .forEach(([spec, count]) => {
    console.log(`  ${spec}: ${count} sessions`);
  });

// Export processed data
const outputData = {
  teachingData,
  summary,
  patterns,
  matchingResults: {
    matched: matchedPresenters.length,
    unmatched: unmatchedPresenters.length,
    unmatchedPresenters,
    matchRate: ((matchedPresenters.length / (matchedPresenters.length + unmatchedPresenters.length)) * 100).toFixed(1)
  },
  processedAt: new Date().toISOString()
};

console.log(`\n✅ Processing complete! Match rate: ${outputData.matchingResults.matchRate}%`);

export { outputData, teachingData, summary, patterns };