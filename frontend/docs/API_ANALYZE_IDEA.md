# API Documentation: /api/analyzeIdea

## Overview
Endpoint for analyzing a startup idea using AI, creating the idea record, and storing the analysis results in a single pipeline.

## Endpoint
```
POST /api/analyzeIdea
```

---

## Request

### Headers
```
Content-Type: application/json
```

### Body
```json
{
  "ideaText": "AI resume builder for job seekers",
  "industry": "HR Tech"
}
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ideaText` | string | ✅ Yes | The startup idea description (required) |
| `industry` | string | ✅ Yes | The industry category for the idea (required) |

---

## Response

### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "idea": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "user_id": "13664e05-7f8d-468b-8085-7016ac9acb82",
      "idea_text": "AI resume builder for job seekers",
      "industry": "HR Tech",
      "created_at": "2026-04-12T10:30:00Z",
      "updated_at": "2026-04-12T10:30:00Z"
    },
    "analysis": {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "idea_id": "550e8400-e29b-41d4-a716-446655440000",
      "market_score": 80,
      "competition_score": 70,
      "feasibility_score": 90,
      "analysis_text": "The market for HR Tech, specifically AI resume builders, is large and continuously growing...",
      "created_at": "2026-04-12T10:30:02Z",
      "updated_at": "2026-04-12T10:30:02Z"
    }
  }
}
```

### Error Response (400 Bad Request)
```json
{
  "success": false,
  "error": "User not authenticated. Please sign in first."
}
```

---

## Response Status Codes

| Status | Meaning |
|--------|---------|
| `200` | Successfully analyzed idea and saved results |
| `400` | Bad request - Invalid input or user not authenticated |
| `405` | Method not allowed (only POST is supported) |
| `500` | Internal server error |

---

## Error Cases

### Missing Authentication
```json
{
  "success": false,
  "error": "User not authenticated. Please sign in first."
}
```
**Cause:** User is not logged in
**Solution:** Call sign-in endpoint first

### Missing Required Fields
```json
{
  "success": false,
  "error": "Missing required fields: ideaText or industry"
}
```
**Cause:** `ideaText` or `industry` not provided
**Solution:** Include both fields in request body

### Database Schema Error
```json
{
  "success": false,
  "error": "Could not find the 'analysis_text' column of 'idea_analysis'"
}
```
**Cause:** `idea_analysis` table doesn't have correct schema
**Solution:** Run setup SQL from `docs/setup-idea-analysis-table.sql`

### Invalid JSON
```json
{
  "success": false,
  "error": "Invalid JSON in request body"
}
```
**Cause:** Request body is not valid JSON
**Solution:** Verify Content-Type header and JSON formatting

---

## Usage Examples

### Using Fetch API
```typescript
const response = await fetch('/api/analyzeIdea', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    ideaText: 'AI resume builder for job seekers',
    industry: 'HR Tech',
  }),
});

const result = await response.json();

if (result.success) {
  console.log('Idea ID:', result.data.idea.id);
  console.log('Market Score:', result.data.analysis.market_score);
} else {
  console.error('Error:', result.error);
}
```

### Using React Hook
```typescript
import { useAnalyzeIdea } from '@/hooks/useAnalyzeIdea';

function MyComponent() {
  const { isLoading, error, data, analyzeIdea } = useAnalyzeIdea();

  const handleAnalyze = async () => {
    await analyzeIdea(
      'AI resume builder for job seekers',
      'HR Tech'
    );
  };

  return (
    <div>
      <button onClick={handleAnalyze} disabled={isLoading}>
        {isLoading ? 'Analyzing...' : 'Analyze Idea'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {data && (
        <div>
          <h3>Results:</h3>
          <p>Market Score: {data.analysis.market_score}/100</p>
          <p>{data.analysis.analysis_text}</p>
        </div>
      )}
    </div>
  );
}
```

### Using cURL
```bash
curl -X POST http://localhost:3000/api/analyzeIdea \
  -H "Content-Type: application/json" \
  -d '{
    "ideaText": "AI resume builder for job seekers",
    "industry": "HR Tech"
  }'
```

---

## Workflow

The endpoint executes the following steps:

```
1. Extract ideaText and industry from request
   ↓
2. Get current authenticated user from session
   ↓
3. Call createAndAnalyzeIdea(userId, ideaText, industry)
   ├─ Step 3a: Insert idea into startup_ideas table
   ├─ Step 3b: Extract idea ID
   ├─ Step 3c: Call AI analysis (GPT-3.5-Turbo via OpenRouter)
   ├─ Step 3d: Store analysis in idea_analysis table
   └─ Return both idea and analysis records
   ↓
4. Return analysis results as JSON
```

---

## Authentication

The endpoint requires an authenticated Supabase session. The authentication is handled server-side:

1. User must be logged in (established session)
2. Session is retrieved from Supabase auth context
3. User ID is extracted from session
4. User ID is used to create the idea record (enforced by RLS policies)

---

## Rate Limiting

No built-in rate limiting. Apply at API Gateway level or middleware:

```typescript
// Example middleware (not included)
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.post('/api/analyzeIdea', limiter, analyzeIdeaHandler);
```

---

## Testing

Run the test file:
```bash
npx tsx src/test/testAnalyzeIdeaAPI.ts
```

Or run the full end-to-end pipeline test:
```bash
npx tsx src/test/testPipeline.ts
```

---

## Files

- **Endpoint:** `src/api/analyzeIdea.ts`
- **Hook:** `src/hooks/useAnalyzeIdea.ts`
- **Test:** `src/test/testAnalyzeIdeaAPI.ts`
- **Service:** `src/services/ideaPipelineService.ts`

---

## Related Documentation

- [Idea Pipeline Service](../../services/ideaPipelineService.ts)
- [Analysis Service](../../services/analysisService.ts)
- [AI Service](../../services/aiService.ts)
- [Setup Guide](../SETUP_IDEA_ANALYSIS.md)
