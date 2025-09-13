# EduX - Django REST API

## Overview
EduX is a Django REST API application for managing university applications. The system provides endpoints for user management, university information, and application tracking with JWT authentication.

## Recent Changes (September 13, 2025)
- Successfully imported GitHub repository to Replit environment
- Configured Python 3.12 environment with all required dependencies
- Set up database with SQLite fallback (original PostgreSQL URL not accessible)
- Applied all database migrations for accounts, universities, and applications
- Configured Django server to run on port 5000 for Replit environment
- Set up deployment configuration for autoscale deployment

## Project Architecture
- **Backend**: Django 5.2.6 with Django REST Framework 3.16.1
- **Database**: SQLite (development) with PostgreSQL support
- **Authentication**: JWT tokens using django-rest-framework-simplejwt
- **Apps**: 
  - `accounts` - Custom user management with email authentication
  - `universities` - University data management
  - `applications` - Application tracking system

## Key Features
- Custom User model with email authentication
- JWT token-based authentication with refresh tokens
- RESTful API endpoints for CRUD operations
- User profile management with avatar support
- Proper Django migrations and database setup

## API Endpoints
- `POST /api/v1/token/` - Obtain JWT token
- `POST /api/v1/token/refresh/` - Refresh JWT token
- `POST /api/v1/register/` - User registration
- `GET/POST /api/v1/universities/` - Universities list/create
- `GET/PUT/DELETE /api/v1/universities/<id>/` - University detail operations
- `GET/POST /api/v1/applications/` - Applications list/create
- `GET/PUT/DELETE /api/v1/applications/<id>/` - Application detail operations
- `GET /admin/` - Django admin interface

## Environment Configuration
- Uses django-environ for environment variable management
- Configured with proper ALLOWED_HOSTS for Replit proxy
- SQLite database with PostgreSQL compatibility maintained
- Debug mode enabled for development

## Deployment Notes
- Configured for Replit autoscale deployment
- Server runs on 0.0.0.0:5000 for proper Replit proxy support
- All dependencies properly installed and configured
- Database migrations applied and ready for use