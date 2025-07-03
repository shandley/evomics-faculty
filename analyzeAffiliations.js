import enrichedData from './src/data/facultyEnriched.json' with { type: 'json' };
import facultyData from './src/data/facultyData.json' with { type: 'json' };

let noAffiliation = [];
let hasAffiliation = [];

// Check enrichment data
for (const [id, data] of Object.entries(enrichedData)) {
  if (!data.enrichment?.professional?.affiliation) {
    noAffiliation.push(id);
  } else {
    hasAffiliation.push({
      id, 
      name: data.name,
      affiliation: data.enrichment.professional.affiliation
    });
  }
}

console.log('Faculty WITHOUT affiliation:', noAffiliation.length);
console.log('Faculty WITH affiliation:', hasAffiliation.length);
console.log('\nFaculty without affiliation:', noAffiliation);

// Check if Uppsala is being used as a default
console.log('\n\nChecking for non-Uppsala faculty that might be mapped to Uppsala:');
const nonUppsalaButMaybeInUppsala = hasAffiliation.filter(f => 
  !f.affiliation.toLowerCase().includes('uppsala')
);

console.log('Faculty with non-Uppsala affiliations:', nonUppsalaButMaybeInUppsala.length);

// Show Julia Barth's case specifically
const julia = hasAffiliation.find(f => f.id === 'barth-julia');
console.log('\nJulia Barth affiliation:', julia?.affiliation);