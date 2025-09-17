# Evomics Ecosystem Integration Plan

## Project Goal
Unify the visual design and user experience across three Evomics sites while preserving each site's unique value proposition.

## Sites to Update
- [x] evomics-faculty (COMPLETED)
- [ ] evomics-students
- [ ] evomics-workshops

## Progress Tracking

### Phase 1: Style Standardization ✅ COMPLETED
- [x] Create shared design system folder
- [x] Define unified color palette (colors.css)
- [x] Create typography standards (typography.css)
- [x] Document animation patterns (animations.css)
- [x] Create STYLE_GUIDE.md
- [x] Create base Tailwind configuration (tailwind.base.js)

### Phase 2: Component Updates - evomics-students
- [ ] Update Layout/Navigation to charcoal theme
- [ ] Apply white card styling with subtle shadows
- [ ] Implement elegant outline buttons
- [ ] Add loading skeletons
- [ ] Remove emoji usage
- [ ] Implement lazy loading for visualizations

### Phase 3: Component Updates - evomics-workshops
- [ ] Update multi-page navigation to charcoal
- [ ] Standardize dashboard cards
- [ ] Apply consistent button styles
- [ ] Update session cards and timeline components
- [ ] Ensure routing pages have consistent headers

### Phase 4: Performance Optimization
- [ ] Implement code splitting for both sites
- [ ] Add Suspense boundaries
- [ ] Configure Vite chunk optimization
- [ ] Verify bundle sizes < 1MB

### Phase 5: Cross-Site Integration
- [ ] Implement unified navigation component
- [ ] Create consistent footer
- [ ] Add cross-site links
- [ ] Test WordPress embeds

### Phase 6: Documentation & Deployment
- [ ] Update all READMEs
- [ ] Add GitHub workflows
- [ ] Deploy to production
- [ ] Verify all links working

## Design Standards

### Color Palette
- **Navigation**: Charcoal (gray-800/900)
- **Primary Accent**: Violet (violet-500/600)
- **Secondary Accent**: Emerald (emerald-500/600)
- **Tertiary Accent**: Slate (slate-500/600)
- **Backgrounds**: White with gray-100 borders
- **Text**: gray-900 (headings), gray-700 (body), gray-500 (secondary)

### Typography
- **Headings**: Bold, no emojis
- **Body**: Regular weight, clear hierarchy
- **Links**: Hover states with color transitions

### Components
- **Buttons**: Outline style with hover effects
- **Cards**: White background, subtle shadows
- **Loading**: Skeleton loaders and spinners
- **Animations**: Staggered fade-ins

## Implementation Notes

### Completed (evomics-faculty)
- ✅ Charcoal navigation theme
- ✅ Violet/Emerald/Slate color scheme
- ✅ No emojis in professional content
- ✅ Loading skeletons
- ✅ Code splitting with lazy loading
- ✅ Clean README

### Current Focus
Starting with evomics-students as it's most similar to faculty site.

## Testing Checklist
- [ ] TypeScript compilation
- [ ] Bundle size verification
- [ ] Cross-browser testing
- [ ] Mobile responsiveness
- [ ] WordPress embed compatibility

## Deployment URLs
- Faculty: https://shandley.github.io/evomics-faculty/
- Students: https://shandley.github.io/evomics-students/
- Workshops: https://shandley.github.io/evomics-workshops/