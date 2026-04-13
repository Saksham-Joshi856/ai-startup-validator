# AI Startup Validator - Full Stack Project

A full-stack application for validating and analyzing startup ideas using AI.

## Project Structure

```
├── frontend/          # React + Vite frontend
├── backend/           # Express.js backend API
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup

#### 1. Frontend Setup
```bash
cd frontend
npm install
cp .env.local.example .env.local  # Configure environment variables
```

#### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # Configure environment variables
```

### Running the Project

You need to run both the frontend and backend in separate terminals:

#### Terminal 1 - Backend (API Server)
```bash
cd backend
npm run dev
# Backend will run on http://localhost:5000
```

#### Terminal 2 - Frontend (React App)
```bash
cd frontend
npm run dev
# Frontend will run on http://localhost:5173 (or similar)
```

## API Endpoints

The frontend communicates with the backend at `http://localhost:5000`:

- `GET /api/test` - Test endpoint
- `GET /api/getIdeas` - Fetch user's startup ideas
- `GET /api/getAnalysis?ideaId=<UUID>` - Fetch analysis for an idea

## Environment Variables

### Backend (.env)
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
OPENROUTER_API_KEY=your_openrouter_api_key
PORT=5000
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000
```

## Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

### Frontend
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
