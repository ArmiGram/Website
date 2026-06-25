# Claude Development Notes

This file contains development notes and instructions for working with Claude on the Vibe project.

## Project Context

Vibe is a full-stack social network application with:
- **Frontend**: Nuxt 3 (Vue 3) + Tailwind CSS
- **Backend**: NestJS + Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT

## Key Files to Understand

- [`README.md`](README.md) - Main project documentation
- [`AGENTS.md`](AGENTS.md) - Agent development guide
- [`backend/src/`](backend/src/) - Backend source code
- [`frontend/`](frontend/) - Frontend source code

## Common Tasks

### Adding a New API Endpoint
1. Create DTO in `backend/src/[module]/dto/`
2. Add method to service in `backend/src/[module]/[module].service.ts`
3. Add endpoint to controller in `backend/src/[module]/[module].controller.ts`

### Adding a New Frontend Page
1. Create page in `frontend/pages/`
2. Add route if needed
3. Use composables from `frontend/composables/`

## Testing

- Backend: `cd backend && npm test`
- Frontend: `cd frontend && npm run test`

## Deployment Notes

- Set `JWT_SECRET` environment variable
- Configure `CORS_ORIGIN` for production
- Consider S3/MinIO for media storage in production
