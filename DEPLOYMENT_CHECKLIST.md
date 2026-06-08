# Checklist for Render Deployment

## Pre-Deployment

- [ ] All code is committed and pushed to GitHub
- [ ] `.env.example` is created with all required environment variables
- [ ] `render.yaml` is in the project root
- [ ] `prisma/migrations` folder is committed (contains migration files)
- [ ] `package.json` has correct `build` and `start` scripts
- [ ] TypeScript compiles without errors locally (`npm run build`)
- [ ] Database schema is finalized in `prisma/schema.prisma`
- [ ] `.env` file is in `.gitignore` (never commit secrets)
- [ ] All dependencies are listed in `package.json`

## During Deployment

- [ ] Create PostgreSQL database on Render
- [ ] Create Web Service on Render
- [ ] Configure all environment variables:
  - [ ] `NODE_ENV=production`
  - [ ] `DATABASE_URL` (from PostgreSQL)
  - [ ] `JWT_SECRET` (strong random string)
  - [ ] `JWT_EXPIRES_IN=7d`
  - [ ] `FRONTEND_URL` (your frontend URL)
- [ ] Monitor logs during deployment
- [ ] Wait for build and migration to complete

## Post-Deployment

- [ ] Test health endpoint: `GET /health`
- [ ] Test API endpoints from your frontend
- [ ] Verify database connectivity
- [ ] Check logs for any errors
- [ ] Set up monitoring/alerts (if needed)

## Maintenance

- [ ] Update `FRONTEND_URL` when frontend is deployed
- [ ] Monitor free tier resource usage
- [ ] Plan upgrade to paid tier if approaching limits
- [ ] Keep dependencies updated
- [ ] Set up automated backups for production data
