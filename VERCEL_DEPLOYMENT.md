# Vercel Deployment Guide

This application is fully configured to run on Vercel using Turso as the remote database. No local databases are needed.

## Prerequisites

1. **Turso Database Account** - [Sign up at turso.tech](https://turso.tech)
2. **Vercel Account** - [Sign up at vercel.com](https://vercel.com)
3. **Google Generative AI API Key** - [Get it here](https://aistudio.google.com/app/apikey)

## Setup Steps

### 1. Prepare Your Turso Database

```bash
# List your Turso databases
turso db list

# Get your database credentials
turso db show --json <your-database-name>
```

You'll need:
- `TURSO_DATABASE_URL` - Your database URL (e.g., `libsql://your-db.turso.io`)
- `TURSO_AUTH_TOKEN` - Your authentication token

### 2. Deploy to Vercel

#### Option A: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import this GitHub repository
4. Set environment variables:
   - `TURSO_DATABASE_URL` - Your Turso database URL
   - `TURSO_AUTH_TOKEN` - Your Turso auth token
   - `GOOGLE_GENAI_API_KEY` - Your Google Generative AI key
5. Deploy!

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts and add environment variables when asked
```

### 3. Environment Variables in Vercel

In your Vercel project settings, add these environment variables:

| Variable | Value | Source |
|----------|-------|--------|
| `TURSO_DATABASE_URL` | `libsql://your-db.turso.io` | Turso Console |
| `TURSO_AUTH_TOKEN` | Your token | Turso Console |
| `GOOGLE_GENAI_API_KEY` | Your API key | Google AI Studio |

## Database Structure

The application automatically handles all database operations through API endpoints:

- **Users Table** - Stores user accounts with email/password
- **Profiles Table** - Stores user onboarding profiles
- **Universities Table** - University information for discovery
- **Shortlists Table** - User's shortlisted universities
- **Tasks Table** - Application tasks and timeline

Tables are created automatically on first API call if they don't exist.

## Key Endpoints

All database operations go through these API routes:

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/check` - Verify authentication
- `POST /api/save-profile` - Save user profile after onboarding
- `POST /api/onboard-voice` - Process voice interview
- `POST /api/parse-cv` - Extract profile data from CV
- `GET /api/search-universities` - Search universities
- `GET /api/search-scholarships` - Search scholarships

## Troubleshooting

### Build Fails with "Cannot find module 'drizzle-kit'"

This is normal - we renamed `drizzle.config.ts` to `drizzle.config.ts.example` since we don't use migrations in production. The app works fine without it.

### Database Connection Errors

1. Verify `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are set in Vercel
2. Check that your Turso database is active (not paused)
3. Verify the tokens are correct in the Turso console

### "User not found" on Login

Make sure you've:
1. Signed up with valid credentials
2. The email matches exactly (case-sensitive in some cases)
3. Completed onboarding after signup

## Performance Notes

- All database calls are through Turso (libsql) - no local SQLite
- Turso handles replication and backup automatically
- API routes are edge-function ready
- Static pages are pre-rendered for speed

## Security

- Never commit `.env.local` to GitHub
- Use Vercel's environment variables UI for sensitive data
- Passwords are stored plainly in this prototype - hash them in production!
- Add password hashing before deploying to production

## Next Steps

For production readiness:

1. **Add password hashing** - Use bcrypt or similar
2. **Implement JWT tokens** - For better session management
3. **Add CORS security** - Restrict API access
4. **Set up database backups** - Via Turso console
5. **Add rate limiting** - For API endpoints
6. **Monitor logs** - Use Vercel's analytics

---

For questions about Turso, visit [turso.tech/docs](https://turso.tech/docs)
For Vercel help, check [vercel.com/docs](https://vercel.com/docs)
