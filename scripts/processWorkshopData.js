/**
 * Workshop Data Processing Script
 * Processes extracted workshop schedule data and integrates with faculty profiles
 */

// Sample data structure from 2025 WoG extraction (Week 1 only for testing)
const sampleWorkshopData = {
  workshop: "WoG",
  year: 2025,
  weeks: [
    {
      week: 1,
      sessions: [
    {
      date: "6th Jan",
      day: "Monday",
      time: "14-17",
      presenters: ["Mike Zody"],
      topic: "Sequencing Technologies",
      location: "Town Theatre",
      type: "lecture"
    },
    {
      date: "7th Jan", 
      day: "Tuesday",
      time: "09-12",
      presenters: ["Guy Leonard", "Mercè Montoliu Nerín"],
      topic: "AMIs, the Cloud, and Computing Introduction to UNIX",
      location: "House of Prelate",
      type: "lecture"
    },
    {
      date: "8th Jan",
      day: "Wednesday",
      time: "09-12", 
      presenters: ["Rayan Chikhi"],
      topic: "Alignment",
      location: "Town Theatre",
      type: "lecture"
    },
    {
      date: "8th Jan",
      day: "Wednesday",
      time: "14-17",
      presenters: ["Katharina Hoff"],
      topic: "Genome Annotation: Theory and Principles", 
      location: "Town Theatre",
      type: "lecture"
    },
    {
      date: "9th Jan",
      day: "Thursday",
      time: "09-12",
      presenters: ["Camille Marchet", "Antoine Limasset"],
      topic: "Genome Assembly: Theory and Principles",
      location: "Town Theatre", 
      type: "lecture"
    },
    {
      date: "10th Jan",
      day: "Friday",
      time: "09-12",
      presenters: ["Olga Vinnere Pettersson"],
      topic: "Experimental Design in Genomics",
      location: "Town Theatre",
      type: "lecture"
    },
    {
      date: "10th Jan",
      day: "Friday", 
      time: "14-17",
      presenters: ["Erik Garrison"],
      topic: "Variant Calling (Lab)",
      location: "House of Prelate",
      type: "lab"
    },
    {
      date: "11th Jan",
      day: "Saturday",
      time: "09-12",
      presenters: ["Chris Wheat"],
      topic: "Lies, Damn Lies, and Genomics (Part 2)",
      location: "Town Theatre",
      type: "lecture"
    }
      ]
    },
    {
      week: 2,
      sessions: [
        {
          date: "13th Jan",
          day: "Monday",
          time: "09-12",
          presenters: ["Evan Eichler"],
          topic: "Genome Structural Variation",
          location: "Town Theatre",
          type: "lecture"
        },
        {
          date: "14th Jan",
          day: "Tuesday",
          time: "09-12",
          presenters: ["Brian Haas"],
          topic: "Transcriptomics",
          location: "Town Theatre",
          type: "lecture"
        },
        {
          date: "17th Jan",
          day: "Friday",
          time: "09-12",
          presenters: ["Rayan Chikhi"],
          topic: "BIG DATA",
          location: "Town Theatre",
          type: "lecture"
        }
      ]
    }
  ]
};

/**
 * Enhanced Faculty Profile with Teaching History
 */
function enhanceFacultyWithTeachingData(facultyProfiles, workshopData) {
  const enhanced = [...facultyProfiles];
  
  // Create teaching lookup from workshop data
  const teachingLookup = {};
  
  workshopData.forEach(workshop => {
    // Handle both old format (sessions) and new format (weeks)
    const allSessions = workshop.sessions || [];
    if (workshop.weeks) {
      workshop.weeks.forEach(week => {
        allSessions.push(...week.sessions);
      });
    }
    
    allSessions.forEach(session => {
      session.presenters.forEach(presenter => {
        const normalizedName = normalizePresenterName(presenter);
        
        if (!teachingLookup[normalizedName]) {
          teachingLookup[normalizedName] = {};
        }
        
        if (!teachingLookup[normalizedName][workshop.workshop]) {
          teachingLookup[normalizedName][workshop.workshop] = {};
        }
        
        if (!teachingLookup[normalizedName][workshop.workshop][workshop.year]) {
          teachingLookup[normalizedName][workshop.workshop][workshop.year] = [];
        }
        
        teachingLookup[normalizedName][workshop.workshop][workshop.year].push({
          date: session.date,
          time: session.time,
          topic: session.topic,
          type: session.type,
          location: session.location,
          coPresenters: session.presenters.filter(p => 
            normalizePresenterName(p) !== normalizedName
          )
        });
      });
    });
  });
  
  // Enhance faculty profiles with teaching data
  enhanced.forEach(profile => {
    const fullName = `${profile.faculty.firstName} ${profile.faculty.lastName}`;
    const teachingData = findTeachingDataForFaculty(fullName, teachingLookup);
    
    if (teachingData) {
      profile.teaching = {
        totalSessions: calculateTotalSessions(teachingData),
        workshopsHistory: teachingData,
        specializations: extractTeachingSpecializations(teachingData),
        lastTaught: getLastTaughtYear(teachingData)
      };
    }
  });
  
  return enhanced;
}

function normalizePresenterName(name) {
  return name
    .replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function findTeachingDataForFaculty(facultyName, teachingLookup) {
  // Try exact match first
  if (teachingLookup[facultyName]) {
    return teachingLookup[facultyName];
  }
  
  // Try fuzzy matching for name variations
  const nameParts = facultyName.toLowerCase().split(' ');
  const lastName = nameParts[nameParts.length - 1];
  const firstName = nameParts[0];
  
  for (const [teacherName, data] of Object.entries(teachingLookup)) {
    const teacherParts = teacherName.toLowerCase().split(' ');
    const teacherLastName = teacherParts[teacherParts.length - 1];
    const teacherFirstName = teacherParts[0];
    
    // Match on last name and first initial
    if (teacherLastName === lastName && teacherFirstName.startsWith(firstName[0])) {
      return data;
    }
  }
  
  return null;
}

function calculateTotalSessions(teachingData) {
  let total = 0;
  Object.values(teachingData).forEach(workshop => {
    Object.values(workshop).forEach(year => {
      total += year.length;
    });
  });
  return total;
}

function extractTeachingSpecializations(teachingData) {
  const topics = new Set();
  
  Object.values(teachingData).forEach(workshop => {
    Object.values(workshop).forEach(year => {
      year.forEach(session => {
        // Extract key topics from session titles
        const topic = session.topic.toLowerCase();
        if (topic.includes('assembly')) topics.add('Genome Assembly');
        if (topic.includes('annotation')) topics.add('Genome Annotation');
        if (topic.includes('variant')) topics.add('Variant Calling');
        if (topic.includes('alignment')) topics.add('Sequence Alignment');
        if (topic.includes('sequencing')) topics.add('Sequencing Technologies');
        if (topic.includes('unix') || topic.includes('computing')) topics.add('Computational Methods');
        if (topic.includes('r ') || topic.includes('statistics')) topics.add('Statistical Analysis');
        if (topic.includes('experimental')) topics.add('Experimental Design');
      });
    });
  });
  
  return Array.from(topics);
}

function getLastTaughtYear(teachingData) {
  let maxYear = 0;
  Object.values(teachingData).forEach(workshop => {
    Object.keys(workshop).forEach(year => {
      maxYear = Math.max(maxYear, parseInt(year));
    });
  });
  return maxYear;
}

/**
 * Generate Workshop Summary Statistics
 */
function generateWorkshopSummary(workshopData) {
  const summary = {
    totalWorkshops: workshopData.length,
    totalSessions: 0,
    totalPresenters: new Set(),
    workshopTypes: new Set(),
    yearRange: { min: Infinity, max: -Infinity },
    topicCounts: {},
    presenterCounts: {},
    locationCounts: {}
  };
  
  workshopData.forEach(workshop => {
    // Handle both old format (sessions) and new format (weeks)
    const allSessions = workshop.sessions || [];
    if (workshop.weeks) {
      workshop.weeks.forEach(week => {
        allSessions.push(...week.sessions);
      });
    }
    
    summary.totalSessions += allSessions.length;
    summary.workshopTypes.add(workshop.workshop);
    summary.yearRange.min = Math.min(summary.yearRange.min, workshop.year);
    summary.yearRange.max = Math.max(summary.yearRange.max, workshop.year);
    
    allSessions.forEach(session => {
      session.presenters.forEach(presenter => {
        if (presenter !== 'Everyone' && presenter !== 'Workshop Team') {
          summary.totalPresenters.add(presenter);
          summary.presenterCounts[presenter] = (summary.presenterCounts[presenter] || 0) + 1;
        }
      });
      
      // Count topics
      const topicKey = session.topic.split(':')[0].trim(); // Take main topic
      summary.topicCounts[topicKey] = (summary.topicCounts[topicKey] || 0) + 1;
      
      // Count locations
      if (session.location) {
        summary.locationCounts[session.location] = (summary.locationCounts[session.location] || 0) + 1;
      }
    });
  });
  
  summary.totalPresenters = summary.totalPresenters.size;
  summary.workshopTypes = Array.from(summary.workshopTypes);
  
  return summary;
}

/**
 * Export data for integration with faculty site
 */
function exportForFacultySite(enhancedFaculty, workshopSummary) {
  return {
    facultyWithTeaching: enhancedFaculty.filter(f => f.teaching),
    workshopSummary,
    generatedAt: new Date().toISOString()
  };
}

// Example usage and testing
function testWorkshopDataProcessing() {
  // Test with sample data including faculty from both weeks
  const sampleFaculty = [
    {
      faculty: { id: "mike_zody", firstName: "Mike", lastName: "Zody" },
      participations: { "WoG": [2025] }
    },
    {
      faculty: { id: "guy_leonard", firstName: "Guy", lastName: "Leonard" },
      participations: { "WoG": [2025] }
    },
    {
      faculty: { id: "rayan_chikhi", firstName: "Rayan", lastName: "Chikhi" },
      participations: { "WoG": [2025] }
    },
    {
      faculty: { id: "evan_eichler", firstName: "Evan", lastName: "Eichler" },
      participations: { "WoG": [2025] }
    }
  ];
  
  const enhanced = enhanceFacultyWithTeachingData(sampleFaculty, [sampleWorkshopData]);
  const summary = generateWorkshopSummary([sampleWorkshopData]);
  
  console.log('Enhanced Faculty:', JSON.stringify(enhanced, null, 2));
  console.log('Workshop Summary:', JSON.stringify(summary, null, 2));
}

// Run test if this is the main module
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (import.meta.url === `file://${process.argv[1]}`) {
  testWorkshopDataProcessing();
}

export {
  enhanceFacultyWithTeachingData,
  generateWorkshopSummary,
  exportForFacultySite,
  normalizePresenterName
};