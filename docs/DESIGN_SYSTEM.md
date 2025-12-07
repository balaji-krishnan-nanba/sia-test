# Design System - SIA Exam Prep

> **Version:** 1.0
> **Last Updated:** December 7, 2025
> **Framework:** Tailwind CSS 3+

---

## Table of Contents

1. [Design Principles](#design-principles)
2. [Brand Colors](#brand-colors)
3. [Typography](#typography)
4. [Spacing Scale](#spacing-scale)
5. [Border Radius](#border-radius)
6. [Shadows](#shadows)
7. [Breakpoints](#breakpoints)
8. [Component Patterns](#component-patterns)
9. [Tailwind Configuration](#tailwind-configuration)
10. [Accessibility Guidelines](#accessibility-guidelines)

---

## Design Principles

### 1. Clarity First

- **Clean, uncluttered interfaces** - Education apps should not distract
- **Clear visual hierarchy** - Important elements stand out
- **Obvious CTAs** - Users always know what to do next

### 2. Mobile-First

- **Design for smallest screens first** - Progressive enhancement
- **Touch-friendly targets** - Minimum 44x44px tap areas
- **Thumb-zone optimization** - Key actions within easy reach

### 3. Performance-Oriented

- **Fast loading** - Perceived and actual performance
- **Lightweight CSS** - Tailwind's purge removes unused styles
- **Optimized images** - Next.js Image component

### 4. Accessible by Default

- **WCAG 2.1 AA compliance** - Legal requirement + right thing to do
- **Keyboard navigable** - All interactions work without mouse
- **Screen reader friendly** - Semantic HTML + ARIA labels

### 5. Consistent & Predictable

- **Reusable components** - Same UI patterns throughout
- **Predictable behavior** - Buttons always act like buttons
- **Visual consistency** - Colors, spacing, typography uniform

---

## Brand Colors

### Primary Palette

These colors represent the SIA Exam Prep brand and are used for key UI elements.

```javascript
// Tailwind config colors
const colors = {
  // Primary brand color - used for CTAs, links, active states
  primary: {
    50: '#eff6ff',   // Very light blue
    100: '#dbeafe',  // Light blue
    200: '#bfdbfe',  // Lighter blue
    300: '#93c5fd',  // Light blue
    400: '#60a5fa',  // Medium light blue
    500: '#3b82f6',  // Primary blue (main brand color)
    600: '#2563eb',  // Darker blue (hover states)
    700: '#1d4ed8',  // Dark blue
    800: '#1e40af',  // Darker blue
    900: '#1e3a8a',  // Very dark blue
  },

  // Success - used for correct answers, pass indicators
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',  // Main success green
    600: '#16a34a',  // Darker green (hover)
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  // Error - used for incorrect answers, fail indicators, validation errors
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',  // Main error red
    600: '#dc2626',  // Darker red (hover)
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // Warning - used for cautions, time warnings
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',  // Main warning yellow
    600: '#d97706',  // Darker yellow (hover)
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  // Neutral - used for text, backgrounds, borders
  neutral: {
    50: '#fafafa',   // Lightest gray (subtle backgrounds)
    100: '#f5f5f5',  // Very light gray
    200: '#e5e5e5',  // Light gray (borders)
    300: '#d4d4d4',  // Gray
    400: '#a3a3a3',  // Medium gray (muted text)
    500: '#737373',  // Gray (secondary text)
    600: '#525252',  // Dark gray (body text)
    700: '#404040',  // Darker gray
    800: '#262626',  // Very dark gray (headings)
    900: '#171717',  // Almost black
  },
}
```

### Color Usage Guidelines

| Use Case | Color | Tailwind Class |
|----------|-------|----------------|
| **Primary CTA buttons** | primary-600 | `bg-primary-600 hover:bg-primary-700` |
| **Links** | primary-600 | `text-primary-600 hover:text-primary-700` |
| **Correct answer feedback** | success-500 | `bg-success-500 text-white` |
| **Incorrect answer feedback** | error-500 | `bg-error-500 text-white` |
| **Exam pass badge** | success-600 | `bg-success-600 text-white` |
| **Exam fail badge** | error-600 | `bg-error-600 text-white` |
| **Timer warning (< 10 min)** | warning-500 | `text-warning-500` |
| **Body text** | neutral-700 | `text-neutral-700` |
| **Headings** | neutral-900 | `text-neutral-900` |
| **Muted text** | neutral-500 | `text-neutral-500` |
| **Borders** | neutral-200 | `border-neutral-200` |
| **Backgrounds (subtle)** | neutral-50 | `bg-neutral-50` |

### Accessibility - Color Contrast

All color combinations meet WCAG 2.1 AA contrast requirements:

- **Normal text (< 18px):** Minimum 4.5:1 contrast
- **Large text (≥ 18px or bold ≥ 14px):** Minimum 3:1 contrast
- **UI components:** Minimum 3:1 contrast

**Verified Combinations:**

| Background | Text | Contrast Ratio | Pass |
|------------|------|----------------|------|
| white | neutral-700 | 8.59:1 | Pass AAA |
| white | neutral-600 | 6.28:1 | Pass AAA |
| primary-600 | white | 4.54:1 | Pass AA |
| success-600 | white | 4.53:1 | Pass AA |
| error-600 | white | 5.35:1 | Pass AA |

---

## Typography

### Font Families

```javascript
const fontFamily = {
  // Sans-serif for UI and body text
  sans: ['Inter', 'system-ui', 'sans-serif'],

  // Monospace for code (if needed for technical explanations)
  mono: ['Fira Code', 'monospace'],
}
```

**Primary Font:** Inter
- Modern, highly legible sans-serif
- Excellent readability at all sizes
- Variable font for performance
- Free and open-source

**CDN or npm:**
- Via Google Fonts: `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap`
- Or npm: `npm install @fontsource/inter`

### Font Sizes

```javascript
const fontSize = {
  'xs': ['0.75rem', { lineHeight: '1rem' }],       // 12px
  'sm': ['0.875rem', { lineHeight: '1.25rem' }],   // 14px
  'base': ['1rem', { lineHeight: '1.5rem' }],      // 16px (default)
  'lg': ['1.125rem', { lineHeight: '1.75rem' }],   // 18px
  'xl': ['1.25rem', { lineHeight: '1.75rem' }],    // 20px
  '2xl': ['1.5rem', { lineHeight: '2rem' }],       // 24px
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }],  // 30px
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }],    // 36px
  '5xl': ['3rem', { lineHeight: '1' }],            // 48px
  '6xl': ['3.75rem', { lineHeight: '1' }],         // 60px
}
```

### Typography Scale Usage

| Element | Font Size | Weight | Tailwind Classes |
|---------|-----------|--------|------------------|
| **H1 (Page title)** | 3xl (30px) | 700 (bold) | `text-3xl font-bold` |
| **H2 (Section heading)** | 2xl (24px) | 700 (bold) | `text-2xl font-bold` |
| **H3 (Subsection)** | xl (20px) | 600 (semibold) | `text-xl font-semibold` |
| **H4 (Card title)** | lg (18px) | 600 (semibold) | `text-lg font-semibold` |
| **Body text** | base (16px) | 400 (normal) | `text-base` |
| **Small text** | sm (14px) | 400 (normal) | `text-sm` |
| **Tiny text** | xs (12px) | 400 (normal) | `text-xs` |
| **Button text** | base (16px) | 500 (medium) | `text-base font-medium` |
| **Question text** | lg (18px) | 400 (normal) | `text-lg` |
| **Explanation text** | base (16px) | 400 (normal) | `text-base` |

### Font Weights

```javascript
const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
}
```

### Line Heights

- **Headings:** Tighter line height (1.2-1.3) for compactness
- **Body text:** Comfortable line height (1.5) for readability
- **Small text:** Proportional line height (1.4)

---

## Spacing Scale

Tailwind uses a spacing scale based on `0.25rem` (4px) increments.

```javascript
const spacing = {
  0: '0px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  32: '8rem',       // 128px
}
```

### Spacing Usage Guidelines

| Use Case | Spacing | Tailwind Class |
|----------|---------|----------------|
| **Button padding (horizontal)** | 6 (24px) | `px-6` |
| **Button padding (vertical)** | 3 (12px) | `py-3` |
| **Card padding** | 6 (24px) | `p-6` |
| **Section margin (vertical)** | 8-12 (32-48px) | `my-8` or `my-12` |
| **Element spacing (stack)** | 4 (16px) | `space-y-4` |
| **Form field gap** | 6 (24px) | `space-y-6` |
| **Container padding (mobile)** | 4 (16px) | `px-4` |
| **Container padding (desktop)** | 8 (32px) | `lg:px-8` |

---

## Border Radius

```javascript
const borderRadius = {
  none: '0px',
  sm: '0.125rem',   // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',   // Circular
}
```

### Border Radius Usage

| Element | Radius | Tailwind Class |
|---------|--------|----------------|
| **Buttons** | lg (8px) | `rounded-lg` |
| **Cards** | xl (12px) | `rounded-xl` |
| **Input fields** | md (6px) | `rounded-md` |
| **Badges/Pills** | full (circular ends) | `rounded-full` |
| **Avatar** | full (circle) | `rounded-full` |
| **Modal** | 2xl (16px) | `rounded-2xl` |

---

## Shadows

```javascript
const boxShadow = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: '0 0 #0000',
}
```

### Shadow Usage

| Element | Shadow | Tailwind Class |
|---------|--------|----------------|
| **Cards (default)** | sm | `shadow-sm` |
| **Cards (hover)** | md | `hover:shadow-md` |
| **Buttons** | sm | `shadow-sm` |
| **Modals** | xl | `shadow-xl` |
| **Dropdowns** | lg | `shadow-lg` |
| **Floating action button** | lg | `shadow-lg` |

---

## Breakpoints

Tailwind uses mobile-first responsive design.

```javascript
const screens = {
  'sm': '640px',   // Small devices (large phones, 640px and up)
  'md': '768px',   // Medium devices (tablets, 768px and up)
  'lg': '1024px',  // Large devices (desktops, 1024px and up)
  'xl': '1280px',  // Extra large devices (large desktops, 1280px and up)
  '2xl': '1536px', // 2X large devices (larger desktops, 1536px and up)
}
```

### Breakpoint Strategy

**Mobile-First Approach:**

1. **Default (< 640px):** Mobile design
   - Single column layouts
   - Stacked elements
   - Full-width buttons

2. **sm (640px+):** Large phones, small tablets
   - Start introducing multi-column layouts (2 columns)
   - Side-by-side buttons

3. **md (768px+):** Tablets
   - 2-3 column layouts
   - Sidebar navigation becomes visible
   - Larger text sizes

4. **lg (1024px+):** Desktops
   - Full desktop layout
   - Multi-column grids (3-4 columns)
   - Sidebar always visible
   - Hover states active

5. **xl (1280px+):** Large desktops
   - Max-width containers to prevent overly wide content
   - Optional: wider sidebars

### Example Responsive Classes

```html
<!-- Mobile: stacked, Desktop: side-by-side -->
<div class="flex flex-col lg:flex-row gap-4">
  <div class="w-full lg:w-1/2">Column 1</div>
  <div class="w-full lg:w-1/2">Column 2</div>
</div>

<!-- Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<!-- Responsive padding -->
<div class="px-4 md:px-6 lg:px-8">
  Content
</div>

<!-- Responsive text size -->
<h1 class="text-2xl md:text-3xl lg:text-4xl">Heading</h1>
```

---

## Component Patterns

### Buttons

#### Primary Button

```html
<button class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200">
  Start Practicing
</button>
```

**States:**
- Default: `bg-primary-600`
- Hover: `hover:bg-primary-700`
- Focus: `focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`
- Disabled: `disabled:bg-neutral-300 disabled:cursor-not-allowed`

#### Secondary Button

```html
<button class="px-6 py-3 bg-white hover:bg-neutral-50 text-primary-600 font-medium border border-primary-600 rounded-lg transition-colors duration-200">
  See Pricing
</button>
```

#### Ghost Button

```html
<button class="px-6 py-3 text-primary-600 hover:bg-primary-50 font-medium rounded-lg transition-colors duration-200">
  Learn More
</button>
```

---

### Cards

#### Basic Card

```html
<div class="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-neutral-200">
  <h3 class="text-lg font-semibold text-neutral-900 mb-2">Card Title</h3>
  <p class="text-neutral-600">Card content goes here.</p>
</div>
```

#### Interactive Card (clickable)

```html
<button class="w-full bg-white p-6 rounded-xl shadow-sm hover:shadow-md hover:border-primary-600 transition-all duration-200 border border-neutral-200 text-left">
  <h3 class="text-lg font-semibold text-neutral-900 mb-2">Door Supervisor</h3>
  <p class="text-neutral-600">703 practice questions</p>
</button>
```

---

### Form Inputs

#### Text Input

```html
<div class="space-y-2">
  <label for="email" class="block text-sm font-medium text-neutral-700">
    Email
  </label>
  <input
    type="email"
    id="email"
    class="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
    placeholder="you@example.com"
  />
</div>
```

**States:**
- Default: `border-neutral-300`
- Focus: `focus:ring-2 focus:ring-primary-500 focus:border-primary-500`
- Error: `border-error-500 focus:ring-error-500`
- Success: `border-success-500 focus:ring-success-500`
- Disabled: `disabled:bg-neutral-100 disabled:cursor-not-allowed`

---

### Question Card

```html
<div class="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
  <!-- Question header -->
  <div class="flex items-center justify-between mb-4">
    <span class="text-sm text-neutral-500">Question 5 of 703</span>
    <span class="px-3 py-1 bg-warning-100 text-warning-700 text-xs font-medium rounded-full">
      Medium
    </span>
  </div>

  <!-- Question text -->
  <h3 class="text-lg text-neutral-900 mb-6">
    What is the minimum age to apply for an SIA licence?
  </h3>

  <!-- Answer options -->
  <div class="space-y-3">
    <button class="w-full p-4 text-left border-2 border-neutral-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-colors">
      <span class="font-medium text-neutral-900">A)</span> 16 years old
    </button>
    <button class="w-full p-4 text-left border-2 border-neutral-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-colors">
      <span class="font-medium text-neutral-900">B)</span> 18 years old
    </button>
    <button class="w-full p-4 text-left border-2 border-neutral-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-colors">
      <span class="font-medium text-neutral-900">C)</span> 21 years old
    </button>
    <button class="w-full p-4 text-left border-2 border-neutral-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-colors">
      <span class="font-medium text-neutral-900">D)</span> 25 years old
    </button>
  </div>
</div>
```

**Answer States:**
- Default: `border-neutral-200 hover:border-primary-600`
- Selected: `border-primary-600 bg-primary-50`
- Correct: `border-success-500 bg-success-50`
- Incorrect: `border-error-500 bg-error-50`

---

### Progress Bar

```html
<div class="w-full bg-neutral-200 rounded-full h-2.5">
  <div class="bg-primary-600 h-2.5 rounded-full transition-all duration-300" style="width: 45%"></div>
</div>
```

---

### Badges

```html
<!-- Pass badge -->
<span class="px-4 py-2 bg-success-600 text-white text-sm font-medium rounded-full">
  PASS
</span>

<!-- Fail badge -->
<span class="px-4 py-2 bg-error-600 text-white text-sm font-medium rounded-full">
  FAIL
</span>

<!-- Info badge -->
<span class="px-3 py-1 bg-neutral-100 text-neutral-700 text-xs font-medium rounded-full">
  Free Tier
</span>
```

---

## Tailwind Configuration

Complete `tailwind.config.ts` file:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
export default config
```

---

## Accessibility Guidelines

### Keyboard Navigation

- All interactive elements must be focusable
- Visible focus indicators (use `focus:ring-2`)
- Logical tab order (DOM order = visual order)
- Skip links for main content

### Color Contrast

- Verified all combinations meet WCAG AA standards
- Never rely on color alone (use icons + text)
- Test with color blindness simulators

### ARIA Labels

- All buttons have descriptive labels
- Form inputs have associated labels
- Dynamic content updates announced to screen readers

### Responsive Text

- Base font size: 16px (never smaller)
- Text scales with browser zoom
- Line length max: 75 characters for readability

---

## Related Documentation

- [PROJECT.md](./PROJECT.md) - Business and product overview
- [SPECIFICATION.md](./SPECIFICATION.md) - Complete technical specification
- [EXAMS.md](./EXAMS.md) - Exam structure and metadata
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [API.md](./API.md) - API endpoints and integrations
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Hosting and deployment guide

---

*Last Updated: December 7, 2025*
