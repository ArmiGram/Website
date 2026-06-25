# ویب — شبکه اجتماعی (سبک TikTok/Instagram)

یک شبکه اجتماعی کامل استک که کاربران می‌توانند عکس و ویدیو پست کنند، یکدیگر را دنبال کنند، لایک و کامنت بگذارند. با **Nuxt 3** (فرانت‌اند)، **NestJS** (بک‌اند)، **PostgreSQL + Prisma** (دیتابیس) ساخته شده است.

## تکنولوژی‌های استفاده شده

| لایه    | تکنولوژی                                          |
| -------- | ------------------------------------------------- |
| فرانت‌اند | Nuxt 3 (Vue 3)، Tailwind CSS                       |
| بک‌اند  | NestJS، Passport JWT، Multer (آپلود)            |
| دیتابیس | PostgreSQL + Prisma ORM                            |
| رسانه    | ذخیره‌سازی دیسک محلی (در `/uploads` سرو شده)         |

## ویژگی‌ها

- احراز هویت ایمیل/نام کاربری + رمز عبور (JWT)
- آپلود عکس **و** ویدیو با کپشن
- فید کاوش (تمام پست‌ها) + فید دنبال‌شده
- لایک / حذف لایک، کامنت، حذف پست‌ها/کامنت‌های خود
- پروفایل کاربران با گرید پست‌ها، تعداد فالوور/فالوینگ
- دنبال کردن / لغو دنبال کردن
- صفحه‌بندی مبتنی بر کرسور
- طراحی واکنش‌گرا برای موبایل و دسکتاپ

## ساختار پروژه

```
vibe/
├── backend/      # API NestJS + Prisma
├── frontend/     # برنامه Nuxt 3
├── docker-compose.yml  # Postgres برای توسعه محلی
├── README.md     # این فایل (انگلیسی)
├── README.fa.md  # مستندات فارسی
├── AGENTS.md     # راهنمای توسعه دهندگان
├── CONTRIBUTING.md # راهنمای مشارکت
├── DESIGN.md     # مستندات سیستم طراحی
└── PASS.md       # نکات امنیتی
```

## شروع کار

### 1. راه‌اندازی PostgreSQL

```bash
docker compose up -d
```

### 2. بک‌اند

```bash
cd backend
cp .env.example .env          # در صورت نیاز تنظیم کنید
npm install
npx prisma migrate dev        # ایجاد جداول
npm run prisma:seed           # اختیاری: کاربران و پست‌های دمو
npm run start:dev             # http://localhost:3001/api
```

حساب‌های دمو پس از seed: `alice` / `bob`، رمز عبور `password123`.

### 3. فرانت‌اند

```bash
cd frontend
cp .env.example .env          # NUXT_PUBLIC_API_BASE=http://localhost:3001/api
npm install
npm run dev                   # http://localhost:3000
```

## API

| متد | اندپوینت                       | احراز هویت | توضیح                |
| ---- | ------------------------------ | ---- | -------------------------- |
| POST   | `/api/auth/register`           | —    | ایجاد حساب             |
| POST   | `/api/auth/login`              | —    | ورود                      |
| GET    | `/api/auth/me`                 | ✓    | کاربر فعلی               |
| GET    | `/api/posts`                   | opt  | فید کاوش               |
| GET    | `/api/posts/following`         | ✓    | فید دنبال‌شده             |
| POST   | `/api/posts`                   | ✓    | ایجاد پست                |
| GET    | `/api/posts/:id`               | opt  | پست تک               |
| DELETE | `/api/posts/:id`               | ✓    | حذف پست کاربر           |
| POST   | `/api/posts/:id/like`          | ✓    | لایک                       |
| DELETE | `/api/posts/:id/like`          | ✓    | حذف لایک                     |
| GET    | `/api/posts/:id/comments`      | —    | لیست کامنت‌ها              |
| POST   | `/api/posts/:id/comments`      | ✓    | افزودن کامنت                |
| DELETE | `/api/comments/:id`            | ✓    | حذف کامنت             |
| POST   | `/api/media/upload`            | ✓    | آپلود تصویر/ویدیو         |
| GET    | `/api/users/:username`         | opt  | پروفایل                    |
| GET    | `/api/users/:username/posts`   | opt  | پست‌های کاربر               |
| POST   | `/api/users/:username/follow`  | ✓    | دنبال کردن                     |
| DELETE | `/api/users/:username/follow`  | ✓    | لغو دنبال کردن                   |
