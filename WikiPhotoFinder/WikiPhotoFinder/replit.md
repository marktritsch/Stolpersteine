# Stolpersteine Ulm - Memorial Search Application

## Overview

This is a full-stack web application for searching and exploring Stolpersteine (memorial stones) in Ulm, Germany. The application allows users to search for memorial stones by name and provides detailed information including addresses, installation dates, lifespans, and images. The app scrapes data from Wikipedia and dedicated Stolpersteine websites when local data is not available.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Library**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API**: RESTful API with JSON responses
- **Data Storage**: In-memory storage with planned PostgreSQL integration
- **Web Scraping**: Cheerio for HTML parsing from external sources

### Key Components

1. **Search System**: Implements a two-tier search strategy - first checking local storage, then scraping external sources if needed
2. **Data Scraping**: Service-based architecture for scraping Wikipedia and Stolpersteine-specific websites
3. **Image Handling**: Modal-based image viewing with keyboard navigation support
4. **Responsive Design**: Mobile-first approach with adaptive layouts
5. **Error Handling**: Comprehensive error boundaries and user feedback

## Data Flow

1. **Search Request**: User enters a name in the search form
2. **Local Search**: Application first searches in-memory storage
3. **External Scraping**: If no local results, scrapes Wikipedia and Stolpersteine websites
4. **Data Persistence**: Scraped results are stored locally for future searches
5. **Results Display**: Search results are displayed with images, addresses, and metadata
6. **Image Viewing**: Users can click images to view them in a full-screen modal

## External Dependencies

### Core Technologies
- **Database**: Drizzle ORM configured for PostgreSQL (currently using in-memory storage)
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **UI Components**: Comprehensive set of Radix UI primitives
- **Data Fetching**: TanStack Query for caching and synchronization
- **Web Scraping**: Cheerio for server-side HTML parsing

### Data Sources
- **Wikipedia**: Primary source for Stolpersteine data in Ulm
- **Stolpersteine-für-Ulm.de**: Secondary source for additional memorial information
- **External Images**: Memorial stone photographs from various sources

### Development Tools
- **Replit Integration**: Custom plugins for development environment
- **TypeScript**: Full type safety across frontend and backend
- **ESBuild**: Production bundling for server-side code

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite dev server with HMR support
- **API Development**: Express server with automatic restarts
- **Database**: In-memory storage for rapid development

### Production Build
- **Frontend**: Vite builds optimized React application to `dist/public`
- **Backend**: ESBuild bundles Node.js server to `dist/index.js`
- **Database**: Drizzle migrations for PostgreSQL schema deployment
- **Environment**: Production-ready with proper error handling and logging

### Database Migration
- **Schema**: Defined in `shared/schema.ts` using Drizzle ORM
- **Migrations**: Generated in `./migrations` directory
- **Deployment**: `db:push` command for schema updates

The application is designed to be easily deployable to various platforms with minimal configuration changes, supporting both development and production environments seamlessly.

## Changelog
- June 30, 2025. Initial setup
- June 30, 2025. Fixed Wikipedia scraper to properly parse table structure and extract Stolperstein data
- June 30, 2025. Enhanced mobile layout with larger, more readable memorial stone photos (h-64 md:h-80 lg:h-96)
- June 30, 2025. Improved responsive design prioritizing image display for inscription readability
- June 30, 2025. Modified to display photos at full natural height immediately, removed modal enlargement feature
- June 30, 2025. Removed Lebensdaten (lifespan) information from display as requested

## User Preferences

Preferred communication style: Simple, everyday language.