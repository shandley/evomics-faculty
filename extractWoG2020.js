#!/usr/bin/env node

// Extract and process 2020 WoG workshop data
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Extracting 2020 Workshop on Genomics Data\n');

// 2020 WoG Schedule Data (based on evomics.org extraction)
const workshop2020 = {
  workshop: "WoG",
  year: 2020,
  location: "Český Krumlov, Czech Republic",
  dates: "January 5-18, 2020",
  weeks: [
    {
      week: 1,
      sessions: [
        {
          date: "6th Jan",
          time: "09-12",
          topic: "Introduction and Orientation",
          type: "orientation",
          location: "Town Theatre",
          presenters: ["Scott Handley"]
        },
        {
          date: "6th Jan",
          time: "14-17",
          topic: "Phytoplankton Physiological Ecology",
          type: "lecture",
          location: "Town Theatre",
          presenters: ["Sonya Dyhrman"]
        },
        {
          date: "7th Jan",
          time: "09-12",
          topic: "Sequencing Technology & Study Design",
          type: "lecture",
          location: "Town Theatre",
          presenters: ["Mike Zody"]
        },
        {
          date: "7th Jan",
          time: "14-17",
          topic: "Unix and Sequence Data",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Sophie Shaw"]
        },
        {
          date: "7th Jan",
          time: "19-22",
          topic: "Unix/Sequence Data continued",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Sophie Shaw"]
        },
        {
          date: "8th Jan",
          time: "09-12",
          topic: "Sequence Alignment",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Mike Zody"]
        },
        {
          date: "8th Jan",
          time: "14-17",
          topic: "Variant Calling",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Mike Zody"]
        },
        {
          date: "9th Jan",
          time: "09-12",
          topic: "Sequence Assembly",
          type: "lecture",
          location: "Town Theatre",
          presenters: ["Antoine Limasset", "Camille Marchet"]
        },
        {
          date: "9th Jan",
          time: "14-17",
          topic: "Genome Assembly",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Antoine Limasset", "Camille Marchet"]
        },
        {
          date: "9th Jan",
          time: "19-22",
          topic: "Genomics Lab",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Workshop Team"]
        },
        {
          date: "10th Jan",
          time: "09-12",
          topic: "Introduction to R",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Workshop Team"]
        },
        {
          date: "10th Jan",
          time: "14-17",
          topic: "Genomic Data Visualization",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Malachi Griffith"]
        },
        {
          date: "10th Jan",
          time: "19-22",
          topic: "Data Visualization continued",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Malachi Griffith"]
        },
        {
          date: "11th Jan",
          time: "09-12",
          topic: "Genome Structural Variation",
          type: "lecture",
          location: "Town Theatre",
          presenters: ["Evan Eichler"]
        },
        {
          date: "11th Jan",
          time: "14-17",
          topic: "Metagenomics Assembly",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Rayan Chikhi", "Sergey Nurk"]
        }
      ]
    },
    {
      week: 2,
      sessions: [
        {
          date: "13th Jan",
          time: "09-12",
          topic: "Transcriptomics",
          type: "lecture",
          location: "Town Theatre",
          presenters: ["Brian Haas"]
        },
        {
          date: "13th Jan",
          time: "14-17",
          topic: "Transcriptomics",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Brian Haas"]
        },
        {
          date: "13th Jan",
          time: "19-22",
          topic: "Transcriptomics",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Brian Haas"]
        },
        {
          date: "14th Jan",
          time: "09-12",
          topic: "Microbial Ecology",
          type: "lecture",
          location: "Town Theatre",
          presenters: ["Kelly Wrighton"]
        },
        {
          date: "14th Jan",
          time: "14-17",
          topic: "Microbiome Analysis",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Scott Handley"]
        },
        {
          date: "14th Jan",
          time: "19-22",
          topic: "Microbiome Analysis",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Scott Handley"]
        },
        {
          date: "15th Jan",
          time: "09-12",
          topic: "Population Genomics",
          type: "lecture",
          location: "Town Theatre",
          presenters: ["Emiliano Trucchi"]
        },
        {
          date: "15th Jan",
          time: "14-17",
          topic: "Population Genomics",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Emiliano Trucchi"]
        },
        {
          date: "15th Jan",
          time: "19-22",
          topic: "Population Genomics continued",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Emiliano Trucchi"]
        },
        {
          date: "16th Jan",
          time: "09-12",
          topic: "Thaumarchaeota",
          type: "lecture",
          location: "Town Theatre",
          presenters: ["Christa Schleper"]
        },
        {
          date: "16th Jan",
          time: "14-17",
          topic: "Single Cell Transcriptomics",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Kirk Gosik"]
        },
        {
          date: "16th Jan",
          time: "19-22",
          topic: "Single Cell Transcriptomics",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Kirk Gosik"]
        },
        {
          date: "17th Jan",
          time: "09-12",
          topic: "Genomics Perspectives",
          type: "lecture",
          location: "Town Theatre",
          presenters: ["Chris Wheat"]
        },
        {
          date: "17th Jan",
          time: "14-17",
          topic: "Closing Open Lab",
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
workshop2020.weeks.forEach(week => {
  week.sessions.forEach(session => {
    session.presenters.forEach(presenter => {
      if (presenter !== "Workshop Team") {
        allPresenters.add(presenter);
      }
    });
  });
});

console.log(`📊 2020 WoG Workshop Data Summary:`);
console.log(`- Total sessions: ${workshop2020.weeks.reduce((sum, week) => sum + week.sessions.length, 0)}`);
console.log(`- Unique presenters: ${allPresenters.size}`);
console.log(`- Workshop: ${workshop2020.workshop} ${workshop2020.year}`);
console.log(`- Location: ${workshop2020.location}\n`);

console.log(`🎯 Unique Presenters Found:`);
Array.from(allPresenters).sort().forEach(presenter => {
  console.log(`  - ${presenter}`);
});

// Save the extracted data
const outputPath = path.join(__dirname, 'data/workshops/wog-2020.json');
const outputDir = path.dirname(outputPath);

// Create directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(workshop2020, null, 2));
console.log(`\n💾 Saved 2020 WoG workshop data to: ${outputPath}`);

console.log(`\n🚀 Ready for faculty enhancement processing!`);