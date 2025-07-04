# Evomics Faculty Alumni Page

Interactive web application showcasing faculty alumni from Evomics workshops, featuring 172 faculty members across 3 workshops with advanced search, filtering, and visualization capabilities.

**Live Site**: https://shandley.github.io/evomics-faculty/

## Key Features

### Core Functionality
- **Faculty Directory**: Interactive cards displaying participation history and professional information
- **Advanced Search & Filtering**: Search by name, filter by workshop, year range, research topics, and minimum participation
- **Data Visualization**: Geographic distribution maps, faculty network graphs, and timeline visualizations
- **Data Export**: CSV downloads with dynamic filenames based on current filters
- **URL State Management**: Shareable filtered views via URL parameters

### Enhanced Features
- **Enriched Faculty Profiles**: 95.9% of faculty have enhanced profiles with professional data, research areas, and ORCID IDs
- **Topic Taxonomy**: Standardized research areas with hierarchical filtering
- **Interactive Visualizations**: Click-through navigation between maps, networks, and faculty details
- **Faculty Self-Service Updates**: Google Forms integration for profile updates
- **Responsive Design**: Optimized for desktop and mobile, iframe-embeddable for WordPress

### Current Data Coverage
- **Workshop on Genomics (WoG)**: 93 faculty, 2011-2025
- **Workshop on Population & Speciation Genomics (WPSG)**: 58 faculty, 2016-2025  
- **Workshop on Phylogenomics (WPhylo)**: 21 faculty, 2018-2025

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Development

The app runs on http://localhost:5173 by default.

### WordPress Integration
Current embed code for evomics.org:

```html
<iframe 
  src="https://shandley.github.io/evomics-faculty/" 
  width="100%" 
  height="800px" 
  frameborder="0"
  title="Evomics Faculty Alumni">
</iframe>
```

## Deployment

**Current**: GitHub Pages with automated CI/CD
- Push to main branch triggers automatic deployment
- Live at: https://shandley.github.io/evomics-faculty/

## Adding New Workshop Data
1. Create CSV file with same format as `wog-summary.csv`
2. Convert to JSON format
3. Add faculty to `facultyData.json`
4. Add participations to the participations array
5. Update `workshops.json` with new workshop info

## Tech Stack
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Static JSON data (API-ready architecture)