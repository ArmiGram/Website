# Contributing to Vibe

Thank you for your interest in contributing to Vibe! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment.

## How to Contribute

### Reporting Bugs
- Use the Issues section to report bugs
- Include a clear description, steps to reproduce, and expected behavior
- Add relevant code snippets or screenshots if helpful

### Suggesting Features
- Open an issue with a feature request
- Explain the use case and potential implementation
- Discuss with maintainers before starting work

### Pull Requests
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and ensure code quality
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Development Setup

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- PostgreSQL (or use Docker)

### Running the Project
```bash
# Start PostgreSQL
docker compose up -d

# Backend setup
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run prisma:seed
npm run start:dev

# Frontend setup (in another terminal)
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Code Style

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add tests for new features

## Project Structure

- [`backend/`](backend/) - NestJS API server
- [`frontend/`](frontend/) - Nuxt 3 application
- [`backend/prisma/`](backend/prisma/) - Database schema

## Questions?

Feel free to open an issue for any questions about contributing.
