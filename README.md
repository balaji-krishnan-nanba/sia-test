# SIA Exam Prep - siaexamprep.co.uk

> Comprehensive web application for UK Security Industry Authority (SIA) exam preparation

A modern, production-ready web application for SIA (Security Industry Authority) exam preparation built with React, TypeScript, and Tailwind CSS.

## Documentation

Complete project documentation is available in the `/docs` directory:

- [PROJECT.md](./docs/PROJECT.md) - Business model, pricing strategy, target audience
- [SPECIFICATION.md](./docs/SPECIFICATION.md) - Complete technical specification
- [EXAMS.md](./docs/EXAMS.md) - Exam structure and metadata
- [DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md) - UI/UX design system
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - System architecture
- [API.md](./docs/API.md) - API documentation
- [DATABASE.md](./docs/DATABASE.md) - Database schema
- [DEPLOYMENT.md](./docs/DEPLOYMENT.md) - Deployment guide

**Session Documentation**: See [docs/SESSION_LOG.md](./docs/SESSION_LOG.md), [docs/CHANGELOG.md](./docs/CHANGELOG.md), [docs/DECISIONS.md](./docs/DECISIONS.md), [docs/TODO.md](./docs/TODO.md)

---

## Tech Stack

- **Framework**: React 18.3 with TypeScript 5.6
- **Build Tool**: Vite 6.0 (SWC for ultra-fast builds)
- **Styling**: Tailwind CSS 3.4 with custom design system
- **Routing**: React Router DOM 6.28
- **Backend**: Supabase (PostgreSQL + Auth)
- **Payments**: Stripe
- **Authentication**: Google OAuth + Email/Password
- **Date Utilities**: date-fns
- **Notifications**: react-hot-toast
- **Deployment**: Vercel

## Project Structure

```
sia-door-supervisor/
├── src/
│   ├── components/          # React components
│   │   ├── quiz/           # Quiz-related components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── mock-exam/      # Mock exam components
│   │   ├── layout/         # Layout components (Header, Footer, etc.)
│   │   └── ui/             # Reusable UI components (Button, Card, etc.)
│   ├── pages/              # Page components (route handlers)
│   ├── contexts/           # React Context providers
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Third-party library configurations
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── data/               # Static data and constants
│   └── assets/             # Images, fonts, etc.
├── public/                 # Public static assets
├── docs/                   # Documentation (session logs, decisions, etc.)
├── Questions/              # SIA question banks
└── [config files]
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Stripe account
- Google Cloud Console project (for OAuth)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sia-door-supervisor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```

   Then edit `.env` and fill in your credentials:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `VITE_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
   - `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth client ID

4. **Run development server**
   ```bash
   npm run dev
   ```

   The app will open at `http://localhost:3000`

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors automatically |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run type-check` | Run TypeScript type checking |

## Design System

### Colors

```javascript
primary: '#1E3A5F'    // Deep navy blue
secondary: '#2D7DD2'  // Bright blue
accent: '#45B649'     // Success green
warning: '#F39C12'    // Warning orange
error: '#E74C3C'      // Error red
background: '#F8FAFC' // Light gray background
```

### Typography

- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800

### Spacing Scale

- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px

### Border Radius

- `sm`: 8px
- `md`: 12px
- `lg`: 16px

### Shadows

- `card`: Subtle shadow for cards
- `elevated`: Medium shadow for elevated elements
- `modal`: Strong shadow for modals

## Features

### Current

- ✅ Modern React 18 setup with TypeScript
- ✅ Tailwind CSS with custom design system
- ✅ React Router with lazy loading
- ✅ TypeScript strict mode with path aliases
- ✅ ESLint + Prettier configuration
- ✅ Production-ready build optimization
- ✅ Code splitting by route

### Planned

- [ ] User authentication (Google OAuth + Email)
- [ ] Quiz practice mode with progress tracking
- [ ] Full mock exam functionality
- [ ] Performance analytics dashboard
- [ ] Study planner
- [ ] Subscription management with Stripe
- [ ] Mobile responsive design
- [ ] PWA support
- [ ] Dark mode

## TypeScript Configuration

This project uses **strict mode** TypeScript with:

- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noFallthroughCasesInSwitch: true`
- `noUncheckedIndexedAccess: true`
- `noImplicitReturns: true`

### Path Aliases

```typescript
@/*           → ./src/*
@components/* → ./src/components/*
@pages/*      → ./src/pages/*
@hooks/*      → ./src/hooks/*
@lib/*        → ./src/lib/*
@types/*      → ./src/types/*
@utils/*      → ./src/utils/*
@contexts/*   → ./src/contexts/*
@data/*       → ./src/data/*
@assets/*     → ./src/assets/*
```

## Code Quality

- **ESLint**: Strict TypeScript rules with React hooks plugin
- **Prettier**: Consistent code formatting with Tailwind plugin
- **Type Safety**: Comprehensive TypeScript types for all domains

## Build Optimization

- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: All routes except home page are lazy loaded
- **Manual Chunks**: Vendor libraries split into separate chunks
  - `react-vendor`: React, React DOM, React Router
  - `supabase`: Supabase client
  - `stripe`: Stripe libraries
- **Tree Shaking**: ES modules for optimal tree shaking
- **Minification**: Automatic in production builds

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual Build

```bash
npm run build
```

The `dist/` folder will contain the production build.

## Contributing

1. Create a feature branch
2. Make your changes
3. Run linting and type checking
4. Submit a pull request

## License

Private - All rights reserved

## Support

For questions or issues, please contact the development team.
