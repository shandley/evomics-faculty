# Evomics Faculty Alumni Page

Interactive web application showcasing faculty alumni from Evomics workshops.

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

### Key Features
- Faculty cards with participation history
- Search by name
- Filter by workshop, year range, and minimum participation
- Sort by name, participation count, or years
- Responsive design for iframe embedding

### Data Management
- Faculty data is stored in `src/data/facultyData.json`
- Workshop metadata in `src/data/workshops.json`
- To update data, modify the JSON files directly

### WordPress Integration
To embed in WordPress, use this iframe code:

```html
<iframe 
  src="https://your-deployed-url.vercel.app" 
  width="100%" 
  height="800px" 
  frameborder="0"
  title="Evomics Faculty Alumni">
</iframe>
```

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Deploy with default settings

### GitHub Pages
1. Update `vite.config.ts` with base path
2. Run `npm run build`
3. Deploy `dist` folder

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