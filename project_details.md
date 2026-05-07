# The Think — SaaS Problem Discovery Platform

## Complete Project Documentation

---

## 1. Project Overview

### 1.1 What is The Think?

**The Think** is a full-stack web application designed as a **SaaS Problem Discovery Platform** for students, entrepreneurs, and indie hackers. It aggregates real-world problems sourced from online communities like Reddit, Hacker News, and Product Hunt, and scores each problem for its potential to be turned into a viable SaaS (Software as a Service) business.

The platform answers a critical question every aspiring entrepreneur faces: **"What should I build?"**

Instead of relying on guesswork, The Think uses a data-driven approach — collecting pain points people express online, categorizing them by domain and difficulty, and applying an algorithmic scoring system to evaluate SaaS viability.

### 1.2 Problem Statement

Aspiring entrepreneurs and developers often struggle to find real problems worth solving. They spend weeks brainstorming ideas in isolation, only to build something nobody wants. Meanwhile, thousands of people publicly complain about unmet needs on platforms like Reddit and Hacker News every day. The gap between "problems people have" and "solutions developers build" is enormous.

**The Think bridges this gap** by curating, categorizing, and scoring real-world problems to help builders make informed decisions about what to build next.

### 1.3 Target Users

| User Type | How They Use The Think |
|-----------|----------------------|
| **Students** | Discover project ideas for hackathons, capstone projects, and startups |
| **Indie Hackers** | Find validated problems with proven demand before investing time |
| **Entrepreneurs** | Evaluate market opportunities using SaaS viability scores |
| **Developers** | Browse weekend-sized problems they can build and ship quickly |
| **Product Managers** | Research pain points across different industry domains |

### 1.4 Key Features

- **Problem Feed** — Browse a curated grid of real-world problems with rich metadata
- **SaaS Viability Scoring** — Every problem is scored 0–100 using a multi-signal heuristic algorithm
- **Domain Filtering** — Filter by fintech, edtech, health, productivity, ecommerce, devtools, SaaS, or other
- **Difficulty Classification** — Problems categorized as weekend, month, or quarter builds
- **Full-Text Search** — MongoDB-powered text search across titles and descriptions
- **Multi-Sort** — Sort by SaaS score, upvotes, or recency
- **Pagination** — Efficient paginated browsing with page controls
- **Detailed Problem View** — Deep-dive into each problem with viability explanation, source links, and tags
- **Stats Dashboard** — Real-time aggregate statistics (total problems, SaaS-viable count, average score, top domain)
- **Responsive Design** — Fully responsive across desktop, tablet, and mobile
- **Dark Mode UI** — Premium dark theme with glassmorphism, micro-animations, and polished aesthetics

---

## 2. Technology Stack

### 2.1 Architecture Overview

The Think follows a **decoupled client-server architecture** with a React frontend communicating with an Express.js REST API backed by MongoDB.

```
┌─────────────────────────┐     HTTP/JSON      ┌─────────────────────────┐
│                         │ ◄────────────────► │                         │
│    Frontend (React)     │                     │   Backend (Express.js)  │
│                         │   GET /api/problems │                         │
│  - Vite dev server      │   GET /api/stats    │  - REST API             │
│  - React Router         │   GET /api/:id      │  - Mongoose ODM         │
│  - Axios HTTP client    │                     │  - Input validation     │
│  - TailwindCSS          │                     │  - Rate limiting        │
│                         │                     │  - Helmet security      │
└─────────────────────────┘                     └──────────┬──────────────┘
                                                           │
                                                           │ Mongoose
                                                           ▼
                                                ┌─────────────────────┐
                                                │                     │
                                                │   MongoDB (BSON)    │
                                                │                     │
                                                │  - Problems         │
                                                │    collection       │
                                                │  - Text indexes     │
                                                │  - Compound indexes │
                                                └─────────────────────┘
```

### 2.2 Frontend Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.3.1 | Component-based UI framework |
| **React Router DOM** | 6.26.2 | Client-side routing (SPA navigation) |
| **Axios** | 1.7.7 | HTTP client for API requests |
| **Vite** | 5.4.6 | Build tool and dev server with HMR |
| **TailwindCSS** | 3.4.10 | Utility-first CSS framework |
| **PostCSS** | 8.4.45 | CSS transformation pipeline |
| **Autoprefixer** | 10.4.20 | Vendor prefix automation |
| **Inter Font** | (Google Fonts) | Modern sans-serif typography |

### 2.3 Backend Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | (runtime) | Server-side JavaScript runtime |
| **Express.js** | 4.21.0 | Web framework for REST API |
| **Mongoose** | 8.6.0 | MongoDB ODM (Object Document Mapper) |
| **Helmet** | 7.1.0 | Security HTTP headers |
| **express-rate-limit** | 7.4.0 | API rate limiting |
| **express-validator** | 7.2.0 | Input validation and sanitization |
| **cors** | 2.8.5 | Cross-Origin Resource Sharing |
| **dotenv** | 16.4.5 | Environment variable management |
| **nodemon** | 3.1.4 | Dev auto-restart (devDependency) |

### 2.4 Database

| Technology | Purpose |
|-----------|---------|
| **MongoDB** | NoSQL document database using BSON format |
| **MongoDB Atlas** | Cloud-hosted MongoDB for production |

---

## 3. MongoDB — Advanced Usage

### 3.1 BSON Document Model

MongoDB uses a JSON-like document format called **BSON (Binary JSON)** to store data in a flexible, schema-less manner. Each document in a collection can have a dynamic structure, making it ideal for semi-structured and evolving data.

In The Think, this flexibility is leveraged in the **Problem** document model:

```javascript
{
  _id:          ObjectId,     // Auto-generated unique identifier
  title:        String,       // Problem headline (required)
  description:  String,       // Detailed problem description (required)
  source:       String,       // Enum: "reddit" | "hackernews" | "producthunt"
  sourceUrl:    String,       // Original post URL (required)
  domain:       String,       // Enum: 8 domain categories
  difficulty:   String,       // Enum: "weekend" | "month" | "quarter"
  saasScore:    Number,       // Computed viability score (0–100)
  tags:         [String],     // Array of topic tags
  upvotes:      Number,       // Community validation metric
  isSaasViable: Boolean,      // Derived from saasScore >= 60
  createdAt:    Date          // Timestamp
}
```

Each problem document can contain varying fields and metadata. The BSON format allows efficient storage and querying of this semi-structured data without requiring rigid schema modifications when new attributes are added.

### 3.2 Array Data Type

MongoDB supports **array data types**, allowing multiple values to be stored within a single field. In The Think, arrays are used for:

- **`tags: [String]`** — Each problem has an array of topic tags (e.g., `["invoicing", "freelance", "automation", "payments"]`). This enables:
  - Storing variable numbers of tags per problem
  - Rich categorization without junction tables
  - Efficient querying with MongoDB array operators

For example, a fintech problem might have `["invoicing", "freelance", "automation"]` while a devtools problem has `["api-monitoring", "uptime", "indie-dev", "alerts"]` — no schema change needed.

### 3.3 Indexing Strategy

The Think uses three types of MongoDB indexes for optimized query performance:

| Index | Type | Purpose |
|-------|------|---------|
| `{ title: "text", description: "text" }` | Text Index | Full-text search across problem titles and descriptions |
| `{ domain: 1, saasScore: -1 }` | Compound Index | Optimizes filtered queries by domain sorted by score |
| `{ isSaasViable: 1, saasScore: -1 }` | Compound Index | Optimizes "SaaS viable only" filter with score sorting |

### 3.4 Aggregation Pipeline

The stats endpoint uses MongoDB's aggregation framework for real-time analytics:

```javascript
// Average SaaS score across all problems
Problem.aggregate([
  { $group: { _id: null, avgScore: { $avg: "$saasScore" } } }
]);

// Top domain by problem count
Problem.aggregate([
  { $group: { _id: "$domain", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 1 }
]);
```

---

## 4. Project Structure

```
The_think/
├── .gitignore                    # Git ignore rules
├── render.yaml                   # Render deployment blueprint
├── railway.json                  # Railway deployment config (root)
├── project_details.md            # This documentation file
│
├── backend/
│   ├── .env                      # Environment variables (local)
│   ├── .env.example              # Environment template
│   ├── package.json              # Dependencies and scripts
│   ├── package-lock.json         # Dependency lock file
│   ├── railway.json              # Railway backend service config
│   ├── server.js                 # Express app entry point
│   │
│   ├── models/
│   │   └── Problem.js            # Mongoose schema + indexes
│   │
│   ├── controllers/
│   │   └── problemController.js  # Request handlers with validation
│   │
│   ├── routes/
│   │   └── problems.js           # API route definitions
│   │
│   ├── utils/
│   │   └── saasScorer.js         # SaaS viability scoring algorithm
│   │
│   └── scraper/
│       └── seed.js               # Database seeder (30 problems)
│
└── frontend/
    ├── .env                      # Environment variables (local)
    ├── .env.example              # Environment template
    ├── package.json              # Dependencies and scripts
    ├── package-lock.json         # Dependency lock file
    ├── railway.json              # Railway frontend service config
    ├── index.html                # HTML entry point
    ├── vite.config.js            # Vite config with dev proxy
    ├── tailwind.config.js        # Tailwind theme customization
    ├── postcss.config.js         # PostCSS plugin config
    │
    └── src/
        ├── main.jsx              # React entry point
        ├── App.jsx               # Router + Error Boundary
        ├── index.css             # Global styles (dark theme, scrollbar)
        │
        ├── api/
        │   └── problems.js       # Axios API layer (env-based URL)
        │
        ├── constants/
        │   └── styles.js         # Shared style constants
        │
        ├── components/
        │   ├── ErrorBoundary.jsx  # React Error Boundary
        │   ├── SearchBar.jsx      # Search input with debounce
        │   ├── FilterBar.jsx      # Domain, difficulty, sort filters
        │   ├── ProblemCard.jsx    # Problem card for feed grid
        │   ├── ScoreBadge.jsx     # Color-coded score badge
        │   └── TagBadge.jsx       # Topic tag pill
        │
        └── pages/
            ├── Feed.jsx           # Main feed page (stats, search, grid)
            ├── ProblemDetail.jsx  # Individual problem detail page
            └── NotFound.jsx       # 404 error page
```

**Total: 27 source files** (10 backend + 13 frontend + 4 config)

---

## 5. API Reference

### 5.1 Base URL

```
Development: http://localhost:5000/api
Production:  https://<your-deployed-backend>/api
```

### 5.2 Endpoints

#### `GET /` — Health Check
```json
Response: { "message": "The Think API is running", "status": "healthy" }
```

#### `GET /api/problems` — List Problems

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `domain` | string | — | Filter: fintech, edtech, health, productivity, ecommerce, devtools, saas, other |
| `difficulty` | string | — | Filter: weekend, month, quarter |
| `isSaasViable` | string | — | Set to `"true"` to filter viable only |
| `search` | string | — | Full-text search (max 200 chars) |
| `sortBy` | string | `saasScore` | Options: saasScore, upvotes, createdAt |
| `page` | number | `1` | Page number (must be > 0) |
| `limit` | number | `12` | Items per page (capped at 50) |

```json
Response: {
  "problems": [...],
  "total": 30,
  "page": 1,
  "totalPages": 3
}
```

#### `GET /api/problems/stats` — Aggregate Statistics
```json
Response: {
  "total": 30,
  "saasViableCount": 22,
  "avgSaasScore": 68,
  "topDomain": "devtools"
}
```

#### `GET /api/problems/domains/list` — Available Domains
```json
Response: ["fintech","edtech","health","productivity","ecommerce","devtools","saas","other"]
```

#### `GET /api/problems/:id` — Get Problem by ID
```json
Response: { "_id": "...", "title": "...", "description": "...", ... }
```

### 5.3 Error Responses

| Status | Meaning |
|--------|---------|
| `400` | Invalid query parameter (bad domain, difficulty, or sortBy value) |
| `404` | Problem not found / Route not found |
| `429` | Rate limit exceeded (100 requests per 15 minutes) |
| `500` | Internal server error |

---

## 6. SaaS Viability Scoring Algorithm

### 6.1 How It Works

Each problem is scored on a **0–100 scale** using an additive heuristic algorithm that evaluates six key signals. The algorithm scans the problem description for keyword patterns and evaluates metadata.

### 6.2 Scoring Breakdown

| Signal | Detection Method | Points | Rationale |
|--------|-----------------|--------|-----------|
| **Recurring Need** | Keywords: "every", "always", "daily", "weekly", "recurring" | **+20** | Recurring problems create recurring revenue |
| **Manual Process** | Keywords: "manual", "spreadsheet", "email", "copy-paste", "track" | **+20** | Manual workflows are prime automation targets |
| **Willingness to Pay** | Keywords: "pay", "money", "cost", "expensive", "fee" | **+15** | Explicit price sensitivity signals monetization |
| **Buildable Scope** | Difficulty is "weekend" or "month" | **+15** | Solo-buildable = lower risk, faster validation |
| **Validated Demand** | Upvotes > 500 | **+15** | High engagement = proven demand |
| **SaaS-Native Signals** | Keywords: "api", "integrate", "automate", "software", "tool", "dashboard" | **+15** | Software-oriented language = natural SaaS fit |

**Maximum possible score: 100** (capped)

### 6.3 Viability Threshold

| Score Range | Classification | Recommendation |
|-------------|---------------|----------------|
| **80–100** | 🚀 High Viability | Strong signals — build this |
| **60–79** | ⚡ Moderate Viability | Solid potential — worth prototyping |
| **40–59** | 🔍 Low Viability | Weak signals — consider alternatives |
| **0–39** | 📋 Needs Research | Insufficient signals — do more discovery |

A problem with `saasScore >= 60` is flagged as `isSaasViable: true`.

---

## 7. Frontend Architecture

### 7.1 Component Hierarchy

```
App (ErrorBoundary wrapper)
├── Feed Page
│   ├── StatCard (×4) — stats dashboard
│   ├── SearchBar — debounced search input
│   ├── FilterBar — domain, difficulty, sort, viable toggle
│   ├── SkeletonCard (×6) — loading state
│   └── ProblemCard (×12) — problem grid
│       ├── ScoreBadge — color-coded score
│       └── TagBadge — topic tags
│
├── ProblemDetail Page
│   ├── ScoreBadge
│   ├── TagBadge
│   └── Viability Explanation section
│
└── NotFound Page — 404 catch-all
```

### 7.2 State Management

The app uses **React local state** (useState + useEffect) — no external state library needed at this scale:

| State Variable | Location | Purpose |
|---------------|----------|---------|
| `problems` | Feed | Array of current page's problems |
| `loading` | Feed | Loading indicator boolean |
| `stats` | Feed | Aggregate statistics object |
| `page` / `totalPages` | Feed | Pagination state |
| `searchInput` / `searchQuery` | Feed | Debounced search (400ms delay) |
| `filters` | Feed | Active filter selections |
| `problem` | ProblemDetail | Single problem data |
| `error` | ProblemDetail | Error state for 404/failures |

### 7.3 Design System

**Color Palette:**
- **Brand** — Indigo scale (50–950) for accents and interactive elements
- **Surface** — Slate scale (50–950) for backgrounds and text hierarchy

**Animations:**
- `fade-in` — 0.5s ease-out opacity transition
- `slide-up` — 0.4s translateY + opacity entrance
- `pulse-slow` — 3s infinite pulse for loading states

**UI Patterns:**
- Glassmorphism (backdrop-blur, semi-transparent backgrounds)
- Hover micro-interactions (card lift, border glow, color transitions)
- Custom scrollbar (6px, matching surface colors)
- Selection highlight (brand indigo tint)
- Skeleton loading cards matching real card layout

---

## 8. Security Measures

### 8.1 Backend Security

| Measure | Implementation | Protection |
|---------|---------------|------------|
| **Helmet** | `app.use(helmet())` | Sets 15+ security headers (XSS filter, content-type sniffing, clickjacking) |
| **CORS** | Origin whitelist from `CORS_ORIGIN` env | Prevents unauthorized cross-origin requests |
| **Rate Limiting** | 100 req / 15 min per IP | Prevents API abuse and DDoS |
| **Input Validation** | Enum checks, type parsing, length limits | Prevents injection and malformed queries |
| **Error Masking** | Generic errors in production | Prevents information leakage |

### 8.2 Frontend Security

| Measure | Implementation |
|---------|---------------|
| **Error Boundary** | Catches render crashes, shows fallback UI |
| **No secrets in code** | API URL from environment variable |
| **X-Frame-Options** | DENY header via Render config |

---

## 9. Seed Data

The database is seeded with **30 curated problem entries** spanning all 8 domains:

| Domain | Count | Example Problem |
|--------|-------|----------------|
| **Fintech** | 3 | Freelancers manually tracking invoices in spreadsheets |
| **Edtech** | 4 | Students can't track job application status across platforms |
| **Health** | 4 | Chronic pain patients can't share symptom data with doctors |
| **Productivity** | 3 | Meeting notes never get turned into action items |
| **Ecommerce** | 3 | Small Shopify stores can't afford good analytics |
| **DevTools** | 4 | No good free API monitoring for indie developers |
| **SaaS** | 5 | SaaS companies can't easily track feature request trends |
| **Other** | 4 | Freelance designers can't showcase work without expensive portfolio sites |

Each problem includes realistic descriptions with keyword signals that the scoring algorithm can detect, ensuring meaningful score differentiation.

---

## 10. Changes Log — Deployment Upgrade

### 10.1 Phase 1: Project Configuration (3 new files)

| File | Change | Reason |
|------|--------|--------|
| `.gitignore` | **Created** — ignores node_modules, .env, dist/, OS files, IDE files | Prevents sensitive and generated files from being committed to version control |
| `backend/.env.example` | **Created** — documents PORT, MONGO_URI, CORS_ORIGIN | Guides developers and deployment pipelines on required environment variables |
| `frontend/.env.example` | **Created** — documents VITE_API_URL | Documents the frontend build-time variable for API URL configuration |

### 10.2 Phase 2: Backend Hardening (5 files modified)

#### `backend/package.json`
- **Added dependencies:** `helmet@^7.1.0`, `express-rate-limit@^7.4.0`, `express-validator@^7.2.0`
- **Added devDependency:** `nodemon@^3.1.4`
- **Added script:** `"dev": "nodemon server.js"` for auto-restart during development

#### `backend/server.js` — Complete Rewrite
- **Added Helmet** middleware for security HTTP headers
- **Configured CORS** to read allowed origins from `CORS_ORIGIN` environment variable (comma-separated), restricted to GET method only
- **Added rate limiter** — 100 requests per 15 minutes per IP with standard headers
- **Added 404 handler** for unknown API routes
- **Added global error handler** that masks error details in production
- **Added startup logging** showing allowed CORS origins

#### `backend/scraper/seed.js`
- **Added `require('dotenv').config()`** with explicit path to parent `.env`
- **Changed** `MONGO_URI` from hardcoded string to `process.env.MONGO_URI` with fallback

#### `backend/controllers/problemController.js` — Complete Rewrite
- **Added enum validation** for `domain`, `difficulty`, and `sortBy` — returns 400 on invalid values
- **Added pagination safety** — `page` and `limit` are parsed with `Number.isFinite()` checks
- **Capped `limit` to 50** to prevent abuse via large page sizes
- **Added search sanitization** — trimmed and capped at 200 characters
- **Centralized domain list** — `getDomains` now returns from the same `ALLOWED_DOMAINS` constant

#### `backend/models/Problem.js`
- **Added compound index** `{ domain: 1, saasScore: -1 }` for domain-filtered queries
- **Added compound index** `{ isSaasViable: 1, saasScore: -1 }` for viable-only queries

### 10.3 Phase 3: Frontend Fixes (4 modified + 3 new files)

#### `frontend/src/api/problems.js`
- **Replaced** hardcoded `http://localhost:5000/api` with `import.meta.env.VITE_API_URL || "/api"`
- In development, the Vite proxy handles `/api` requests — no CORS issues
- In production, `VITE_API_URL` is set to the deployed backend URL

#### `frontend/vite.config.js`
- **Added dev proxy** — `/api` requests proxied to `http://localhost:5000`
- Eliminates CORS issues during development entirely

#### `frontend/src/constants/styles.js` — New File
- **Extracted** `SOURCE_STYLES` and `DIFFICULTY_STYLES` from ProblemCard and ProblemDetail
- Single source of truth for source and difficulty color mappings

#### `frontend/src/components/ProblemCard.jsx`
- **Replaced** local `SOURCE_COLORS` / `DIFFICULTY_COLORS` with imports from `constants/styles.js`
- **Renamed** references from `SOURCE_COLORS` → `SOURCE_STYLES`, `DIFFICULTY_COLORS` → `DIFFICULTY_STYLES`

#### `frontend/src/pages/ProblemDetail.jsx`
- **Replaced** local `SOURCE_STYLES` / `DIFFICULTY_STYLES` with imports from `constants/styles.js`

#### `frontend/src/components/ErrorBoundary.jsx` — New File
- React class component implementing `getDerivedStateFromError` and `componentDidCatch`
- Renders styled fallback UI with "Refresh Page" button on crash
- Prevents white-screen-of-death for users

#### `frontend/src/pages/NotFound.jsx` — New File
- Styled 404 page with large "404" heading, friendly message, and "Back to Home" button
- Matches the dark theme design language

#### `frontend/src/App.jsx`
- **Wrapped** all routes in `<ErrorBoundary>` component
- **Added** `<Route path="*" element={<NotFound />} />` as catch-all 404 route

### 10.4 Phase 4: Deployment Configuration (6 new files)

#### `backend/.env` — Actual environment file for local development
- PORT=5000, MONGO_URI for localhost, CORS_ORIGIN for Vite dev server, NODE_ENV=development

#### `frontend/.env` — Actual environment file for local development
- VITE_API_URL left empty (Vite proxy handles `/api` in dev)

#### `render.yaml` — Render Blueprint
- Defines **two services** in a single blueprint:
  - **the-think-api** — Node web service, health check on `/`, MONGO_URI as manual secret
  - **the-think** — Static site, builds `dist/`, SPA rewrites, cache headers on assets, X-Frame-Options DENY

#### `railway.json` (root) — Railway root config
- Nixpacks builder, restart-on-failure policy with 10 max retries

#### `backend/railway.json` — Railway backend service
- Build: `npm install`, Start: `node server.js`, health check on `/`

#### `frontend/railway.json` — Railway frontend service
- Build: `npm install && npm run build`, Start: `npx serve dist -s -l $PORT` (SPA fallback)

---

## 11. Deployment Guide

### 11.1 Local Development

```bash
# 1. Clone the repository
git clone <repo-url>
cd The_think

# 2. Setup backend
cd backend
cp .env.example .env          # Edit MONGO_URI if needed
npm install
npm run seed                   # Seed the database with 30 problems
npm run dev                    # Start with nodemon (auto-restart)

# 3. Setup frontend (new terminal)
cd frontend
cp .env.example .env           # Leave VITE_API_URL empty for dev
npm install
npm run dev                    # Vite dev server on port 5173
```

### 11.2 Deploy to Render

1. Push code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click **New → Blueprint**
4. Connect your GitHub repo — Render auto-detects `render.yaml`
5. Set `MONGO_URI` manually in the backend service's environment variables (it's a secret)
6. Update `CORS_ORIGIN` and `VITE_API_URL` with actual deployed URLs
7. Deploy

### 11.3 Deploy to Railway

1. Push code to GitHub
2. Go to [Railway Dashboard](https://railway.app)
3. Click **New Project → Deploy from GitHub**
4. Create **two services** pointing to `backend/` and `frontend/` root directories
5. Railway auto-detects `railway.json` in each directory
6. Set environment variables in each service:
   - Backend: `PORT`, `MONGO_URI`, `CORS_ORIGIN`, `NODE_ENV=production`
   - Frontend: `VITE_API_URL`
7. Deploy

### 11.4 Environment Variables Reference

#### Backend

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `5000` | Server port |
| `MONGO_URI` | **Yes** | `mongodb://localhost:27017/thethink` | MongoDB connection string |
| `CORS_ORIGIN` | **Yes** | `http://localhost:5173` | Comma-separated allowed origins |
| `NODE_ENV` | No | — | Set to `production` for error masking |

#### Frontend

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | No | `/api` (proxy) | Full backend API URL for production |

---

## 12. Build & Performance

### 12.1 Production Build Output

```
Frontend build (Vite):
  dist/index.html                   0.75 kB │ gzip:  0.46 kB
  dist/assets/index-xxxxx.css      19.09 kB │ gzip:  4.40 kB
  dist/assets/index-xxxxx.js      226.25 kB │ gzip: 74.26 kB

Total: ~246 kB raw / ~79 kB gzipped
Build time: ~1.1 seconds
```

### 12.2 Codebase Metrics

| Metric | Value |
|--------|-------|
| Total source files | 27 |
| Backend source lines | ~700 (including seed data) |
| Frontend source lines | ~900 |
| React components | 8 (3 pages + 5 components) |
| API endpoints | 4 + 1 health check |
| Database collections | 1 |
| MongoDB indexes | 3 (1 text + 2 compound) |
| Seed records | 30 |

---

## 13. Future Roadmap

| Feature | Priority | Description |
|---------|----------|-------------|
| User Authentication | High | Sign up, login, JWT tokens |
| Bookmarks / Save | High | Users can save interesting problems |
| Upvoting System | Medium | User-driven upvotes instead of static |
| Real-time Scraping | Medium | Actual Reddit/HN/PH API integration |
| AI-Enhanced Scoring | Medium | Use LLMs for smarter viability scoring |
| Problem Submission | Medium | Users can submit new problems |
| Email Notifications | Low | Weekly digest of top new problems |
| Analytics Dashboard | Low | Trend tracking over time |
| Docker Setup | Low | docker-compose for local development |
| CI/CD Pipeline | Low | Automated testing and deployment |

---

*Document generated on May 7, 2026. Last updated after deployment upgrade.*
