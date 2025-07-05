# Workshop Schedule Integration Plan

## 🎯 Objective
Integrate workshop schedule data from evomics.org into the faculty alumni ecosystem to show detailed teaching history and curriculum evolution.

## ✅ Completed Demonstration

### 1. Data Extraction Proof of Concept
- **WebFetch**: Successfully extracted 2025 WoG schedule from WordPress
- **Data Structure**: Defined comprehensive workshop session schema
- **Processing Pipeline**: Created scripts to normalize and structure data

### 2. Faculty Enhancement Framework
- **Teaching History**: Added detailed session-level teaching data to faculty profiles
- **Specialization Detection**: Automated extraction of teaching specializations from session topics
- **Co-teaching Networks**: Captured collaborative teaching relationships
- **UI Component**: Created `TeachingHistory` component for displaying session details

### 3. Sample Data Output
```json
{
  "teaching": {
    "totalSessions": 1,
    "workshopsHistory": {
      "WoG": {
        "2025": [{
          "date": "6th Jan",
          "time": "14-17", 
          "topic": "Sequencing Technologies",
          "type": "lecture",
          "location": "Town Theatre",
          "coPresenters": []
        }]
      }
    },
    "specializations": ["Sequencing Technologies"],
    "lastTaught": 2025
  }
}
```

## 🚀 Implementation Strategy

### Phase 1: Data Collection (Manual/Semi-Automated)
1. **Identify Workshop URLs**: Catalog all workshop schedule pages on evomics.org
   - WoG: 2011-2025 (15 years)
   - WPSG: 2016-2025 (10 years) 
   - WPhylo: 2018-2025 (8 years)
   - Add other workshops as discovered

2. **Extract Schedule Data**: Use WebFetch + manual processing for initial dataset
   - Focus on recent years first (2020-2025) for immediate value
   - Gradually expand to historical data
   - Handle WordPress table format variations

3. **Data Cleaning & Normalization**:
   - Standardize presenter names to match faculty database
   - Categorize session types (lecture, lab, practical, social)
   - Extract teaching specializations from session topics
   - Handle co-presenter relationships

### Phase 2: Faculty Site Integration
1. **Enhanced Faculty Profiles**:
   - Add teaching history tab to faculty modal
   - Show session-level teaching details
   - Display teaching specializations as badges
   - Include co-teaching collaborations

2. **New Filtering & Search**:
   - Filter by teaching specialization 
   - Search by session topics taught
   - "Active in last 3 years" filter
   - Workshop-specific teaching filters

3. **Network Visualizations**:
   - Co-teaching relationship networks
   - Teaching specialization clusters
   - Curriculum evolution over time

### Phase 3: Workshop Archive Site
1. **Independent Workshop History Site**:
   - Complete curriculum archive with search/filter
   - Timeline view of workshop evolution
   - Session-level detail pages
   - Faculty profile integration links

2. **Cross-Site Integration**:
   - Faculty site ↔ Workshop archive linking
   - Student cohort statistics integration
   - Unified search across all three sites

## 📊 Data Architecture

### Core Schema
```typescript
interface WorkshopSession {
  date: string;
  day: string; 
  time: string;
  presenters: string[];
  topic: string;
  location: string;
  type: 'lecture' | 'lab' | 'practical' | 'social' | 'orientation';
}

interface WorkshopSchedule {
  workshop: string; // "WoG", "WPSG", "WPhylo"
  year: number;
  location: string;
  dates: string;
  sessions: WorkshopSession[];
}
```

### Faculty Enhancement
```typescript
interface FacultyTeaching {
  totalSessions: number;
  workshopsHistory: {
    [workshop: string]: {
      [year: number]: TeachingSession[];
    };
  };
  specializations: string[];
  lastTaught: number;
}
```

## 🛠 Technical Implementation

### Tools & Scripts Created
1. **`extractWorkshopData.js`**: Data structure definitions and processing functions
2. **`scrapeWorkshopSchedules.js`**: Puppeteer-based systematic scraping (optional)
3. **`processWorkshopData.js`**: Faculty enhancement and data transformation
4. **`TeachingHistory.tsx`**: UI component for displaying teaching history

### Data Collection Workflow
1. **WebFetch Extraction**: Use Claude's WebFetch tool for individual workshop pages
2. **Manual Processing**: Structure extracted data into JSON format
3. **Faculty Matching**: Link session presenters to existing faculty profiles
4. **Data Integration**: Enhance faculty profiles with teaching history

### File Structure
```
faculty-app/
├── scripts/
│   ├── extractWorkshopData.js       # Data processing utilities
│   ├── scrapeWorkshopSchedules.js   # Automated scraping (optional)
│   └── processWorkshopData.js       # Faculty enhancement
├── src/components/
│   └── TeachingHistory.tsx          # Teaching history UI
└── data/workshops/
    ├── workshopSchedules.json       # Raw workshop data
    └── facultyTeaching.json         # Processed teaching data
```

## 🎯 Next Steps

### Immediate (Week 1)
1. **Collect 2023-2025 Data**: Use WebFetch to extract recent workshop schedules
2. **Process 5-10 Faculty**: Test integration with faculty who have extensive teaching history
3. **UI Integration**: Add teaching history to faculty modal/detail view

### Short-term (Month 1) 
1. **Expand Data Collection**: Target 2020-2025 across all workshop types
2. **Enhanced Filtering**: Add specialization and recent teaching filters
3. **Cross-references**: Link workshop data to existing faculty participation data

### Medium-term (Month 2-3)
1. **Historical Data**: Collect 2015+ workshop schedules for comprehensive history
2. **Workshop Archive Site**: Create independent workshop history site
3. **Advanced Analytics**: Workshop curriculum evolution visualization

## 💡 Value Propositions

### For Faculty
- **Comprehensive CV**: Complete teaching history with session details
- **Collaboration Networks**: Visualize co-teaching relationships
- **Specialization Recognition**: Automated categorization of expertise areas

### For Students/Visitors
- **Curriculum Transparency**: See exactly what each faculty member teaches
- **Program Evolution**: Understand how workshop content has evolved
- **Faculty Expertise**: Match learning interests with faculty specializations

### For Evomics Organization
- **Impact Documentation**: Comprehensive record of educational contributions
- **Curriculum Archive**: Preserve institutional knowledge and evolution
- **Faculty Recognition**: Detailed record of teaching contributions

## 🔧 Technical Considerations

### Data Quality
- **Name Matching**: Handle presenter name variations (initials, titles, etc.)
- **Topic Standardization**: Normalize session topics for consistent categorization
- **Historical Consistency**: Account for changing workshop formats over time

### Performance
- **Incremental Loading**: Load teaching history on-demand in faculty modals
- **Efficient Filtering**: Index teaching specializations for fast search
- **Caching Strategy**: Cache processed workshop data for performance

### Scalability  
- **Modular Architecture**: Design for easy addition of new workshop types
- **API Design**: Structure for potential real-time data updates
- **Cross-site Integration**: Plan for unified search across faculty/student/workshop sites

## 📈 Success Metrics

### Technical
- **Data Coverage**: >90% of recent faculty have teaching history
- **Update Frequency**: Workshop data updated within 1 month of new schedules
- **Performance**: Teaching history loads <500ms

### User Engagement
- **Faculty Profile Views**: Increase in detailed faculty profile engagement
- **Teaching Filter Usage**: Adoption of specialization-based filtering
- **Cross-site Navigation**: Usage of workshop archive links from faculty site

This integration will transform the faculty site from an alumni directory into a comprehensive genomics education archive, showcasing both the educators and the curriculum that has shaped the field.