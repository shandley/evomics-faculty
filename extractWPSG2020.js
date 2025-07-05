#!/usr/bin/env node

// Extract and process 2020 WPSG workshop data
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Extracting 2020 Workshop on Population & Speciation Genomics Data\n');

// 2020 WPSG Schedule Data (based on evomics.org extraction)
const workshop2020 = {
  workshop: "WPSG",
  year: 2020,
  location: "Český Krumlov, Czech Republic",
  dates: "January 19 - February 1, 2020",
  weeks: [
    {
      week: 1,
      sessions: [
        {
          date: "20th Jan",
          time: "09-12",
          topic: "Introduction and orientation",
          type: "orientation",
          location: "Town Theater",
          presenters: ["Workshop Team"]
        },
        {
          date: "20th Jan",
          time: "14-17",
          topic: "Computer lab / UNIX introduction",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Workshop Team"]
        },
        {
          date: "21st Jan",
          time: "09-12",
          topic: "Likelihood, probability, and Bayesian inference",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Alex Buerkle"]
        },
        {
          date: "21st Jan",
          time: "14-17",
          topic: "Probability in population genomics activity",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Workshop Team"]
        },
        {
          date: "21st Jan",
          time: "19-22",
          topic: "First steps in genomic data analysis",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Workshop Team"]
        },
        {
          date: "22nd Jan",
          time: "09-12",
          topic: "The genomics of organismal diversification",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Walter Salzburger"]
        },
        {
          date: "22nd Jan",
          time: "14-17",
          topic: "Demographic analysis with fastsimcoal2",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Vítor Sousa"]
        },
        {
          date: "22nd Jan",
          time: "19-22",
          topic: "Fastsimcoal2 activity",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Vítor Sousa"]
        },
        {
          date: "23rd Jan",
          time: "09-12",
          topic: "Adaptation and selection",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Rachael Dudaniec"]
        },
        {
          date: "23rd Jan",
          time: "14-17",
          topic: "Environmental selection detection activity",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Workshop Team"]
        },
        {
          date: "23rd Jan",
          time: "19-22",
          topic: "Predicting evolution",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Patrik Nosil"]
        },
        {
          date: "24th Jan",
          time: "09-12",
          topic: "The coalescent",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Leo Speidel", "Simon Myers"]
        },
        {
          date: "24th Jan",
          time: "14-17",
          topic: "Genome-wide genealogy inference activity",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Leo Speidel", "Simon Myers"]
        },
        {
          date: "24th Jan",
          time: "19-22",
          topic: "Experimental design / Demography",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Richard Durbin"]
        },
        {
          date: "25th Jan",
          time: "09-12",
          topic: "Evolution of the mutation spectrum",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Kelley Harris"]
        },
        {
          date: "25th Jan",
          time: "14-17",
          topic: "Mutation spectrum inference activity",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Kelley Harris"]
        }
      ]
    },
    {
      week: 2,
      sessions: [
        {
          date: "27th Jan",
          time: "09-12",
          topic: "Population structure",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Daniel Falush"]
        },
        {
          date: "27th Jan",
          time: "14-17",
          topic: "Population structure analysis",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Daniel Falush"]
        },
        {
          date: "27th Jan",
          time: "19-22",
          topic: "Population structure continued",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Daniel Falush"]
        },
        {
          date: "28th Jan",
          time: "09-12",
          topic: "Multi-species coalescent",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Lacey Knowles"]
        },
        {
          date: "28th Jan",
          time: "14-17",
          topic: "Multi-species coalescent analysis",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Lacey Knowles"]
        },
        {
          date: "28th Jan",
          time: "19-22",
          topic: "Multi-species coalescent continued",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Lacey Knowles"]
        },
        {
          date: "29th Jan",
          time: "09-12",
          topic: "Speciation and hybridization",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Simon Martin"]
        },
        {
          date: "29th Jan",
          time: "14-17",
          topic: "Hybridization analysis",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Simon Martin"]
        },
        {
          date: "29th Jan",
          time: "19-22",
          topic: "Hybridization continued",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Simon Martin"]
        },
        {
          date: "30th Jan",
          time: "09-12",
          topic: "Genome-Wide Association Studies",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Magnus Nordborg"]
        },
        {
          date: "30th Jan",
          time: "14-17",
          topic: "GWAS analysis",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Magnus Nordborg"]
        },
        {
          date: "30th Jan",
          time: "19-22",
          topic: "GWAS continued",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Magnus Nordborg"]
        },
        {
          date: "31st Jan",
          time: "09-12",
          topic: "Ancient genomics",
          type: "lecture",
          location: "Town Theater",
          presenters: ["Ludovic Orlando"]
        },
        {
          date: "31st Jan",
          time: "14-17",
          topic: "Ancient genomics analysis",
          type: "practical",
          location: "Egon Schiele Art Center",
          presenters: ["Ludovic Orlando"]
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

console.log(`📊 2020 WPSG Workshop Data Summary:`);
console.log(`- Total sessions: ${workshop2020.weeks.reduce((sum, week) => sum + week.sessions.length, 0)}`);
console.log(`- Unique presenters: ${allPresenters.size}`);
console.log(`- Workshop: ${workshop2020.workshop} ${workshop2020.year}`);
console.log(`- Location: ${workshop2020.location}\n`);

console.log(`🎯 Unique Presenters Found:`);
Array.from(allPresenters).sort().forEach(presenter => {
  console.log(`  - ${presenter}`);
});

// Save the extracted data
const outputPath = path.join(__dirname, 'data/workshops/wpsg-2020.json');
const outputDir = path.dirname(outputPath);

// Create directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(workshop2020, null, 2));
console.log(`\n💾 Saved 2020 WPSG workshop data to: ${outputPath}`);

console.log(`\n🚀 Ready for faculty enhancement processing!`);