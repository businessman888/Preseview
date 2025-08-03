# Project Overview

## Description
A full-stack JavaScript social media application migrated from Figma to Replit. Features a modern React frontend with shadcn/ui components and an Express.js backend.

## Technology Stack
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui, Wouter (routing), TanStack Query
- **Backend**: Node.js, Express.js, TypeScript  
- **Database**: PostgreSQL with Drizzle ORM
- **UI Framework**: Radix UI components with Tailwind CSS
- **Styling**: Custom CSS with Inria Sans font family

## Project Architecture

### Frontend Structure
- `/client/src/pages/ScreenHome.tsx` - Main social media feed page
- `/client/src/App.tsx` - Main app component with routing
- `/client/src/components/ui/` - Reusable UI components from shadcn
- `/client/src/lib/` - Utility functions and query client setup

### Backend Structure  
- `/server/index.ts` - Express server setup and middleware
- `/server/routes.ts` - API route handlers
- `/server/storage.ts` - Data storage interface
- `/server/vite.ts` - Vite development server integration

### Shared
- `/shared/schema.ts` - Database schema and TypeScript types

## Migration Status
- [x] Project structure is set up correctly
- [x] All dependencies are installed
- [x] Server is running on port 5000
- [•] Figma assets integration pending verification
- [ ] Database setup and migration complete
- [ ] All features tested and working

## Current Features
- Social media feed interface
- Creator profiles display
- Post interaction buttons (like, comment, tip, bookmark)
- Horizontal scrolling creator stories
- Suggested creators section with follow buttons
- Bottom navigation bar
- Mobile-responsive design

## Asset Dependencies
The application references Figma assets in `/figmaAssets/` directory:
- Creator profile images (ellipse-*.png, frame-*.png)
- Post images (fttpost2.png)
- Header graphics (head.svg)
- UI icons (verified.png)

## User Preferences
None specified yet.

## Recent Changes
- 2025-08-03: Initial migration from Figma to Replit started
- Project structure examined and documented