# Evomics Faculty Alumni Page - Implementation Plan

## Project Overview
Build an interactive, filterable faculty alumni directory for Evomics workshops, starting with Workshop on Genomics data and architected for multi-workshop expansion.

## Phase 1: Foundation Setup (Days 1-2)

### 1.1 Project Initialization
- [ ] Create GitHub repository
- [ ] Initialize React + TypeScript + Vite project
- [ ] Configure ESLint and Prettier
- [ ] Set up Vercel deployment
- [ ] Configure project structure

### 1.2 Data Architecture
- [ ] Convert wog-summary.csv to JSON format
- [ ] Create TypeScript interfaces for data models
- [ ] Set up data loading utilities
- [ ] Design workshop-agnostic data structure

### 1.3 Basic UI Framework
- [ ] Choose and install UI library (recommend Tailwind CSS for flexibility)
- [ ] Create layout components (Header, Container, Grid)
- [ ] Set up responsive breakpoints
- [ ] Implement base styling to match evomics.org

## Phase 2: Core Features (Days 3-5)

### 2.1 Faculty Card Component
```typescript
interface FacultyCardProps {
  faculty: Faculty;
  participationYears: number[];
  totalYears: number;
  workshops: WorkshopParticipation[];
}
```
- [ ] Design card layout (name, affiliation, years badge)
- [ ] Implement hover states and interactions
- [ ] Add placeholder for photo
- [ ] Create participation indicator (e.g., "14 years")

### 2.2 Grid Layout
- [ ] Responsive grid system (1-4 columns based on viewport)
- [ ] Card spacing and alignment
- [ ] Smooth transitions for filtering
- [ ] Empty state handling

### 2.3 Data Display
- [ ] Load and parse faculty data
- [ ] Map data to card components
- [ ] Sort by last name by default
- [ ] Display total count

## Phase 3: Filtering & Sorting (Days 6-8)

### 3.1 Filter Controls
- [ ] Year range selector (2011-2025)
- [ ] Participation frequency filter (1+ years, 5+ years, 10+ years)
- [ ] Search by name
- [ ] Workshop selector (pre-built for expansion)
- [ ] Active filters indicator

### 3.2 Sorting Options
- [ ] Alphabetical (A-Z, Z-A)
- [ ] Participation count (high to low, low to high)
- [ ] Most recent participation
- [ ] First participation year

### 3.3 Filter/Sort Implementation
- [ ] State management for filters
- [ ] Efficient filtering algorithms
- [ ] URL parameter sync for shareable views
- [ ] Smooth animations for changes

## Phase 4: Enhanced Features (Days 9-11)

### 4.1 Faculty Detail View
- [ ] Modal or expanded card view
- [ ] Full participation timeline
- [ ] Placeholder for additional info
- [ ] Close/collapse functionality

### 4.2 Export Functionality
- [ ] Export filtered results as CSV
- [ ] Print-friendly view
- [ ] Copy shareable link

### 4.3 Statistics Dashboard
- [ ] Total faculty count
- [ ] Average years of participation
- [ ] Participation trends graph
- [ ] New vs returning faculty metrics

## Phase 5: Polish & Integration (Days 12-14)

### 5.1 Performance Optimization
- [ ] Lazy loading for large datasets
- [ ] Virtual scrolling if needed
- [ ] Image optimization
- [ ] Bundle size optimization

### 5.2 iframe Compatibility
- [ ] Test in WordPress iframe
- [ ] Handle responsive sizing
- [ ] Cross-origin communication if needed
- [ ] Loading states

### 5.3 Accessibility
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] ARIA labels
- [ ] Color contrast compliance

## Technical Specifications

### File Structure
```
evomics-faculty/
├── src/
│   ├── components/
│   │   ├── FacultyCard.tsx
│   │   ├── FilterPanel.tsx
│   │   ├── SortControls.tsx
│   │   └── Layout.tsx
│   ├── data/
│   │   ├── faculty.json
│   │   └── workshops.json
│   ├── hooks/
│   │   ├── useFilters.ts
│   │   └── useFacultyData.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── dataTransform.ts
│   │   └── filters.ts
│   └── App.tsx
├── public/
│   └── faculty-photos/
└── package.json
```

### Key Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "clsx": "^2.0.0",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.3.0",
    "typescript": "^5.0.0",
    "vite": "^4.4.0"
  }
}
```

### Data Format Example
```json
{
  "faculty": [
    {
      "id": "handley-scott",
      "firstName": "Scott",
      "lastName": "Handley",
      "participations": {
        "wog": [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2022, 2023, 2024, 2025]
      }
    }
  ],
  "workshops": [
    {
      "id": "wog",
      "name": "Workshop on Genomics",
      "years": [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]
    }
  ]
}
```

## Deployment Strategy

### Vercel Configuration
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### WordPress Integration
1. Create new page in WordPress
2. Add Custom HTML block
3. Insert iframe code with appropriate sizing
4. Test responsive behavior

## Future Enhancements (Post-Launch)

### Data Enrichment
- Faculty photos from institutional websites
- Current affiliation updates
- Research area tags
- Social media links

### Additional Features
- Workshop comparison view
- Alumni network visualization
- Timeline view of faculty evolution
- Integration with workshop application system

### Multi-Workshop Support
- Unified search across all workshops
- Cross-workshop participation patterns
- Workshop-specific filtering
- Combined statistics dashboard

## Success Criteria
- ✅ Loads in <2 seconds
- ✅ Responsive on all devices
- ✅ Intuitive filtering/sorting
- ✅ Accessible to screen readers
- ✅ Works seamlessly in WordPress iframe
- ✅ Handles 100+ faculty efficiently
- ✅ Easy to add new workshop data