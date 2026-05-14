# JacoMoments - Database Setup Guide

## Local Development (SQLite)

1. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

2. Create and seed the database:
   ```bash
   npx prisma db push
   node prisma/seed.ts
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## Production Deployment (Vercel)

### Step 1: Add Vercel Postgres Database

1. Go to your Vercel project dashboard
2. Go to **Storage** tab
3. Click **Create Database**
4. Select **Postgres** (Vercel Postgres)
5. Click **Continue**

### Step 2: Connect Your Database

1. After creating the database, click **Connect**
2. Select your project (**JacoMoments**)
3. Keep the default environment variable name (`DATABASE_URL`)
4. Click **Connect**

### Step 3: Push Schema to Production Database

1. Go to the **Storage** tab in Vercel
2. Click on your database
3. Go to **Schema** tab
4. Click **Push Schema** and paste your Prisma schema content

### Step 4: Initialize Admin User

After deployment, visit:
```
https://your-domain.vercel.app/api/init
```

This will create the default admin user:
- **Username:** admin
- **Password:** Admin123

Then change the password in the admin panel.

## Environment Variables

| Variable | Local | Vercel | Description |
|----------|-------|--------|-------------|
| `DATABASE_URL` | `file:./dev.db` | Auto-set by Vercel Postgres | Database connection string |

## Admin Panel

- **URL:** `/admin`
- **Default Password:** `Admin123`

## Notes

- SQLite works for local development only
- For Vercel production, you must use Vercel Postgres
- All data (photos, messages, admin) persists in PostgreSQL
