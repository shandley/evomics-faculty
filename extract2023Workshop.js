#!/usr/bin/env node

// Extract and process 2023 WoG workshop data
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Extracting 2023 Workshop on Genomics Data\n');

// 2023 WoG Schedule Data (based on evomics.org extraction)
const workshop2023 = {
  workshop: "WoG",
  year: 2023,
  location: "Český Krumlov, Czech Republic",
  dates: "May 14-27, 2023",
  weeks: [
    {
      week: 1,
      sessions: [
        {
          date: "15th May",
          time: "09-12",
          topic: "Introduction and Orientation",
          type: "orientation",
          location: "Town Theatre",
          presenters: ["Josie Paris", "Daniel Kintzl"]
        },
        {
          date: "15th May",
          time: "14-17",
          topic: "Sequencing Technology and Study Design",
          type: "lecture",
          location: "Town Theatre",
          presenters: ["Mike Zody"]
        },
        {
          date: "17th May",
          time: "09-12",
          topic: "Alignment",
          type: "lecture",
          location: "House of Prelate",
          presenters: ["Mike Zody"]
        },
        {
          date: "17th May",
          time: "14-17",
          topic: "Variant Calling",
          type: "lecture",
          location: "House of Prelate",
          presenters: ["Erik Garrison"]
        },
        {
          date: "17th May",
          time: "19-22",
          topic: "Structural Variants",
          type: "lecture",
          location: "House of Prelate",
          presenters: ["Fritz Sedlazeck"]
        },
        {
          date: "18th May",
          time: "09-12",
          topic: "Genome Assembly: theory and principles",
          type: "lecture",
          location: "Town Theatre",
          presenters: ["Camille Marchet", "Antoine Limasset"]
        },
        {
          date: "18th May",
          time: "14-17",
          topic: "Genome Assembly: from reads to a genome",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Marcela Uliano-Silva"]
        },
        {
          date: "18th May",
          time: "19-22",
          topic: "Genome Assembly: from reads to a genome",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Marcela Uliano-Silva"]
        },
        {
          date: "19th May",
          time: "09-12",
          topic: "Genome Annotation",
          type: "lecture",
          location: "House of Prelate",
          presenters: ["Katharina Hoff", "Natalia Nenasheva"]
        },
        {
          date: "19th May",
          time: "14-17",
          topic: "Genome Annotation",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Katharina Hoff", "Natalia Nenasheva"]
        },
        {
          date: "19th May",
          time: "19-22",
          topic: "Genomics Adventure",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Josie Paris", "Guy Leonard"]
        },
        {
          date: "20th May",
          time: "09-12",
          topic: "Pangenomics",
          type: "lecture",
          location: "Town Theatre",
          presenters: ["Erik Garrison"]
        },
        {
          date: "20th May",
          time: "14-15",
          topic: "BIG Data",
          type: "lecture",
          location: "Town Theatre",
          presenters: ["Rayan Chikhi"]
        }
      ]
    },
    {
      week: 2,
      sessions: [
        {
          date: "22nd May",
          time: "09-12",
          topic: "Comparative Genomics",
          type: "lecture",
          location: "Town Theatre",
          presenters: ["Robert Waterhouse"]
        },
        {
          date: "22nd May",
          time: "14-17",
          topic: "Comparative Genomics",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Francesco Cicconardi"]
        },
        {
          date: "23rd May",
          time: "09-12",
          topic: "Phylogenomics",
          type: "lecture",
          location: "Town Theatre",
          presenters: ["Rosa Fernández"]
        },
        {
          date: "23rd May",
          time: "14-17",
          topic: "Transcriptomics",
          type: "lecture",
          location: "Town Theatre",
          presenters: ["Brian Haas"]
        },
        {
          date: "23rd May",
          time: "19-22",
          topic: "Differential Gene Expression",
          type: "practical",
          location: "House of Prelate",
          presenters: ["Rachel Steward"]
        },
        {
          date: "24th May",
          time: "09-12",
          topic: "Genomics in the Ocean",
          type: "lecture",
          location: "Town Theatre",
          presenters: ["Sonya Dyhrman"]
        },
        {
          date: "24th May",
          time: "14-17",
          topic: "Metagenomics & Metatranscriptomics",
          type: "lecture",
          location: "House of Prelate",
          presenters: ["Paolo Manghi", "Aitor Blanco Miguez"]
        },
        {
          date: "24th May",
          time: "19-22",
          topic: "Microbiome Analysis",
          type: "practical",
          location: "House of Prelate",
          presenters: ["David Barnett"]
        },
        {
          date: "25th May",
          time: "09-12",
          topic: "Genome Structural Variation",
          type: "lecture",
          location: "Town Theatre",
          presenters: ["Evan Eichler"]
        },
        {
          date: "25th May",
          time: "14-17",
          topic: "Population Genomics",
          type: "lecture",
          location: "House of Prelate",
          presenters: ["James Whiting"]
        },
        {
          date: "25th May",
          time: "19-22",
          topic: "Best Practices in Handling Genomic Data",
          type: "lecture",
          location: "House of Prelate",
          presenters: ["Doug Scofield"]
        },
        {
          date: "26th May",
          time: "09-12",
          topic: "Lies, Damn Lies, and Genomics",
          type: "lecture",
          location: "Town Theatre",
          presenters: ["Chris Wheat"]
        }
      ]
    }
  ]
};

// Extract all unique presenters
const allPresenters = new Set();
workshop2023.weeks.forEach(week => {
  week.sessions.forEach(session => {
    session.presenters.forEach(presenter => {
      if (presenter !== "Workshop Team" && presenter !== "Everyone") {
        allPresenters.add(presenter);
      }
    });
  });
});

console.log(`📊 2023 Workshop Data Summary:`);
console.log(`- Total sessions: ${workshop2023.weeks.reduce((sum, week) => sum + week.sessions.length, 0)}`);
console.log(`- Unique presenters: ${allPresenters.size}`);
console.log(`- Workshop: ${workshop2023.workshop} ${workshop2023.year}`);
console.log(`- Location: ${workshop2023.location}\n`);

console.log(`🎯 Unique Presenters Found:`);
Array.from(allPresenters).sort().forEach(presenter => {
  console.log(`  - ${presenter}`);
});

// Save the extracted data
const outputPath = path.join(__dirname, 'data/workshops/wog-2023.json');
const outputDir = path.dirname(outputPath);

// Create directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(workshop2023, null, 2));
console.log(`\n💾 Saved 2023 workshop data to: ${outputPath}`);

console.log(`\n🚀 Ready for faculty enhancement processing!`);