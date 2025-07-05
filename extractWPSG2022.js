#!/usr/bin/env node

// Extract and process 2022 WPSG workshop data
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Extracting 2022 Workshop on Population & Speciation Genomics Data\n');

// 2022 WPSG Schedule Data (based on evomics.org extraction)
const workshop2022 = {
  workshop: "WPSG",
  year: 2022,
  location: "Český Krumlov, Czech Republic",
  dates: "June 5-18, 2022",
  weeks: [
    {
      week: 1,
      sessions: [
        {
          date: "5th Jun",
          time: "14-17",
          topic: "UNIX primer",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Workshop Team"]
        },
        {
          date: "6th Jun",
          time: "09-12",
          topic: "Workshop introduction",
          type: "orientation",
          location: "Town Theater",
          presenters: ["Workshop Team"]
        },
        {
          date: "6th Jun",
          time: "14-17",
          topic: "Likelihood and probability",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Michael Matschiner"]
        },
        {
          date: "6th Jun",
          time: "19-22",
          topic: "AMI/Jupyter tutorial & Probability activity",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Workshop Team"]
        },
        {
          date: "7th Jun",
          time: "09-12",
          topic: "Population genomics",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Rasmus Nielsen"]
        },
        {
          date: "7th Jun",
          time: "14-17",
          topic: "ANGSD activity",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Rasmus Nielsen", "Thorfinn Korneliussen"]
        },
        {
          date: "8th Jun",
          time: "09-12",
          topic: "Coalescent theory and introgression",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Matthew Hahn"]
        },
        {
          date: "8th Jun",
          time: "14-17",
          topic: "Multiple testing",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Matthew Hahn"]
        },
        {
          date: "8th Jun",
          time: "19-22",
          topic: "D-statistics activity",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Workshop Team"]
        },
        {
          date: "9th Jun",
          time: "09-12",
          topic: "Model-based inference of population history",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Vitor Sousa"]
        },
        {
          date: "9th Jun",
          time: "14-17",
          topic: "fastsimcoal2 activity",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Vitor Sousa"]
        },
        {
          date: "9th Jun",
          time: "19-22",
          topic: "Species tree inference activity",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Workshop Team"]
        },
        {
          date: "10th Jun",
          time: "09-12",
          topic: "Selection and adaptation",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Leonie Moyle"]
        }
      ]
    },
    {
      week: 2,
      sessions: [
        {
          date: "13th Jun",
          time: "09-12",
          topic: "Speciation with gene flow",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Chris Jiggins"]
        },
        {
          date: "13th Jun",
          time: "14-17",
          topic: "Structural variation",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Alexander Suh"]
        },
        {
          date: "13th Jun",
          time: "19-22",
          topic: "Structural variation activity",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Valentina Peona"]
        },
        {
          date: "14th Jun",
          time: "09-12",
          topic: "Machine Learning",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Matteo Fumagalli", "Flora Jay"]
        },
        {
          date: "14th Jun",
          time: "14-17",
          topic: "Selection inference ML activity",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Matteo Fumagalli"]
        },
        {
          date: "14th Jun",
          time: "19-22",
          topic: "Demography inference ML activity",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Flora Jay"]
        },
        {
          date: "15th Jun",
          time: "09-12",
          topic: "Tree sequences",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Simon Myers"]
        },
        {
          date: "15th Jun",
          time: "14-17",
          topic: "Relate activity",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Simon Myers", "Jasmin Rees", "Leo Speidel"]
        },
        {
          date: "15th Jun",
          time: "19-22",
          topic: "Open lab",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Workshop Team"]
        },
        {
          date: "16th Jun",
          time: "09-12",
          topic: "Simulation",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Georgia Tsambos"]
        },
        {
          date: "16th Jun",
          time: "14-17",
          topic: "Simulation with msprime activity",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Georgia Tsambos"]
        },
        {
          date: "16th Jun",
          time: "19-22",
          topic: "Inference with tsinfer activity",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Georgia Tsambos"]
        },
        {
          date: "17th Jun",
          time: "09-12",
          topic: "Ancient genomics",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Fabrizio Mafessoni"]
        },
        {
          date: "17th Jun",
          time: "14-17",
          topic: "Wrap-up",
          type: "discussion",
          location: "Town Theater",
          presenters: ["Workshop Team"]
        }
      ]
    }
  ]
};

// Extract all unique presenters
const allPresenters = new Set();
workshop2022.weeks.forEach(week => {
  week.sessions.forEach(session => {
    session.presenters.forEach(presenter => {
      if (presenter !== "Workshop Team") {
        allPresenters.add(presenter);
      }
    });
  });
});

console.log(`📊 2022 WPSG Workshop Data Summary:`);
console.log(`- Total sessions: ${workshop2022.weeks.reduce((sum, week) => sum + week.sessions.length, 0)}`);
console.log(`- Unique presenters: ${allPresenters.size}`);
console.log(`- Workshop: ${workshop2022.workshop} ${workshop2022.year}`);
console.log(`- Location: ${workshop2022.location}\n`);

console.log(`🎯 Unique Presenters Found:`);
Array.from(allPresenters).sort().forEach(presenter => {
  console.log(`  - ${presenter}`);
});

// Save the extracted data
const outputPath = path.join(__dirname, 'data/workshops/wpsg-2022.json');
const outputDir = path.dirname(outputPath);

// Create directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(workshop2022, null, 2));
console.log(`\n💾 Saved 2022 WPSG workshop data to: ${outputPath}`);

console.log(`\n🚀 Ready for faculty enhancement processing!`);