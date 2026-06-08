# Render Deployment Guide

## Overview
This project is configured for deployment on [Render](https://render.com), a modern cloud platform for deploying web applications and databases.

## Prerequisites
- Render account (free tier available)
- GitHub repository with this code pushed
- PostgreSQL database connection string

## Deployment Steps

### Step 1: Create a PostgreSQL Database on Render

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **PostgreSQL**
3. Fill in the details:
   - **Name**: `smart-collab-db` (or your preferred name)
   - **Database**: `smart_collab` (or your preferred database name)
   - **User**: `postgres` (or custom)
   - **Region**: Choose closest to your users
   - **Plan**: Free (sufficient for development/testing)
4. Click **Create Database**
5. Wait for the database to be created and note the **Internal Database URL**

### Step 2: Create a Web Service on Render

1. Click **New +** → **Web Service**
2. Select your GitHub repository
3. Configure the service:
   - **Name**: `smart-collab-api` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: Same as your database (important for performance)
   - **Branch**: `main` (or your deployment branch)
   - **Build Command**: 
     ```bash
     npm ci && npm run build && npx prisma generate && npx prisma migrate deploy
     ```
   - **Start Command**: 
     ```bash
     node dist/server.js
     ```
   - **Plan**: Free or Starter (depending on your needs)

### Step 3: Configure Environment Variables

In the Render dashboard, add the following environment variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Use the PostgreSQL URL from Step 1 |
| `JWT_SECRET` | Generate a strong secret key (use `openssl rand -hex 32` or a password manager) |
| `JWT_EXPIRES_IN` | `7d` (or your preferred duration) |
| `FRONTEND_URL` | Your frontend URL (e.g., `https://your-app.onrender.com`) |
| `PORT` | `3000` (Render sets this automatically, keep as reference) |

### Step 4: Deploy

1. Complete the form and click **Create Web Service**
2. Render will automatically:
   - Clone your repository
   - Install dependencies
   - Build the TypeScript code
   - Run Prisma migrations
   - Start the server
3. Monitor the **Logs** tab to ensure deployment succeeds
4. Once deployed, you'll receive a URL like: `https://smart-collab-api.onrender.com`

## Verification

After deployment, verify your API is running:

```bash
# Check health endpoint
curl https://your-deployed-api.onrender.com/health

# Expected response:
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T12:00:00.000Z",
    "environment": "production"
  }
}
```

## Important Notes

### Free Tier Limitations
- The app will spin down after 15 minutes of inactivity
- Database may have restrictions on connections
- Limited compute resources

### Production Considerations
- Upgrade to **Starter** or **Standard** plans for production
- Use strong, randomly generated `JWT_SECRET`
- Implement proper logging and monitoring
- Set up database backups
- Configure custom domain
- Enable HTTPS (automatic on Render)

### Troubleshooting

#### "Database connection failed"
- Verify DATABASE_URL in environment variables
- Ensure database is in the same region as the web service
- Check database is running in Render dashboard

#### "Migration failed"
- Check logs in Render dashboard
- Ensure `prisma/migrations` folder is committed to Git
- Verify `prisma/schema.prisma` is correct

#### "CORS errors"
- Update `FRONTEND_URL` environment variable with correct frontend URL
- Ensure frontend is deployed and accessible

#### "Cold start taking too long"
- Upgrade to Starter plan
- Implement connection pooling if using many database connections

## Continuous Deployment

Render automatically redeploys when you:
1. Push to your selected branch (default: `main`)
2. Update environment variables (manual redeploy needed)
3. Change the build/start commands

To trigger a manual redeploy:
1. Go to your service in Render dashboard
2. Click **Manual Deploy** → **Deploy latest commit**

## Rollback

If something goes wrong:
1. Fix the issue in your code
2. Push to Git
3. Render will automatically redeploy
4. Or manually trigger redeploy as shown above

## Cleanup

To delete the service and database:
1. Go to service settings
2. Click **Delete Service** (at the bottom)
3. Delete the PostgreSQL database similarly from the Databases tab

## Support

For Render-specific issues, visit:
- [Render Documentation](https://render.com/docs)
- [Render Support](https://render.com/support)

For application issues, check the logs in the Render dashboard under the **Logs** tab.
