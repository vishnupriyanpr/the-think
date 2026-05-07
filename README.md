
<p align="center">
  <img src="https://github.com/user-attachments/assets/195a2553-45a3-46c6-ad42-a01a740f894b" alt="The Think Screenshot" />
</p>

---



**The Think** is a full-stack SaaS problem discovery platform built to help founders find high-impact startup ideas. It automatically aggregates real-world problems from sources like Razorpay's *Fix My Itch*, scores them for SaaS viability, and presents them in a beautiful, highly-interactive neobrutalist UI.

<img width="1897" height="1115" alt="image" src="https://github.com/user-attachments/assets/3813ac67-1549-4c86-af66-02304c764a40" />


##  Key Features

- **Automated Data Pipeline**: Continuously syncs live data from external sources (e.g., Razorpay Fix My Itch) every 10 minutes using a custom HTML & Framer JSON scraper.
- **SaaS Viability Scoring**: Uses an intelligent heuristic algorithm to analyze problem descriptions and assign a 0-100 score based on B2B focus, recurring pain points, and solution potential.
- **Neobrutalist Design System**: A custom-built, vibrant, and highly interactive UI featuring hard shadows, bold typography (Archivo Black), and micro-animations.
- **Advanced Filtering & Search**: Client-side debounced search combined with server-side pagination, sorting, and dynamic domain categorization.
- **Production-Ready Backend**: Hardened Express.js API with Helmet security headers, rate-limiting (100 req/15min), and strict input validation/sanitization.

##  Tech Stack

### Frontend
- **React 18** (via Vite)
- **React Router v6** (Client-side routing)
- **Tailwind CSS** + Custom CSS custom properties
- **Axios** (API communication)

### Backend
- **Node.js & Express**
- **MongoDB & Mongoose** (Text indexing and aggregation pipelines)
- **Helmet & Express-Rate-Limit** (Security)

##  Getting Started (Local Development)

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster (or local MongoDB instance)

### 1. Clone the repository
```bash
git clone https://github.com/vishnupriyanpr/the-think.git
cd the-think
```

### 2. Environment Variables
You need to set up `.env` files in both the `frontend` and `backend` directories. Refer to the `.env.example` files in each directory.

**Backend (`backend/.env`):**
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/thethink
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Install Dependencies & Run
For Windows users, simply double-click the included batch script:
```bash
start-local.bat
```

Alternatively, run them manually in separate terminal windows:
```bash
# Terminal 1 (Backend)
cd backend
npm install
npm run dev

# Terminal 2 (Frontend)
cd frontend
npm install
npm run dev
```

##  Deployment

The project is configured for easy deployment as a **Single Web Service** on platforms like Render, where the Node.js backend serves the built React static files.

### Render Deployment Configuration

1. Connect your GitHub repository to Render and create a new **Web Service**.
2. **Build Command:**
   ```bash
   cd frontend && npm install --include=dev && npm run build && cd ../backend && npm install
   ```
3. **Start Command:**
   ```bash
   cd backend && node server.js
   ```
4. **Environment Variables:**
   - `MONGO_URI`: Your MongoDB connection string
   - `CORS_ORIGIN`: Your Render app URL (e.g., `https://the-think.onrender.com`)
   - `NODE_ENV`: `production`
   - `VITE_API_URL`: `/api`

##  Project Structure

```text
the-think/
├── backend/
│   ├── controllers/      # Route logic
│   ├── models/           # Mongoose schemas (Problem.js)
│   ├── routes/           # Express API endpoints
│   ├── utils/            # Sync scripts, SaaS scoring algorithm
│   └── server.js         # Entry point & middleware
├── frontend/
│   ├── src/
│   │   ├── api/          # Axios API wrappers
│   │   ├── components/   # Reusable UI components
│   │   ├── constants/    # Design system constants
│   │   ├── pages/        # Route views (Landing, Feed, Detail)
│   │   └── index.css     # Global styles & Neobrutalist variables
│   └── vite.config.js    # Vite configuration & proxy
└── start-local.bat       # Windows dev startup script
```

