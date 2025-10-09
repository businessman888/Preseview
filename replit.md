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
- [x] Figma assets integration verified and working
- [x] Navigation system implemented with functional routing
- [x] All pages created and accessible
- [x] All features tested and working

## Current Features
- **Unified Account System**: All users create a single account type, with option to upgrade to creator within the platform
- **Creator Upgrade Flow**: Users can become creators through a dedicated page with subscription price and profile setup
- Social media feed interface (Homepage)
- Creator profiles display
- Post interaction buttons (like, comment, tip, bookmark)
- Horizontal scrolling creator stories
- Suggested creators section with follow buttons
- Functional bottom navigation bar with routing
- Messages page with conversation list
- Search/Explore page with trending topics and creator suggestions
- Notifications page with activity feed
- Profile page with user posts grid and tabs
- Mobile-responsive design
- Interactive elements with proper data-testid attributes

## Asset Dependencies
The application references Figma assets in `/figmaAssets/` directory:
- Creator profile images (ellipse-*.png, frame-*.png)
- Post images (fttpost2.png)
- Header graphics (head.svg)
- UI icons (verified.png)

## User Preferences
None specified yet.

## Recent Changes
- 2025-10-09: Implemented unified account creation system
  - Removed user type selection from registration (all new accounts are regular users)
  - Created "Become Creator" page at `/become-creator` with subscription setup
  - Added `POST /api/user/become-creator` endpoint for account upgrades
  - Added "Tornar-se Criador" button in profile for non-creator users
  - Updated storage layer with `upgradeToCreator()` method
- 2025-08-03: Initial migration from Figma to Replit completed
- Project structure examined and documented
- Created functional navigation system with wouter routing
- Implemented Messages, Search, Notifications, and Profile pages
- Added interactive elements and proper data-testid attributes
- Fixed all import errors and navigation links
- All pages now fully functional and accessible via bottom navigation