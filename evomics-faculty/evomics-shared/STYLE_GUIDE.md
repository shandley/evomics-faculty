# Evomics Design System Style Guide

## Overview
This style guide defines the unified design standards for all Evomics ecosystem sites (faculty, students, workshops). The goal is to maintain visual consistency while allowing each site to preserve its unique functionality.

## Design Principles

### Visual Hierarchy
- Clear distinction between navigation, content, and actions
- Consistent spacing and typography scales
- Professional appearance without unnecessary embellishments
- Clean, academic aesthetic suitable for scientific content

### User Experience
- Fast loading with optimized assets
- Responsive design for all devices
- Accessible to users with disabilities
- Intuitive navigation across all sites

## Color Palette

### Navigation Colors
- **Primary**: `rgb(31, 41, 55)` - Charcoal gray for main navigation
- **Secondary**: `rgb(17, 24, 39)` - Darker gray for secondary elements
- **Text**: `rgb(156, 163, 175)` - Light gray for navigation text
- **Hover**: `rgb(209, 213, 219)` - Lighter gray for hover states

### Accent Colors
- **Violet** (Primary Accent): Faculty expertise, primary actions
  - 500: `rgb(139, 92, 246)` - Main violet
  - 600: `rgb(124, 58, 237)` - Hover state
  - 700: `rgb(109, 40, 217)` - Active state

- **Emerald** (Secondary Accent): Success states, student achievements
  - 500: `rgb(16, 185, 129)` - Main emerald
  - 600: `rgb(5, 150, 105)` - Hover state
  - 700: `rgb(4, 120, 87)` - Active state

- **Slate** (Tertiary Accent): Workshop series, metadata
  - 500: `rgb(100, 116, 139)` - Main slate
  - 600: `rgb(71, 85, 105)` - Hover state
  - 700: `rgb(51, 65, 85)` - Active state

### Text Colors
- **Primary**: `rgb(17, 24, 39)` - Headings and important text
- **Secondary**: `rgb(55, 65, 81)` - Body text
- **Tertiary**: `rgb(107, 114, 128)` - Secondary information
- **Light**: `rgb(156, 163, 175)` - Disabled or placeholder text

## Typography

### Font Families
- **Sans-serif**: System fonts for optimal performance
- **Monospace**: Code and technical content

### Type Scale
- **Heading 1**: 2.25rem (36px), bold, tight line-height
- **Heading 2**: 1.875rem (30px), bold, tight line-height
- **Heading 3**: 1.5rem (24px), semi-bold, snug line-height
- **Heading 4**: 1.25rem (20px), semi-bold, snug line-height
- **Body Large**: 1.125rem (18px), normal, relaxed line-height
- **Body Base**: 1rem (16px), normal, normal line-height
- **Body Small**: 0.875rem (14px), normal, normal line-height
- **Caption**: 0.75rem (12px), medium, wide letter-spacing

### Usage Guidelines
- Headings should be bold without decorative elements
- Body text maintains clear hierarchy
- Links use violet accent with hover transitions
- No emojis in professional content

## Components

### Buttons
- **Primary**: Violet background with white text
- **Secondary**: Outline style with violet border
- **Tertiary**: Text-only with underline on hover
- **Disabled**: Reduced opacity with cursor-not-allowed

### Cards
- White background with subtle shadow
- Gray-100 border on hover
- Consistent padding (1.5rem)
- Rounded corners (0.5rem)

### Navigation
- Charcoal background (gray-800/900)
- Horizontal layout with dropdown menus
- Sticky positioning for quick access
- Cross-site links in consistent order

### Loading States
- Skeleton loaders for content placeholders
- Spinning indicators for actions
- Shimmer effect for loading cards
- Progress bars for multi-step processes

## Animations

### Transitions
- **Duration**: 200ms for micro-interactions, 500ms for page transitions
- **Timing**: Ease-in-out for smooth movement
- **Properties**: Transform and opacity for performance

### Hover Effects
- Lift effect: `translateY(-2px)` with shadow
- Scale effect: `scale(1.02)` for interactive elements
- Color transitions for links and buttons

### Loading Animations
- Spin: Continuous rotation for spinners
- Pulse: Opacity variation for skeleton loaders
- Shimmer: Gradient animation for loading cards

### Staggered Animations
- 50ms increments for sequential element appearance
- Maximum 4 stagger levels to maintain performance
- Used for lists and grid layouts

## Layout

### Grid System
- 12-column grid with responsive breakpoints
- Mobile: 1 column
- Tablet: 2-3 columns
- Desktop: 3-4 columns
- Wide: 4-6 columns

### Spacing
- Base unit: 0.25rem (4px)
- Common spacings: 0.5rem, 1rem, 1.5rem, 2rem
- Consistent vertical rhythm throughout

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: 1024px - 1280px
- Wide: > 1280px

## Implementation

### CSS Architecture
1. **Shared Styles**: Import from evomics-shared/styles/
2. **CSS Custom Properties**: Define tokens in :root
3. **Tailwind Extension**: Use tailwind.base.js as foundation
4. **Component Classes**: Semantic naming for reusability

### File Structure
```
evomics-shared/
├── styles/
│   ├── colors.css      # Color palette definitions
│   ├── typography.css  # Typography standards
│   └── animations.css  # Animation patterns
├── config/
│   └── tailwind.base.js # Base Tailwind config
└── STYLE_GUIDE.md      # This file
```

### Usage Example
```css
/* Import in your main CSS file */
@import '../../evomics-shared/styles/colors.css';
@import '../../evomics-shared/styles/typography.css';
@import '../../evomics-shared/styles/animations.css';

/* Use the design tokens */
.my-component {
  color: var(--text-primary);
  background: var(--bg-white);
  transition: var(--transition-all);
}
```

```javascript
// In tailwind.config.js
const baseConfig = require('../../evomics-shared/config/tailwind.base.js');

module.exports = {
  ...baseConfig,
  // Site-specific overrides
}
```

## Accessibility

### Requirements
- WCAG 2.1 AA compliance minimum
- Keyboard navigation for all interactive elements
- ARIA labels for screen readers
- Sufficient color contrast (4.5:1 minimum)
- Focus indicators for keyboard navigation

### Best Practices
- Semantic HTML elements
- Alternative text for images
- Descriptive link text
- Error messages near form fields
- Skip navigation links

## Performance

### Targets
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Bundle size: < 1MB per route
- Image optimization: WebP with fallbacks

### Optimization Strategies
- Code splitting with lazy loading
- Tree shaking unused styles
- Asset compression and caching
- CDN for static resources
- Progressive enhancement

## Maintenance

### Version Control
- Document all style changes
- Use semantic versioning for updates
- Maintain backwards compatibility
- Test across all sites before deploying

### Review Process
1. Propose changes in style guide
2. Test in isolated environment
3. Review impact on all sites
4. Update documentation
5. Deploy incrementally

## Contact
For questions about the design system or to propose changes, please create an issue in the repository.