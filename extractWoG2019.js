#!/usr/bin/env node

// Extract and process 2019 WoG workshop data
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Extracting 2019 Workshop on Genomics Data\n');

// 2019 WoG Schedule Data (based on evomics.org extraction)
const workshop2019 = {
  workshop: "WoG",
  year: 2019,
  location: "Český Krumlov, Czech Republic",
  dates: "January 6-19, 2019",
  weeks: [
    {
      week: 1,
      sessions: [
        {
          date: "7th Jan",
          time: "09-12",
          topic: "Introduction and Orientation",
          type: "orientation",
          location: "Town Theatre",
          presenters: ["Scott Handley"]
        },
        {
          date: "7th Jan",
          time: "14-17",
          topic: "Marine Ecosystems",
          type: "lecture",
          location: "Town Theatre",
          presenters: ["Sonya Dyhrman"]
        },
        {
          date: "8th Jan",
          time: "09-12",
          topic: "Sequencing Technology & Study Design",
          type: "lecture",
          location: "Town Theatre",
          presenters: ["Mike Zody"]
        },
        {
          date: "8th Jan",
          time: "14-17",
          topic: "Unix and Software Installation",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Sophie Shaw"]
        },
        {
          date: "8th Jan",
          time: "19-22",
          topic: "Introduction to R",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Hannah Tavalire"]
        },
        {
          date: "9th Jan",
          time: "09-12",
          topic: "Sequence Data Quality Control",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Sophie Shaw"]
        },
        {
          date: "9th Jan",
          time: "14-17",
          topic: "Read Alignment",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Mike Zody"]
        },
        {
          date: "9th Jan",
          time: "19-22",
          topic: "Genomics Lab",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Josephine Paris"]
        },
        {
          date: "10th Jan",
          time: "09-12",
          topic: "Sequence Data Assembly",
          type: "lecture",
          location: "Town Theatre",
          presenters: ["Rayan Chikhi"]
        },
        {
          date: "10th Jan",
          time: "14-17",
          topic: "Assembly Lab",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Rayan Chikhi"]
        },
        {
          date: "10th Jan",
          time: "19-22",
          topic: "Research Documentation",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Hannah Tavalire"]
        },
        {
          date: "11th Jan",
          time: "09-12",
          topic: "Genomic Data Visualization",
          type: "lecture",
          location: "Town Theatre",
          presenters: ["Malachi Griffith", "Zachary Skidmore"]
        },
        {
          date: "11th Jan",
          time: "14-17",
          topic: "Visualization Lab Part I",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Malachi Griffith", "Zachary Skidmore"]
        },
        {
          date: "11th Jan",
          time: "19-22",
          topic: "Visualization Lab Part II",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Malachi Griffith", "Zachary Skidmore"]
        },
        {
          date: "12th Jan",
          time: "09-12",
          topic: "Statistics for Genomics Lab 1",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Bill Cresko"]
        },
        {
          date: "12th Jan",
          time: "14-17",
          topic: "Statistics for Genomics Lab 2",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Bill Cresko"]
        }
      ]
    },
    {
      week: 2,
      sessions: [
        {
          date: "14th Jan",
          time: "09-12",
          topic: "Transcriptomics",
          type: "lecture",
          location: "Town Theatre",
          presenters: ["Brian Haas"]
        },
        {
          date: "14th Jan",
          time: "14-17",
          topic: "Transcriptomics",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Brian Haas"]
        },
        {
          date: "14th Jan",
          time: "19-22",
          topic: "Transcriptomics",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Brian Haas"]
        },
        {
          date: "15th Jan",
          time: "09-12",
          topic: "Microbiome Analysis",
          type: "lecture",
          location: "Town Theatre",
          presenters: ["Amy Willis"]
        },
        {
          date: "15th Jan",
          time: "14-17",
          topic: "Microbiome Analysis",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Amy Willis"]
        },
        {
          date: "15th Jan",
          time: "19-22",
          topic: "Microbiome Analysis continued",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Amy Willis"]
        },
        {
          date: "16th Jan",
          time: "09-12",
          topic: "Population Genomics",
          type: "lecture",
          location: "Town Theatre",
          presenters: ["Julian Catchen"]
        },
        {
          date: "16th Jan",
          time: "14-17",
          topic: "Population Genomics",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Julian Catchen", "Josephine Paris"]
        },
        {
          date: "16th Jan",
          time: "19-22",
          topic: "Population Genomics continued",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Julian Catchen", "Josephine Paris"]
        },
        {
          date: "17th Jan",
          time: "09-12",
          topic: "Evolutionary Genomics",
          type: "lecture",
          location: "Town Theatre",
          presenters: ["Dag Ahren"]
        },
        {
          date: "17th Jan",
          time: "14-17",
          topic: "Evolutionary Genomics",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Dag Ahren"]
        },
        {
          date: "17th Jan",
          time: "19-22",
          topic: "Evolutionary Genomics continued",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Dag Ahren"]
        },
        {
          date: "18th Jan",
          time: "09-12",
          topic: "Genomics Research Perspectives",
          type: "lecture",
          location: "Town Theatre",
          presenters: ["Chris Wheat"]
        },
        {
          date: "18th Jan",
          time: "14-17",
          topic: "Final Open Lab",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Workshop Team"]
        }
      ]
    }
  ]
};

// Extract all unique presenters
const allPresenters = new Set();
workshop2019.weeks.forEach(week => {
  week.sessions.forEach(session => {
    session.presenters.forEach(presenter => {
      if (presenter !== "Workshop Team") {
        allPresenters.add(presenter);
      }
    });
  });
});

console.log(`📊 2019 WoG Workshop Data Summary:`);
console.log(`- Total sessions: ${workshop2019.weeks.reduce((sum, week) => sum + week.sessions.length, 0)}`);
console.log(`- Unique presenters: ${allPresenters.size}`);
console.log(`- Workshop: ${workshop2019.workshop} ${workshop2019.year}`);
console.log(`- Location: ${workshop2019.location}\n`);

console.log(`🎯 Unique Presenters Found:`);
Array.from(allPresenters).sort().forEach(presenter => {
  console.log(`  - ${presenter}`);
});

// Save the extracted data
const outputPath = path.join(__dirname, 'data/workshops/wog-2019.json');
const outputDir = path.dirname(outputPath);

// Create directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(workshop2019, null, 2));
console.log(`\n💾 Saved 2019 WoG workshop data to: ${outputPath}`);

console.log(`\n🚀 Ready for faculty enhancement processing!`);