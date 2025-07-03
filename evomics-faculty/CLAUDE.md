# Evomics Faculty Alumni Page

## Project Overview
Interactive web application to showcase faculty alumni from Evomics workshops, successfully deployed with data from three workshops and designed to scale to include all workshop series.

## Current Development Phase
**Phase 2B: Enhanced Features ✅ COMPLETED**
**Status: Production with Faculty Self-Service Updates** - https://shandley.github.io/evomics-faculty/

### Achieved Goals - Phase 1
- ✅ Interactive faculty directory with card-based UI
- ✅ Search, sorting and filtering capabilities
- ✅ Multi-workshop support (3 workshops integrated)
- ✅ Deployed as iframe-embeddable application
- ✅ Summary statistics dashboard
- ✅ Responsive design for all devices

### Achieved Goals - Phase 2
- ✅ WordPress iframe integration tested and deployed
- ✅ Google Analytics tracking implemented
- ✅ Faculty detail modal with enriched data (16 faculty)
- ✅ Web scraping enrichment proof of concept
- ✅ Faculty self-service update system via Google Forms
- ✅ Update request workflow with email templates

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5.4 for fast development
- **UI Library**: Tailwind CSS v3 with custom animations
- **State Management**: React hooks (useState, useMemo)
- **Data**: Static JSON with 172 faculty across 3 workshops

### Deployment
- **Hosting**: GitHub Pages (free, reliable, no bandwidth limits)
- **CI/CD**: GitHub Actions for automatic deployment
- **Integration**: iframe embed ready for evomics.org WordPress site
- **Live URL**: https://shandley.github.io/evomics-faculty/

## Data Architecture

### Current Data (Integrated)
- **Workshop on Genomics (WoG)**: 93 faculty, 2011-2025
- **Workshop on Population & Speciation Genomics (WPSG)**: 58 faculty, 2016-2025
- **Workshop on Phylogenomics (WPhylo)**: 21 faculty, 2018-2025
- **Total**: 172 unique faculty members
- **Total Participations**: 427 workshop-year records

### Data Structure (Implemented)
```typescript
interface Faculty {
  id: string;
  firstName: string;
  lastName: string;
}

interface EnrichedFacultyProfile {
  faculty: Faculty;
  participations: { [workshopId: string]: number[] };
  statistics: {
    totalYears: number;
    workshopCount: number;
    firstYear: number;
    lastYear: number;
  };
  enrichment?: {
    confidence: 'high' | 'medium' | 'low';
    lastUpdated: string;
    professional?: {
      title?: string;
      affiliation?: string;
      department?: string;
      labWebsite?: string;
    };
    academic?: {
      researchAreas?: string[];
      orcid?: string;
    };
    profile?: {
      shortBio?: string;
      source?: string;
    };
  };
}

interface Workshop {
  id: string;
  name: string;
  abbreviation: string;
  active: boolean;
}
```

## Features Completed

### Phase 1: Core Implementation ✅ COMPLETED
- [x] React app with TypeScript and Vite
- [x] Faculty card component with animations
- [x] Data loading from CSV/JSON (3 workshops)
- [x] Filtering by year (dropdown) and workshop
- [x] Search functionality by name
- [x] Sorting (alphabetical, participation count)
- [x] Responsive design optimized for iframe
- [x] Summary statistics cards
- [x] Workshop-specific color coding
- [x] Participation year display
- [x] GitHub Pages deployment with CI/CD

### Phase 2A: Integration & Analytics ✅ COMPLETED
- [x] WordPress iframe embedding tested and live
- [x] Google Analytics tracking configured
- [x] Cross-browser compatibility verified
- [x] Mobile responsiveness within WordPress

### Phase 2B: Faculty Details & Updates ✅ COMPLETED
- [x] Faculty detail modal with enriched information
- [x] Click-to-view expanded faculty profiles
- [x] Web scraping enrichment (163 faculty enriched - 95.9% coverage)
- [x] Faculty self-service update system
- [x] Google Forms integration for updates
- [x] Email workflow with templates
- [x] Processing scripts for CSV updates

### Phase 3A: Data Sharing & Export ✅ COMPLETED
- [x] URL state management for shareable filtered views
- [x] CSV export with all faculty data and enrichments
- [x] Share button with native share API / clipboard fallback
- [x] Dynamic filenames based on current filters

## Next Steps Recommendations

### Recently Completed (Phase 3A) ✅
1. **URL State Management** ✅ COMPLETED
   - Shareable URLs preserve all filter and sort settings
   - URL parameters update automatically as users interact
   - Bookmarkable filtered views for easy sharing
   - Share button with clipboard copy functionality

2. **Export Functionality** ✅ COMPLETED
   - CSV download includes all visible faculty data
   - Exports include enriched profile information
   - Dynamic filename based on current filters
   - One-click export of filtered results

### Immediate Priorities (Phase 3B: User Experience)
1. **Performance Optimizations**
   - Implement lazy loading for large datasets
   - Add virtual scrolling if faculty list grows
   - Optimize image loading when photos are added
   - Consider pagination for mobile devices

2. **Advanced Filtering**
   - Add affiliation/institution filter
   - Research area tag filtering
   - "Active in last 5 years" quick filter
   - Multi-select workshop filter

3. **Faculty Photo Integration**
   - Add photo upload to Google Form
   - Implement photo display in cards and modal
   - Create fallback avatar system
   - Optimize image loading and caching

### Medium-term Features (Phase 3: Data Enrichment)
1. **Additional Workshop Integration**
   - Molecular Evolution workshop data
   - Comparative Genomics workshop data
   - Standardize data collection process

2. **Faculty Enrichment**
   - Collect and display affiliations
   - Add faculty photos (with consent)
   - Link to personal/lab websites
   - ORCID integration for publications

3. **Advanced Visualizations**
   - Timeline view of workshop participation
   - Network graph of co-teaching relationships
   - Geographic distribution map

### Long-term Vision (Phase 4: Platform Evolution)
1. **Dynamic Data Management**
   - Admin interface for data updates
   - API endpoint for real-time data
   - Automated data validation

2. **Community Features**
   - Alumni directory with contact permissions
   - Success stories and testimonials
   - Workshop impact metrics

3. **Integration Expansion**
   - Connect with workshop application system
   - Link to course materials archive
   - Integration with publication tracking

## Development Workflow

### Local Development
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

### Deployment
- Push to main branch → Auto-deploy to GitHub Pages
- GitHub Actions handles build and deployment
- Preview URL: https://shandley.github.io/evomics-faculty/

## WordPress Integration

### Embed Code
```html
<div style="width: 100%; min-height: 800px;">
  <iframe 
    src="https://shandley.github.io/evomics-faculty/" 
    width="100%" 
    height="800"
    frameborder="0"
    style="border: 0;"
    title="Evomics Faculty Alumni">
  </iframe>
</div>
```

### Alternative Embed (Responsive)
```html
<div style="position: relative; width: 100%; padding-bottom: 100%; height: 0; overflow: hidden;">
  <iframe 
    src="https://shandley.github.io/evomics-faculty/" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
    title="Evomics Faculty Alumni">
  </iframe>
</div>
```

## Data Management

### Current Status
- Workshop on Genomics: ✅ Complete (93 faculty)
- Population & Speciation Genomics: ✅ Complete (58 faculty)
- Phylogenomics: ✅ Complete (21 faculty)
- Faculty Enrichment: 163/170 profiles enriched (95.9%)
- ORCID Coverage: 145 IDs (90% of enriched faculty)
- Molecular Evolution: ⏳ Pending
- Comparative Genomics: ⏳ Pending

### Data Pipeline
1. CSV files maintained by workshop organizers
2. Build process converts to optimized JSON
3. Static deployment with data included
4. Faculty updates via Google Forms → CSV → Processing script
5. Future: API endpoint for dynamic updates

### Faculty Update Workflow
1. **Request**: Faculty click "Request Update" in modal
2. **Email**: Automated email to fourthculture@gmail.com
3. **Form**: Admin sends Google Form link
4. **Submit**: Faculty complete form with updates
5. **Process**: Admin runs `processFacultyUpdates.mjs`
6. **Deploy**: Changes pushed to GitHub → Auto-deploy

## Design Principles
- **Mobile-First**: Responsive design for all devices
- **Performance**: Fast loading, optimized assets
- **Accessibility**: WCAG 2.1 AA compliance
- **Maintainability**: Clear code structure, documentation
- **Scalability**: Built for growth to all workshops

## Success Metrics
- Page load time: ✅ <1 second achieved
- Faculty cards render: ✅ <200ms achieved
- Search/filter response: ✅ <50ms achieved
- Mobile usability: ✅ 100% responsive

## Technical Implementation Details

### Performance Optimizations
- Memoized filtering and sorting with `useMemo`
- Debounced search input (300ms)
- Efficient data structure with normalized faculty/participation data
- CSS animations with GPU acceleration

### Key Components
- **App.tsx**: Main application container with state management
- **FilterPanel**: Search, workshop, and year filtering
- **StatsCards**: Summary statistics with workshop breakdown
- **FacultyGrid**: Responsive card layout with sorting
- **FacultyCard**: Individual faculty display with color-coded workshops
- **FacultyModal**: Detailed view with enriched data and update requests
- **facultyEnriched.json**: Enrichment data for faculty profiles

### Build Configuration
- TypeScript with relaxed settings for rapid development
- Vite configured with GitHub Pages base path
- PostCSS with Tailwind CSS v3
- Optimized production builds (~250KB gzipped)

### Faculty Self-Service System
- **Google Form**: https://docs.google.com/forms/d/e/1FAIpQLSfgjNj8lJF4Iw4z_oFTUHkAwgcq5_XjcPDmoFUmtpZECthdlw/viewform
- **Admin Email**: fourthculture@gmail.com
- **Processing Script**: `scripts/processFacultyUpdates.mjs`
- **Documentation**: `docs/FACULTY_UPDATE_WORKFLOW.md`

## Notes
- Successfully deployed with CI/CD pipeline
- WordPress iframe integration live on evomics.org
- Faculty self-service updates operational
- 163 faculty profiles enriched with professional data (95.9% coverage)
- 145 ORCID IDs added (90% coverage)
- 94.3% overall data quality score (A+ grade)
- Architecture supports incremental enhancements