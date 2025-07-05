/**
 * Workshop Schedule Data Extraction Script
 * Extracts workshop schedules from evomics.org WordPress pages
 */

// Complete extracted data from 2025 Workshop on Genomics (both weeks)
const wog2025Schedule = {
  workshop: "WoG",
  fullName: "Workshop on Genomics",
  year: 2025,
  location: "Český Krumlov, Czech Republic",
  dates: "5-18 January, 2025",
  weeks: [
    {
      week: 1,
      dateRange: "5-12 January, 2025",
      sessions: [
        {
          date: "5th Jan",
          day: "Sunday",
          time: "18-22",
          presenters: ["Everyone"],
          topic: "Reception Dinner",
          location: "Hotel Zlaty Andel",
          type: "social"
        },
        {
          date: "6th Jan",
          day: "Monday", 
          time: "09-12",
          presenters: ["Josie Paris", "Daniel Kintzl"],
          topic: "Introduction and Orientation Town Services",
          location: "Town Theatre",
          type: "orientation"
        },
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
          date: "6th Jan",
          day: "Monday",
          time: "19:30-22",
          presenters: ["Everyone"],
          topic: "Dreams, Fantasy Dreams, and Genomics",
          location: "Krumlov Mill",
          type: "social"
        },
        {
          date: "7th Jan",
          day: "Tuesday",
          time: "09-12",
          presenters: ["Guy Leonard", "Mercè Montoliu Nerín"],
          topic: "AMIs, the Cloud, and Computing Introduction to UNIX (Presentation)",
          location: "House of Prelate",
          type: "lecture"
        },
        {
          date: "7th Jan", 
          day: "Tuesday",
          time: "14-17",
          presenters: ["Mike Zody"],
          topic: "Essential File Types in Bioinformatics",
          location: "House of Prelate",
          type: "lecture"
        },
        {
          date: "7th Jan",
          day: "Tuesday",
          time: "19-22",
          presenters: ["Mercè Montoliu Nerín"],
          topic: "Introduction to UNIX (Presentation)",
          location: "House of Prelate", 
          type: "practical"
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
          date: "8th Jan",
          day: "Wednesday",
          time: "19-22",
          presenters: ["Katharina Hoff"],
          topic: "Genome Annotation practical",
          location: "House of Prelate",
          type: "practical"
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
          date: "9th Jan",
          day: "Thursday",
          time: "14-17", 
          presenters: ["Camille Marchet", "Antoine Limasset"],
          topic: "Genome Assembly practical",
          location: "House of Prelate",
          type: "practical"
        },
        {
          date: "9th Jan",
          day: "Thursday",
          time: "19-22",
          presenters: ["Fritz Sedlazeck"],
          topic: "Structural Variant Calling (Lab)",
          location: "House of Prelate",
          type: "lab"
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
          date: "10th Jan",
          day: "Friday",
          time: "19-22",
          presenters: ["Workshop Team"],
          topic: "Introduction to R (Lab)",
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
        },
        {
          date: "11th Jan",
          day: "Saturday", 
          time: "14-17",
          presenters: ["Guy Leonard"],
          topic: "Genomics Adventure",
          location: "House of Prelate",
          type: "practical"
        },
        {
          date: "11th Jan",
          day: "Saturday",
          time: "19-late",
          presenters: ["Everyone"],
          topic: "Town Tour @ 19.00 Mid-Workshop dinner @ 20.00",
          location: "Town Square Krumlov Mill",
          type: "social"
        },
        {
          date: "12th Jan",
          day: "Sunday",
          time: "All Day",
          presenters: ["Everyone"],
          topic: "Free Day",
          location: "Up to you!",
          type: "free"
        }
      ]
    },
    {
      week: 2,
      dateRange: "13-18 January, 2025",
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
          date: "13th Jan",
          day: "Monday",
          time: "14-17",
          presenters: ["Ben Langmead"],
          topic: "Genome Indexing",
          location: "House of Prelate",
          type: "practical"
        },
        {
          date: "13th Jan",
          day: "Monday",
          time: "19-22",
          presenters: ["Ben Langmead"],
          topic: "Genome Indexing (Lab)",
          location: "House of Prelate",
          type: "lab"
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
          date: "14th Jan",
          day: "Tuesday",
          time: "14-17",
          presenters: ["Brian Haas"],
          topic: "Transcriptomics (Lab)",
          location: "House of Prelate",
          type: "lab"
        },
        {
          date: "14th Jan",
          day: "Tuesday",
          time: "19-22",
          presenters: ["Fritz Sedlazeck"],
          topic: "Structural Variant Calling (Lab continued)",
          location: "House of Prelate",
          type: "lab"
        },
        {
          date: "15th Jan",
          day: "Wednesday",
          time: "09-12",
          presenters: ["Sonya Dyhrman"],
          topic: "Genomics in the Ocean",
          location: "Town Theatre",
          type: "lecture"
        },
        {
          date: "15th Jan",
          day: "Wednesday",
          time: "14-17",
          presenters: ["Sonya Dyhrman"],
          topic: "Genomics in the Ocean (Lab)",
          location: "House of Prelate",
          type: "lab"
        },
        {
          date: "15th Jan",
          day: "Wednesday",
          time: "19-22",
          presenters: ["Scott Handley"],
          topic: "Microbiome Analysis",
          location: "House of Prelate",
          type: "practical"
        },
        {
          date: "16th Jan",
          day: "Thursday",
          time: "09-12",
          presenters: ["Marcela Uliano-Silva"],
          topic: "Wonders of Genome Assembly",
          location: "Town Theatre",
          type: "lecture"
        },
        {
          date: "16th Jan",
          day: "Thursday",
          time: "14-17",
          presenters: ["Marcela Uliano-Silva"],
          topic: "Wonders of Genome Assembly (Lab)",
          location: "House of Prelate",
          type: "lab"
        },
        {
          date: "16th Jan",
          day: "Thursday",
          time: "19-22",
          presenters: ["Erik Garrison"],
          topic: "Population Genomics",
          location: "House of Prelate",
          type: "practical"
        },
        {
          date: "17th Jan",
          day: "Friday",
          time: "09-12",
          presenters: ["Rayan Chikhi"],
          topic: "BIG DATA",
          location: "Town Theatre",
          type: "lecture"
        },
        {
          date: "17th Jan",
          day: "Friday",
          time: "14-17",
          presenters: ["Workshop Team"],
          topic: "Student Presentations",
          location: "Town Theatre",
          type: "presentation"
        },
        {
          date: "17th Jan",
          day: "Friday",
          time: "19-22",
          presenters: ["Everyone"],
          topic: "Closing Dinner",
          location: "Krumlov Mill",
          type: "social"
        },
        {
          date: "18th Jan",
          day: "Saturday",
          time: "All Day",
          presenters: ["Everyone"],
          topic: "Departure",
          location: "Various",
          type: "departure"
        }
      ]
    }
  ]
};

// Function to normalize presenter names to match faculty database
function normalizePresenterName(name) {
  // Remove titles, normalize spacing, handle special cases
  return name
    .replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Function to categorize session types
function categorizeSession(topic, time, location) {
  const topicLower = topic.toLowerCase();
  
  if (topicLower.includes('reception') || topicLower.includes('dinner') || topicLower.includes('tour')) {
    return 'social';
  }
  if (topicLower.includes('lab') || topicLower.includes('practical')) {
    return 'practical';
  }
  if (topicLower.includes('introduction') && topicLower.includes('orientation')) {
    return 'orientation';
  }
  if (topicLower.includes('free')) {
    return 'free';
  }
  
  return 'lecture';
}

// Function to extract faculty teaching sessions from workshop data
function extractFacultyTeachingSessions(workshopData) {
  const facultyTeaching = {};
  
  workshopData.weeks.forEach(week => {
    week.sessions.forEach(session => {
      session.presenters.forEach(presenter => {
        const normalizedName = normalizePresenterName(presenter);
        
        if (normalizedName !== 'Everyone' && normalizedName !== 'Workshop Team') {
          if (!facultyTeaching[normalizedName]) {
            facultyTeaching[normalizedName] = [];
          }
          
          facultyTeaching[normalizedName].push({
            workshop: workshopData.workshop,
            year: workshopData.year,
            date: session.date,
            time: session.time,
            topic: session.topic,
            type: session.type,
            location: session.location,
            coPresenters: session.presenters.filter(p => 
              normalizePresenterName(p) !== normalizedName && 
              p !== 'Everyone' && 
              p !== 'Workshop Team'
            )
          });
        }
      });
    });
  });
  
  return facultyTeaching;
}

// Export the data structure and helper functions
module.exports = {
  wog2025Schedule,
  normalizePresenterName,
  categorizeSession,
  extractFacultyTeachingSessions
};

// Example usage:
if (require.main === module) {
  const facultyTeaching = extractFacultyTeachingSessions(wog2025Schedule);
  console.log('Faculty Teaching Sessions:', JSON.stringify(facultyTeaching, null, 2));
}