# Overview

This is a project management prompts reference application built with React, TypeScript, and a Node.js/Express backend. The application serves as a curated library of project management prompts organized by project phases (initiation, planning, execution, monitoring, closing). Users can browse, search, filter, and copy ready-to-use prompts for various project management scenarios.

The application features a modern web interface with search functionality, stage-based filtering, modal dialogs for detailed prompt viewing, and seamless copy-to-clipboard functionality. It's designed specifically for project managers who need quick access to well-structured prompts for different project activities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives for accessibility and consistency
- **Styling**: TailwindCSS with custom design system following Material Design principles
- **State Management**: React Query (TanStack Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Theme System**: Custom light/dark theme provider with localStorage persistence

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database Integration**: Dual support for PostgreSQL (via Neon) and Prisma ORM
- **Schema Management**: Drizzle ORM as the primary database toolkit with schema definitions
- **API Design**: RESTful endpoints with search, filtering, and pagination capabilities
- **Development**: Hot reload via Vite dev server with proxy configuration

## Data Storage Strategy
- **Primary Database**: PostgreSQL via Neon Database (serverless)
- **ORM Layer**: Drizzle ORM for type-safe database operations
- **Backup Support**: Prisma client for potential database operations
- **Schema**: Prompts table with fields for title, summary, full text, project stage, and metadata
- **Seeding**: JSON-based seed data system for initial prompt population

## Component Design Patterns
- **Card-based Layout**: Prompts displayed as cards with summary information and action buttons
- **Modal System**: Full-screen prompt details with scrollable content area
- **Search & Filter**: Debounced search with stage-based filtering
- **Responsive Design**: Mobile-first approach with touch-optimized interactions
- **Accessibility**: Screen reader support, keyboard navigation, and focus management

## Development Workflow
- **Build Process**: Vite for fast development builds and optimized production bundles
- **Type Safety**: Full TypeScript coverage across frontend, backend, and shared schemas
- **Code Organization**: Feature-based component structure with shared utilities
- **Asset Management**: Static assets served via Vite with proper caching headers

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle Kit**: Database migrations and schema management
- **WebSocket Support**: Real-time database connections via Neon's serverless architecture

## UI and Design
- **Radix UI**: Accessible component primitives for dialogs, dropdowns, and form elements
- **Lucide React**: Modern icon library for consistent iconography
- **TailwindCSS**: Utility-first CSS framework with custom design tokens
- **Google Fonts**: Inter font family for typography consistency

## Development Tools
- **Vite**: Fast build tool with hot module replacement
- **TypeScript**: Static type checking across the entire application
- **ESBuild**: Fast JavaScript/TypeScript bundling for production
- **PostCSS**: CSS processing with Autoprefixer for browser compatibility

## Runtime Libraries
- **React Query**: Server state management with caching and background updates
- **React Hook Form**: Form state management with validation
- **Date-fns**: Date manipulation and formatting utilities
- **Wouter**: Lightweight routing library for single-page application navigation

## Deployment Platform
- **Replit**: Hosted development and deployment environment
- **Replit Cartographer**: Development mode enhancements and debugging tools
- **Environment Variables**: Secure configuration management for database connections