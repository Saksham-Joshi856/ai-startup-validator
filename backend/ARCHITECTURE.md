# Backend Architecture

## Overview
The backend contains all business logic, database operations, and external API integrations for the AI Startup Validator. It is completely decoupled from the frontend and can run independently.

## Folder Structure

```
backend/
├── index.js                    # Express server entry point
├── package.json               # Dependencies and scripts
├── .env                        # Environment variables (local)
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
│
├── config/                    # Configuration files
│   └── supabaseClient.js      # Supabase client initialization
│
├── services/                  # Business logic services
│   ├── ideaService.js         # Startup idea CRUD operations
│   ├── analysisService.js     # Idea analysis CRUD operations
│   ├── aiService.js           # AI analysis using OpenRouter API
│   └── ideaPipelineService.js # Orchestrates complete workflow
│
├── utils/                     # Utility functions (for future use)
├── routes/                    # API routes (for future refactoring)
└── lib/                        # Library files (for future use)
```

## Services

### ideaService.js
Handles startup idea database operations:
- `createStartupIdea()` - Insert new idea
- `getUserStartupIdeas()` - Get ideas for a specific user
- `getAllStartupIdeas()` - Get all ideas
- `getStartupIdeaById()` - Get a specific idea by ID

### analysisService.js
Handles idea analysis database operations:
- `saveIdeaAnalysis()` - Store analysis results
- `getIdeaAnalysis()` - Retrieve analysis for an idea
- `updateIdeaAnalysis()` - Update analysis data

### aiService.js
Handles AI operations:
- `analyzeStartupIdea()` - Analyze idea using OpenRouter API
- `analyzeStartupIdeasBatch()` - Analyze multiple ideas in parallel
- `analyzeAndStoreIdea()` - Analyze and store results

### ideaPipelineService.js
Orchestrates the complete workflow:
- `createAndAnalyzeIdea()` - Create idea, analyze with AI, and store results
- `createAndAnalyzeIdeasBatch()` - Process multiple ideas

## API Endpoints

### GET /api/test
Health check endpoint
**Response:**
```json
{ "message": "Backend working" }
```

### GET /api/getIdeas
Fetch all startup ideas
**Response:**
```json
{
  "success": true,
  "ideas": [ { id, user_id, idea_text, industry, created_at, updated_at }, ... ]
}
```

### GET /api/getAnalysis?ideaId=<uuid>
Fetch analysis for a specific idea
**Response:**
```json
{
  "success": true,
  "market_score": 0-100,
  "competition_score": 0-100,
  "feasibility_score": 0-100,
  "analysis_text": "<detailed analysis>"
}
```

### POST /api/analyzeIdea
Create idea and analyze with AI in one request
**Request Body:**
```json
{
  "userId": "<uuid>",
  "ideaText": "<idea description>",
  "industry": "<industry category>"
}
```
**Response:**
```json
{
  "success": true,
  "idea": { id, user_id, idea_text, industry, created_at, updated_at },
  "analysis": { id, idea_id, market_score, competition_score, feasibility_score, analysis_text, created_at, updated_at }
}
```

## Environment Variables

Create a `.env` file in the `backend/` folder with:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
OPENROUTER_API_KEY=your_api_key_here
PORT=5000
```

## Running the Backend

```bash
cd backend
npm install
npm run dev
```

Server will start on `http://localhost:5000`

## Key Design Decisions

1. **Service Layer Pattern**: All business logic is encapsulated in services, making it easy to test, reuse, and maintain.

2. **Independent Operation**: The backend doesn't depend on the frontend. It can be used by multiple clients (web, mobile, CLI).

3. **Error Handling**: Each service returns `{ data, error }` objects for consistent error handling.

4. **Score Normalization**: Scores are converted between 1-10 scale (AI) and 0-100 scale (database) transparently.

5. **Modular Architecture**: Services are loosely coupled and can be extended or replaced independently.

## Future Improvements

1. Add authentication middleware for JWT validation
2. Create route handlers to further separate API logic
3. Add input validation middleware
4. Implement logging service
5. Add caching layer
6. Create database migration system
7. Add comprehensive error handling and custom exceptions
8. Implement rate limiting
