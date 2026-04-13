# API Endpoints: Quick Reference

## Overview
This document provides a quick reference for the two main API endpoints working together in the idea management system.

## Endpoints at a Glance

| Endpoint | Method | Purpose | Status | User |
|----------|--------|---------|--------|------|
| `/api/analyzeIdea` | POST | Create & analyze idea | ✅ Ready | Authenticated |
| `/api/getIdeas` | GET | Retrieve all ideas | ✅ Ready | Authenticated |

---

## 1. POST /api/analyzeIdea

### Purpose
Create a new startup idea and get AI-powered analysis in one request.

### Request
```bash
POST http://localhost:3000/api/analyzeIdea
Content-Type: application/json

{
  "ideaText": "AI resume builder for job seekers",
  "industry": "HR Tech"
}
```

### Response (Success)
```json
{
  "success": true,
  "data": {
    "idea": {
      "id": "uuid-1",
      "user_id": "uuid-user",
      "idea_text": "AI resume builder for job seekers",
      "industry": "HR Tech",
      "created_at": "2026-04-12T10:30:00Z",
      "updated_at": "2026-04-12T10:30:00Z"
    },
    "analysis": {
      "id": "uuid-2",
      "idea_id": "uuid-1",
      "market_score": 85,
      "competition_score": 72,
      "feasibility_score": 88,
      "analysis_text": "Strong market opportunity...",
      "created_at": "2026-04-12T10:30:02Z",
      "updated_at": "2026-04-12T10:30:02Z"
    }
  }
}
```

### Status Codes
- `200` - Success
- `400` - Missing fields or database error
- `401` - Not authenticated
- `500` - Server error

### Use Cases
- User submits new idea from form
- Display results immediately to user
- Save both idea and analysis to database

### React Integration
```typescript
import { useAnalyzeIdea } from '@/hooks/useAnalyzeIdea';

const { isLoading, error, data, analyzeIdea } = useAnalyzeIdea();

const handleSubmit = async (ideaText, industry) => {
  await analyzeIdea(ideaText, industry);
  // results in data.idea and data.analysis
};
```

---

## 2. GET /api/getIdeas

### Purpose
Retrieve all ideas for the authenticated user, ordered by newest first.

### Request
```bash
GET http://localhost:3000/api/getIdeas
Content-Type: application/json
```

### Response (Success)
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "user_id": "uuid-user",
      "idea_text": "AI resume builder for job seekers",
      "industry": "HR Tech",
      "created_at": "2026-04-12T10:30:00Z",
      "updated_at": "2026-04-12T10:30:00Z"
    },
    {
      "id": "uuid-2",
      "user_id": "uuid-user",
      "idea_text": "Marketplace for sustainable fashion",
      "industry": "E-commerce",
      "created_at": "2026-04-11T15:20:00Z",
      "updated_at": "2026-04-11T15:20:00Z"
    }
  ],
  "count": 2
}
```

### Status Codes
- `200` - Success (even if no ideas)
- `400` - Database error
- `401` - Not authenticated
- `500` - Server error

### Use Cases
- Display user's idea history
- Browse previous ideas
- List screen on dashboard

### React Integration
```typescript
import { useGetIdeas } from '@/hooks/useGetIdeas';

const { isLoading, ideas, count, refetch } = useGetIdeas();

// Auto-fetches on mount
// ideas is array of idea objects
// count is the number of ideas
```

---

## Combined Usage Pattern

### Workflow
```
1. User logs in
   ↓
2. Dashboard loads ideas list (GET /api/getIdeas)
   ↓
3. User sees previous ideas
   ↓
4. User submits new idea (POST /api/analyzeIdea)
   ↓
5. Idea created and analyzed
   ↓
6. User can refresh to see new idea in list (GET /api/getIdeas)
```

### Example Implementation
```typescript
import { IdeaSubmissionForm } from '@/components/dashboard/IdeaSubmissionForm';
import { useGetIdeas } from '@/hooks/useGetIdeas';

export function Dashboard() {
  const { ideas, count, refetch } = useGetIdeas();

  const handleIdeaCreated = () => {
    // Refetch after new idea is created
    refetch();
  };

  return (
    <div className="space-y-8">
      {/* Submit new idea */}
      <IdeaSubmissionForm onSuccess={handleIdeaCreated} />

      {/* List all ideas */}
      <div>
        <h2>Your Ideas ({count})</h2>
        <IdeasList ideas={ideas} />
      </div>
    </div>
  );
}
```

---

## Data Flow Diagram

```
┌──────────────────────────────────────┐
│   User on Dashboard                  │
└──────────────┬───────────────────────┘
               │
        ┌──────┴──────┐
        │             │
        v             v
   ┌─────────┐   ┌──────────────────┐
   │ Submit  │   │ View all ideas   │
   │ Form    │   │                  │
   └────┬────┘   └────┬─────────────┘
        │             │
        │             v
        │        ┌──────────────┐
        │        │ GET /api/    │
        │        │ getIdeas     │
        │        │              │
        │        │ Returns:     │
        │        │ - Array of   │
        │        │   ideas      │
        │        │ - Count      │
        │        └────┬─────────┘
        │             │
        v             v
   ┌─────────────────────┐
   │ POST /api/          │
   │ analyzeIdea         │
   │                     │
   │ Request:            │
   │ - ideaText          │
   │ - industry          │
   │                     │
   │ Response:           │
   │ - idea object       │
   │ - analysis object   │
   │ - scores (0-100)    │
   │ - analysis_text     │
   └─────────────────────┘
```

---

## Database Impact

### POST /api/analyzeIdea
Creates 2 rows:
1. Row in `startup_ideas` table
2. Row in `idea_analysis` table

### GET /api/getIdeas
Reads from `startup_ideas` table (filtered by user_id)

---

## Error Reference

### Authentication Errors (401)
Both endpoints return 401 if user not authenticated.

**Both Endpoints:**
```json
{
  "success": false,
  "error": "User not authenticated. Please sign in first."
}
```

**Solution:** Redirect to login page

### Validation Errors (400)
Only POST endpoint validates input.

**POST /api/analyzeIdea:**
```json
{
  "success": false,
  "error": "Missing required fields: ideaText or industry"
}
```

**Solution:** Ensure both fields are provided

### Database Errors (400)
Both endpoints can return database errors.

**Both Endpoints:**
```json
{
  "success": false,
  "error": "Failed to [fetch/save] ideas: [database error]"
}
```

**Solution:** Check Supabase connection, RLS policies, table schema

---

## Performance Benchmarks

| Operation | Time | Notes |
|-----------|------|-------|
| POST /api/analyzeIdea | 500-2000ms | Includes AI analysis |
| GET /api/getIdeas | 50-200ms | Database query |
| Create idea only | 50-100ms | Step 1 of POST |
| AI analysis only | 500-1500ms | Step 3 of POST |
| Store analysis only | 30-50ms | Step 5 of POST |

---

## Implementation Checklist

### API Endpoints
- [x] POST /api/analyzeIdea ✅
- [x] GET /api/getIdeas ✅

### React Hooks
- [x] useAnalyzeIdea ✅
- [x] useGetIdeas ✅

### UI Components
- [x] IdeaSubmissionForm ✅
- [ ] IdeasList (suggested enhancement)

### Documentation
- [x] API_ANALYZE_IDEA.md ✅
- [x] API_GET_IDEAS.md ✅
- [x] HOOK_USE_GET_IDEAS.md ✅
- [x] IDEA_SUBMISSION_FORM.md ✅

### Testing
- [x] testAnalyzeIdeaAPI.ts ✅
- [x] testGetIdeasAPI.ts ✅
- [ ] testPipeline.ts (requires database setup)

---

## Related Documentation

- [Analyze Idea Endpoint](./API_ANALYZE_IDEA.md)
- [Get Ideas Endpoint](./API_GET_IDEAS.md)
- [useAnalyzeIdea Hook](./IDEA_SUBMISSION_FORM.md)
- [useGetIdeas Hook](./HOOK_USE_GET_IDEAS.md)
- [Dashboard Integration](./DASHBOARD_INTEGRATION.md)

---

## Next Steps

1. **Test with Database:**
   ```bash
   npx tsx src/test/testPipeline.ts
   ```

2. **Create IdeasList Component:**
   - Display ideas from useGetIdeas hook
   - Add filtering by industry
   - Add search functionality

3. **Integrate with Dashboard:**
   - Show idea history
   - Auto-refresh after creation
   - Add edit/delete capabilities

4. **Add More Endpoints:**
   - GET /api/getIdeas/:id (single idea)
   - PUT /api/ideas/:id (update)
   - DELETE /api/ideas/:id (delete)
   - GET /api/ideas/:id/analysis (analysis details)

---

## Quick Copy-Paste Examples

### Fetch Single Analysis
```typescript
const response = await fetch('/api/analyzeIdea', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ideaText: 'My idea description',
    industry: 'EdTech'
  })
});
const result = await response.json();
console.log(result.data.analysis.market_score);
```

### Fetch All Ideas
```typescript
const response = await fetch('/api/getIdeas');
const result = await response.json();
result.data.forEach(idea => {
  console.log(`${idea.idea_text} (${idea.industry})`);
});
```

### In React Component
```typescript
import { useAnalyzeIdea } from '@/hooks/useAnalyzeIdea';
import { useGetIdeas } from '@/hooks/useGetIdeas';

function App() {
  const { analyzeIdea, data: newIdea } = useAnalyzeIdea();
  const { ideas, refetch } = useGetIdeas();

  const handleSubmit = async (text, industry) => {
    await analyzeIdea(text, industry);
    await refetch(); // Refresh list
  };

  return (
    <div>
      <Form onSubmit={handleSubmit} />
      <IdeasList ideas={ideas} />
    </div>
  );
}
```
