#!/usr/bin/env node

// Extract and process 2024 WPhylo workshop data
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Extracting 2024 Workshop on Phylogenomics Data\n');

// 2024 WPhylo Schedule Data (based on evomics.org extraction)
const workshop2024 = {
  workshop: "WPhylo",
  year: 2024,
  location: "Český Krumlov, Czech Republic",
  dates: "January 21-February 2, 2024",
  weeks: [
    {
      week: 1,
      sessions: [
        {
          date: "22nd Jan",
          time: "09-12",
          topic: "Introduction & Orientation",
          type: "orientation",
          location: "Town Theater",
          presenters: ["Anna Karnkowska"]
        },
        {
          date: "22nd Jan",
          time: "14-17",
          topic: "Lab introduction & Unix",
          type: "practical",
          location: "Municipal Theater",
          presenters: ["Gemma Martínez-Redondo", "Karin Steffen"]
        },
        {
          date: "23rd Jan",
          time: "09-12",
          topic: "Introduction to Phylogenomics",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Rosa Fernández"]
        },
        {
          date: "23rd Jan",
          time: "14-17",
          topic: "Alignment and Multiple Sequence Alignment Trimming",
          type: "practical",
          location: "Municipal Theater",
          presenters: ["Marina Marcet-Houben", "Jacob L Steenwyk"]
        },
        {
          date: "23rd Jan",
          time: "19-22",
          topic: "Tree Visualization & Tree Challenge",
          type: "practical",
          location: "Municipal Theater",
          presenters: ["Michał Karlicki", "Eduard Ocaña-Pallarès"]
        },
        {
          date: "24th Jan",
          time: "09-12",
          topic: "Introduction to Phylogenetics, Orthology and Paralogy",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Marina Marcet-Houben"]
        },
        {
          date: "24th Jan",
          time: "14-17",
          topic: "Orthology and Paralogy Prediction lab",
          type: "practical",
          location: "Municipal Theater",
          presenters: ["Marina Marcet-Houben", "Jacob L Steenwyk"]
        },
        {
          date: "24th Jan",
          time: "19-22",
          topic: "Partitioning and Concatenation Laboratory",
          type: "practical",
          location: "Municipal Theater",
          presenters: ["Jacob L Steenwyk", "Karin Steffen"]
        },
        {
          date: "25th Jan",
          time: "09-12",
          topic: "State-of-the-art methods and software in phylogenomic inference",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Olivier Gascuel"]
        },
        {
          date: "25th Jan",
          time: "14-17",
          topic: "Coalescent methods in phylogenomic inference lab",
          type: "practical",
          location: "Municipal Theater",
          presenters: ["Erin Molloy"]
        },
        {
          date: "25th Jan",
          time: "19-22",
          topic: "RAxML software and phylogenomic analyses",
          type: "practical",
          location: "Municipal Theater",
          presenters: ["Oleksiy Kozlov"]
        },
        {
          date: "26th Jan",
          time: "09-12",
          topic: "Trait evolution on trees, phenotypic and species diversification",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Hélène Morlon"]
        },
        {
          date: "26th Jan",
          time: "14-17",
          topic: "Coalescent methods lab day 2",
          type: "practical",
          location: "Municipal Theater",
          presenters: ["Erin Molloy"]
        },
        {
          date: "26th Jan",
          time: "19-22",
          topic: "Evolution and genomic basis of shared and specialized traits in mammals",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Matthew Christmas"]
        },
        {
          date: "27th Jan",
          time: "09-12",
          topic: "Phylogenetic inference in Whole Genome Duplication context",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Aoife McLysaght"]
        },
        {
          date: "27th Jan",
          time: "14-17",
          topic: "Green computing",
          type: "practical",
          location: "Municipal Theater",
          presenters: ["Oleksyi Kozlov"]
        }
      ]
    },
    {
      week: 2,
      sessions: [
        {
          date: "29th Jan",
          time: "09-12",
          topic: "Incongruence",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Antonis Rokas"]
        },
        {
          date: "29th Jan",
          time: "14-17",
          topic: "Incongruence detection lab",
          type: "practical",
          location: "Municipal Theater",
          presenters: ["Jacob Steenwyk"]
        },
        {
          date: "29th Jan",
          time: "19-22",
          topic: "Using genome-level processes to solve tricky nodes in phylogenetics",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Jordi Paps Montserrat"]
        },
        {
          date: "30th Jan",
          time: "09-12",
          topic: "Gene family evolution",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Toni Gabaldon"]
        },
        {
          date: "30th Jan",
          time: "14-17",
          topic: "Reticulate evolution, temporal resolution and custom data visualisations",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Gytis Dudas"]
        },
        {
          date: "30th Jan",
          time: "19-22",
          topic: "Open Lab: Phylobayes and BEAST",
          type: "practical",
          location: "Municipal Theater",
          presenters: ["Eduard Ocaña-Pallarès", "Gytis Dudas"]
        },
        {
          date: "31st Jan",
          time: "09-12",
          topic: "Target Capture Sequencing Approaches in Phylogenomics",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Lisa Pokorny"]
        },
        {
          date: "31st Jan",
          time: "14-17",
          topic: "Joint lecture",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Antonis Rokas", "Toni Gabaldon"]
        },
        {
          date: "31st Jan",
          time: "19-22",
          topic: "Discussion on phylogenomic pipelines & tree thinking",
          type: "discussion",
          location: "Municipal Theater",
          presenters: ["Workshop Team"]
        },
        {
          date: "1st Feb",
          time: "09-12",
          topic: "Horizontal Gene Transfer",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Gergely Szöllősi"]
        },
        {
          date: "1st Feb",
          time: "14-17",
          topic: "Horizontal Gene Transfer Lab",
          type: "practical",
          location: "Municipal Theater",
          presenters: ["Gergely Szöllősi"]
        },
        {
          date: "1st Feb",
          time: "19-22",
          topic: "Open Lab: Workshop summary & software installation",
          type: "practical",
          location: "Municipal Theater",
          presenters: ["Workshop Team"]
        },
        {
          date: "2nd Feb",
          time: "09-12",
          topic: "Unravelling complexity: Exploring the evolution of microbial eukaryotes",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Anna Karnkowska"]
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
      if (presenter !== "Workshop Team") {
        allPresenters.add(presenter);
      }
    });
  });
});

console.log(`📊 2024 WPhylo Workshop Data Summary:`);
console.log(`- Total sessions: ${workshop2024.weeks.reduce((sum, week) => sum + week.sessions.length, 0)}`);
console.log(`- Unique presenters: ${allPresenters.size}`);
console.log(`- Workshop: ${workshop2024.workshop} ${workshop2024.year}`);
console.log(`- Location: ${workshop2024.location}\n`);

console.log(`🎯 Unique Presenters Found:`);
Array.from(allPresenters).sort().forEach(presenter => {
  console.log(`  - ${presenter}`);
});

// Save the extracted data
const outputPath = path.join(__dirname, 'data/workshops/wphylo-2024.json');
const outputDir = path.dirname(outputPath);

// Create directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(workshop2024, null, 2));
console.log(`\n💾 Saved 2024 WPhylo workshop data to: ${outputPath}`);

console.log(`\n🚀 Ready for faculty enhancement processing!`);