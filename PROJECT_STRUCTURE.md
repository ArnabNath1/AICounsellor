# Project Structure - Vercel Ready

```
ai-counsellor/
│
├── 📁 src/
│   ├── 📁 app/
│   │   ├── 📁 api/                    # All API endpoints (serverless functions)
│   │   │   ├── 📁 auth/
│   │   │   │   ├── login/route.ts     # ← Database: User authentication
│   │   │   │   ├── signup/route.ts    # ← Database: User creation
│   │   │   │   └── check/route.ts     # ← Database: Session verification
│   │   │   ├── 📁 onboard-voice/
│   │   │   │   └── route.ts           # ← Database: Voice data extraction
│   │   │   ├── 📁 parse-cv/
│   │   │   │   └── route.ts           # ← Database: CV parsing
│   │   │   ├── 📁 save-profile/
│   │   │   │   └── route.ts           # ← Database: Profile persistence
│   │   │   └── 📁 search-universities/
│   │   │       └── route.ts           # ← Database: University search
│   │   │
│   │   ├── 📁 dashboard/              # Protected pages (auth required)
│   │   │   ├── layout.tsx             # Auth check & user display
│   │   │   └── page.tsx
│   │   │
│   │   ├── 📁 login/
│   │   │   └── page.tsx               # Login form
│   │   │
│   │   ├── 📁 signup/
│   │   │   └── page.tsx               # Signup form
│   │   │
│   │   ├── 📁 onboarding/
│   │   │   └── page.tsx               # Voice interview & profile form
│   │   │
│   │   ├── layout.tsx                 # Root layout
│   │   ├── page.tsx                   # Home page
│   │   └── globals.css
│   │
│   └── 📁 db/
│       ├── index.ts                   # ← Turso client (libsql)
│       └── schema.ts                  # Database schema (users, profiles, etc)
│
├── 📁 scripts/
│   ├── setup-db.ts                    # Initialize database (auto-created on deploy)
│   ├── init-db.ts                     # Legacy (not used)
│   └── migrate-profiles.ts            # Legacy (not used)
│
├── 📁 public/                          # Static assets
│
├── 🔧 Configuration Files
│   ├── next.config.ts                 # Next.js config
│   ├── tsconfig.json                  # TypeScript config
│   ├── package.json                   # Dependencies (NO local SQLite)
│   ├── .env.local                     # Local env (git-ignored)
│   ├── .env.example                   # Template for deployment
│   ├── drizzle.config.ts.example      # Legacy (not used in production)
│   └── eslint.config.mjs
│
├── 📚 Documentation
│   ├── VERCEL_DEPLOYMENT.md           # Deployment guide
│   ├── TURSO_MIGRATION.md             # What changed
│   ├── DEPLOYMENT_CHECKLIST.md        # Pre-deployment tasks
│   ├── PLAN.md                        # Project roadmap
│   └── README.md
│
└── 🔐 Git Config
    └── .gitignore                     # .env*, *.db, *.sqlite ignored
```

## Database Flow

```
User Actions
    ↓
Client (React/TypeScript)
    ↓
API Routes (/api/*)
    ↓
Turso Client (libsql)
    ↓
Turso Database (Remote - AWS)
    ↓
Response → Client
```

## Environment Variables Required

### For Local Development (.env.local)
```
TURSO_DATABASE_URL=libsql://aicounsellor-arnabnath1.aws-ap-northeast-1.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSI...
GOOGLE_GENAI_API_KEY=AIzaSyAGlY-dvWHkr0dK4gX1UzTAdfg106TRWj0
```

### For Vercel Production
Set these in Vercel Dashboard → Settings → Environment Variables:
- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`
- `GOOGLE_GENAI_API_KEY`

## No Local Database Files

These files are NOT created or needed:
- ❌ `sqlite.db`
- ❌ `.sqlite` files
- ❌ Local database directory

Everything uses Turso cloud database.

## Build Process

```bash
npm install              # Only cloud dependencies
  ↓
npm run build            # TypeScript compile & Next.js build
  ↓
# Output: .next/ folder (ready for Vercel)
  ↓
Vercel serves static files + API routes
```

## Deployment Steps

1. Push to GitHub (no secrets in repo)
2. Vercel auto-detects Next.js
3. Set environment variables in Vercel UI
4. Click "Deploy"
5. Done! ✅

No database setup steps needed. All tables are created automatically on first API call.

---

**Database**: Turso (Cloud)  
**Hosting**: Vercel (Edge Network)  
**Code**: Next.js 16.1.6 (TypeScript)  
**Status**: Production Ready ✅
