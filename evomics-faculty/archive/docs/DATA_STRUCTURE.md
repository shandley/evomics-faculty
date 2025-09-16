# Faculty Alumni Data Structure Design

## Overview
This document outlines the data structure designed to support the current Workshop on Genomics data while being extensible for future workshops.

## Core Data Models

### 1. Faculty Member
```typescript
interface Faculty {
  // Core identifiers
  id: string;                    // Unique ID: "lastname-firstname"
  firstName: string;
  lastName: string;
  
  // Professional information (future additions)
  email?: string;
  currentAffiliation?: Institution;
  previousAffiliations?: Institution[];
  position?: string;
  
  // Online presence (future additions)
  website?: string;
  orcid?: string;
  googleScholar?: string;
  twitter?: string;
  linkedin?: string;
  
  // Academic information (future additions)
  photo?: string;
  bio?: string;
  researchAreas?: string[];
  expertise?: string[];
}
```

### 2. Institution (future addition)
```typescript
interface Institution {
  id: string;
  name: string;
  department?: string;
  country: string;
  city?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}
```

### 3. Workshop
```typescript
interface Workshop {
  id: string;                    // 'wog', 'wpsg', 'wphylo', etc.
  name: string;                  // Full workshop name
  shortName: string;             // Abbreviated name
  description?: string;
  active: boolean;
  location?: string;
  startYear: number;
  endYear?: number;
}
```

### 4. Participation Record
```typescript
interface Participation {
  facultyId: string;
  workshopId: string;
  year: number;
  role: ParticipationRole;
  topics?: string[];             // Topics taught that year
  notes?: string;
}

enum ParticipationRole {
  FACULTY = 'faculty',
  INSTRUCTOR = 'instructor',
  ORGANIZER = 'organizer',
  DIRECTOR = 'director',
  GUEST = 'guest'
}
```

### 5. Aggregated View (for UI)
```typescript
interface FacultyProfile {
  faculty: Faculty;
  participations: {
    [workshopId: string]: YearlyParticipation[];
  };
  statistics: {
    totalYears: number;
    workshopCount: number;
    firstYear: number;
    lastYear: number;
    primaryWorkshop: string;
    continuousYears: number;      // Longest streak
  };
}

interface YearlyParticipation {
  year: number;
  role: ParticipationRole;
  workshop: Workshop;
}
```

## Data Storage Format

### Current Phase: Static JSON
```json
{
  "metadata": {
    "lastUpdated": "2024-12-30",
    "version": "1.0.0"
  },
  "workshops": {
    "wog": {
      "id": "wog",
      "name": "Workshop on Genomics",
      "shortName": "WoG",
      "active": true,
      "startYear": 2011
    },
    "wpsg": {
      "id": "wpsg",
      "name": "Workshop on Population and Speciation Genomics",
      "shortName": "WPSG",
      "active": true,
      "startYear": 2012
    }
  },
  "faculty": {
    "handley-scott": {
      "id": "handley-scott",
      "firstName": "Scott",
      "lastName": "Handley"
    }
  },
  "participations": [
    {
      "facultyId": "handley-scott",
      "workshopId": "wog",
      "year": 2011,
      "role": "faculty"
    }
  ]
}
```

### CSV to JSON Transformation
```typescript
// Input: CSV row
// "Handley","Scott","X","X","X",...
// Years: 2011,2012,2013,...

// Output: Participation records
[
  { facultyId: "handley-scott", workshopId: "wog", year: 2011, role: "faculty" },
  { facultyId: "handley-scott", workshopId: "wog", year: 2012, role: "faculty" },
  { facultyId: "handley-scott", workshopId: "wog", year: 2013, role: "faculty" }
]
```

## API Structure (for future consideration)

### Endpoints
```
GET /api/faculty
  ?workshop=wog,wpsg
  ?year=2011-2025
  ?minYears=5
  ?search=handley
  ?sort=lastName|participationCount|recentYear
  ?page=1&limit=50

GET /api/faculty/{id}
  Returns complete FacultyProfile

GET /api/workshops
  Returns all workshop metadata

GET /api/statistics
  ?workshop=wog
  ?year=2024
  Returns aggregated statistics
```

## Multi-Workshop Support Strategy

### 1. Data Collection Template
Create a standardized CSV template for all workshops:
```csv
lastName,firstName,2011,2012,2013,...,2025,totalCount
```

### 2. Workshop-Specific Variations
- Some workshops may have different year ranges
- Some faculty may have different roles (faculty vs instructor)
- Handle missing years gracefully

### 3. Cross-Workshop Features
```typescript
interface CrossWorkshopStats {
  facultyId: string;
  workshops: {
    [workshopId: string]: {
      years: number[];
      totalYears: number;
      role: ParticipationRole;
    }
  };
  multiWorkshopYears: number[];  // Years teaching multiple workshops
  primaryWorkshop: string;       // Most frequent workshop
}
```

## Implementation Priority

### Phase 1 (Current)
- Basic Faculty interface (id, firstName, lastName)
- Simple participation tracking (workshopId, year)
- Workshop on Genomics data only

### Phase 2
- Add Workshop on Population & Speciation Genomics
- Add Workshop on Phylogenomics
- Implement cross-workshop views

### Phase 3
- Add Institution data
- Add faculty photos and bios
- Add research areas and expertise

### Phase 4
- Historical workshops (Molecular Evolution, Comparative Genomics)
- Role differentiation (faculty vs instructor)
- Advanced statistics and visualizations

## Data Validation Rules
1. Faculty ID must be unique across all workshops
2. Years must be within workshop's active range
3. Participation cannot have duplicate year/workshop/faculty combinations
4. Names should be consistently formatted (capitalize first letter)
5. Handle name variations (e.g., "Chris" vs "Christopher")

## File Organization
```
data/
├── raw/                          # Original CSV files
│   ├── wog-summary.csv
│   ├── wpsg-summary.csv
│   └── wphylo-summary.csv
├── processed/                    # Converted JSON files
│   ├── faculty.json
│   ├── workshops.json
│   └── participations.json
├── scripts/                      # Data processing scripts
│   └── csv-to-json.js
└── schema/                       # TypeScript interfaces
    └── types.ts
```

This structure ensures we can start simple with Workshop on Genomics while building a foundation that gracefully handles additional workshops and data enrichment over time.