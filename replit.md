# EduX - Full-Stack University Application Management

## Overview
EduX is a full-stack application for managing university applications, featuring a React + TypeScript frontend and Django REST API backend. The system provides comprehensive user management, university browsing, and application tracking with role-based access controls.

## Recent Changes (September 13, 2025)
- Successfully imported GitHub repository to Replit environment
- Configured Python 3.12 and Node.js 20 environments with all dependencies
- Set up database with SQLite fallback (PostgreSQL support maintained)
- Applied all database migrations for accounts, universities, and applications
- **Built complete React + TypeScript frontend with modern tooling**
- Configured proper port separation: React (5000), Django (8000)
- Implemented JWT authentication with automatic token refresh
- Added role-based access controls and CRUD interfaces
- Set up deployment configuration for autoscale deployment

## Project Architecture
- **Backend**: Django 5.2.6 with Django REST Framework 3.16.1
- **Frontend**: React 18 + TypeScript + Vite
- **Database**: SQLite (development) with PostgreSQL support
- **Authentication**: JWT tokens with automatic refresh
- **Build Tool**: Vite with proxy configuration for seamless development
- **Apps**: 
  - `accounts` - Custom user management with email authentication
  - `universities` - University data management
  - `applications` - Application tracking system

## Frontend Features
- **Authentication System**: Login/Registration with JWT token management
- **Universities Interface**: Browse universities (all users) + Admin CRUD (staff only)
- **Applications Management**: Full CRUD with owner-based permissions
- **Role-Based Access**: Admin-only university management, user-only application access
- **Responsive Design**: Clean, professional interface with proper form validation
- **Auto Token Refresh**: Seamless authentication with automatic token renewal

## API Endpoints
- `POST /api/v1/token/` - Obtain JWT token
- `POST /api/v1/token/refresh/` - Refresh JWT token
- `POST /api/v1/register/` - User registration (public)
- `GET /api/v1/user/profile/` - Get current user profile
- `GET/POST /api/v1/universities/` - Universities list/create
- `GET/PUT/DELETE /api/v1/universities/<id>/` - University detail operations
- `GET/POST /api/v1/applications/` - Applications list/create
- `GET/PUT/DELETE /api/v1/applications/<id>/` - Application detail operations
- `GET /admin/` - Django admin interface

## Development Setup
- **Django Backend**: Runs on port 8000 with CORS enabled
- **React Frontend**: Runs on port 5000 with Vite proxy for API calls
- **Database**: SQLite for development, PostgreSQL production-ready
- **Dependencies**: All installed via package managers (pip, npm)

## Role-Based Access Control
- **Public Access**: University browsing, user registration
- **Authenticated Users**: Application management (own applications only)
- **Admin Users**: University CRUD, all application management
- **Automatic Enforcement**: Frontend and backend permission checks

## Environment Configuration
- Uses django-environ for environment variable management
- CORS configured for React frontend integration
- Vite proxy handles API routing without hardcoded URLs
- Debug mode enabled for development
- SQLite database with PostgreSQL fallback

## Deployment Notes
- Configured for Replit autoscale deployment
- Frontend serves on port 5000 (required for Replit webview)
- Backend API on port 8000 with proper CORS configuration
- All dependencies properly installed and configured
- Database migrations applied and ready for use