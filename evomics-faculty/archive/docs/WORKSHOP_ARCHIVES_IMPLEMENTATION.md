# Workshop Archives Implementation Plan

## Overview
This document outlines the implementation plan for adding Workshop Archives functionality to the existing Evomics Faculty Alumni application. This feature will transform 15+ years of workshop history into an interactive, searchable timeline integrated with the faculty directory.

## Project Context
- **Current App**: React + TypeScript faculty directory at https://shandley.github.io/evomics-faculty/
- **Data Source**: Faculty data enrichment in progress, workshop participation data available
- **Goal**: Add workshop archives as a new feature within the existing application

## Data Architecture

### Current Data Structure
```typescript
// Existing in facultyData.json
{
  "faculty": [
    {
      "id": "handley-scott",
      "firstName": "Scott",
      "lastName": "Handley"
    }
  ],
  "participations": {
    "handley-scott": {
      "wog": [2011, 2012, 2013, ...],
      "wpsg": [2016, 2018, 2020, ...]
    }
  }
}
```

### Enhanced Data Structure (To Implement)
```typescript
// Add to facultyData.json or create workshopArchive.json
{
  "workshopInstances": [
    {
      "id": "wog-2024",
      "workshopId": "wog",
      "year": 2024,
      "dates": {
        "start": "2024-01-07",
        "end": "2024-01-20"
      },
      "location": {
        "city": "Český Krumlov",
        "country": "Czech Republic",
        "venue": "Hotel Růže Conference Center"
      },
      "instructorIds": ["handley-scott", "zody-mike", "chikhi-rayan"],
      "participantCount": 45,
      "status": "completed",
      "materials": {
        "schedule": "/archives/wog-2024/schedule.pdf",
        "photos": "/archives/wog-2024/photos/"
      }
    }
  ],
  "sessions": [
    {
      "workshopId": "wog-2024",
      "date": "2024-01-08",
      "timeSlot": "morning",
      "title": "Introduction to Genome Assembly",
      "instructorIds": ["chikhi-rayan"],
      "type": "lecture",
      "materials": {
        "slides": "/archives/wog-2024/sessions/genome-assembly.pdf"
      }
    }
  ]
}
```

## Implementation Plan

### Phase 1: Core Infrastructure (Week 1)

#### 1.1 Add Routing
```bash
npm install react-router-dom
```

Update `App.tsx` to include routes:
```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter basename="/evomics-faculty">
      <Routes>
        <Route path="/" element={<FacultyPage />} />
        <Route path="/workshops" element={<WorkshopsPage />} />
        <Route path="/workshops/:workshopId" element={<WorkshopDetailPage />} />
        <Route path="/timeline" element={<TimelinePage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

#### 1.2 Create Workshop Components

Create new directory structure:
```
src/
├── pages/
│   ├── FacultyPage.tsx      (refactor from App.tsx)
│   ├── WorkshopsPage.tsx    (new)
│   ├── WorkshopDetailPage.tsx (new)
│   └── TimelinePage.tsx     (new)
├── components/
│   └── workshops/
│       ├── WorkshopCard.tsx
│       ├── WorkshopTimeline.tsx
│       ├── WorkshopFilters.tsx
│       └── SessionSchedule.tsx
```

#### 1.3 Update Navigation

Modify `Layout.tsx` to include navigation tabs:
```typescript
<nav className="flex space-x-6 border-b">
  <NavLink to="/">Faculty Directory</NavLink>
  <NavLink to="/workshops">Workshop Archives</NavLink>
  <NavLink to="/timeline">Timeline View</NavLink>
</nav>
```

### Phase 2: Data Processing (Week 2)

#### 2.1 Create Data Processing Script

`scripts/buildWorkshopArchive.js`:
```javascript
const fs = require('fs');
const path = require('path');

// Parse existing CSV files
async function parseWorkshopData() {
  const wogCSV = await parseCSV('../wog-summary.csv');
  const wpsgCSV = await parseCSV('../wpsg-faculty-summary.csv');
  const wphyloCSV = await parseCSV('../phylo-faculty-summary.csv');
  
  // Build workshop instances from CSV data
  const workshopInstances = [];
  
  // Process each workshop series
  processWorkshopSeries('wog', wogCSV, workshopInstances);
  processWorkshopSeries('wpsg', wpsgCSV, workshopInstances);
  processWorkshopSeries('wphylo', wphyloCSV, workshopInstances);
  
  return workshopInstances;
}

// Merge with faculty data
async function enhanceFacultyData() {
  const facultyData = require('../src/data/facultyData.json');
  const workshopInstances = await parseWorkshopData();
  
  // Add workshop instances to faculty data
  facultyData.workshopInstances = workshopInstances;
  
  // Save enhanced data
  fs.writeFileSync(
    '../src/data/facultyData.json',
    JSON.stringify(facultyData, null, 2)
  );
}
```

#### 2.2 Add Workshop Dates Collection

Create `data/workshopDates.json` for manual date entry:
```json
{
  "wog-2024": {
    "start": "2024-01-07",
    "end": "2024-01-20"
  },
  "wog-2023": {
    "start": "2023-01-08",
    "end": "2023-01-21"
  }
}
```

### Phase 3: Workshop Archive Features (Week 3)

#### 3.1 Workshop List View

`pages/WorkshopsPage.tsx`:
- Grid/list view of all workshops
- Filter by series (WoG, WPSG, WPhylo)
- Filter by year range
- Search by instructor name
- Sort by date, participant count

#### 3.2 Workshop Detail View

`pages/WorkshopDetailPage.tsx`:
- Workshop header with dates, location
- Instructor list with links to faculty profiles
- Session schedule (if available)
- Download links for materials
- Photo gallery (if available)

#### 3.3 Timeline Visualization

`pages/TimelinePage.tsx`:
- Horizontal timeline showing all workshops
- Color coding by workshop series
- Zoom controls (decade/year/month)
- Click to view workshop details

### Phase 4: Integration Features (Week 4)

#### 4.1 Faculty Profile Enhancement

Update `FacultyModal.tsx`:
```typescript
// Add teaching history section
<div className="mt-6">
  <h3 className="text-lg font-semibold mb-3">Teaching History</h3>
  <div className="space-y-2">
    {facultyWorkshops.map(workshop => (
      <Link 
        to={`/workshops/${workshop.id}`}
        className="block hover:bg-gray-50 p-2 rounded"
      >
        {workshop.name} - {workshop.year}
      </Link>
    ))}
  </div>
  <p className="text-sm text-gray-600 mt-2">
    Total: {totalWorkshops} workshops over {yearsActive} years
  </p>
</div>
```

#### 4.2 Cross-Navigation

- Faculty cards show workshop count badges
- Workshop pages link to instructor profiles
- Search works across both faculty and workshops
- Shared filtering updates URL state

#### 4.3 Statistics Dashboard

Enhanced `StatsCards.tsx`:
```typescript
// Add workshop statistics
<StatsCard
  title="Total Workshops"
  value={totalWorkshops}
  icon={<CalendarIcon />}
/>
<StatsCard
  title="Total Participants"
  value={totalParticipants}
  icon={<UsersIcon />}
/>
<StatsCard
  title="Countries Reached"
  value={uniqueCountries}
  icon={<GlobeIcon />}
/>
```

### Phase 5: Progressive Enhancement

#### 5.1 Data Collection Priorities

1. **Immediate** (from existing sources):
   - Workshop years
   - Instructor lists
   - Basic workshop info

2. **Short-term** (manual collection):
   - Exact dates
   - Participant counts
   - Location details

3. **Long-term** (digitization effort):
   - Session schedules
   - Course materials
   - Photos and videos

#### 5.2 Material Archive Structure

```
public/
└── archives/
    ├── wog-2024/
    │   ├── schedule.pdf
    │   ├── sessions/
    │   │   ├── genome-assembly.pdf
    │   │   └── variant-calling.pdf
    │   └── photos/
    │       ├── group-photo.jpg
    │       └── lab-session.jpg
    └── wpsg-2022/
        └── ...
```

## Technical Considerations

### State Management
- Continue using React hooks (useState, useMemo)
- Add URL state management for deep linking
- Consider Zustand if state gets complex

### Performance
- Lazy load workshop details
- Implement virtual scrolling for long lists
- Optimize images with Next.js Image (if migrating)

### Data Updates
- Single script updates all data
- GitHub Actions for automated deployment
- Version control for data changes

### SEO & Sharing
- Update meta tags for workshop pages
- Generate Open Graph images
- Implement structured data for events

## Testing Strategy

1. **Component Testing**
   - Test filtering logic
   - Test navigation between views
   - Test data transformations

2. **Integration Testing**
   - Test faculty ↔ workshop navigation
   - Test search across all data
   - Test URL state persistence

3. **Performance Testing**
   - Measure page load times
   - Test with full 15-year dataset
   - Optimize bundle size

## Deployment

1. **Development**
   ```bash
   npm run dev
   ```

2. **Build & Deploy**
   ```bash
   npm run build
   git add .
   git commit -m "Add workshop archives feature"
   git push origin main
   ```

3. **GitHub Pages**
   - Automatic deployment on push to main
   - Available at: https://shandley.github.io/evomics-faculty/

## Success Metrics

- Page load time < 2 seconds
- Search response < 100ms
- Mobile responsive
- Accessibility score > 90
- User engagement metrics via analytics

## Next Steps

1. Complete faculty data enrichment
2. Set up routing infrastructure
3. Create workshop data processing scripts
4. Implement core workshop views
5. Add cross-navigation features
6. Deploy and gather feedback

## Notes for Implementation

- Reuse existing components where possible
- Maintain consistent design language
- Keep workshop data in sync with faculty data
- Plan for incremental data enrichment
- Consider future features (certificates, alumni network)