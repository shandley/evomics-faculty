#!/usr/bin/env node

// Extract and process 2025 WPSG workshop data
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Extracting 2025 Workshop on Population & Speciation Genomics Data\n');

// 2025 WPSG Schedule Data (based on evomics.org extraction)
const workshop2025 = {
  workshop: "WPSG",
  year: 2025,
  location: "Český Krumlov, Czech Republic",
  dates: "January 19-February 1, 2025",
  weeks: [
    {
      week: 1,
      sessions: [
        {
          date: "19th Jan",
          time: "14-17",
          topic: "UNIX Primer",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Workshop Team"]
        },
        {
          date: "20th Jan",
          time: "09-12",
          topic: "Workshop Introduction",
          type: "orientation",
          location: "Town Theater",
          presenters: ["Workshop Team"]
        },
        {
          date: "20th Jan",
          time: "14-17",
          topic: "Likelihood and Probability",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Michael Matschiner"]
        },
        {
          date: "20th Jan",
          time: "19-22",
          topic: "AMI Introduction & Probability Activity",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Workshop Team"]
        },
        {
          date: "21st Jan",
          time: "09-12",
          topic: "Molecular Population Genomics",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Matthew Hahn"]
        },
        {
          date: "21st Jan",
          time: "14-17",
          topic: "Population Genomics Primer I",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Workshop Team"]
        },
        {
          date: "21st Jan",
          time: "19-22",
          topic: "Population Genomics Primer II",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Workshop Team"]
        },
        {
          date: "22nd Jan",
          time: "09-12",
          topic: "Coalescent Theory",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Matthew Hahn"]
        },
        {
          date: "22nd Jan",
          time: "14-17",
          topic: "Model-based Inference of Population History",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Vitor Sousa"]
        },
        {
          date: "22nd Jan",
          time: "19-22",
          topic: "fastsimcoal2 Activity",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Vitor Sousa"]
        },
        {
          date: "23rd Jan",
          time: "09-12",
          topic: "Structural Variation",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Alex Suh"]
        },
        {
          date: "23rd Jan",
          time: "14-17",
          topic: "Structural Variation Activity",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Valentina Peona"]
        },
        {
          date: "23rd Jan",
          time: "19-22",
          topic: "Pangenomics",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Alexander Leonard"]
        },
        {
          date: "24th Jan",
          time: "09-12",
          topic: "Machine Learning",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Andrew Kern"]
        },
        {
          date: "24th Jan",
          time: "14-17",
          topic: "Machine Learning Activity",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Andrew Kern"]
        },
        {
          date: "24th Jan",
          time: "19-22",
          topic: "Experimental Design",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Joana Meier", "Workshop Team"]
        },
        {
          date: "25th Jan",
          time: "09-12",
          topic: "The Genomics of Organismal Diversification",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Walter Salzburger"]
        },
        {
          date: "25th Jan",
          time: "14-17",
          topic: "Open Lab",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Workshop Team"]
        }
      ]
    },
    {
      week: 2,
      sessions: [
        {
          date: "27th Jan",
          time: "09-12",
          topic: "Hybridisation",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Joana Meier"]
        },
        {
          date: "27th Jan",
          time: "14-17",
          topic: "D-statistics Activity",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Workshop Team"]
        },
        {
          date: "27th Jan",
          time: "19-22",
          topic: "Tree-based Introgression Detection Activity",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Workshop Team"]
        },
        {
          date: "28th Jan",
          time: "09-12",
          topic: "Combining Genomics with Experimental Studies of Adaptation",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Katie Peichel"]
        },
        {
          date: "28th Jan",
          time: "14-17",
          topic: "Detecting Positive Selection",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Magdalena Bohutínská"]
        },
        {
          date: "28th Jan",
          time: "19-22",
          topic: "Selective Sweep Identification",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Joana Meier"]
        },
        {
          date: "29th Jan",
          time: "09-12",
          topic: "Coalescent Simulation and Inference Activity 1/2",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Georgia Tsambos"]
        },
        {
          date: "29th Jan",
          time: "14-17",
          topic: "Coalescent Simulation and Inference Activity 2/2",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Georgia Tsambos"]
        },
        {
          date: "29th Jan",
          time: "19-22",
          topic: "Building Intuition into Population Genetics Fundamentals and Inference",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Martin Petr"]
        },
        {
          date: "30th Jan",
          time: "09-12",
          topic: "Conservation Genomics",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Emiliano Trucchi"]
        },
        {
          date: "30th Jan",
          time: "14-17",
          topic: "Genetic Load Activities",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Emiliano Trucchi"]
        },
        {
          date: "30th Jan",
          time: "19-22",
          topic: "Open Lab",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Workshop Team"]
        },
        {
          date: "31st Jan",
          time: "09-12",
          topic: "Ancient Genomics",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Michael Hofreiter"]
        },
        {
          date: "31st Jan",
          time: "14-17",
          topic: "Ancient Genomics Activity",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Michael Westbury"]
        }
      ]
    }
  ]
};

// Extract all unique presenters
const allPresenters = new Set();
workshop2025.weeks.forEach(week => {
  week.sessions.forEach(session => {
    session.presenters.forEach(presenter => {
      if (presenter !== "Workshop Team") {
        allPresenters.add(presenter);
      }
    });
  });
});

console.log(`📊 2025 WPSG Workshop Data Summary:`);
console.log(`- Total sessions: ${workshop2025.weeks.reduce((sum, week) => sum + week.sessions.length, 0)}`);
console.log(`- Unique presenters: ${allPresenters.size}`);
console.log(`- Workshop: ${workshop2025.workshop} ${workshop2025.year}`);
console.log(`- Location: ${workshop2025.location}\n`);

console.log(`🎯 Unique Presenters Found:`);
Array.from(allPresenters).sort().forEach(presenter => {
  console.log(`  - ${presenter}`);
});

// Save the extracted data
const outputPath = path.join(__dirname, 'data/workshops/wpsg-2025.json');
const outputDir = path.dirname(outputPath);

// Create directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(workshop2025, null, 2));
console.log(`\n💾 Saved 2025 WPSG workshop data to: ${outputPath}`);

console.log(`\n🚀 Ready for faculty enhancement processing!`);