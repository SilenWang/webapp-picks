# Agent Guidelines for webapp-picks

This document provides guidelines for AI agents working on this codebase.

## Project Overview

A Next.js web application that serves as an app store for webapps (PWA support). Built with Next.js 16, TypeScript, and Tailwind CSS v4.

## Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
```

### Linting & Type Checking
```bash
npm run lint         # Run ESLint
```

### Testing
No test framework is currently configured. Do not write tests unless explicitly requested by the user.

## Code Style Guidelines

### General
- Use TypeScript for all new code
- Enable strict mode in TypeScript (already enabled)
- Avoid `any` type - use proper types or `unknown`
- Use `eslint-config-next` rules (already configured)

### Formatting
- Use 2 spaces for indentation
- Use single quotes for strings in JS/JSX
- Use double quotes for strings in TS
- Add trailing commas where practical
- Use explicit return types for exported functions

### Imports
- Use absolute imports with `@/` prefix (configured in tsconfig.json)
- Order imports: external libs, then internal modules
- Example: `import { useState } from 'react'; import { getApps } from '@/lib/apps';`

### Naming Conventions
- Components: PascalCase (e.g., `AppCard.tsx`)
- Functions/variables: camelCase (e.g., `getAllApps`)
- Types/Interfaces: PascalCase (e.g., `WebApp`, `CategoryConfig`)
- Files: kebab-case for utilities (e.g., `apps.ts`), PascalCase for components

### Components
- Use functional components with hooks
- Define component types with explicit props interfaces
- Use `export default` for page components, named exports for utilities
- Keep components small and focused

### React/Next.js Patterns
- Use Server Components by default (no 'use client' unless needed)
- Use `next/navigation` for routing (not `next/router`)
- Use Server Actions for form submissions when needed
- Mark client components with `'use client'` directive at top of file

### Error Handling
- Use try/catch for async operations
- Handle edge cases explicitly (undefined, null, empty arrays)
- Return appropriate types (undefined vs null)

### Tailwind CSS
- Use Tailwind v4 syntax (CSS-first configuration)
- Use `clsx` and `tailwind-merge` for conditional classes
- Use utility classes directly in JSX
- Follow mobile-first responsive design

### File Organization
```
src/
  app/           # Next.js App Router pages
  components/    # Reusable React components
  lib/           # Utility functions
  data/          # YAML data files
  types/         # TypeScript type definitions
```

### Data Handling
- Data is stored in YAML files in `src/data/`
- Use the existing pattern in `src/lib/apps.ts` for loading data
- Always cache data reads (see `cachedApps`, `cachedCategories` pattern)

### Internationalization
- Support `en` and `zh` locales
- Use the `Locale` type from `@/lib/types`
- Store translations in component or use i18n pattern

### PWA/Service Worker
- Service worker files are in `src/app/sw.ts` (excluded from TypeScript checks)
- Use Serwist for PWA support
- Manifest at `src/app/manifest.ts`

### Performance Considerations
- Use React Server Components to reduce client bundle
- Lazy load components when needed
- Optimize images with Next.js Image component

## Important Notes

- The project uses Next.js 16 with Turbopack for development
- ESLint configuration combines `eslint-config-next/core-web-vitals` and TypeScript rules
- TypeScript strict mode is enabled
- The project does not currently have tests - do not add test files unless requested
