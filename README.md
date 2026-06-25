# Vibe — Social Network (TikTok/Instagram-style)

A full-stack social network where users can post photos and videos, follow each other, like and comment. Built with **Nuxt 3** (frontend), **NestJS** (backend), **PostgreSQL + Prisma** (database).

## Tech stack

| Layer    | Tech                                              |
| -------- | ------------------------------------------------- |
| Frontend | Nuxt 3 (Vue 3), Tailwind CSS                       |
| Backend  | NestJS, Passport JWT, Multer (uploads)            |
| Database | PostgreSQL + Prisma ORM                            |
| Media    | Local disk storage (served at `/uploads`)         |

## Features

- Email/username + password auth (JWT)
- Upload photos **and** videos with caption
- Explore feed (all posts) + Following feed
- Like / unlike, comment, delete own posts/comments
- User profiles with grid of posts, follower/following counts
- Follow / unfollow
- Cursor-based pagination
- Responsive design for mobile and desktop

## Project structure

```
vibe/
├── backend/      # NestJS API + Prisma
├── frontend/     # Nuxt 3 app
├── docker-compose.yml  # Postgres for local dev
├── README.md     # This file (English)
├── README.fa.md  # Persian documentation
├── AGENTS.md     # Agent development guide
├── CONTRIBUTING.md # Contribution guidelines
├── DESIGN.md     # Design system documentation
└── PASS.md       # Password and security notes
```

## Getting started

### 1. Start PostgreSQL

```bash
docker compose up -d
```

### 2. Backend

```bash
cd backend
cp .env.example .env          # adjust if needed
npm install
npx prisma migrate dev        # create tables
npm run prisma:seed           # optional: demo users + posts
npm run start:dev             # http://localhost:3001/api
```

Demo logins after seeding: `alice` / `bob`, password `password123`.

### 3. Frontend

```bash
cd frontend
cp .env.example .env          # NUXT_PUBLIC_API_BASE=http://localhost:3001/api
npm install
npm run dev                   # http://localhost:3000
```

## API overview

| Method | Endpoint                       | Auth | Description                |
| ------ | ------------------------------ | ---- | -------------------------- |
| POST   | `/api/auth/register`           | —    | Create account             |
| POST   | `/api/auth/login`              | —    | Login                      |
| GET    | `/api/auth/me`                 | ✓    | Current user               |
| GET    | `/api/posts`                   | opt  | Explore feed               |
| GET    | `/api/posts/following`         | ✓    | Following feed             |
| POST   | `/api/posts`                   | ✓    | Create post                |
| GET    | `/api/posts/:id`               | opt  | Single post                |
| DELETE | `/api/posts/:id`               | ✓    | Delete own post            |
| POST   | `/api/posts/:id/like`          | ✓    | Like                       |
| DELETE | `/api/posts/:id/like`          | ✓    | Unlike                     |
| GET    | `/api/posts/:id/comments`      | —    | List comments              |
| POST   | `/api/posts/:id/comments`      | ✓    | Add comment                |
| DELETE | `/api/comments/:id`            | ✓    | Delete comment             |
| POST   | `/api/media/upload`            | ✓    | Upload image/video         |
| GET    | `/api/users/:username`         | opt  | Profile                    |
| GET    | `/api/users/:username/posts`   | opt  | User's posts               |
| POST   | `/api/users/:username/follow`  | ✓    | Follow                     |
| DELETE | `/api/users/:username/follow`  | ✓    | Unfollow                   |
| GET    | `/api/users/search?q=`         | —    | Search users               |

## Notes

- Media files are stored on local disk under `backend/uploads`. For production, switch to S3/MinIO and store only the URL.
- Set a strong `JWT_SECRET` and configure `CORS_ORIGIN` before deploying.
- See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.
- See [DESIGN.md](DESIGN.md) for design system documentation.

## License

This project is licensed under the MIT License.
