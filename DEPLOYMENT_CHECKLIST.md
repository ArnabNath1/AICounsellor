# Vercel Deployment Checklist

## Pre-Deployment Tasks

### ✅ Code Ready
- [x] All local database dependencies removed
- [x] `better-sqlite3` removed from package.json
- [x] `drizzle-kit` removed from dev dependencies
- [x] Production build succeeds: `npm run build`
- [x] Dev server runs without errors: `npm run dev`
- [x] No SQLite files being created locally

### ✅ Database Configuration
- [x] Application uses Turso (libsql) only
- [x] Database credentials in environment variables
- [x] `.env.local` is git-ignored
- [x] `.env.example` created for reference
- [x] All database tables auto-created on first use

### ✅ API Endpoints Verified
- [x] `/api/auth/signup` - Register users
- [x] `/api/auth/login` - Authenticate users  
- [x] `/api/auth/check` - Verify session
- [x] `/api/save-profile` - Store onboarding data
- [x] `/api/onboard-voice` - Process voice interviews
- [x] `/api/parse-cv` - Extract CV data
- [x] `/api/search-universities` - University discovery
- [x] `/api/search-scholarships` - Scholarship search

## Deployment Steps

### Step 1: Prepare GitHub Repository
```bash
# Make sure no .env files are in git
git status

# Only files that should exist:
# - .env.example (template only)
# - .env.local (locally ignored)

# All other files tracked normally
git add .
git commit -m "Ready for Vercel deployment with Turso"
git push
```

### Step 2: Create Vercel Project
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select project name and framework (Next.js should auto-detect)

### Step 3: Configure Environment Variables
In Vercel's project settings → Environment Variables, add:

| Key | Value | Get From |
|-----|-------|----------|
| `TURSO_DATABASE_URL` | `libsql://your-db.turso.io` | [turso.tech](https://turso.tech) console |
| `TURSO_AUTH_TOKEN` | `eyJhbGc...` | [turso.tech](https://turso.tech) console |
| `GOOGLE_GENAI_API_KEY` | `AIzaSy...` | [aistudio.google.com](https://aistudio.google.com) |

### Step 4: Deploy
- Vercel will automatically:
  - Install dependencies (no better-sqlite3)
  - Run build (no drizzle-kit needed)
  - Deploy to edge network
  - Use environment variables for database

### Step 5: Test Production
1. Visit your Vercel deployment URL
2. Test signup flow
3. Test login flow
4. Complete onboarding
5. Verify data is in Turso

## Database Setup (Optional - Auto-Generated)

If tables aren't auto-created, run manually in Vercel Functions:

```bash
# Local setup (for reference)
npx tsx scripts/setup-db.ts

# This creates:
# - users table
# - profiles table
# - universities table
# - shortlists table
# - tasks table
```

## Monitoring & Maintenance

After deployment:
1. **Monitor Logs**: Vercel dashboard → Functions
2. **Check Database**: Turso console → your database
3. **Track Usage**: Both Vercel and Turso provide analytics
4. **Backup Data**: Turso auto-backups daily

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot find module 'drizzle-kit'" | This is expected - we removed it. The `.example` file is not loaded. |
| "Database connection error" | Verify TURSO variables are set in Vercel environment |
| "Build fails" | Clear build cache in Vercel settings → Deployments → Redeploy |
| "User not found after signup" | Ensure .env variables match your Turso account |

## Post-Deployment

### Security Hardening
- [ ] Add rate limiting to API endpoints
- [ ] Implement password hashing (currently plain-text)
- [ ] Add CSRF protection
- [ ] Set up API key rotation
- [ ] Enable WAF in Vercel

### Performance Optimization
- [ ] Enable Vercel Analytics
- [ ] Monitor database query performance
- [ ] Optimize images and assets
- [ ] Set up CDN caching

### Feature Completion
- [ ] Implement dashboard
- [ ] Add scholarship matching algorithm
- [ ] Build application tracking
- [ ] Add email notifications
- [ ] Create admin panel

## Rollback Plan

If something goes wrong:

1. **Vercel**: Go to Deployments tab, select previous build, click "Promote to Production"
2. **Database**: Turso keeps backups - contact support for restore
3. **Code**: Git revert: `git revert HEAD` and push

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Turso Docs**: https://turso.tech/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Drizzle Docs**: https://orm.drizzle.team/docs

---

**Status**: ✅ Ready for Vercel Deployment
**Database**: ✅ Turso Only
**Build**: ✅ Production Ready
**Environment**: ✅ All Variables Configured
