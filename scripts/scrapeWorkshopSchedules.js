/**
 * Comprehensive Workshop Schedule Scraper
 * Uses Puppeteer to extract workshop schedules from evomics.org
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Workshop URLs to scrape (can be expanded)
const workshopUrls = [
  {
    workshop: 'WoG',
    fullName: 'Workshop on Genomics',
    urls: [
      { year: 2025, url: 'https://evomics.org/2025-workshop-on-genomics/' },
      { year: 2024, url: 'https://evomics.org/2024-workshop-on-genomics/' },
      { year: 2023, url: 'https://evomics.org/2023-workshop-on-genomics/' },
      // Add more years as needed
    ]
  },
  {
    workshop: 'WPSG', 
    fullName: 'Workshop on Population and Speciation Genomics',
    urls: [
      { year: 2025, url: 'https://evomics.org/2025-workshop-on-population-and-speciation-genomics/' },
      // Add more years as needed
    ]
  },
  {
    workshop: 'WPhylo',
    fullName: 'Workshop on Phylogenomics', 
    urls: [
      { year: 2025, url: 'https://evomics.org/2025-workshop-on-phylogenomics/' },
      // Add more years as needed
    ]
  }
];

class WorkshopScheduleScraper {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    
    // Set user agent to avoid blocking
    await this.page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
  }

  async scrapeWorkshopPage(url, workshop, year) {
    console.log(`Scraping ${workshop} ${year}: ${url}`);
    
    try {
      await this.page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      
      // Extract workshop metadata
      const metadata = await this.page.evaluate(() => {
        const title = document.querySelector('h1, .entry-title')?.textContent?.trim() || '';
        const content = document.querySelector('.entry-content, .post-content, main')?.textContent || '';
        
        // Try to extract location and dates from content
        const locationMatch = content.match(/location[:\s]+([^.]+)/i);
        const dateMatch = content.match(/(\d{1,2}[-–]\d{1,2}\s+\w+\s+\d{4})/);
        
        return {
          title,
          location: locationMatch ? locationMatch[1].trim() : null,
          dates: dateMatch ? dateMatch[1].trim() : null
        };
      });

      // Extract schedule tables - handle multiple tables for multi-week workshops
      const scheduleData = await this.page.evaluate(() => {
        const tables = Array.from(document.querySelectorAll('table'));
        const scheduleTables = tables.filter(table => {
          const text = table.textContent.toLowerCase();
          return text.includes('date') || text.includes('time') || text.includes('presenter');
        });
        
        if (scheduleTables.length === 0) return null;

        const allSessions = [];
        let currentWeek = 1;
        
        scheduleTables.forEach((table, tableIndex) => {
          // Try to identify week from surrounding text
          const prevElement = table.previousElementSibling;
          const weekText = prevElement?.textContent || '';
          const weekMatch = weekText.match(/week\s*(\d+)/i);
          if (weekMatch) {
            currentWeek = parseInt(weekMatch[1]);
          }
          
          const rows = Array.from(table.querySelectorAll('tr'));
          
          rows.forEach((row, index) => {
            const cells = Array.from(row.querySelectorAll('td, th'));
            if (cells.length >= 4 && index > 0) { // Skip header row
              const [dateCell, dayCell, timeCell, presenterCell, topicCell, locationCell] = cells;
              
              if (dateCell && timeCell && presenterCell && topicCell) {
                allSessions.push({
                  week: currentWeek,
                  date: dateCell.textContent?.trim() || '',
                  day: dayCell?.textContent?.trim() || '',
                  time: timeCell.textContent?.trim() || '',
                  presenters: presenterCell.textContent?.trim() || '',
                  topic: topicCell.textContent?.trim() || '',
                  location: locationCell?.textContent?.trim() || ''
                });
              }
            }
          });
          
          // Increment week for next table if no explicit week found
          if (!weekMatch && tableIndex < scheduleTables.length - 1) {
            currentWeek++;
          }
        });
        
        return allSessions;
      });

      if (!scheduleData || scheduleData.length === 0) {
        console.log(`No schedule table found for ${workshop} ${year}`);
        return null;
      }

      // Process and structure the data by weeks
      const sessionsByWeek = {};
      
      scheduleData.forEach(session => {
        const week = session.week || 1;
        if (!sessionsByWeek[week]) {
          sessionsByWeek[week] = [];
        }
        
        if (session.date && session.time) { // Filter out empty rows
          sessionsByWeek[week].push({
            date: session.date,
            day: session.day,
            time: session.time,
            presenters: this.parsePresenters(session.presenters),
            topic: session.topic,
            location: session.location,
            type: this.categorizeSession(session.topic, session.time)
          });
        }
      });

      // Convert to weeks array format
      const weeks = Object.entries(sessionsByWeek).map(([weekNum, sessions]) => ({
        week: parseInt(weekNum),
        sessions: sessions
      })).sort((a, b) => a.week - b.week);

      return {
        workshop,
        year,
        fullName: metadata.title,
        location: metadata.location,
        dates: metadata.dates,
        weeks: weeks,
        totalSessions: scheduleData.length,
        scrapedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error(`Error scraping ${workshop} ${year}:`, error.message);
      return null;
    }
  }

  parsePresenters(presenterText) {
    if (!presenterText) return [];
    
    // Handle multiple presenters separated by &, and, or ,
    return presenterText
      .split(/[&,]|(?:\s+and\s+)/)
      .map(name => name.trim())
      .filter(name => name.length > 0)
      .map(name => this.normalizePresenterName(name));
  }

  normalizePresenterName(name) {
    return name
      .replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s+/i, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  categorizeSession(topic, time) {
    const topicLower = topic.toLowerCase();
    
    if (topicLower.includes('reception') || topicLower.includes('dinner') || topicLower.includes('tour')) {
      return 'social';
    }
    if (topicLower.includes('lab') || topicLower.includes('practical')) {
      return 'practical';
    }
    if (topicLower.includes('introduction') && topicLower.includes('orientation')) {
      return 'orientation';
    }
    if (topicLower.includes('free')) {
      return 'free';
    }
    
    return 'lecture';
  }

  async scrapeAllWorkshops() {
    const allWorkshopData = [];
    
    for (const workshopGroup of workshopUrls) {
      for (const workshopYear of workshopGroup.urls) {
        const data = await this.scrapeWorkshopPage(
          workshopYear.url, 
          workshopGroup.workshop, 
          workshopYear.year
        );
        
        if (data) {
          allWorkshopData.push(data);
        }
        
        // Add delay between requests to be respectful
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    return allWorkshopData;
  }

  async generateFacultyTeachingData(workshopData) {
    const facultyTeaching = {};
    
    workshopData.forEach(workshop => {
      workshop.sessions.forEach(session => {
        session.presenters.forEach(presenter => {
          if (presenter !== 'Everyone' && presenter !== 'Workshop Team') {
            if (!facultyTeaching[presenter]) {
              facultyTeaching[presenter] = {
                name: presenter,
                totalSessions: 0,
                workshops: {},
                sessions: []
              };
            }
            
            facultyTeaching[presenter].totalSessions++;
            
            if (!facultyTeaching[presenter].workshops[workshop.workshop]) {
              facultyTeaching[presenter].workshops[workshop.workshop] = [];
            }
            
            if (!facultyTeaching[presenter].workshops[workshop.workshop].includes(workshop.year)) {
              facultyTeaching[presenter].workshops[workshop.workshop].push(workshop.year);
            }
            
            facultyTeaching[presenter].sessions.push({
              workshop: workshop.workshop,
              year: workshop.year,
              date: session.date,
              time: session.time,
              topic: session.topic,
              type: session.type,
              location: session.location
            });
          }
        });
      });
    });
    
    return facultyTeaching;
  }

  async saveData(workshopData, facultyData) {
    const outputDir = path.join(__dirname, '../data/workshops');
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Save workshop schedules
    fs.writeFileSync(
      path.join(outputDir, 'workshopSchedules.json'),
      JSON.stringify(workshopData, null, 2)
    );
    
    // Save faculty teaching data
    fs.writeFileSync(
      path.join(outputDir, 'facultyTeaching.json'), 
      JSON.stringify(facultyData, null, 2)
    );
    
    console.log(`Saved data to ${outputDir}`);
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Main execution function
async function main() {
  const scraper = new WorkshopScheduleScraper();
  
  try {
    await scraper.initialize();
    console.log('Starting workshop schedule scraping...');
    
    const workshopData = await scraper.scrapeAllWorkshops();
    console.log(`Scraped ${workshopData.length} workshops`);
    
    const facultyData = await scraper.generateFacultyTeachingData(workshopData);
    console.log(`Generated teaching data for ${Object.keys(facultyData).length} faculty`);
    
    await scraper.saveData(workshopData, facultyData);
    
  } catch (error) {
    console.error('Scraping failed:', error);
  } finally {
    await scraper.close();
  }
}

// Export for use as module
module.exports = { WorkshopScheduleScraper };

// Run if called directly
if (require.main === module) {
  main();
}