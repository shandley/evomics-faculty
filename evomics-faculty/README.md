# Evomics Faculty Alumni Directory

Interactive web application showcasing faculty alumni from Evomics workshops.

**Live Site:** https://shandley.github.io/evomics-faculty/

## Overview

This repository contains the source code for the Evomics Faculty Alumni Directory, an interactive platform that highlights the contributions of 172 faculty members across three workshop series from 2011 to 2025.

## Features

- **Faculty Directory**: Browse and search 172 faculty profiles with detailed information
- **Advanced Filtering**: Filter by workshop, year, research areas, and specializations
- **Interactive Visualizations**:
  - Timeline of workshop participation
  - Geographic distribution map
  - Faculty collaboration network
  - Research topic taxonomy browser
- **Data Export**: Download faculty data in CSV format
- **Shareable URLs**: Bookmark and share filtered views
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## Workshop Coverage

- **Workshop on Genomics (WoG)**: 93 faculty members (2011-2025)
- **Workshop on Population & Speciation Genomics (WPSG)**: 58 faculty members (2016-2025)
- **Workshop on Phylogenomics (WPhylo)**: 21 faculty members (2018-2025)

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS v3
- **Data Visualization**: D3.js, Leaflet
- **Deployment**: GitHub Pages with automated CI/CD
- **Testing**: GitHub Actions for quality checks

## Project Structure

```
evomics-faculty/
├── faculty-app/          # Main React application
│   ├── src/             # Source code
│   ├── public/          # Static assets
│   └── dist/            # Production build
├── .github/workflows/   # CI/CD automation
├── scripts/             # Data processing utilities
└── archive/             # Historical documentation
```

## Development

### Prerequisites
- Node.js 20+
- npm or yarn

### Setup
```bash
cd faculty-app
npm install
npm run dev
```

### Build
```bash
npm run build
```

### Deploy
Push to main branch triggers automatic deployment to GitHub Pages.

## Data Management

Faculty data is maintained in JSON format with enrichment data including:
- Professional affiliations
- ORCID identifiers (90% coverage)
- Research areas and specializations
- Teaching history across workshops

## Quality Assurance

- Automated weekly data quality checks
- External link validation
- TypeScript type checking
- 95.9% faculty profile enrichment rate

## Contributing

To update faculty information or report issues, please submit a GitHub issue or pull request.

## License

This project is maintained by the Evomics team. For questions or collaboration, please contact the repository maintainer.

## Related Projects

- [Evomics Workshops Dashboard](https://shandley.github.io/evomics-workshops/)
- [Evomics Students Directory](https://shandley.github.io/evomics-students/)