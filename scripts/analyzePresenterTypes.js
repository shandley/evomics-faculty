/**
 * Analyze presenter types to understand filtering impact
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load workshop data
const workshopDataPath = join(__dirname, '../data/workshops/wog_2023_2025_extracted.json');
const workshopData = JSON.parse(readFileSync(workshopDataPath, 'utf8'));

const presenterAnalysis = {
  totalSessions: 0,
  individualPresenters: new Set(),
  workshopTeamSessions: 0,
  everyoneSessions: 0,
  genericSessions: 0,
  presenterCounts: {},
  sessionsByType: {
    individual: [],
    team: [],
    everyone: [],
    generic: []
  }
};

function categorizePresenter(presenter) {
  if (presenter === 'Workshop Team') return 'team';
  if (presenter === 'Everyone') return 'everyone';
  if (presenter.toLowerCase().includes('team') || presenter.toLowerCase().includes('group')) return 'generic';
  return 'individual';
}

workshopData.forEach(workshop => {
  workshop.weeks.forEach(week => {
    week.sessions.forEach(session => {
      presenterAnalysis.totalSessions++;
      
      session.presenters.forEach(presenter => {
        const type = categorizePresenter(presenter);
        
        // Count by type
        if (type === 'team') {
          presenterAnalysis.workshopTeamSessions++;
        } else if (type === 'everyone') {
          presenterAnalysis.everyoneSessions++;
        } else if (type === 'generic') {
          presenterAnalysis.genericSessions++;
        } else {
          presenterAnalysis.individualPresenters.add(presenter);
        }
        
        // Count specific presenters
        presenterAnalysis.presenterCounts[presenter] = (presenterAnalysis.presenterCounts[presenter] || 0) + 1;
        
        // Store session for analysis
        presenterAnalysis.sessionsByType[type].push({
          workshop: workshop.workshop,
          year: workshop.year,
          date: session.date,
          topic: session.topic,
          presenter: presenter,
          allPresenters: session.presenters
        });
      });
    });
  });
});

console.log('📊 Presenter Type Analysis\n');

console.log('🔢 Overall Numbers:');
console.log(`  Total Sessions: ${presenterAnalysis.totalSessions}`);
console.log(`  Individual Presenters: ${presenterAnalysis.individualPresenters.size}`);
console.log(`  Sessions with "Workshop Team": ${presenterAnalysis.workshopTeamSessions}`);
console.log(`  Sessions with "Everyone": ${presenterAnalysis.everyoneSessions}`);
console.log(`  Sessions with other generic presenters: ${presenterAnalysis.genericSessions}`);

console.log('\n🎯 What Gets Filtered Out:');
presenterAnalysis.sessionsByType.team.slice(0, 5).forEach(session => {
  console.log(`  - ${session.year} ${session.topic} (Workshop Team)`);
});

presenterAnalysis.sessionsByType.everyone.slice(0, 5).forEach(session => {
  console.log(`  - ${session.year} ${session.topic} (Everyone)`);
});

console.log('\n👤 Individual Presenter Examples:');
const individualExamples = presenterAnalysis.sessionsByType.individual.slice(0, 10);
individualExamples.forEach(session => {
  console.log(`  - ${session.presenter}: "${session.topic}" (${session.year})`);
});

console.log('\n📈 Most Frequent Presenters:');
Object.entries(presenterAnalysis.presenterCounts)
  .filter(([name]) => !['Workshop Team', 'Everyone'].includes(name))
  .sort(([,a], [,b]) => b - a)
  .slice(0, 10)
  .forEach(([name, count]) => {
    console.log(`  ${name}: ${count} sessions`);
  });

console.log('\n🔍 Generic/Team Sessions Detail:');
console.log('Workshop Team sessions:');
presenterAnalysis.sessionsByType.team.forEach(session => {
  console.log(`  ${session.year}: ${session.topic}`);
});

console.log('\nEveryone sessions:');
presenterAnalysis.sessionsByType.everyone.forEach(session => {
  console.log(`  ${session.year}: ${session.topic}`);
});

const filteringImpact = {
  totalPresentationInstances: Object.values(presenterAnalysis.presenterCounts).reduce((sum, count) => sum + count, 0),
  filteredOut: presenterAnalysis.workshopTeamSessions + presenterAnalysis.everyoneSessions + presenterAnalysis.genericSessions,
  individualPresenterInstances: Object.entries(presenterAnalysis.presenterCounts)
    .filter(([name]) => !['Workshop Team', 'Everyone'].includes(name))
    .reduce((sum, [, count]) => sum + count, 0)
};

console.log('\n📊 Filtering Impact Summary:');
console.log(`  Total presentation instances: ${filteringImpact.totalPresentationInstances}`);
console.log(`  Filtered out (generic): ${filteringImpact.filteredOut}`);
console.log(`  Individual presenter instances: ${filteringImpact.individualPresenterInstances}`);
console.log(`  Filtering rate: ${(filteringImpact.filteredOut / filteringImpact.totalPresentationInstances * 100).toFixed(1)}%`);

export { presenterAnalysis };