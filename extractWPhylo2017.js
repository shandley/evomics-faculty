#!/usr/bin/env node

// Extract and process 2017 WPhylo workshop data
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Extracting 2017 Workshop on Phylogenomics Data\n');

// 2017 WPhylo Schedule Data (based on evomics.org extraction)
const workshop2017 = {
  workshop: "WPhylo",
  year: 2017,
  location: "Český Krumlov, Czech Republic",
  dates: "January 22-February 4, 2017",
  weeks: [
    {
      week: 1,
      sessions: [
        {
          date: "22nd Jan",
          time: "09-12",
          topic: "Introduction and Orientation",
          type: "orientation",
          location: "Town Theater",
          presenters: ["Scott Handley", "Toni Gabaldón"]
        },
        {
          date: "22nd Jan",
          time: "14-17",
          topic: "UNIX Introduction",
          type: "practical",
          location: "Municipal Theater",
          presenters: ["Guy Leonard", "Jordi Paps"]
        },
        {
          date: "23rd Jan",
          time: "09-12",
          topic: "Introduction to Phylogenetic Inference",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Toni Gabaldón"]
        },
        {
          date: "23rd Jan",
          time: "14-17",
          topic: "Orthology and Paralogy",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Toni Gabaldón"]
        },
        {
          date: "23rd Jan",
          time: "19-22",
          topic: "Orthology Detection Lab",
          type: "practical",
          location: "Municipal Theater",
          presenters: ["Toni Gabaldón"]
        },
        {
          date: "24th Jan",
          time: "09-12",
          topic: "Introduction to Phylogenomics",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Antonis Rokas"]
        },
        {
          date: "24th Jan",
          time: "14-17",
          topic: "Alignment and Trimming Lab",
          type: "practical",
          location: "Municipal Theater",
          presenters: ["Workshop Instructors"]
        },
        {
          date: "24th Jan",
          time: "19-22",
          topic: "Alignment Concatenation Lab",
          type: "practical",
          location: "Municipal Theater",
          presenters: ["Workshop Instructors"]
        },
        {
          date: "25th Jan",
          time: "09-12",
          topic: "Fast Phylogenetic Approaches",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Xiaofan Zhou"]
        },
        {
          date: "25th Jan",
          time: "14-17",
          topic: "Maximum Likelihood Lab",
          type: "practical",
          location: "Municipal Theater",
          presenters: ["Xiaofan Zhou"]
        },
        {
          date: "25th Jan",
          time: "19-22",
          topic: "Maximum Likelihood Tools Lab",
          type: "practical",
          location: "Municipal Theater",
          presenters: ["Workshop Instructors"]
        },
        {
          date: "26th Jan",
          time: "09-12",
          topic: "Bayesian Phylogenetic Inference",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Tracy Heath"]
        },
        {
          date: "26th Jan",
          time: "14-17",
          topic: "Bayesian Phylogenetic Inference Lab",
          type: "practical",
          location: "Municipal Theater",
          presenters: ["Tracy Heath"]
        },
        {
          date: "26th Jan",
          time: "19-22",
          topic: "Divergence Time Estimation",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Tracy Heath"]
        },
        {
          date: "27th Jan",
          time: "09-12",
          topic: "Hypothesis Testing in Phylogenetics",
          type: "lecture",
          location: "Town Theater",
          presenters: ["David Swofford"]
        },
        {
          date: "27th Jan",
          time: "14-17",
          topic: "Model Selection Lab",
          type: "practical",
          location: "Municipal Theater",
          presenters: ["David Swofford"]
        }
      ]
    },
    {
      week: 2,
      sessions: [
        {
          date: "30th Jan",
          time: "09-12",
          topic: "Detecting Selection",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Joe Bielawski"]
        },
        {
          date: "30th Jan",
          time: "14-17",
          topic: "Detecting Selection Lab",
          type: "practical",
          location: "Municipal Theater",
          presenters: ["Joe Bielawski"]
        },
        {
          date: "30th Jan",
          time: "19-22",
          topic: "Techniques for Generating Phylogenomic Data Matrices",
          type: "practical",
          location: "Municipal Theater",
          presenters: ["Workshop Instructors"]
        },
        {
          date: "31st Jan",
          time: "09-12",
          topic: "Species Tree Estimation",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Laura Kubatko"]
        },
        {
          date: "31st Jan",
          time: "14-17",
          topic: "SVDquartets Lab",
          type: "practical",
          location: "Municipal Theater",
          presenters: ["Laura Kubatko"]
        },
        {
          date: "31st Jan",
          time: "19-22",
          topic: "Tree Editing and Visualization / Open Lab",
          type: "practical",
          location: "Municipal Theater",
          presenters: ["Workshop Instructors"]
        },
        {
          date: "1st Feb",
          time: "09-12",
          topic: "Analysis of Gene Gain and Loss",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Matthew Hahn"]
        },
        {
          date: "1st Feb",
          time: "14-17",
          topic: "CAFE Lab",
          type: "practical",
          location: "Municipal Theater",
          presenters: ["Matthew Hahn"]
        },
        {
          date: "1st Feb",
          time: "19-22",
          topic: "CAFE Lab cont. / Open Lab",
          type: "practical",
          location: "Municipal Theater",
          presenters: ["Matthew Hahn"]
        },
        {
          date: "2nd Feb",
          time: "09-12",
          topic: "Non-Vertical Evolution and Phylogenetic Networks",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Céline Scornavacca"]
        },
        {
          date: "2nd Feb",
          time: "14-17",
          topic: "Non-Vertical Evolution Lab",
          type: "practical",
          location: "Municipal Theater",
          presenters: ["Céline Scornavacca"]
        },
        {
          date: "2nd Feb",
          time: "19-22",
          topic: "Open Lab",
          type: "practical",
          location: "Municipal Theater",
          presenters: ["Workshop Instructors"]
        },
        {
          date: "3rd Feb",
          time: "09-12",
          topic: "LBA & Animal Nightmares / Open Lab",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Jordi Paps Montserrat"]
        },
        {
          date: "3rd Feb",
          time: "14-17",
          topic: "Downloading data / Final Open Lab",
          type: "practical",
          location: "Municipal Theater",
          presenters: ["Jordi Paps Montserrat"]
        }
      ]
    }
  ]
};

// Extract all unique presenters
const allPresenters = new Set();
workshop2017.weeks.forEach(week => {
  week.sessions.forEach(session => {
    session.presenters.forEach(presenter => {
      if (presenter !== "Workshop Team" && presenter !== "Workshop Instructors") {
        allPresenters.add(presenter);
      }
    });
  });
});

console.log(`📊 2017 WPhylo Workshop Data Summary:`);
console.log(`- Total sessions: ${workshop2017.weeks.reduce((sum, week) => sum + week.sessions.length, 0)}`);
console.log(`- Unique presenters: ${allPresenters.size}`);
console.log(`- Workshop: ${workshop2017.workshop} ${workshop2017.year}`);
console.log(`- Location: ${workshop2017.location}\n`);

console.log(`🎯 Unique Presenters Found:`);
Array.from(allPresenters).sort().forEach(presenter => {
  console.log(`  - ${presenter}`);
});

// Save the extracted data
const outputPath = path.join(__dirname, 'data/workshops/wphylo-2017.json');
const outputDir = path.dirname(outputPath);

// Create directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(workshop2017, null, 2));
console.log(`\n💾 Saved 2017 WPhylo workshop data to: ${outputPath}`);

console.log(`\n🚀 Ready for faculty enhancement processing!`);