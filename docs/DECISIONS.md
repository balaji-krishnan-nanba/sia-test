# Architecture & Design Decisions

## 2025-12-07 - Framework Selection: Vite vs Next.js

### Context
Needed to choose between Vite and Next.js as the build tool/framework for the SIA Exam Prep application. The application will feature quiz functionality, mock exams, user authentication, progress tracking, and subscription management.

### Options Considered

1. **Next.js 15**
   - Pros:
     - Built-in SSR/SSG for excellent SEO
     - File-based routing system
     - API routes built-in
     - Excellent Vercel integration
     - Image optimization out of the box
   - Cons:
     - Heavier framework, more complexity
     - Slower dev server compared to Vite
     - Overkill for SPA-heavy applications
     - More configuration needed for SPA features
     - Steeper learning curve for team

2. **Vite 6 (CHOSEN)**
   - Pros:
     - Lightning-fast HMR and dev server
     - Simpler configuration and setup
     - Perfect for SPA architecture
     - Smaller bundle sizes by default
     - Modern tooling (ESM, SWC)
     - Excellent DX for MVP iteration
     - Easy to migrate to Next.js later if needed
   - Cons:
     - No built-in SSR
     - Manual routing setup required
     - Less SEO-friendly out of the box

### Decision
**Chose Vite 6 with React SWC template**

### Rationale

1. **MVP-First Approach**: Vite's faster development experience allows for quicker iteration during the MVP phase.

2. **Architecture Alignment**: The application is primarily:
   - Behind authentication (minimal SEO needs)
   - SPA-style interactions (quiz, exam taking)
   - Using Supabase for backend (no need for Next.js API routes)

3. **Performance**:
   - Instant HMR improves developer productivity
   - Smaller bundle sizes benefit end users
   - SWC provides ultra-fast TypeScript compilation

4. **Complexity Management**: Vite's simplicity allows the team to focus on business logic rather than framework configuration.

5. **Future-Proof**: If SEO becomes critical (e.g., for landing pages), we can:
   - Add static landing pages separately
   - Migrate to Next.js with minimal code changes
   - Use Vite SSR plugin

### Consequences

**Positive:**
- Faster development cycles
- Better developer experience
- Smaller learning curve
- More control over routing and code splitting

**Tradeoffs:**
- Need to handle SEO separately for landing page
- Manual React Router setup (completed)
- No built-in API routes (using Supabase instead)

### Related Files
- `vite.config.ts` - Vite configuration
- `src/App.tsx` - React Router setup
- `package.json` - Build scripts

---

## 2025-12-07 - TypeScript Strict Mode Configuration

### Context
Deciding the level of TypeScript strictness for the project.

### Decision
Enabled **full strict mode** with additional safety checks:
- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noFallthroughCasesInSwitch: true`
- `noUncheckedIndexedAccess: true`
- `noImplicitReturns: true`

### Rationale

1. **Type Safety**: Catch errors at compile time rather than runtime
2. **Better IDE Support**: Enhanced autocomplete and error detection
3. **Code Quality**: Forces developers to handle edge cases
4. **Maintainability**: Explicit types make code easier to understand and refactor
5. **Production Ready**: Strict mode is a best practice for production applications

### Consequences

**Positive:**
- Fewer runtime errors
- Better code documentation through types
- Improved refactoring safety
- Catches array indexing bugs (`noUncheckedIndexedAccess`)

**Tradeoffs:**
- Slightly more verbose code (type annotations required)
- Initial development may be slower (worth it for quality)

### Related Files
- `tsconfig.app.json` - TypeScript configuration

---

## 2025-12-07 - Path Aliases Strategy

### Context
Deciding on import path strategy for the application.

### Decision
Implemented comprehensive path aliases:
- `@/*` → `./src/*`
- `@components/*` → `./src/components/*`
- `@pages/*` → `./src/pages/*`
- `@hooks/*` → `./src/hooks/*`
- `@lib/*` → `./src/lib/*`
- `@types/*` → `./src/types/*`
- `@utils/*` → `./src/utils/*`
- `@contexts/*` → `./src/contexts/*`
- `@data/*` → `./src/data/*`
- `@assets/*` → `./src/assets/*`

### Rationale

1. **Readability**: Absolute imports are clearer than relative paths
2. **Refactoring**: Moving files doesn't break imports
3. **Consistency**: All imports follow the same pattern
4. **IDE Support**: Better autocomplete with absolute paths

### Consequences

**Positive:**
- No more `../../../../` import chains
- Easy to understand file relationships
- Simple to refactor and move files

**Tradeoffs:**
- Need to configure both TypeScript and Vite
- New developers need to learn alias conventions

### Related Files
- `tsconfig.app.json` - TypeScript path aliases
- `vite.config.ts` - Vite path resolution

---

## 2025-12-07 - Code Splitting Strategy

### Context
Optimizing bundle size and initial load time.

### Decision
Implemented route-based code splitting with manual vendor chunks:
- Lazy load all routes except home page
- Separate chunks for: react-vendor, supabase, stripe

### Rationale

1. **Performance**: Users only download code they need
2. **Caching**: Vendor code changes less frequently
3. **Initial Load**: Faster first paint with smaller initial bundle

### Consequences

**Positive:**
- Faster initial page load
- Better caching strategy
- Reduced bandwidth usage

**Tradeoffs:**
- Slightly more complex build configuration
- Route transitions require chunk loading (minimal delay)

### Related Files
- `vite.config.ts` - Manual chunk configuration
- `src/App.tsx` - Lazy route loading
