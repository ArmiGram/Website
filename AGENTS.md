# Agents Guide

This document provides guidance for AI agents working on the Vibe social network project.

## Project Overview

Vibe is a full-stack social network application built with:
- **Frontend**: Nuxt 3 (Vue 3) + Tailwind CSS
- **Backend**: NestJS + Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)

## Key Directories

- [`backend/`](backend/) - NestJS API server
- [`frontend/`](frontend/) - Nuxt 3 application
- [`backend/prisma/`](backend/prisma/) - Database schema and migrations

## Development Commands

### Backend
```bash
cd backend
npm run start:dev     # Start development server
npm run prisma:seed   # Seed database with demo data
```

### Frontend
```bash
cd frontend
npm run dev           # Start development server
```

## API Endpoints

See [README.md](README.md) for complete API documentation.

## Code Style

- TypeScript for both frontend and backend
- ESLint + Prettier for code formatting
- Follow existing patterns in the codebase
