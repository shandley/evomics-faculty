#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

class LinkChecker {
  constructor() {
    this.results = [];
    this.facultyData = null;
    this.enrichedData = null;
  }

  loadData() {
    try {
      // Load faculty data
      const facultyPath = path.join(__dirname, '../src/data/facultyData.json');
      const facultyJson = JSON.parse(fs.readFileSync(facultyPath, 'utf8'));
      this.facultyData = facultyJson.faculty || facultyJson; // Handle both formats
      
      // Load enriched data
      const enrichedPath = path.join(__dirname, '../src/data/facultyEnriched.json');
      this.enrichedData = JSON.parse(fs.readFileSync(enrichedPath, 'utf8'));
      
      console.log('✅ Data files loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load data files:', error.message);
      throw error;
    }
  }

  async checkUrl(url, timeout = 10000) {
    return new Promise((resolve) => {
      if (!url || typeof url !== 'string') {
        resolve({
          status: 'broken',
          statusCode: null,
          error: 'Invalid URL'
        });
        return;
      }

      // Basic URL validation
      try {
        new URL(url);
      } catch (error) {
        resolve({
          status: 'broken',
          statusCode: null,
          error: 'Malformed URL'
        });
        return;
      }

      const client = url.startsWith('https:') ? https : http;
      const timeoutId = setTimeout(() => {
        resolve({
          status: 'broken',
          statusCode: null,
          error: 'Timeout'
        });
      }, timeout);

      const request = client.get(url, {
        headers: {
          'User-Agent': 'Evomics-Faculty-Link-Checker/1.0'
        }
      }, (response) => {
        clearTimeout(timeoutId);
        
        const statusCode = response.statusCode;
        
        if (statusCode >= 200 && statusCode < 400) {
          resolve({
            status: 'working',
            statusCode,
            error: null
          });
        } else if (statusCode >= 400) {
          resolve({
            status: 'broken',
            statusCode,
            error: `HTTP ${statusCode}`
          });
        } else {
          resolve({
            status: 'warning',
            statusCode,
            error: `Unexpected status ${statusCode}`
          });
        }
      });

      request.on('error', (error) => {
        clearTimeout(timeoutId);
        resolve({
          status: 'broken',
          statusCode: null,
          error: error.message
        });
      });

      request.setTimeout(timeout, () => {
        clearTimeout(timeoutId);
        request.destroy();
        resolve({
          status: 'broken',
          statusCode: null,
          error: 'Request timeout'
        });
      });
    });
  }

  async checkFacultyLinks() {
    console.log('🔍 Checking faculty website links...');
    
    const promises = this.facultyData.map(async (faculty) => {
      const links = [];
      
      // Check main website
      if (faculty.website) {
        const result = await this.checkUrl(faculty.website);
        links.push({
          type: 'website',
          url: faculty.website,
          facultyId: faculty.id,
          facultyName: `${faculty.firstName} ${faculty.lastName}`,
          ...result
        });
      }
      
      // Check enriched data links
      const enriched = this.enrichedData[faculty.id];
      if (enriched?.enrichment?.professional?.labWebsite) {
        const result = await this.checkUrl(enriched.enrichment.professional.labWebsite);
        links.push({
          type: 'lab_website',
          url: enriched.enrichment.professional.labWebsite,
          facultyId: faculty.id,
          facultyName: `${faculty.firstName} ${faculty.lastName}`,
          ...result
        });
      }
      
      return links;
    });
    
    const allResults = await Promise.all(promises);
    return allResults.flat();
  }

  async checkOrcidLinks() {
    console.log('🔍 Checking ORCID links...');
    
    const orcidPromises = this.facultyData.map(async (faculty) => {
      const orcidLinks = [];
      
      // Check main ORCID
      if (faculty.orcid) {
        const orcidUrl = `https://orcid.org/${faculty.orcid}`;
        const result = await this.checkUrl(orcidUrl);
        orcidLinks.push({
          type: 'orcid',
          url: orcidUrl,
          facultyId: faculty.id,
          facultyName: `${faculty.firstName} ${faculty.lastName}`,
          ...result
        });
      }
      
      // Check enriched ORCID
      const enriched = this.enrichedData[faculty.id];
      if (enriched?.enrichment?.academic?.orcid && enriched.enrichment.academic.orcid !== faculty.orcid) {
        const orcidUrl = `https://orcid.org/${enriched.enrichment.academic.orcid}`;
        const result = await this.checkUrl(orcidUrl);
        orcidLinks.push({
          type: 'orcid_enriched',
          url: orcidUrl,
          facultyId: faculty.id,
          facultyName: `${faculty.firstName} ${faculty.lastName}`,
          ...result
        });
      }
      
      return orcidLinks;
    });
    
    const allOrcidResults = await Promise.all(orcidPromises);
    return allOrcidResults.flat();
  }

  async checkInstitutionalLinks() {
    console.log('🔍 Checking institutional affiliation links...');
    
    // This could be expanded to check institutional pages
    // For now, we'll focus on explicitly provided URLs
    const institutionalLinks = [];
    
    // Check for any institutional URLs in enrichment data
    for (const [facultyId, data] of Object.entries(this.enrichedData)) {
      if (data.enrichment?.profile?.source) {
        const faculty = this.facultyData.find(f => f.id === facultyId);
        if (faculty && this.isValidUrl(data.enrichment.profile.source)) {
          const result = await this.checkUrl(data.enrichment.profile.source);
          institutionalLinks.push({
            type: 'profile_source',
            url: data.enrichment.profile.source,
            facultyId,
            facultyName: `${faculty.firstName} ${faculty.lastName}`,
            ...result
          });
        }
      }
    }
    
    return institutionalLinks;
  }

  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  async checkAllLinks() {
    console.log('🚀 Starting link checking process...');
    
    this.loadData();
    
    // Check all types of links
    const facultyLinks = await this.checkFacultyLinks();
    const orcidLinks = await this.checkOrcidLinks();
    const institutionalLinks = await this.checkInstitutionalLinks();
    
    this.results = [...facultyLinks, ...orcidLinks, ...institutionalLinks];
    
    // Generate summary
    const summary = this.generateSummary();
    
    console.log(`\n📊 Link Check Results:`);
    console.log(`   Total links checked: ${summary.totalLinks}`);
    console.log(`   Working links: ${summary.workingLinks}`);
    console.log(`   Broken links: ${summary.brokenLinks}`);
    console.log(`   Success rate: ${summary.successRate}%`);
    
    if (summary.brokenLinks > 0) {
      console.log(`\n❌ Broken links found:`);
      const brokenLinks = this.results.filter(r => r.status === 'broken');
      brokenLinks.slice(0, 5).forEach(link => {
        console.log(`   - ${link.type}: ${link.facultyName} - ${link.url} (${link.error})`);
      });
      if (brokenLinks.length > 5) {
        console.log(`   ... and ${brokenLinks.length - 5} more`);
      }
    }
    
    return {
      links: this.results,
      summary
    };
  }

  generateSummary() {
    const totalLinks = this.results.length;
    const workingLinks = this.results.filter(r => r.status === 'working').length;
    const brokenLinks = this.results.filter(r => r.status === 'broken').length;
    const warningLinks = this.results.filter(r => r.status === 'warning').length;
    
    return {
      totalLinks,
      workingLinks,
      brokenLinks,
      warningLinks,
      successRate: totalLinks > 0 ? Math.round((workingLinks / totalLinks) * 100) : 0,
      timestamp: new Date().toISOString()
    };
  }
}

// Run if called directly
if (require.main === module) {
  const checker = new LinkChecker();
  checker.checkAllLinks()
    .then(result => {
      if (result.summary.brokenLinks > 0) {
        console.log('\n⚠️  Some links are broken');
        process.exit(1);
      } else {
        console.log('\n✅ All links are working');
        process.exit(0);
      }
    })
    .catch(error => {
      console.error('💥 Link checking error:', error.message);
      process.exit(1);
    });
}

module.exports = LinkChecker;