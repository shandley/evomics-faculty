# Evomics Platform Development Guide

## Current Project
Unifying design across three Evomics sites for consistent user experience.

## Active Sites
1. **evomics-faculty** - Faculty alumni directory (✅ COMPLETED)
2. **evomics-students** - Student alumni directory (🚧 IN PROGRESS)
3. **evomics-workshops** - Workshop archive and curriculum

## Design Standards

### Color Palette
- Navigation: Charcoal (gray-800/900)
- Accents: Violet, Emerald, Slate (NO teal/cyan)
- Cards: White with subtle shadows
- Text: Consistent gray hierarchy

### Key Principles
- No emojis in production content
- Professional, clean typography
- Elegant outline buttons
- Loading skeletons for async content
- Code splitting for performance

## Tech Stack
- React 18 + TypeScript + Vite
- Tailwind CSS v3
- GitHub Pages deployment

## Current Task
Implementing Phase 1: Style Standardization for evomics-students

## Important Commands
```bash
# Development
cd evomics-students
npm run dev

# Build & Test
npm run build
npm run preview

# Deploy
git push origin main
```

## Progress Tracking
See EVOMICS_INTEGRATION_PLAN.md for detailed progress

## Quick Reference
- Faculty site completed with all modern updates
- Students site needs same styling updates
- Workshops site needs routing-aware updates
- Maintain unique features of each site