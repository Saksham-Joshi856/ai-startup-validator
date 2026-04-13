# Dashboard Integration Architecture

## Component Hierarchy

```
Index.tsx (Dashboard Page)
├── DashboardSidebar
├── TopNavbar
├── Main Content Area
│   ├── Hero Section (Title + Particles)
│   ├── Stats Cards (4x StatCard)
│   ├── IdeaSubmissionForm ← NEW
│   │   ├── Form Container
│   │   │   ├── Textarea (ideaText)
│   │   │   ├── Select Dropdown (industry)
│   │   │   ├── Button (Analyze) → POST /api/analyzeIdea
│   │   │   └── Button (Clear)
│   │   └── Results Container (conditional)
│   │       ├── Success Alert
│   │       ├── Scores Grid (3x ScoreBadge)
│   │       ├── Overall Viability
│   │       ├── Analysis Text Card
│   │       ├── Idea Details Card
│   │       └── Submit Another Button
│   ├── Charts Row 1
│   │   ├── IndustryTrendChart
│   │   └── ScoreDistributionChart
│   ├── Table + Insights Row
│   │   ├── RecentValidations (2/3 width)
│   │   └── InsightsPanel (1/3 width)
│   └── MarketOpportunityChart
└── FloatingActionButton
```

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    IdeaSubmissionForm                           │
│  (React Component - src/components/dashboard/)                 │
└─────────────┬──────────────────────────────────────────────────┘
              │ (Form State)
              ├─ ideaText (textarea input)
              ├─ selectedIndustry (dropdown value)
              └─ derives: isLoading, error, data
              │
              v
┌─────────────────────────────────────────────────────────────────┐
│           React Hook: useAnalyzeIdea()                          │
│  (src/hooks/useAnalyzeIdea.ts)                                 │
│                                                                 │
│  const { isLoading, error, data, analyzeIdea } = hook           │
└─────────────┬──────────────────────────────────────────────────┘
              │ On Submit: await analyzeIdea(ideaText, industry)
              │
              v
┌─────────────────────────────────────────────────────────────────┐
│         Fetch API: POST /api/analyzeIdea                        │
│  (Browser API - Sends JSON to backend)                         │
│  Request Body: { ideaText, industry }                          │
└─────────────┬──────────────────────────────────────────────────┘
              │
              v
┌─────────────────────────────────────────────────────────────────┐
│         API Route Handler                                        │
│  (src/api/analyzeIdea.ts → POST function)                      │
│                                                                 │
│  1. Parse request body                                          │
│  2. Get authenticated user from Supabase.auth.getSession()     │
│  3. Return error if user not authenticated                      │
│  4. Extract userId                                              │
└─────────────┬──────────────────────────────────────────────────┘
              │ await createAndAnalyzeIdea(userId, ideaText, industry)
              │
              v
┌─────────────────────────────────────────────────────────────────┐
│      Pipeline Orchestration                                      │
│  (src/services/ideaPipelineService.ts)                         │
│                                                                 │
│  Step 1: createStartupIdea()                                    │
│    └─> INSERT into startup_ideas table                          │
│    └─> Return: { id, user_id, idea_text, industry, ... }      │
│                                                                 │
│  Step 2: Extract ideaId from Step 1 result                      │
│                                                                 │
│  Step 3: analyzeStartupIdea() via AI                           │
│    └─> Call OpenRouter API with GPT-3.5-Turbo                 │
│    └─> Return: { market_score, competition_score,             │
│                   feasibility_score, analysis_text } (1-10)    │
│                                                                 │
│  Step 4: Normalize scores (1-10 → 0-100)                       │
│                                                                 │
│  Step 5: saveIdeaAnalysis()                                     │
│    └─> INSERT into idea_analysis table                          │
│    └─> Return: { id, idea_id, market_score,                   │
│                   competition_score, feasibility_score,        │
│                   analysis_text }                               │
│                                                                 │
│  Return: { idea, analysis }                                     │
└─────────────┬──────────────────────────────────────────────────┘
              │
              v
┌─────────────────────────────────────────────────────────────────┐
│      Database (Supabase)                                         │
│                                                                 │
│  Table: startup_ideas                                           │
│    - id (UUID, PK)                                              │
│    - user_id (UUID, FK to auth.users)                          │
│    - idea_text (TEXT)                                           │
│    - industry (VARCHAR)                                         │
│    - created_at, updated_at (TIMESTAMP)                        │
│                                                                 │
│  Table: idea_analysis                                           │
│    - id (UUID, PK)                                              │
│    - idea_id (UUID, FK, UNIQUE)                                │
│    - market_score (INT, 0-100)                                 │
│    - competition_score (INT, 0-100)                            │
│    - feasibility_score (INT, 0-100)                            │
│    - analysis_text (TEXT)                                       │
│    - created_at, updated_at (TIMESTAMP)                        │
└─────────────┬──────────────────────────────────────────────────┘
              │
              v
┌─────────────────────────────────────────────────────────────────┐
│      API Response (JSON)                                         │
│                                                                 │
│  {                                                              │
│    "success": true,                                             │
│    "data": {                                                    │
│      "idea": {                                                  │
│        "id": "uuid-1",                                          │
│        "user_id": "uuid-2",                                     │
│        "idea_text": "...",                                      │
│        "industry": "EdTech",                                    │
│        "created_at": "timestmp"                                 │
│      },                                                         │
│      "analysis": {                                              │
│        "id": "uuid-3",                                          │
│        "idea_id": "uuid-1",                                     │
│        "market_score": 80,        ← Normalized 0-100           │
│        "competition_score": 60,   ← Normalized 0-100           │
│        "feasibility_score": 70,   ← Normalized 0-100           │
│        "analysis_text": "..."                                   │
│      }                                                          │
│    }                                                            │
│  }                                                              │
└─────────────┬──────────────────────────────────────────────────┘
              │ useAnalyzeIdea processes response
              │ Sets: data = result.data
              │ Trigger re-render
              │
              v
┌─────────────────────────────────────────────────────────────────┐
│                IdeaSubmissionForm (UI State Update)             │
│                                                                 │
│  Conditional Rendering:                                         │
│                                                                 │
│  IF data exists:                                                │
│    - Show Results Container                                     │
│    - Display Scores with Progress Bars                         │
│    - Show Analysis Text                                         │
│    - Display Idea Metadata                                      │
│    - Render "Submit Another" Button                            │
│                                                                 │
│  IF error exists:                                               │
│    - Show Error Alert                                           │
│    - Keep form fields intact for retry                         │
│                                                                 │
│  IF !data && !error:                                            │
│    - Show empty form ready for input                           │
└─────────────────────────────────────────────────────────────────┘
```

## Module Dependencies

```
IdeaSubmissionForm Component
├── Depends On:
│   ├── useAnalyzeIdea Hook
│   ├── UI Components (Button, Card, Badge, Alert)
│   ├── Icons (Zap, Loader2, AlertCircle, CheckCircle2)
│   ├── Framer Motion (Animations)
│   └── Constants (INDUSTRIES array)
│
└── Used By:
    └── pages/Index.tsx (Dashboard Page)

useAnalyzeIdea Hook
├── Depends On:
│   ├── Fetch API (Browser native)
│   ├── /api/analyzeIdea endpoint
│   └── useState (React)
│
└── Used By:
    └── IdeaSubmissionForm Component

/api/analyzeIdea Route
├── Depends On:
│   ├── Supabase Client
│   ├── createAndAnalyzeIdea Pipeline
│   ├── supabase.auth.getSession()
│   └── Request/Response handlers
│
└── Called By:
    └── useAnalyzeIdea Hook (Fetch)

ideaPipelineService
├── Depends On:
│   ├── ideaService (createStartupIdea)
│   ├── aiService (analyzeStartupIdea)
│   ├── analysisService (saveIdeaAnalysis)
│   └── Score normalization logic
│
└── Called By:
    └── /api/analyzeIdea Route

ideaService
├── Depends On:
│   ├── supabaseClient
│   └── startup_ideas table
│
└── Called By:
    └── ideaPipelineService

aiService
├── Depends On:
│   ├── OpenRouter API
│   ├── GPT-3.5-Turbo Model
│   ├── process.env.OPENROUTER_API_KEY
│   └── JSON parsing utilities
│
└── Called By:
    └── ideaPipelineService

analysisService
├── Depends On:
│   ├── supabaseClient
│   └── idea_analysis table
│
└── Called By:
    └── ideaPipelineService
```

## Request/Response Flow (Timeline)

```
T+0ms     User enters "My startup idea" in textarea
T+5ms     User selects "EdTech" from dropdown
T+10ms    User clicks "Analyze Idea" button
│
├─ T+15ms   : onClick handler calls analyzeIdea("My startup idea", "EdTech")
├─ T+20ms   : Hook sets isLoading = true, disables form
├─ T+25ms   : Fetch sends POST /api/analyzeIdea {ideaText, industry}
├─ T+50ms   : Request reaches API handler
├─ T+55ms   : API gets session from Supabase.auth
├─ T+60ms   : API calls createAndAnalyzeIdea(userId, ideaText, industry)
│
├─ T+70ms   → Pipeline Step 1: Insert idea into startup_ideas
├─ T+85ms   ← Returns idea ID
│
├─ T+90ms   → Pipeline Step 2: Extract idea ID
│
├─ T+95ms   → Pipeline Step 3: Call OpenRouter GPT-3.5-Turbo
├─ T+500ms  ← Returns AI analysis (may vary)
│
├─ T+510ms  → Pipeline Step 4: Normalize scores (1-10 → 0-100)
│
├─ T+520ms  → Pipeline Step 5: Insert analysis into idea_analysis table
├─ T+535ms  ← Returns analysis ID
│
├─ T+540ms  : API response returns { success: true, data: {idea, analysis} }
├─ T+545ms  : Hook receives response, sets data, isLoading = false
├─ T+550ms  : Component re-renders with results
│
└─ T+600ms  : User sees full results with scores, progress bars, analysis text
```

## Error Handling Flow

```
IdeaSubmissionForm (Form Input)
        ↓
useAnalyzeIdea (Fetch API)
        ↓
    Fetch Error?
    ├─ YES → Set error state
    │         Display error Alert
    │         Form ready for retry
    │
    └─ NO → Parse response JSON
            ↓
        Response OK?
        ├─ NO → Set error state
        │        Display error Alert
        │        Form ready for retry
        │
        └─ YES → Check result.success
                ├─ FALSE → Set error state
                │           Display error Alert
                │           Form ready for retry
                │
                └─ TRUE → Set data state
                          Display results
                          Show "Submit Another" button
```

## File Structure

```
src/
├── api/
│   └── analyzeIdea.ts                    ← POST /api/analyzeIdea
├── components/
│   └── dashboard/
│       ├── IdeaSubmissionForm.tsx        ← NEW (291 lines)
│       ├── ChartSkeleton.tsx
│       ├── FloatingActionButton.tsx
│       ├── InsightsPanel.tsx
│       ├── ParticleBackground.tsx
│       └── RecentValidations.tsx
├── services/
│   ├── ideaPipelineService.ts
│   ├── ideaService.ts
│   ├── analysisService.ts
│   └── aiService.ts
├── hooks/
│   └── useAnalyzeIdea.ts                 ← React Hook for API
├── pages/
│   └── Index.tsx                         ← UPDATED (integrated form)
└── ...

docs/
├── API_ANALYZE_IDEA.md                   ← API Documentation
├── IDEA_SUBMISSION_FORM.md               ← Component Documentation (NEW)
└── ...
```

## Integration Checklist

- [x] Create IdeaSubmissionForm component
- [x] Create useAnalyzeIdea hook
- [x] Create /api/analyzeIdea endpoint
- [x] Create API documentation
- [x] Update dashboard page to include form
- [x] Test API endpoint validation
- [x] Test error handling
- [x] Add component documentation
- [ ] Test full end-to-end flow with authenticated user
- [ ] Test with database schema properly set up
- [ ] Verify UI animations and styling
- [ ] Deploy to production

## Related Documentation

- [API Route Documentation](./API_ANALYZE_IDEA.md)
- [Component Documentation](./IDEA_SUBMISSION_FORM.md)
- [Setup Guide for Database](./setup-idea-analysis-table.sql)
