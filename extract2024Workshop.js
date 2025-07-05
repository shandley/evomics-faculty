#!/usr/bin/env node

// Extract and process 2024 WoG workshop data with enhanced name matching
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Extracting 2024 Workshop on Genomics Data\n');

// Load faculty data for matching
const facultyData = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/facultyData.json'), 'utf8'));

// 2024 WoG Schedule Data (extracted from evomics.org)
const workshop2024 = {
  workshop: "WoG",
  year: 2024,
  location: "Český Krumlov, Czech Republic",
  dates: "January 7-20, 2024",
  weeks: [
    {
      week: 1,
      sessions: [
        {
          date: "8th Jan",
          time: "09-12",
          topic: "Introduction and Orientation",
          type: "orientation",
          location: "Town Theatre",
          presenters: ["Josie Paris", "Daniel Kintzl"]
        },
        {
          date: "8th Jan",
          time: "14-17",
          topic: "Sequencing Technology",
          type: "lecture",
          location: "Town Theatre",
          presenters: ["Scott Handley"]
        },
        {
          date: "10th Jan",
          time: "09-12",
          topic: "Alignment",
          type: "lecture",
          location: "Town Theatre",
          presenters: ["Rayan Chikhi"]
        },
        {
          date: "10th Jan",
          time: "14-17",
          topic: "Genome Annotation",
          type: "lecture",
          location: "Town Theatre",
          presenters: ["Katharina Hoff"]
        },
        {
          date: "10th Jan",
          time: "19-22",
          topic: "Genome Annotation practical",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Katharina Hoff"]
        },
        {
          date: "11th Jan",
          time: "09-12",
          topic: "Genome Assembly",
          type: "lecture",
          location: "Town Theatre",
          presenters: ["Camille Marchet", "Antoine Limasset"]
        },
        {
          date: "11th Jan",
          time: "14-17",
          topic: "Genome Assembly practical",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Camille Marchet", "Antoine Limasset"]
        },
        {
          date: "12th Jan",
          time: "09-12",
          topic: "Variant Calling",
          type: "lecture",
          location: "Town Theatre",
          presenters: ["Erik Garrison"]
        },
        {
          date: "12th Jan",
          time: "14-17",
          topic: "Structural Variant Calling",
          type: "lecture",
          location: "House of Prelate",
          presenters: ["Fritz Sedlazeck"]
        },
        {
          date: "12th Jan",
          time: "19-22",
          topic: "Genomics Adventure",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Guy Leonard"]
        },
        {
          date: "13th Jan",
          time: "09-12",
          topic: "Lies, Damn Lies, and Genomics",
          type: "lecture",
          location: "Town Theatre",
          presenters: ["Chris Wheat"]
        },
        {
          date: "13th Jan",
          time: "14-17",
          topic: "Pangenomics",
          type: "lecture",
          location: "House of Prelate",
          presenters: ["Erik Garrison"]
        }
      ]
    },
    {
      week: 2,
      sessions: [
        {
          date: "15th Jan",
          time: "09-12",
          topic: "Transcriptomics and Single-cell Transcriptomics",
          type: "lecture",
          location: "Town Theatre",
          presenters: ["Brian Haas"]
        },
        {
          date: "15th Jan",
          time: "19-22",
          topic: "Analysis of RNASeq Data",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Rachel Steward"]
        },
        {
          date: "16th Jan",
          time: "09-12",
          topic: "Genomics in the Ocean",
          type: "lecture",
          location: "Town Theatre",
          presenters: ["Sonya Dyhrman"]
        },
        {
          date: "16th Jan",
          time: "14-17",
          topic: "Comparative Genomics",
          type: "lecture",
          location: "Town Theatre",
          presenters: ["Oleg Simakov"]
        },
        {
          date: "16th Jan",
          time: "19-22",
          topic: "Microbiome Analysis",
          type: "practical",
          location: "House of Prelate",
          presenters: ["David Barnett"]
        },
        {
          date: "17th Jan",
          time: "09-12",
          topic: "The wonders of genome assembly!",
          type: "lecture",
          location: "Town Theatre",
          presenters: ["Marcela Uliano-Silva"]
        },
        {
          date: "17th Jan",
          time: "14-17",
          topic: "Population Genomics",
          type: "lecture",
          location: "House of Prelate",
          presenters: ["Vincenza Colonna"]
        },
        {
          date: "18th Jan",
          time: "09-12",
          topic: "Genome Structural Variation",
          type: "lecture",
          location: "Town Theatre",
          presenters: ["Evan Eichler"]
        },
        {
          date: "18th Jan",
          time: "14-17",
          topic: "Best Practices in Handling Genomic Data",
          type: "lecture",
          location: "House of Prelate",
          presenters: ["Dag Ahrén"]
        },
        {
          date: "18th Jan",
          time: "19-22",
          topic: "Phylogenomics",
          type: "lecture",
          location: "House of Prelate",
          presenters: ["Rosa Fernández"]
        },
        {
          date: "19th Jan",
          time: "09-12",
          topic: "BIG DATA",
          type: "lecture",
          location: "House of Prelate",
          presenters: ["Rayan Chikhi"]
        }
      ]
    }
  ]
};

// Extract all unique presenters
const allPresenters = new Set();
workshop2024.weeks.forEach(week => {
  week.sessions.forEach(session => {
    session.presenters.forEach(presenter => {
      if (presenter !== "Workshop Team" && presenter !== "Everyone") {
        allPresenters.add(presenter);
      }
    });
  });
});

console.log(`📊 2024 Workshop Data Summary:`);
console.log(`- Total sessions: ${workshop2024.weeks.reduce((sum, week) => sum + week.sessions.length, 0)}`);
console.log(`- Unique presenters: ${allPresenters.size}`);
console.log(`- Workshop: ${workshop2024.workshop} ${workshop2024.year}`);
console.log(`- Location: ${workshop2024.location}\n`);

console.log(`🎯 Unique Presenters Found:`);
Array.from(allPresenters).sort().forEach(presenter => {
  console.log(`  - ${presenter}`);
});

// Enhanced name matching simulation
console.log(`\n🔍 Testing Enhanced Name Matching:`);

const testMatches = [
  "Mercè Montoliu Nerín",
  "Petr Daněček", 
  "Dag Ahrén",
  "Rosa Fernández"
];

testMatches.forEach(testName => {
  // Simple test of our normalization logic
  const normalized = testName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[-\s]+/g, ' ')
    .trim();
  
  const faculty = facultyData.faculty.find(f => {
    const facultyName = `${f.firstName} ${f.lastName}`.toLowerCase();
    const facultyNormalized = facultyName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[-\s]+/g, ' ')
      .trim();
    
    return facultyNormalized === normalized || facultyName.includes(normalized.split(' ')[1]);
  });
  
  if (faculty) {
    console.log(`✅ ${testName} → ${faculty.firstName} ${faculty.lastName} (${faculty.id})`);
  } else {
    console.log(`❌ ${testName} → Not found`);
  }
});

// Save the extracted data
const outputPath = path.join(__dirname, 'data/workshops/wog-2024.json');
const outputDir = path.dirname(outputPath);

// Create directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(workshop2024, null, 2));
console.log(`\n💾 Saved 2024 workshop data to: ${outputPath}`);

console.log(`\n🚀 Ready for faculty enhancement processing!`);