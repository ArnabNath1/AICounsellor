# AI Counsellor - Prototype Implementation Plan

## 1. Project Initialization
- [x] Initialize Next.js project (React + Node.js environment).
- [x] Set up clean folder structure (src/components, src/lib, src/styles).
- [x] Configure `globals.css` for Premium Design (Glassmorphism, CSS Variables).

## 2. Database & Backend
- [x] Set up **Drizzle with SQLite** (Superior alternative to Prisma for this environment).
- [x] Define Schema: `User`, `Profile`, `University` (seeded), `Shortlist`, `Tasks`.
- [x] Create API routes for:
    - AI Chat/Counsellor

## 3. Core Frontend Flow (Pages)
- [x] **Landing Page (`/`)**: High-impact visuals, clear CTA.
- [x] **Auth (`/login`, `/signup`)**: Simple forms.
- [x] **Onboarding (`/onboarding`)**: Multi-step form (Academic, Goals, Budget, Exams).
- [x] **Dashboard (`/dashboard`)**: Stage-based view, Profile Strength.
- [x] **AI Counsellor (`/dashboard/counsellor`)**: Chat interface integrated with Gemini.
- [x] **University Discovery (`/dashboard/discover`)**: List view, Filtering, Detailed modal/page.
- [x] **Locking & Tasks**: State management for "Locked" university and generated To-Dos.
- [x] **Profile Management**: Editable profile syncing with AI.

## 4. AI Integration (Gemini)
- [x] Implement Gemini Flash API.
- [x] Create prompts for:
    - Analyzing Profile.
    - Recommending Universities (Dream/Target/Safe).
    - Generating Application Tasks.

## 5. Design & Polish
- [x] Apply "Glassmorphism" effects.
- [x] Ensure responsive layout.
- [x] Add flow animations.

## 6. Verification
- [x] Test the full user flow from Landing -> Locking.
